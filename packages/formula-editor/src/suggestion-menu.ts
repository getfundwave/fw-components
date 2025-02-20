import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SuggestionMenuStyles } from "./styles/suggestion-menu";

@customElement("suggestion-menu")
export class SuggestionMenu extends LitElement {

  @property()
  recommendations: string[] = [];

  @property()
  onClickRecommendation: Function = (recommendation: string) => {};

  @property()
  currentSelection = "";

  handleKeydown(event: KeyboardEvent, recommendation: string) {
    if (event.code == "Enter") {
      event.preventDefault();
      event.stopPropagation();
      this.onClickRecommendation(recommendation);
    }
  }

  render() {
    return html`
      <style>${SuggestionMenuStyles}</style>
      <ul class="wysiwyg-suggestion-menu">
        ${this.recommendations.map((recommendation) =>
            html`<li
              class="${this.currentSelection === recommendation ? "selected" : ""}"
              tabindex="0"
              @click=${(e: any) => this.onClickRecommendation(recommendation)}
              @keydown=${(e: any) => this.handleKeydown(e, recommendation)}
            >${recommendation}</li>`
          )}
      </ul>
    `;
  }
}
