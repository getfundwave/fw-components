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

  @property()
  isLoading = false;

  @property()
  variables: Map<string, number> = new Map();

  @property()
  constants: Map<string, number> = new Map();

  static styles = css`
      .container {
        position: relative;
      }

      .loading {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100000;
      }

      .empty-state {
        padding: 1rem;
        text-align: center;
        color: var(--fe-suggestion-color, #bab6c0);
      }

      .group-label {
        padding: 0.5em 1rem;
        font-size: 0.8em;
        color: var(--fe-suggestion-group-color, #69676c);
        background-color: var(--fe-suggestion-group-background, #f5f5f5);
        font-weight: bold;
      }

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
      <div class="container" role="combobox" aria-expanded="true" aria-haspopup="listbox">
        ${this.isLoading ? html`
          <div class="loading" role="status" aria-label="Loading suggestions">
            <span class="loading-spinner"></span>
          </div>
        ` : ''}
        
        ${this.recommendations.length === 0 ? html`
          <div class="empty-state" role="status">
            No suggestions available
          </div>
        ` : html`
          <ul class="wysiwyg-suggestion-menu" role="listbox" aria-label="Suggestions">
            ${this.recommendations.some(r => this.variables.has(r)) ? html`
              <li class="group-label" role="presentation">Variables</li>
              ${this.recommendations.filter(r => this.variables.has(r)).map((recommendation) => html`
                <li
                  role="option"
                  aria-selected="${this.currentSelection === recommendation}"
                  class="${this.currentSelection === recommendation ? 'selected' : ''}"
                  tabindex="0"
                  @click=${() => this.onClickRecommendation(recommendation)}
                  @keydown=${(e: KeyboardEvent) => this.handleKeydown(e, recommendation)}
                >
                  ${recommendation}
                  <span class="value">${this.variables.get(recommendation)}</span>
                </li>
              `)}
            ` : ''}
            
            ${this.recommendations.some(r => this.constants.has(r)) ? html`
              <li class="group-label" role="presentation">Constants</li>
              ${this.recommendations.filter(r => this.constants.has(r)).map((recommendation) => html`
                <li
                  role="option"
                  aria-selected="${this.currentSelection === recommendation}"
                  class="${this.currentSelection === recommendation ? 'selected' : ''}"
                  tabindex="0"
                  @click=${() => this.onClickRecommendation(recommendation)}
                  @keydown=${(e: KeyboardEvent) => this.handleKeydown(e, recommendation)}
                >
                  ${recommendation}
                  <span class="value">${this.constants.get(recommendation)}</span>
                </li>
              `)}
            ` : ''}
          </ul>
        `}
      </div>
    `;
  }
}
