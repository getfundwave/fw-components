import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { Operator } from "./helpers/types";

enum FormulaEntityType {
  Operator,
  Entity,
}

class FormulaEntity {
  constructor(
    type: FormulaEntityType,
    metric: string | null,
    operator: Operator = Operator.NONE
  ) {
    this.type = type;
    this.metric = metric;
    this.operator = operator;
  }

  type: FormulaEntityType;
  metric: string | null;
  operator: Operator;
}

class FormulaRow {
  constructor(
    type: FormulaEntityType,
    metrices: FormulaEntity[] | null = null,
    operator: Operator = Operator.NONE
  ) {
    this.type = type;
    this.metrices = metrices;
    this.operator = operator;
  }

  type: FormulaEntityType;
  operator: Operator = Operator.NONE;
  metrices: FormulaEntity[] | null;
}

@customElement("formula-creator")
class FormulaCreator extends LitElement {
  @state()
  formulaState: FormulaRow[] = [
    new FormulaRow(FormulaEntityType.Entity, [
      new FormulaEntity(FormulaEntityType.Entity, "Sales Expense"),
      new FormulaEntity(FormulaEntityType.Operator, null, Operator.MINUS),
      new FormulaEntity(FormulaEntityType.Entity, "Marketing Expense"),
    ]),
    new FormulaRow(FormulaEntityType.Operator, null, Operator.DIV),
    new FormulaRow(FormulaEntityType.Entity, [
      new FormulaEntity(FormulaEntityType.Entity, "Sales Expense"),
      new FormulaEntity(FormulaEntityType.Operator, null, Operator.PLUS),
      new FormulaEntity(FormulaEntityType.Entity, "Marketing Expense"),
    ]),
    new FormulaRow(FormulaEntityType.Operator, null, Operator.DIV),
    new FormulaRow(FormulaEntityType.Entity, [
      new FormulaEntity(FormulaEntityType.Entity, "Sales Expense"),
      new FormulaEntity(FormulaEntityType.Operator, null, Operator.DIV),
      new FormulaEntity(FormulaEntityType.Entity, "Marketing Expense"),
    ]),
  ];

  render() {
    return html`
      <label>Formula</label>
      ${repeat(
        this.formulaState,
        (_, rowIndex) => `row-${rowIndex}`,
        (formulaRow, rowIndex) => {
          return formulaRow.type == FormulaEntityType.Entity
            ? html` <div>
                ${repeat(
                  formulaRow.metrices!,
                  (_, columnIndex) => `col-(${rowIndex},${columnIndex})`,
                  (formulaEntity, columnIndex) => {
                    return formulaEntity.type == FormulaEntityType.Entity
                      ? html`<input
                          value=${ifDefined(
                            formulaEntity.metric === null
                              ? undefined
                              : formulaEntity.metric
                          )}
                        />`
                      : html`<operator-input
                          .operator=${formulaEntity.operator}
                        ></operator-input>`;
                  }
                )}
              </div>`
            : html`<div>${formulaRow.operator}</div>`;
        }
      )}
    `;
  }
}
