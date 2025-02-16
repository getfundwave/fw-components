var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { Formula } from "./helpers/types.js";
import { TextButtonStyles } from "../../styles/src/button-styles.js";
let FormulaBuilder = class FormulaBuilder extends LitElement {
    constructor() {
        super(...arguments);
        this.variables = new Map([
            ["sales_expense", 2],
            ["sales_in_quarter", 3],
            ["sales_cummulative", 3],
            ["cummulative_sum", 4],
            ["mayank", 10],
        ]);
        this.formula = new Formula("", "");
        this.handleCalculate = () => {
            var _a;
            (_a = this.formulaEditor) === null || _a === void 0 ? void 0 : _a.requestCalculate();
        };
        this.handleFormat = () => {
            var _a;
            (_a = this.formulaEditor) === null || _a === void 0 ? void 0 : _a.requestFormat();
        };
    }
    handleChange() {
        var _a;
        this.dispatchEvent(new CustomEvent("fw-formula-changed", {
            detail: {
                name: (_a = this.nameInput) === null || _a === void 0 ? void 0 : _a.value,
                rawFormula: this.formula.formulaString,
                error: this.formula.error,
                precision: this.formula.precision,
            },
            bubbles: true,
        }));
        this.requestUpdate();
    }
    render() {
        var _a, _b;
        return html `
      ${TextButtonStyles}

      <div>
        <label for="metric-name-input">Metric Name</label>
        <input
          id="metric-name-input"
          .value=${this.formula.name}
          @input=${(e) => {
            this.handleChange();
        }}
        />
      </div>
      <label>Formula</label>
      <formula-editor
        class="fe"
        minSuggestionLen="0"
        @fw-formula-content-changed=${(e) => {
            this.formula.formulaString = e.detail.formulaString;
            this.formula.error = e.detail.error;
            this.handleChange();
        }}
        .variables=${this.variables}
        .content=${this.formula.formulaString}
        .errorString=${this.formula.error}
      >
      </formula-editor>
      <div id="wysiwyg-err" class="${(_a = this.formula.error) !== null && _a !== void 0 ? _a : "wysiwyg-no-err"}">
        ${(_b = this.formula.error) !== null && _b !== void 0 ? _b : `${this.formula.name} = ${this.formula.formulaString}`}
      </div>
      <button class="primary-text-button" @click=${this.handleCalculate}>
        Calculate
      </button>
      <button class="primary-text-button" @click=${this.handleFormat}>
        Format
      </button>
    `;
    }
};
FormulaBuilder.styles = css `
    #wysiwyg-err {
      width: 100%;
      border-radius: 0px 0px var(--fe-err-border-radius, 4px)
        var(--fe-err-border-radius, 4px);
      color: var(--fe-err-text-color, #fc514f);
      border: var(--fe-err-border-width, 2px) solid black;
      /* border-top: 0px; */
      background-color: var(--fe-background-color, #222222);
      padding: 4px;
      margin: 0px 0px 8px 0px;
    }

    .wysiwyg-no-err {
      color: #098668 !important;
    }
  `;
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
], FormulaBuilder.prototype, "variables", void 0);
__decorate([
    property({
        type: Formula,
        converter: {
            fromAttribute: (value) => {
                if (value) {
                    const formulaJSON = JSON.parse(value);
                    return new Formula(formulaJSON.name, formulaJSON.formulaString, formulaJSON.precision);
                }
            },
            toAttribute: (value) => {
                return JSON.stringify(value);
            },
        },
    })
], FormulaBuilder.prototype, "formula", void 0);
__decorate([
    property()
], FormulaBuilder.prototype, "handleCalculate", void 0);
__decorate([
    property()
], FormulaBuilder.prototype, "handleFormat", void 0);
__decorate([
    query("#metric-name-input")
], FormulaBuilder.prototype, "nameInput", void 0);
__decorate([
    query("formula-editor")
], FormulaBuilder.prototype, "formulaEditor", void 0);
FormulaBuilder = __decorate([
    customElement("formula-builder")
], FormulaBuilder);
//# sourceMappingURL=formula-builder.js.map