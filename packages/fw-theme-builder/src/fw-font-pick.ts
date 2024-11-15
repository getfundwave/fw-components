import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from 'lit/directives/repeat.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';

import { DropdownStyles, PlainInputStyles } from '@fw-components/styles/input-styles';

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

  async optionSelectHandler(e: CustomEvent) {
    const selection = e.detail.item.obj;
    if(selection.name === this.value.name) return;

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
      ${DropdownStyles} ${PlainInputStyles}
      <span part="font-container">
        <style>
          :host {
            font-family: ${this.value.style};
          }
        </style>
        <div part="font-button">
          <paper-dropdown-menu .dynamicAlign=${true} class="plain" no-label-float @iron-select=${(e : CustomEvent) => this.optionSelectHandler(e)} style="width:100%" >
              <paper-listbox  style="color:#000" slot="dropdown-content" .selected=${this.value.name || ''} attr-for-selected="name">
              ${this.options && repeat(this.options, (item) => html`<paper-item style='font-family: ${item.style}' .name=${item.name} .obj=${item}>${item.name}</paper-item>`)}
              </paper-listbox>
          </paper-dropdown-menu>
        </div>
      </span>
    `;
  }
}
