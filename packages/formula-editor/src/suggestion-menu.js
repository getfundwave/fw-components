var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
let SuggestionMenu = class SuggestionMenu extends LitElement {
    constructor() {
        super(...arguments);
        this.recommendations = [];
        this.onClickRecommendation = (recommendation) => { };
    }
    handleKeydown(event, recommendation) {
        if (event.code == "Enter") {
            event.preventDefault();
            event.stopPropagation();
            this.onClickRecommendation(recommendation);
        }
    }
    render() {
        return html `
      <ul class="wysiwyg-suggestion-menu">
        ${this.recommendations.map((recommendation) => {
            return html `<li
            tabindex="0"
            @click=${(e) => this.onClickRecommendation(recommendation)}
            @keydown=${(e) => this.handleKeydown(e, recommendation)}
          >
            ${recommendation}
          </li>`;
        })}
      </ul>
    `;
    }
};
SuggestionMenu.styles = css `
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

    li:focus-visible {
      /* outline: 1px solid red; */
      outline: 0px;
      color: var(--fe-suggestion-focus-color, #fce566);
      background-color: var(--fe-suggestion-focus-background-color, #69676c);
    }
  `;
__decorate([
    property()
], SuggestionMenu.prototype, "recommendations", void 0);
__decorate([
    property()
], SuggestionMenu.prototype, "onClickRecommendation", void 0);
SuggestionMenu = __decorate([
    customElement("suggestion-menu")
], SuggestionMenu);
export { SuggestionMenu };
//# sourceMappingURL=suggestion-menu.js.map