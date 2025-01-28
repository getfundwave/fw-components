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
        position: relative;
        border: 1px solid var(--fe-suggestion-color, white);
        color: var(--fe-suggestion-color, #bab6c0);
        background-color: var(--fe-suggestion-background-color, white);
        box-sizing: border-box;
        width: var(--fe-suggestion-width, 20vw);
        max-height: 25vh;
        overflow-x: auto;
        overflow-y: auto;
        list-style-type: none;
        padding: 0;
        margin: 0;
        box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.13);
        border-radius: 5px;
        z-index: 99999
      }

      li {
        margin: 0;
        padding: 0.5em 1rem;
        cursor: pointer;
        font-family: var(--theme-font);
        font-size: var(--secondary-font-size, 16px);
        color: var(--secondary-color, #bab6c0);
      }

      li:hover,
      li:focus-visible {
        font-weight: bold;
        color: var(--fe-suggestion-focus-color, #69676c);
      }

      li.selected {
        color: var(--fe-suggestion-focus-color, #69676c);
        font-weight: bold;
      }

      li[focused] {
        font-weight: bold;
      }

      /* Scrollbar styling */
      ::-webkit-scrollbar {
        width: 10px;
      }

      ::-webkit-scrollbar-track {
        background: transparent;
      }

      ::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 5px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #aaa;
      }

      /* Optional shadow for the dropdown */
      .content {
        box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.13);
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
