var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { Operator } from "./helpers/types";
var FormulaEntityType;
(function (FormulaEntityType) {
    FormulaEntityType[FormulaEntityType["Operator"] = 0] = "Operator";
    FormulaEntityType[FormulaEntityType["Entity"] = 1] = "Entity";
})(FormulaEntityType || (FormulaEntityType = {}));
class FormulaEntity {
    constructor(type, metric, operator = Operator.NONE) {
        this.type = type;
        this.metric = metric;
        this.operator = operator;
    }
}
class FormulaRow {
    constructor(type, metrices = null, operator = Operator.NONE) {
        this.operator = Operator.NONE;
        this.type = type;
        this.metrices = metrices;
        this.operator = operator;
    }
}
let FormulaCreator = class FormulaCreator extends LitElement {
    constructor() {
        super(...arguments);
        this.formulaState = [
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
    }
    render() {
        return html `
      <label>Formula</label>
      ${repeat(this.formulaState, (_, rowIndex) => `row-${rowIndex}`, (formulaRow, rowIndex) => {
            return formulaRow.type == FormulaEntityType.Entity
                ? html ` <div>
                ${repeat(formulaRow.metrices, (_, columnIndex) => `col-(${rowIndex},${columnIndex})`, (formulaEntity, columnIndex) => {
                    return formulaEntity.type == FormulaEntityType.Entity
                        ? html `<input
                          value=${ifDefined(formulaEntity.metric === null
                            ? undefined
                            : formulaEntity.metric)}
                        />`
                        : html `<operator-input
                          .operator=${formulaEntity.operator}
                        ></operator-input>`;
                })}
              </div>`
                : html `<div>${formulaRow.operator}</div>`;
        })}
    `;
    }
};
__decorate([
    state()
], FormulaCreator.prototype, "formulaState", void 0);
FormulaCreator = __decorate([
    customElement("formula-creator")
], FormulaCreator);
//# sourceMappingURL=formula-creator.js.map