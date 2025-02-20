import { html, LitElement, PropertyValues } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import { SuggestionMenuStyles } from "./styles/suggestion-menu";

@customElement("suggestion-menu")
export class SuggestionMenu extends LitElement {
  @property()
  recommendations: string[] = [];

  @property()
  onClickRecommendation: Function = (recommendation: string) => {};

  @state()
  _selectedRecommendationIndex: number = 0;

  /**
   * abort controller for keydown event listener
   */
  @state()
  abortController: AbortController;

  @query(".wysiwyg-suggestion-menu") 
  suggestionList: HTMLUListElement

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.abortController = new AbortController();

    const handleKeydown = this.handleKeydown.bind(this);
    document.addEventListener("keydown", handleKeydown, { signal: this.abortController?.signal });
  }

  scrollToSelectedRecommendation(index: number) {
    const listItem = this.suggestionList?.querySelectorAll("li")[index];
    if(!listItem) return;

    listItem.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth"
    });
  }

  navigate(direction: string) {
    if (!this.recommendations) return;
    
    let newIndex = this._selectedRecommendationIndex;

    if (direction === "down") newIndex = (this._selectedRecommendationIndex + 1) % this.recommendations.length;
    else if (direction === "up") newIndex = (this._selectedRecommendationIndex - 1 + this.recommendations.length) % this.recommendations.length;
    
    this._selectedRecommendationIndex = newIndex;
    this.scrollToSelectedRecommendation(newIndex);
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.code === "Tab") {
      event.preventDefault();
      if (this.recommendations?.length === 1) {
        this._handleRecommendationSelect();
      } else {
        const direction = event.shiftKey ? "up" : "down";
        this.navigate(direction);
      }
    } else if (event.code === "ArrowDown" || event.code === "ArrowUp") {
      event.preventDefault();
      const direction = event.code === "ArrowDown" ? "down" : "up";
      this.navigate(direction);
    } else if (event.code === "Enter") {
      event.preventDefault();
      this._handleRecommendationSelect();
    }
  }

  _handleRecommendationSelect(index: number = this._selectedRecommendationIndex) {
    const recommendation = this.recommendations[index];
    if(!recommendation) return;

    this.onClickRecommendation(recommendation);
    this._selectedRecommendationIndex = -1;
  }

  disconnectedCallback(): void {
    this.abortController?.abort();
  }

  render() {
    return html`
      <style>${SuggestionMenuStyles}</style>
      <ul class="wysiwyg-suggestion-menu" @mousedown=${(e: MouseEvent) => e.preventDefault()}>
        ${this.recommendations.map((recommendation, index) =>
            html`<li
              class="${this._selectedRecommendationIndex === index ? "selected" : ""}"
              @click=${(e: MouseEvent) => this._handleRecommendationSelect(index)}
            >${recommendation}</li>`
        )}
      </ul>
    `;
  }
}
