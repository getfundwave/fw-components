import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("fw-font-pick")
class FwFontPick extends LitElement {
  @property()
  label = "";

  @property()
  section = "";

  @property()
  theme : any;

  @property()
  options : any;

  @state()
  dropdown = false;

  buttonClickHandler () {
    if (this.dropdown) this.dropdown = false;
    else this.dropdown = true;
  }

  async optionSelectHandler (selection : any) {
    let detail = {
      "section" : this.section,
      "value"   : selection,
    }
    const event = new CustomEvent('font-change', { detail, bubbles : true, composed : true });
    this.dispatchEvent(event);
  }

  static styles = css`
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
    <span part="font-container">
      <p part="font-label">${this.label}</p>
      <div part="font-button" @click="${this.buttonClickHandler}">
        <div part="font-dropdown-container" class="fp-dropdown ${this.dropdown?"fp-dropdown-show":""}">
        ${
          this.options.filter((option : any) => {
            if (option.name != this.theme.Fonts[this.section].name) {
              return option;
            }
          }).map((option : any) => (html`<div part="font-dropdown-option" @click="${(e : any) => this.optionSelectHandler(option)}" class="fp-option-unselected">${option.name}</div>`))
        }
        </div>
        <p part="font-dropdown-selected" class="fp-button-fontname">${this.theme.Fonts[this.section].name}</p>
        <svg class="fp-icon ${this.dropdown?"fp-icon-selected":""}" width="80" height="46" viewBox="0 0 80 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.10464 43.9567C4.89877 46.6811 9.41237 46.6811 12.2065 43.9567L40.0045 16.8527L67.8025 43.9567C70.5967 46.6811 75.1103 46.6811 77.9044 43.9567C80.6985 41.2323 80.6985 36.8314 77.9044 34.1071L45.0196 2.04328C42.2255 -0.681097 37.7119 -0.681097 34.9178 2.04328L2.033 34.1071C-0.689491 36.7616 -0.689489 41.2323 2.10464 43.9567Z" fill="black"/>
        </svg>    
      </div>
    </span> 
    `;
  }
}