import { LitElement, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { Formula } from "./helpers/types.js";

import { TextButtonStyles } from "../../styles/src/button-styles.js";
import { FormulaEditor } from "./formula-editor";

@customElement("formula-builder")
class FormulaBuilder extends LitElement {
  static styles = css`
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
  variables = new Map([
    ["sales_expense", 2],
    ["sales_in_quarter", 3],
    ["sales_cummulative", 3],
    ["cummulative_sum", 4],
    ["mayank", 10],
  ]);

  @property({
    type: Formula,
    converter: {
      fromAttribute: (value) => {
        if (value) {
          const formulaJSON = JSON.parse(value);
          return new Formula(
            formulaJSON.name,
            formulaJSON.formulaString,
            formulaJSON.precision
          );
        }
      },
      toAttribute: (value) => {
        return JSON.stringify(value);
      },
    },
  })
  formula = new Formula("", "");

  @property()
  handleCalculate = () => {
    this.formulaEditor?.requestCalculate();
  };

  @property()
  handleFormat = () => {
    this.formulaEditor?.requestFormat();
  };

  @query("#metric-name-input")
  nameInput: HTMLInputElement | undefined;

  @query("formula-editor")
  formulaEditor: FormulaEditor | undefined;

  handleChange() {
    this.dispatchEvent(
      new CustomEvent("fw-formula-changed", {
        detail: {
          name: this.nameInput?.value,
          rawFormula: this.formula.formulaString,
          error: this.formula.error,
          precision: this.formula.precision,
        },
        bubbles: true,
      })
    );

    this.requestUpdate();
  }

  render() {
    return html`
      ${TextButtonStyles}

      <div>
        <label for="metric-name-input">Metric Name</label>
        <input
          id="metric-name-input"
          .value=${this.formula.name}
          @input=${(e: any) => {
            this.handleChange();
          }}
        />
      </div>
      <label>Formula</label>
      <formula-editor
        class="fe"
        minSuggestionLen="0"
        @fw-formula-content-changed=${(e: any) => {
          this.formula.formulaString = e.detail.formulaString;
          this.formula.error = e.detail.error;
          this.handleChange();
        }}
        .variables=${this.variables}
        .content=${this.formula.formulaString}
        .errorString=${this.formula.error}
      >
      </formula-editor>
      <div id="wysiwyg-err" class="${this.formula.error ?? "wysiwyg-no-err"}">
        ${this.formula.error ??
        `${this.formula.name} = ${this.formula.formulaString}`}
      </div>
      <button class="primary-text-button" @click=${this.handleCalculate}>
        Calculate
      </button>
      <button class="primary-text-button" @click=${this.handleFormat}>
        Format
      </button>
    `;
  }
}
