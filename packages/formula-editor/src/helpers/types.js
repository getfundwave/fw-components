export var Operator;
(function (Operator) {
    Operator["PLUS"] = "+";
    Operator["MINUS"] = "-";
    Operator["MUL"] = "*";
    Operator["DIV"] = "/";
    Operator["NONE"] = "";
})(Operator || (Operator = {}));
export class Formula {
    constructor(name, formulaString, precision = -1) {
        this.error = null;
        this.name = name;
        this.formulaString = formulaString;
        this.precision = precision;
    }
}
//# sourceMappingURL=types.js.map