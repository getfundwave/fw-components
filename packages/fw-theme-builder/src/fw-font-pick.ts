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
    const selectedFont = new FontFace(selection.name, `url(${selection.url})`);
    (document as any).fonts.add(selectedFont);
    await selectedFont.load();
    document.body.style.setProperty(this.CSSvariable, selection.style);
  }

  static styles = css`
  .fp-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 0.5rem;
    align-items: center;
    height: 3.2rem;
    padding: 0.2rem 0.5rem;
  }
  .fp-dropdown {
    position: absolute;
    bottom: 2.4rem;
    right: 0;
    display: none;
    flex-direction: column;
    justify-content: flex-start;
    background-color: #ffffff;
    padding: 0.5rem;
    border-radius: 4px;
    box-shadow: 3px 3px 10px #1b1b1b1b, -3px -3px 10px #1b1b1b1b; 
    width: 8rem;
  }
  .fp-option-unselected {
    padding: 0.2rem 0.5rem;
    cursor: pointer;
    border-radius: 2px;
  }
  .fp-option-unselected:hover {
    background-color: #e4e4e4;
  }
  .fp-dropdown-show {
    display: flex;
    animation: fp-appear 0.2s forwards; 
  }
  @keyframes fp-appear {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .fp-button {
    cursor: pointer;
    position: relative;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    width: 8rem;
    height: 2rem;
    border-radius: 4px;
    padding: 0.2rem 0.5rem;
    box-shadow: 3px 3px 10px #1b1b1b1b, -3px -3px 10px #1b1b1b1b; 
  }
  .fp-button:hover {
    background-color: #fcfcfc;
  }
  .fp-button:active {
    box-shadow: none;
    background-color: #e4e4e4;
  }
  .fp-button-fontname {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .fp-icon {
    width: 1rem;
    height: 1rem;
  }
  .fp-icon-selected {
    transform: rotate(180deg);
  }
  `;

  render() {
    return html`
    <span class="fp-container">
      <p class="fp-label">${this.label}</p>
      <div class="fp-button" @click="${this.buttonClickHandler}">
        <div class="fp-dropdown ${this.dropdown?"fp-dropdown-show":""}">
        ${
          this.options.filter((option : any) => {
            if (option.name != this.value.name) {
              return option;
            }
          }).map((option : any) => (html`<div @click="${(e : any) => this.optionSelectHandler(option)}" class="fp-option-unselected">${option.name}</div>`))
        }
        </div>
        <p class="fp-button-fontname">${this.value.name}</p>
        <img class="fp-icon ${this.dropdown?"fp-icon-selected":""}" src="./up-arrow.svg"/>
      </div>
    </span> 
    `;
  }
}