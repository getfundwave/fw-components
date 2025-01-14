import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import "@fw-components/formula-editor";

class Formula {
  constructor(name, formulaString, precision = -1) {
    this.name = name;
    this.formulaString = formulaString;
    this.precision = precision;
    this.error = null;
  }

  get formulaString() {
    return this._formulaString;
  }

  set formulaString(value) {
    this._formulaString = value;
    this.error = null;
  }
}

export class FWFormulaEditorShowcase extends LitElement {
  @property({ type: Object }) currentFormula = new Formula(
    "Total Sales",
    "sales_in_quarter + additional_cost",
    2
  );

  @property({ type: Object }) variables = new Map([
    ["sales_expense", 5000],
    ["sales_in_quarter", 30000],
    ["sales_cummulative", 70000],
    ["cummulative_sum", 80000],
    ["additional_cost", 2000],
  ]);

  static styles = css`
    .container {
      width: 95%;
      margin: auto;
      font-family: Arial, sans-serif;
    }
    .variables {
      margin: 20px 0;
      padding: 15px;
      border-radius: 8px;
      background-color: #f3f3f3;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
    }
    .variable-list {
      margin-top: 10px;
    }
    .variable-item {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
    }
    .formula-builder-container {
      width: 99%;
      margin-top: 20px;
    }
  `;

  handleFormulaChange(event) {
    const { name, rawFormula, precision } = event.detail;
    this.currentFormula = new Formula(name, rawFormula, precision);
  }

  render() {
    return html`
      <div class="formula-editor-showcase">
        <div class="variables">
          <!-- Current Variables -->
          <div class="variable-list">
            <h4>Current Variables</h4>
            ${Array.from(this.variables.entries()).map(
              ([key, value]) => html`
                <div class="variable-item">
                  <span>${key}</span>
                  <span>${value}</span>
                </div>
              `
            )}
          </div>
        </div>

        <div class="formula-builder-container">
          <formula-builder
            id="formula-builder-showcase"
            .variables=${this.variables}
            .formula=${this.currentFormula}
            @fw-formula-changed=${this.handleFormulaChange}
          ></formula-builder>
        </div>
      </div>
    `;
  }
}

window.customElements.define(
  "fw-formula-editor-showcase",
  FWFormulaEditorShowcase
);
