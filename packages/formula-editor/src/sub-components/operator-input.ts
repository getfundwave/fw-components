import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Operator } from "../helpers/types";

@customElement("operator-input")
class OperatorInput extends LitElement {
  @property()
  operator: Operator = Operator.NONE;

  render() {
    return html`<span> ${this.operator} </span>`;
  }
}
