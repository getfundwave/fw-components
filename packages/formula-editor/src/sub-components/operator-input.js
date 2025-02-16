var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Operator } from "../helpers/types";
let OperatorInput = class OperatorInput extends LitElement {
    constructor() {
        super(...arguments);
        this.operator = Operator.NONE;
    }
    render() {
        return html `<span> ${this.operator} </span>`;
    }
};
__decorate([
    property()
], OperatorInput.prototype, "operator", void 0);
OperatorInput = __decorate([
    customElement("operator-input")
], OperatorInput);
//# sourceMappingURL=operator-input.js.map