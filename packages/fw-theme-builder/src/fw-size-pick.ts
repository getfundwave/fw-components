import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("fw-size-pick")
class FwSizePick extends LitElement {
  constructor() {
    super();
  } 

  @property() 
  label? : string;
  @property() 
  CSSvariable = "";
  @property() 
  value? : string;

  handleChange(e : any) {
    console.log(e);
    let size = (e.target as HTMLInputElement)?.value;
    console.log("size", size);
    document.body.style.setProperty(this.CSSvariable, size + "px");
    this.value = size;
  }

  static styles = css`
  .size-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    height: 3.2rem;
    max-width: 6rem;
    padding: 0.2rem 0.5rem;
  }
  .size-container > input {
    width: 3rem;
    box-sizing: border-box;
    padding: 0.5rem 0.3rem;
    font-size: 1.2rem;
    border-radius: 4px;
    border: solid 1px #1b1b1b1b;
  }
  .size-container > input:focus {
    outline: solid 1px #1b1b1b4b;
  }

  .size-container > p {
    margin: 0;
    font-family: "DM Sans", sans-serif;
  }
  `;

  render() {
    return html`
    <span class="size-container">
      <p>${this.label}</p>
      <input
        type="number"
        value="${(this.value)?.slice(0, -2) || -1}"
        @change="${this.handleChange}"
      />
    </span>
    `;
  }
}