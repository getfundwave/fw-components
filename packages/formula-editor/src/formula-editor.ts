import { html, LitElement, PropertyValueMap } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { FormulaEditorStyles } from "./styles/formula-editor-styles.js";
import { Parser } from "./parser.js";
import { Cursor } from "./cursor.js";
import "./suggestion-menu.js";

@customElement("formula-editor")
export class FormulaEditor extends LitElement {
  private _parser: Parser;
  private _undoStack: string[] = [];
  private _redoStack: string[] = [];
  private _isCalculating: boolean = false;
  private _inputDebounceTimer: number | null = null;

  constructor() {
    super();
    this._parser = new Parser(this.variables, this.minSuggestionLen);
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this._parser = new Parser(this.variables, this.minSuggestionLen);
    this.parseInput(null, false);
  }

  /**
   * These `states` and `properties` can't be defined as `static get properties`,
   * because TS doesn't support that.
   * @see https://github.com/lit/lit-element/issues/414
   */

  @state()
  _formattedContent: Element | null = null;

  @state()
  _recommendations: string[] | null = null;

  @state()
  _calculatedResult: number | undefined = undefined;

  /**
   * If `parseInput` is called to add a recommendation, say by clicking,
   * browser removes focus from the input box. In that case, we have no way
   * of knowing where the cursor previously was, other than storing it somewhere.
   */

  @state()
  currentCursorPosition: number | null = null;

  @state()
  currentCursorRect: DOMRect | undefined = undefined;

  @state()
  lastInputType: string = "undef";

  @state()
  _selectedRecommendation: string; 

  @state()
  isFocus: Boolean = false;

  @property()
  content: string = "";

  @property()
  placeholder: string = "Type your formula..."

  @property()
  label: string;

  @property({
    type: Map<string, number>,
    converter: {
      fromAttribute: (value) => {
        if (value) {
          return new Map<string, number>(JSON.parse(value));
        }
      },
      toAttribute: (value: Map<string, number>) => {
        return JSON.stringify(Array.from(value.entries()));
      },
    },
  })
  variables = new Map();

  @property()
  minSuggestionLen: number = 2;

  @property()
  errorString: string | null = null;

  @query("wysiwyg-editor")
  editor: any;

  handleChange(event: InputEvent) {
    event.preventDefault();

    this.lastInputType = event.inputType;
    const newContent = (event.target as HTMLDivElement).innerText;
    
    // Save state for undo/redo if content actually changed
    if (newContent !== this.content) {
      this._undoStack.push(this.content);
      this._redoStack = []; // Clear redo stack on new changes
      if (this._undoStack.length > 50) this._undoStack.shift(); // Limit stack size
    }
    
    this.content = newContent;

    // Debounce input parsing
    if (this._inputDebounceTimer) {
      window.clearTimeout(this._inputDebounceTimer);
    }
    this._inputDebounceTimer = window.setTimeout(() => {
      this.parseInput();
      this._inputDebounceTimer = null;
    }, 150);

    (event.target as HTMLDivElement).focus();
  }

  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain') || '';
    
    // Clean and sanitize pasted content
    const sanitizedText = text
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces
      .replace(/\r\n/g, ' ') // Convert Windows line endings
      .replace(/\n/g, ' ') // Convert remaining line endings
      .trim();
    
    document.execCommand('insertText', false, sanitizedText);
  }

  undo() {
    if (this._undoStack.length > 0) {
      this._redoStack.push(this.content);
      this.content = this._undoStack.pop()!;
      this.parseInput();
    }
  }

  redo() {
    if (this._redoStack.length > 0) {
      this._undoStack.push(this.content);
      this.content = this._redoStack.pop()!;
      this.parseInput();
    }
  }

  navigateRecommendations(direction: string) {
    if (!this._recommendations) return;
  
    const currentIndex = this._recommendations.indexOf(this._selectedRecommendation);
    const newIndex =
      direction === "ArrowDown"
        ? (currentIndex + 1) % this._recommendations.length
        : direction === "ArrowUp"
        ? (currentIndex - 1 + this._recommendations.length) % this._recommendations.length
        : currentIndex;
  
    this._selectedRecommendation = this._recommendations[newIndex];

    this.scrollToSelectedRecommendation(newIndex);
  }

  scrollToSelectedRecommendation(index: number) {
    const suggestionMenu = this.shadowRoot?.querySelector("suggestion-menu");
    if (suggestionMenu) {
      const listItem = suggestionMenu.shadowRoot?.querySelectorAll("li")[index];
      if (listItem) {
        listItem.scrollIntoView({
          block: "nearest",  
          inline: "nearest",
        });
      }
    }
  }

  handleKeyboardEvents(event: KeyboardEvent) {
    if (event.code === "Tab" && this._recommendations?.length == 1) {
      this._selectedRecommendation = null;
      event.preventDefault();
      this.parseInput(this._recommendations[0]);
    }
    else if (event.code === "ArrowDown" || event.code === "ArrowUp") {
      event.preventDefault();
      this.navigateRecommendations(event.code);
      this.requestUpdate();
    }
    else if (event.code === "Enter" && this._selectedRecommendation) {
      event.preventDefault();
      this.parseInput(this._selectedRecommendation);
      this._selectedRecommendation = null; 
    }
    else if ((event.metaKey || event.ctrlKey) && event.code === "KeyZ") {
      event.preventDefault();
      if (event.shiftKey) {
        this.redo();
      } else {
        this.undo();
      }
    }
  }

  onClickRecommendation(recommendation: string) {
    let editor = this.shadowRoot?.getElementById("wysiwyg-editor");
    if (!editor) return;

    this.parseInput(recommendation);
    this.currentCursorPosition = null;
  }

  /**
   *
   * @param recommendation The recommendation which needs to be inserted
   * at the current cursor position
   * @param manageCursor Whether or not cursor management is needed. Not
   * needed when manual insertion of text is required (eg: during initialization)
   * @returns void
   */
  parseInput(
    recommendation: string | null = null,
    manageCursor: boolean = true
  ) {
    let editor = this.shadowRoot?.getElementById("wysiwyg-editor");
    if (!editor) return;

    /**
     * @see https://github.com/WICG/webcomponents/issues/79
     */

    if (manageCursor)
      this.currentCursorPosition = recommendation
        ? this.currentCursorPosition
        : Cursor.getCaretPosition(this.shadowRoot!, editor);

    const parseOutput = this._parser.parseInput(
      this.content,
      this.currentCursorPosition,
      recommendation
    );

    this._recommendations = parseOutput.recommendations;
    this._formattedContent = parseOutput.formattedContent;
    this.errorString = parseOutput.errorString;


    /**
     * Don't modify the text stream manually if the text is being composed,
     * unless the user manually chooses to do so by selecting a suggestion.
     * @see https://github.com/w3c/input-events/issues/86
     * @see https://github.com/w3c/input-events/pull/122
     * @see https://bugs.chromium.org/p/chromium/issues/detail?id=689541
     * */

    if (this.lastInputType != "insertCompositionText" || recommendation) {
      editor.innerHTML = parseOutput.formattedString!;
    }

    this.content = (editor as HTMLDivElement).innerText;

    if (recommendation) {
      this._recommendations = null;
      this.currentCursorPosition = parseOutput.newCursorPosition;
    }

    if (manageCursor)
      Cursor.setCaretPosition(this.currentCursorPosition!, editor);
    editor?.focus();

    if (manageCursor)
      this.currentCursorRect = Cursor.getCursorRect(this.shadowRoot!);

    this.requestUpdate();

    this.dispatchEvent(
      new CustomEvent("fw-formula-content-changed", {
        detail: {
          formulaString: this.content,
          error: this.errorString,
          recommendations: this._recommendations
        },
        bubbles: true,
      })
    );
  }

  async requestCalculate() {
    if (this._parser.parseInput(this.content).errorString) {
      return;
    }

    this._isCalculating = true;
    this.requestUpdate();

    try {
      const calculatedResult = this._parser.calculate(this.content);
      this.content = this._parser.addParentheses(this.content) ?? this.content;
      this.parseInput();

      this._calculatedResult = calculatedResult.result;
      this.errorString = calculatedResult.errorString;
    } finally {
      this._isCalculating = false;
      this._recommendations = null;
      this.requestUpdate();
    }
  }

  requestFormat() {
    if(!Boolean(this.content)){
      return;
    }
    this.content =  this._parser.addParentheses(this.content) ?? this.content;
    this.parseInput();
    this._recommendations = null;
    this.requestUpdate();
  }

  async updated(_changedProperties){

    if(_changedProperties.has("content")){
      if(!this.content.trim()){
        this._recommendations= Array.from(this.variables.keys());
      }
    }

    if(_changedProperties.has("variables")){
      this._parser = new Parser(this.variables, this.minSuggestionLen);
      this.parseInput(null, false);
    }

  }

  handleFocusOut(e: FocusEvent) {
      this.isFocus = false;
      this._recommendations = null;
      this.requestUpdate();
  }

  handleFocus(e: FocusEvent){
    this.isFocus = true;
    if(!this.content.trim()){
      this._recommendations= Array.from(this.variables.keys());
    }
  }
  

  render() {
    return html`
      <style>
        ${FormulaEditorStyles}
      </style>

        ${this.label
          ? html`<label for="wysiwyg-editor" class="formula-editor-label">
              ${this.label}
            </label>`
          : ""}
        
        <div
          contenteditable
          placeholder=${this.placeholder}
          id="wysiwyg-editor"
          spellcheck="false"
          autocomplete="off"
          role="textbox"
          class=${this._isCalculating ? 'loading' : ''}
          aria-label="Formula editor"
          aria-placeholder=${this.placeholder}
          aria-invalid=${Boolean(this.errorString)}
          aria-describedby=${this.errorString ? "error-message" : null}
          @input=${this.handleChange}
          @keydown=${this.handleKeyboardEvents}
          @blur=${this.handleFocusOut}
          @focus=${this.handleFocus}
          @paste=${this.handlePaste}
        ></div>
        ${this.errorString ? html`
          <div id="error-message" class="error-message" role="alert">
            ${this.errorString}
          </div>
        ` : null}
      ${this.isFocus ? html`
        <suggestion-menu
          .recommendations=${this._recommendations ?? []}
          .currentSelection=${this._selectedRecommendation}
          .onClickRecommendation=${(e: any) => this.onClickRecommendation(e)}
          .variables=${this.variables}
          .constants=${this._parser.constants}
          .isLoading=${this._inputDebounceTimer !== null}
          @mousedown=${(e: MouseEvent) => e.preventDefault()}
        ></suggestion-menu>
      ` : html``}
      ${this._calculatedResult !== undefined ? html`
        <p role="status" aria-live="polite">Result: ${this._calculatedResult}</p>
      ` : null}
    `;
  }
}
