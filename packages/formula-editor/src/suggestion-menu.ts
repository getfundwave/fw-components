import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("suggestion-menu")
export class SuggestionMenu extends LitElement {

  @property()
  recommendations: string[] = [];

  @property()
  onClickRecommendation: Function = (recommendation: string) => {};

  @property()
  currentSelection = "";

  static styles = css`
    ul {
      border: 1px solid var(--fe-suggestion-color, white);
      color: var(--fe-suggestion-color, #bab6c0);
      background-color: var(--fe-suggestion-background-color, #363537);
      box-sizing: border-box;
      width: fit-content;
      list-style-type: none;
      padding: 4px 0px;
      margin: 2px;
    }

    li {
      margin: 0px;
      padding: 2px 6px;
      cursor: pointer;
    }

    li.selected {
      background-color: var(--fe-suggestion-selected-background-color, darkgrey);
      color: var(--fe-suggestion-selected-color, yellow);
    }

    li:focus-visible {
      /* outline: 1px solid red; */
      outline: 0px;
      color: var(--fe-suggestion-focus-color, #fce566);
      background-color: var(--fe-suggestion-focus-background-color, #69676c);
    }
  `;

  handleKeydown(event: KeyboardEvent, recommendation: string) {
    if (event.code == "Enter") {
      event.preventDefault();
      event.stopPropagation();
      this.onClickRecommendation(recommendation);
    }
  }

  render() {
    return html`
      <ul class="wysiwyg-suggestion-menu">
        ${this.recommendations.map((recommendation) => {
          return html`<li
            class="${this.currentSelection === recommendation ? 'selected' : ''}"
            tabindex="0"
            @click=${(e: any) => this.onClickRecommendation(recommendation)}
            @keydown=${(e: any) => this.handleKeydown(e, recommendation)}
          >
            ${recommendation}
          </li>`;
        })}
      </ul>
    `;
  }
}
