import { Queue } from "./helpers.js";
export interface ParseResult {
    recommendations: string[] | null;
    formattedContent: HTMLBodyElement | null;
    formattedString: string | null;
    newCursorPosition: number;
    errorString: string | null;
}
export interface CalculateResult {
    result: number | undefined;
    errorString: string | null;
}
export declare class Parser {
    constructor(variables: Map<string, number>, minSuggestionLen: number);
    private _recommender;
    variables: Map<string, number>;
    mathematicalOperators: Set<string>;
    operatorPrecedence: {
        [key: string]: number;
    };
    parseInput(formula: string, prevCurPos?: number | null, recommendation?: string | null): ParseResult;
    buildRPN(formula: string): Queue<string> | null;
    addParentheses(formula: string): string | null;
    calculate(formula: string): CalculateResult;
}
