export enum Operator {
  PLUS = "+",
  MINUS = "-",
  MUL = "*",
  DIV = "/",
  NONE = "",
}

export class Formula {
  constructor(name: string, formulaString: string, precision: number = -1) {
    this.name = name;
    this.formulaString = formulaString;
    this.precision = precision;
  }

  name: string;
  formulaString: string;
  precision: number;
  error: string | null = null;
}
