export declare enum Operator {
    PLUS = "+",
    MINUS = "-",
    MUL = "*",
    DIV = "/",
    NONE = ""
}
export declare class Formula {
    constructor(name: string, formulaString: string, precision?: number);
    name: string;
    formulaString: string;
    precision: number;
    error: string | null;
}
