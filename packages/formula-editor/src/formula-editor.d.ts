import { LitElement, PropertyValueMap } from "lit";
import "./suggestion-menu.js";
export declare class FormulaEditor extends LitElement {
    private _parser;
    constructor();
    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    /**
     * These `states` and `properties` can't be defined as `static get properties`,
     * because TS doesn't support that.
     * @see https://github.com/lit/lit-element/issues/414
     */
    _formattedContent: Element | null;
    _recommendations: string[] | null;
    _calculatedResult: number | undefined;
    /**
     * If `parseInput` is called to add a recommendation, say by clicking,
     * browser removes focus from the input box. In that case, we have no way
     * of knowing where the cursor previously was, other than storing it somewhere.
     */
    currentCursorPosition: number | null;
    currentCursorRect: DOMRect | undefined;
    lastInputType: string;
    content: string;
    variables: Map<any, any>;
    minSuggestionLen: number;
    errorString: string | null;
    editor: any;
    handleChange(event: InputEvent): void;
    handleTab(event: KeyboardEvent): void;
    onClickRecommendation(recommendation: string): void;
    /**
     *
     * @param recommendation The recommendation which needs to be inserted
     * at the current cursor position
     * @param manageCursor Whether or not cursor management is needed. Not
     * needed when manual insertion of text is required (eg: during initialization)
     * @returns void
     */
    parseInput(recommendation?: string | null, manageCursor?: boolean): void;
    requestCalculate(): void;
    requestFormat(): void;
    render(): import("lit-html").TemplateResult<1>;
}
