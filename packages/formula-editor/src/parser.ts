import Big from "big.js";
import { Expectation, Queue, Stack } from "./helpers.js";
import { Recommender } from "./recommendor.js";

export interface ParseOutput {
  recommendations: string[] | null;
  formattedContent: HTMLBodyElement | null;
  formattedString: string | null;
  newCursorPosition: number;
  errorStr: string | null;
}

export class Parser {
  constructor(variables: Map<string, number>, minSuggestionLen: number) {
    this.variables = variables;

    this._recommender = new Recommender(this.variables, minSuggestionLen);
  }

  private _recommender: Recommender;

  variables: Map<string, number>;
  mathematicalOperators: Set<string> = new Set(["+", "-", "*", "/"]);
  operatorPrecedence: { [key: string]: number } = {
    "^": 3,
    "/": 2,
    "*": 2,
    "+": 1,
    "-": 1,
  };

  parseInput(
    formula: string,
    prevCurPos: number | null = null,
    recommendation: string | null = null
  ): ParseOutput {
    let tokens = formula.split(/([-+(),*/:?\s])/g),
      parentheses = new Stack<number>(),
      formattedString = ``,
      expectation = Expectation.VARIABLE,
      bracketCount = 0,
      currentPosition = 0,
      prevToken = "",
      parseOutput: ParseOutput = {
        recommendations: null,
        formattedContent: null,
        formattedString: null,
        newCursorPosition: prevCurPos ?? -1,
        errorStr: null,
      };

    console.log(tokens);

    tokens.forEach((token) => {
      let isNumber =
          this.variables.has(token) ||
          (recommendation && this.variables.has(recommendation)) ||
          !Number.isNaN(Number.parseFloat(token)),
        isOperator = this.mathematicalOperators.has(token),
        isSpace = token.trim() == "",
        isBracket = token == "(" || token == ")";

      if (isSpace) {
        formattedString = `${formattedString}${token}`;
        currentPosition += token.length;
        return;
      }

      if (
        currentPosition <= prevCurPos! &&
        currentPosition + token.length + 1 >= prevCurPos! &&
        !parseOutput.recommendations
      ) {
        // If a recommendation was provided, replace the correspoding
        // word with it and move the cursor forward, accordingly.
        if (recommendation) {
          parseOutput.newCursorPosition = Math.min(
            parseOutput.newCursorPosition +
              recommendation.length -
              token.length +
              1,
            formula.length + recommendation.length - token.length + 1
          );
          token = recommendation + " ";
          recommendation = null;
        }

        parseOutput.recommendations =
          this._recommender.getRecommendation(token);
        console.log(parseOutput.recommendations);
      } else {
        // parseOutput.recommendations = null;
      }

      let tokenClassName = "";

      if (token == "(") {
        bracketCount++;
        parentheses.push(currentPosition);
        tokenClassName += " bracket";
      } else if (token == ")") {
        parentheses.pop();
        bracketCount--;
        tokenClassName += " bracket";
      } else if (isOperator) {
        tokenClassName += " operator";
      } else {
      }

      if (
        expectation == Expectation.UNDEF ||
        (expectation == Expectation.VARIABLE && !isNumber && !isBracket) ||
        (expectation == Expectation.OPERATOR && !isOperator) ||
        !(isNumber || isOperator || isBracket) ||
        (isNumber &&
          prevToken == "/" &&
          (this.variables.get(token) == 0 || Number.parseFloat(token) == 0))
      ) {
        tokenClassName += " error";
      }

      if (!parseOutput.errorStr) {
        if (bracketCount < 0) {
          parseOutput.errorStr = `Unexpected ')' at pos: ${currentPosition}`;
          expectation = Expectation.UNDEF;
        } else if (
          expectation == Expectation.VARIABLE &&
          !isNumber &&
          !isBracket
        ) {
          parseOutput.errorStr = `Expected variable/number at pos: ${currentPosition}`;
          expectation = Expectation.UNDEF;
        } else if (
          expectation == Expectation.OPERATOR &&
          !isOperator &&
          token != ")"
        ) {
          parseOutput.errorStr = `Expected mathematical operator at pos: ${currentPosition}`;
          expectation = Expectation.UNDEF;
        } else if (!(isNumber || isOperator || isBracket)) {
          parseOutput.errorStr = `Unknown word at pos: ${currentPosition}`;
          expectation = Expectation.UNDEF;
        } else if (
          isNumber &&
          prevToken == "/" &&
          (this.variables.get(token) == 0 || Number.parseFloat(token) == 0)
        ) {
          parseOutput.errorStr = `Division by zero at pos: ${currentPosition}`;
          expectation = Expectation.UNDEF;
        }
      }

      if (expectation != Expectation.UNDEF) {
        if (token == "(" || isOperator) {
          console.log("operator encountered ", token, expectation);
          expectation = Expectation.VARIABLE;
        } else if (token == ")" || isNumber) {
          expectation = Expectation.OPERATOR;
        }
      }

      formattedString = `${formattedString}<span class="wysiwygInternals ${tokenClassName}">${token}</span>`;

      // if (isNumber) {
      //   expectation = Expectation.OPERATOR;
      // } else if (isOperator) {
      //   expectation = Expectation.VARIABLE;
      // } else if (isSpace) {
      // } else {
      //   expectation = Expectation.UNDEF;
      // }

      currentPosition += token.length;
      prevToken = token;
      console.log(token, expectation);
    });

    const parser = new DOMParser();
    const doc = parser.parseFromString(formattedString, "text/html");

    parseOutput.formattedContent = doc.querySelector("body")!;
    parseOutput.formattedString = formattedString;

    if (!parentheses.empty()) {
      parseOutput.errorStr = `Unclosed '(' at position: ${parentheses.top()}`;
    }

    return parseOutput;
  }

  buildRPN(formula: string): Queue<string> | null {
    if (this.parseInput(formula).errorStr) {
      return null;
    }

    let tokens = formula
      .split(/([-+(),*/:?\s])/g)
      .filter((el: string) => !/\s+/.test(el) && el !== "");
    // this.calculatedResult = this._parser.calculate(this.content)!;

    // Implementing the Shunting Yard Algorithm (EW Dijkstra)

    const operatorStack = new Stack<string>();
    const outputQueue = new Queue<string>();

    for (let token of tokens) {
      if (token == "(") {
        operatorStack.push("(");
      } else if (token == ")") {
        while (operatorStack.top() != "(") {
          outputQueue.enqueue(operatorStack.pop()!);
        }

        operatorStack.pop();
      } else if (this.mathematicalOperators.has(token)) {
        while (
          this.mathematicalOperators.has(operatorStack.top()!) &&
          this.operatorPrecedence[token] <=
            this.operatorPrecedence[operatorStack.top()!]
        ) {
          outputQueue.enqueue(operatorStack.pop()!);
        }

        operatorStack.push(token);
      } else if (!Number.isNaN(token) && token != "") {
        outputQueue.enqueue(token);
      }
    }

    while (operatorStack.top()) {
      outputQueue.enqueue(operatorStack.pop()!);
    }

    (() => {
      // outputQueue?.print();
    })();

    return outputQueue;
  }

  addParens(formula: string): string | null {
    const rpn = this.buildRPN(formula);

    if (!rpn) {
      return null;
    }

    let stringRPN = "";

    while (!rpn.empty()) {
      stringRPN += rpn.dequeue() + " ";
    }

    let lexedRPN = stringRPN
      // .replace(/\^/g, "**")
      .split(/\s+/g)
      .filter((el: string) => !/\s+/.test(el) && el !== "");

    let operatorStack = new Stack<string | null>();
    let resultStack = new Stack<string>();

    lexedRPN.forEach((symbol) => {
      let stra, strb;

      if (
        this.variables.has(symbol) ||
        (!isNaN(parseFloat(symbol)) && isFinite(parseFloat(symbol)))
      ) {
        resultStack.push(symbol);
        operatorStack.push(null);
      } else if (Object.keys(this.operatorPrecedence).includes(symbol)) {
        let [a, b, opa, opb] = [
          resultStack.pop(),
          resultStack.pop(),
          operatorStack.pop()!,
          operatorStack.pop()!,
        ];

        if (
          this.operatorPrecedence[opb] <= this.operatorPrecedence[symbol] ||
          (this.operatorPrecedence[opb] === this.operatorPrecedence[symbol] &&
            ["/", "-"].includes(symbol))
        ) {
          strb = `(${b})`;
        } else {
          strb = `${b}`;
        }

        if (
          this.operatorPrecedence[opa] <= this.operatorPrecedence[symbol] ||
          (this.operatorPrecedence[opa] === this.operatorPrecedence[symbol] &&
            ["/", "-"].includes(symbol))
        ) {
          stra = `(${a})`;
        } else {
          stra = `${a}`;
        }

        resultStack.push(`${strb} ${symbol} ${stra}`);
        operatorStack.push(symbol);
      } else throw `${symbol} is not a recognized symbol`;
    });

    if (!resultStack.empty()) {
      return resultStack.pop()!;
    } else throw `${stringRPN} is not a correct RPN`;
  }

  calculate(formula: string): number | undefined {
    let rpn = this.buildRPN(formula);

    if (!rpn) {
      return undefined;
    }

    let calcStack = new Stack<Big>();

    while (!rpn.empty()) {
      const frontItem = rpn.dequeue()!;

      if (!this.mathematicalOperators.has(frontItem)) {
        calcStack.push(
          Big(
            Number.parseFloat(
              this.variables.get(frontItem)?.toString() ?? frontItem
            )
          )
        );
      } else {
        let operator = frontItem;
        let numB = calcStack.pop()!;
        let numA = calcStack.pop()!;

        try {
          switch (operator) {
            case "+":
              calcStack.push(Big(numA).add(Big(numB)));
              break;
            case "-":
              calcStack.push(Big(numA).sub(Big(numB)));
              break;
            case "*":
              calcStack.push(Big(numA).mul(Big(numB)));
              break;
            case "/":
              calcStack.push(Big(numA).div(Big(numB)));
          }
        } catch (err) {
          return undefined;
        }
      }
    }

    return calcStack.top()?.toNumber();
  }
}
