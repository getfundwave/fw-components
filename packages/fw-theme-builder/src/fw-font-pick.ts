import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("fw-font-pick")
class FwFontPick extends LitElement {
  constructor () {
    super();
  }

  @property()
  label = "";

  @property()
  value : any;

  @property()
  options : any;

  @property()
  CSSvariable = "";

  @state()
  dropdown = false;

  buttonClickHandler () {
    if (this.dropdown) this.dropdown = false;
    else this.dropdown = true;
  }

  async optionSelectHandler (selection : any) {
    this.value = selection;
    this.dropdown = false;

    const pont = new FontFace(selection.name, selection.url);
    await pont.load();
    (document as any).fonts.add(pont);

    document.body.style.setProperty(`${this.CSSvariable}`, selection.style);
  }

  static styles = css`
  .fp-container {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 0.5rem;
    align-items: center;
  }
  .fp-label {
    
  }
  .fp-dropdown {
    position: absolute;
    display: none;
    flex-direction: column;
    justify-content: flex-start;
  }
  .fp-dropdown-show {
    display: flex;
  }
  .fp-icon {

  }
  `;

  render() {
    return html`
    <span class="fp-container">
      <p class="fp-label">${this.label}</p>
      <div class="fp-dropdown ${this.dropdown?"fp-dropdown-show":""}">
      ${
        this.options.filter((option : any) => {
          if (option.name != this.value.name) {
            return option;
          }
        }).map((option : any) => (html`<div @click="${(e : any) => this.optionSelectHandler(option)}" class="fp-option-unselected">${option.name}</div>`))
      }
      </div>
      <div class="fp-button" @click="${this.buttonClickHandler}">
        <p>${this.value.name}</p>
        <img class="fp-icon" src="./back-arrow.svg"/>
      </div>
    </span> 
    `;
  }
}