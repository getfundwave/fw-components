import { LitElement } from "lit";
export declare class SuggestionMenu extends LitElement {
    recommendations: string[];
    onClickRecommendation: Function;
    static styles: import("lit").CSSResult;
    handleKeydown(event: KeyboardEvent, recommendation: string): void;
    render(): import("lit-html").TemplateResult<1>;
}
