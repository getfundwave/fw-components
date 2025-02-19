import { html, LitElement, PropertyValueMap } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { FormulaEditorStyles } from "./styles/formula-editor-styles.js";
import { Parser } from "./parser.js";
import { Cursor } from "./cursor.js";
import "./suggestion-menu.js";

@customElement("formula-editor")
export class FormulaEditor extends LitElement {
  private _parser: Parser;

  constructor() {
    super();
    this._parser = new Parser(this.variables, this.minSuggestionLen);
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    this._parser = new Parser(this.variables, this.minSuggestionLen);

    let editor : HTMLElement = this.shadowRoot?.getElementById("wysiwyg-editor");

    const inputListener = this.handleContentUpdate.bind(this);
    editor.addEventListener("input", inputListener);

    editor.focus();
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
  lastInputType: string = "";

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
  editor: HTMLTextAreaElement;

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
    if (event.code == "Tab" && this._recommendations?.length == 1) {
      this._selectedRecommendation = null;
      event.preventDefault();
      this.parseInput(this._recommendations[0]);
    }
    else if (event.code === "ArrowDown" || event.code === "ArrowUp") {
      if(this._recommendations) event.preventDefault();
      this.navigateRecommendations(event.code);
      this.requestUpdate();
    }
    else if (event.code === "Enter" && this._selectedRecommendation) {
      event.preventDefault();
      this.parseInput(this._selectedRecommendation);
      this._selectedRecommendation = null; 
    }
  
  }

  onClickRecommendation(recommendation: string) {
    let editor = this.shadowRoot?.getElementById("wysiwyg-editor");
    if (!editor) return;

    this.parseInput(recommendation);
  }

  handleContentUpdate(event: any) {
    event.preventDefault(); 

    this.lastInputType = event.inputType;
    this.content = event.target.value;
    this.parseInput();
  }

  _adjustInputHeight() {
    const editor = this.shadowRoot?.getElementById("wysiwyg-editor");

    if(!this.content) editor.style.height = "var(--fe-height, 30px)";
   
    if(editor.scrollHeight > editor.clientHeight) editor.style.height = (editor.scrollHeight + 5)+"px"
  }

  /**
   *
   * @param recommendation The recommendation which needs to be inserted
   * at the current cursor position
   * @param manageCursor Whether or not cursor management is needed. Not
   * needed when manual insertion of text is required (eg: during initialization)
   * @returns void
   */
  parseInput(recommendation: string | null = null) {
    let editor = <HTMLTextAreaElement>this.shadowRoot?.getElementById("wysiwyg-editor");

    if (!editor) return;

    this.currentCursorPosition = editor.selectionStart;

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

    if (this.lastInputType !== "insertCompositionText" || recommendation) {
      const formattedString = parseOutput.formattedString!;
      this.content = formattedString;
    }

    if (recommendation) {
      this._recommendations = null;
      this.currentCursorPosition = parseOutput.newCursorPosition;
      
      setTimeout(() => {
        editor.setSelectionRange(this.currentCursorPosition, this.currentCursorPosition);
      }, 0);
    }


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

    editor.focus();
  }

  requestCalculate() {
    if (this._parser.parseInput(this.content).errorString) {
      return;
    }

    const calculatedResult = this._parser.calculate(this.content);

    this.content = this._parser.addParentheses(this.content) ?? this.content;
    this.parseInput();

    this._calculatedResult = calculatedResult.result;
    this.errorString = calculatedResult.errorString;

    this._recommendations = null;
    this.requestUpdate();
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

      this._adjustInputHeight();
    }

    if(_changedProperties.has("variables")){
      this._parser = new Parser(this.variables, this.minSuggestionLen);
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
      this._recommendations = Array.from(this.variables.keys());
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
        
        <textarea
          placeholder=${this.placeholder}
          id="wysiwyg-editor"
          class=${this.errorString?.length ? "error" : ""}
          .value=${this.content}
          @keydown=${this.handleKeyboardEvents}
          @blur=${this.handleFocusOut}
          @focus=${this.handleFocus}
        ></textarea>
      ${this._recommendations && this.isFocus
        ? html` <suggestion-menu
              .recommendations=${this._recommendations}
              .currentSelection=${this._selectedRecommendation}
              .onClickRecommendation=${(e: any) => this.onClickRecommendation(e)}
               @mousedown=${(e: MouseEvent) => e.preventDefault()}
            ></suggestion-menu>`
        : html``}
      <p>${this._calculatedResult}</p>
    `;
  }
}
