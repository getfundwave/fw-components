import { html, LitElement, PropertyValues } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";

import "./suggestion-menu.js";
import { Parser } from "./utils/parser.js";
import { FormulaEditorStyles } from "./styles/editor.js";
import { SuggestionMenu } from "./suggestion-menu.js";
@customElement("formula-editor")
export class FormulaEditor extends LitElement {
  /**
   * Formula Parser
   */
  private _parser: Parser;

  @state()
  recommendations: string[] = [];

  @state()
  currentCursorPosition: number = 0;

  /**
   * user input event type
   */
  @state()
  lastInputType: string;

  @state()
  _selectedRecommendation: string;

  @state()
  isFocused: boolean = false;

  /**
   * Text area input value
   */
  @property()
  content: string = "";

  @property()
  placeholder: string = "Type your formula...";

  @property()
  label: string;

  @property()
  variables: Map<string, number> = new Map();

  @property()
  minSuggestionLen: number = 2;

  @property()
  errorString: string = "";

  @query("#wysiwyg-editor")
  editor: HTMLTextAreaElement;

  @query("suggestion-menu")
  suggestionMenu: SuggestionMenu;
  
  protected firstUpdated(_changedProperties: PropertyValues): void {
    const inputListener = this.handleContentUpdate.bind(this);
    this.editor.addEventListener("input", inputListener);
    this.editor.focus();
  }


  protected updated(_changedProperties: PropertyValues): void {
    if (_changedProperties.has("content")) {
      if (!this.content?.trim()) {
        this.recommendations = Array.from(this.variables.keys());
      }

      this._adjustTextAreaHeight();
    }

    if (_changedProperties.has("variables") && this.variables.size) {
      this._parser = new Parser(this.variables, this.minSuggestionLen);
    }
  }

  onClickRecommendation(recommendation: string) {
    this.parseInput(recommendation);
  }

  handleContentUpdate(event: InputEvent) {
    event.preventDefault();

    this.lastInputType = event.inputType;
    this.content = (event.target as HTMLInputElement).value;
    this.parseInput();
  }

  _adjustTextAreaHeight() {
    if (!this.content) this.editor.style.height = "var(--fe-height, 30px)";

    if (this.editor.scrollHeight > this.editor.clientHeight) this.editor.style.height = String(this.editor.scrollHeight + 5).concat("px");
  }

  /**
   * @param recommendation The recommendation which needs to be inserted
   * at the current cursor position
   * @returns void
   */
  parseInput(recommendation: string = "") {
    this.currentCursorPosition = this.editor.selectionStart;

    const parseOutput = this._parser.parseInput(this.content, this.currentCursorPosition, recommendation);

    this.recommendations = parseOutput.recommendations;
    this.errorString = parseOutput.errorString;

    /**
     * Don't modify the text stream manually if the text is being composed,
     * unless the user manually chooses to do so by selecting a recommendation.
     * @see https://github.com/w3c/input-events/issues/86
     * @see https://github.com/w3c/input-events/pull/122
     * @see https://bugs.chromium.org/p/chromium/issues/detail?id=689541
     */
    if (this.lastInputType !== "insertCompositionText" || recommendation) {
      this.content = parseOutput.formattedString!;
    }

    if (Boolean(recommendation)) {
      this.recommendations = [];
      this.currentCursorPosition = parseOutput.newCursorPosition;

      /* update cursor position in text area */
      setTimeout(() => {
        this.editor.setSelectionRange(this.currentCursorPosition, this.currentCursorPosition);
      }, 0);
    }

    this.dispatchEvent(
      new CustomEvent("fw-formula-content-changed", {
        detail: {
          formulaString: this.content,
          error: this.errorString,
          recommendations: this.recommendations,
        },
        bubbles: true,
      })
    );
  }

  formatFormula() {
    if (!Boolean(this.content)) return;

    this.content = this._parser.addParentheses(this.content) ?? this.content;
    this.parseInput();
    this.recommendations = [];
  }

  handleFocus(focus: boolean) {
    this.isFocused = focus;
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.code === "Tab") {
      event.preventDefault();
      if (this.recommendations?.length === 1) {
        this.suggestionMenu._handleRecommendationSelect();
      } else {
        const direction = event.shiftKey ? "up" : "down";
        this.suggestionMenu.navigate(direction);
      }
    } else if (event.code === "ArrowDown" || event.code === "ArrowUp") {
      event.preventDefault();
      const direction = event.code === "ArrowDown" ? "down" : "up";
      this.suggestionMenu.navigate(direction);
    } else if (event.code === "Enter") {
      event.preventDefault();
      this.suggestionMenu._handleRecommendationSelect();
    }
  }

  render() {
    return html`
      <style>${FormulaEditorStyles}</style>

      ${this.label ? html`<label for="wysiwyg-editor" class="editor-label">${this.label}</label>` : ""}

      <textarea
        id="wysiwyg-editor"
        class=${this.errorString?.length ? "error" : ""}
        .value=${this.content}
        .placeholder=${this.placeholder}
        spellcheck="false"
        autocomplete="off"
        @keydown=${this.handleKeydown}
        @blur=${() => this.handleFocus(false)}
        @focus=${() => this.handleFocus(true)}
      ></textarea>

      ${this.isFocused && this.recommendations?.length
        ? html`<suggestion-menu
            .recommendations=${this.recommendations}
            .currentSelection=${this._selectedRecommendation}
            .onClickRecommendation=${this.onClickRecommendation.bind(this)}
          ></suggestion-menu>`
        : ''}
    `;
  }
}