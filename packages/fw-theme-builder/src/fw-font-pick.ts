import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

type Font = {
  name: string,
  url: string,
  style: string
}

@customElement("fw-font-pick")
export class FwFontPick extends LitElement {
  @property({type : String})
  label = "";

  @property({type : Array})
  options: Array<Font> = [];

  @state()
  showDropdown = false;

  @property({ type: Object })
  value = {
    name: "DM Sans",
    url: "https://fonts.gstatic.com/s/dmsans/v11/rP2Hp2ywxg089UriCZOIHQ.woff2",
    style: "'DM Sans', sans-serif",
  };

  buttonClickHandler() {
    if (this.showDropdown) this.showDropdown = false;
    else this.showDropdown = true;
  }

  async optionSelectHandler(selection: Font) {
    let detail = {
      value: selection,
    };
    const event = new CustomEvent("value-changed", {
      detail,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);

    const selectedFont = new FontFace(selection.name, `url(${selection.url})`);
    (document.fonts as any).add(selectedFont);
    await selectedFont.load();
    this.value = selection;
  }

  static styles = css`
    .fp-dropdown {
      position: absolute;
      top: 2.4rem;
      left: 0;
      display: none;
      flex-direction: column;
      justify-content: flex-start;
      background-color: #ffffff;
      padding: 0.5rem;
      border-radius: 4px;
      box-shadow: 3px 3px 10px #1b1b1b1b, -3px -3px 10px #1b1b1b1b;
      width: 8rem;
      z-index: 21;
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
      transform: rotate(180deg);
    }
    .fp-icon-selected {
      transform: rotate(0deg);
    }
  `;

  render() {
    return html`
      <span part="font-container">
        <style>
          :host {
            font-family: ${this.value.style};
          }
        </style>
        <div part="font-button" @click="${this.buttonClickHandler}">
          <div
            part="font-dropdown-container"
            class="fp-dropdown ${this.showDropdown ? "fp-dropdown-show" : ""}"
          >
            ${this.options
              .filter((option: Font) => {
                if (option.name != this.value.name) {
                  return option;
                }
              })
              .map(
                (option: Font) =>
                  html`<div
                    part="font-dropdown-option"
                    @click="${() => this.optionSelectHandler(option)}"
                    class="fp-option-unselected"
                    style="font-family: ${option.style}"
                  >
                    ${option.name}
                  </div>`
              )}
          </div>
          <p part="font-dropdown-selected" class="fp-button-fontname">
            ${this.value.name}
          </p>
          <svg
            class="fp-icon ${this.showDropdown ? "fp-icon-selected" : ""}"
            width="80"
            height="46"
            viewBox="0 0 80 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.10464 43.9567C4.89877 46.6811 9.41237 46.6811 12.2065 43.9567L40.0045 16.8527L67.8025 43.9567C70.5967 46.6811 75.1103 46.6811 77.9044 43.9567C80.6985 41.2323 80.6985 36.8314 77.9044 34.1071L45.0196 2.04328C42.2255 -0.681097 37.7119 -0.681097 34.9178 2.04328L2.033 34.1071C-0.689491 36.7616 -0.689489 41.2323 2.10464 43.9567Z"
              fill="black"
            />
          </svg>
        </div>
      </span>
    `;
  }
}
