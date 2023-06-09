import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement("fw-color-pick")
class FwColorPick extends LitElement {
  constructor() {
    super();
  }

  @property()
  label? : string;
  CSSvariable? : string;
  value? : string;
  handleChange : any;
  styles = `.color-pick-button {
    background-color: var(${this.CSSvariable});
  }`;

  static styles = css`
  .color-button {
      position: relative;
      background-color: #afafaf;
      border-radius: 4px;
      padding: 0.2rem 0.5rem;
      font-family: "DM Sans", sans-serif;
      font-weight: 400;
      color: #2b2b2b;
      cursor: pointer;
      box-shadow: #1b1b1b3b 0px 4px 10px;
  }`;

  render () {
    return html`
    <style>${this.style}</style>
        <span class="color-button" >
            <p>${this.label}</p>
            <input 
                class="colorpicker-hidden"
                type="color"
                value=${this.value || "ERROR"}
                @change=${(e : any) => this.handleChange(e, this.CSSvariable)}
            />
        </span>
      `;
  }
}