var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { FormulaEditorStyles } from "./styles/formula-editor-styles.js";
import { Parser } from "./parser.js";
import { Cursor } from "./cursor.js";
import "./suggestion-menu.js";
let FormulaEditor = class FormulaEditor extends LitElement {
    constructor() {
        super();
        /**
         * These `states` and `properties` can't be defined as `static get properties`,
         * because TS doesn't support that.
         * @see https://github.com/lit/lit-element/issues/414
         */
        this._formattedContent = null;
        this._recommendations = null;
        this._calculatedResult = undefined;
        /**
         * If `parseInput` is called to add a recommendation, say by clicking,
         * browser removes focus from the input box. In that case, we have no way
         * of knowing where the cursor previously was, other than storing it somewhere.
         */
        this.currentCursorPosition = null;
        this.currentCursorRect = undefined;
        this.lastInputType = "undef";
        this.content = "";
        this.variables = new Map();
        this.minSuggestionLen = 2;
        this.errorString = null;
        this._parser = new Parser(this.variables, this.minSuggestionLen);
    }
    firstUpdated(_changedProperties) {
        this._parser = new Parser(this.variables, this.minSuggestionLen);
        this.parseInput(null, false);
    }
    handleChange(event) {
        event.preventDefault();
        this.lastInputType = event.inputType;
        this.content = event.target.innerText;
        this.parseInput();
        event.target.focus();
    }
    handleTab(event) {
        var _a;
        if (event.code == "Tab" && ((_a = this._recommendations) === null || _a === void 0 ? void 0 : _a.length) == 1) {
            event.preventDefault();
            this.parseInput(this._recommendations[0]);
        }
    }
    onClickRecommendation(recommendation) {
        var _a;
        let editor = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById("wysiwyg-editor");
        if (!editor)
            return;
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
    parseInput(recommendation = null, manageCursor = true) {
        var _a;
        let editor = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById("wysiwyg-editor");
        if (!editor)
            return;
        /**
         * @see https://github.com/WICG/webcomponents/issues/79
         */
        if (manageCursor)
            this.currentCursorPosition = recommendation
                ? this.currentCursorPosition
                : Cursor.getCaretPosition(this.shadowRoot, editor);
        const parseOutput = this._parser.parseInput(this.content, this.currentCursorPosition, recommendation);
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
            editor.innerHTML = parseOutput.formattedString;
        }
        this.content = editor.innerText;
        if (recommendation) {
            this._recommendations = null;
            this.currentCursorPosition = parseOutput.newCursorPosition;
        }
        if (manageCursor)
            Cursor.setCaretPosition(this.currentCursorPosition, editor);
        editor === null || editor === void 0 ? void 0 : editor.focus();
        if (manageCursor)
            this.currentCursorRect = Cursor.getCursorRect(this.shadowRoot);
        this.requestUpdate();
        this.dispatchEvent(new CustomEvent("fw-formula-content-changed", {
            detail: {
                formulaString: this.content,
                error: this.errorString,
            },
            bubbles: true,
        }));
    }
    requestCalculate() {
        var _a;
        if (this._parser.parseInput(this.content).errorString) {
            return;
        }
        const calculatedResult = this._parser.calculate(this.content);
        this.content = (_a = this._parser.addParentheses(this.content)) !== null && _a !== void 0 ? _a : this.content;
        this.parseInput();
        this._calculatedResult = calculatedResult.result;
        this.errorString = calculatedResult.errorString;
        this._recommendations = null;
        this.requestUpdate();
    }
    requestFormat() {
        var _a;
        this.content = (_a = this._parser.addParentheses(this.content)) !== null && _a !== void 0 ? _a : this.content;
        this.parseInput();
        this._recommendations = null;
        this.requestUpdate();
    }
    render() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return html `
      <style>
        ${FormulaEditorStyles}
      </style>
      <div
        contenteditable
        id="wysiwyg-editor"
        spellcheck="false"
        autocomplete="off"
        @input=${this.handleChange}
        @keydown=${this.handleTab}
      ></div>
      ${this._recommendations
            ? html ` <suggestion-menu
            style="
              position: absolute; 
              left: ${((_b = (_a = this.currentCursorRect) === null || _a === void 0 ? void 0 : _a.left) !== null && _b !== void 0 ? _b : 0) -
                ((_e = (_d = (_c = this.editor) === null || _c === void 0 ? void 0 : _c.getClientRect()[0]) === null || _d === void 0 ? void 0 : _d.left) !== null && _e !== void 0 ? _e : 0) +
                "px"}; 
              top: ${((_g = (_f = this.currentCursorRect) === null || _f === void 0 ? void 0 : _f.top) !== null && _g !== void 0 ? _g : 0 - ((_k = (_j = (_h = this.editor) === null || _h === void 0 ? void 0 : _h.getClientRect()[0]) === null || _j === void 0 ? void 0 : _j.top) !== null && _k !== void 0 ? _k : 0)) +
                window.scrollY +
                "px"};
            "
            .recommendations=${this._recommendations}
            .onClickRecommendation=${(e) => this.onClickRecommendation(e)}
          ></suggestion-menu>`
            : html ``}
      <p>${this._calculatedResult}</p>
    `;
    }
};
__decorate([
    state()
], FormulaEditor.prototype, "_formattedContent", void 0);
__decorate([
    state()
], FormulaEditor.prototype, "_recommendations", void 0);
__decorate([
    state()
], FormulaEditor.prototype, "_calculatedResult", void 0);
__decorate([
    state()
], FormulaEditor.prototype, "currentCursorPosition", void 0);
__decorate([
    state()
], FormulaEditor.prototype, "currentCursorRect", void 0);
__decorate([
    state()
], FormulaEditor.prototype, "lastInputType", void 0);
__decorate([
    property()
], FormulaEditor.prototype, "content", void 0);
__decorate([
    property({
        type: (Map),
        converter: {
            fromAttribute: (value) => {
                if (value) {
                    return new Map(JSON.parse(value));
                }
            },
            toAttribute: (value) => {
                return JSON.stringify(Array.from(value.entries()));
            },
        },
    })
], FormulaEditor.prototype, "variables", void 0);
__decorate([
    property()
], FormulaEditor.prototype, "minSuggestionLen", void 0);
__decorate([
    property()
], FormulaEditor.prototype, "errorString", void 0);
__decorate([
    query("wysiwyg-editor")
], FormulaEditor.prototype, "editor", void 0);
FormulaEditor = __decorate([
    customElement("formula-editor")
], FormulaEditor);
export { FormulaEditor };
//# sourceMappingURL=formula-editor.js.map