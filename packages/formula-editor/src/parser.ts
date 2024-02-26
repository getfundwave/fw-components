import Big from "big.js";
import { Expectation, Queue, Stack } from "./helpers.js";
import { Recommender } from "./recommendor.js";

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

export class Parser {
  constructor(variables: Map<string, number>, minSuggestionLen: number) {
    this.variables = variables;

    this._recommender = new Recommender(this.variables, minSuggestionLen);
  }

  private _recommender: Recommender;

  variables: Map<string, number>;
  mathematicalOperators: Set<string> = new Set(["^", "+", "-", "*", "/"]);
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
  ): ParseResult {
    let tokens = formula.split(/([-+(),*^/:?\s])/g);

    // Stores the positions of opening parentheses. This allows us to
    // show "Unclosed parenthesis error" for positions which are far behind
    // our current token
    let parentheses = new Stack<number>();

    // The HTML formatted string which we eventually show on the view.
    let formattedString = ``;

    // The expectation that we have for the current token.
    let expectation = Expectation.VARIABLE;

    // Position of the current token in the formula string.
    let currentPosition = 0;

    // Previous 'token' (not a space or a new line) that we just encountered.
    let previousToken = "";

    // The object that we return as the output of the parsing result.
    let parseOutput: ParseResult = {
      recommendations: null,
      formattedContent: null,
      formattedString: null,
      newCursorPosition: prevCurPos ?? -1,
      errorString: null,
    };

    console.log(tokens);

    tokens.forEach((token) => {
      // It is a number is either it's in the defined variables, or
      // it's a valid number literal.
      let isNumber = this.variables.has(token) || !Number.isNaN(Number(token)),
        isOperator = this.mathematicalOperators.has(token),
        isSpace = token.trim() == "",
        isBracket = token == "(" || token == ")";

      // We don't really want anything for the spaces, other than simply
      // adding them back to the view.
      if (isSpace) {
        formattedString = `${formattedString}${token}`;
        currentPosition += token.length;
        return;
      }

      // If the cursor position is 'inside` the current token:
      //
      // 1. If we've got a recommendation to add, simply replace the
      //    word with the recommendation.
      // 2. Ask the recommendor to fetch recommendations for this specific
      //    token/word.

      if (
        currentPosition <= prevCurPos! &&
        currentPosition + token.length >= prevCurPos!
      ) {
        // If a recommendation was provided, replace the correspoding
        // word with it and move the cursor forward, accordingly.
        if (recommendation) {
          // Since we are sure that the recommendation will always correspond
          // to a variable.
          isNumber = true;

          // If the new cursor length somehow becomes larger than the
          // length of the formula string, setting the caret to that
          // length will move the caret to the start. Although this overflow
          // won't happen, but still, this check prevents that.
          parseOutput.newCursorPosition = Math.min(
            parseOutput.newCursorPosition +
              recommendation.length -
              token.length,
            formula.length + recommendation.length - token.length
          );
          token = recommendation;
          recommendation = null;
        }

        // Fetch recommendations nonetheless.
        parseOutput.recommendations =
          this._recommender.getRecommendation(token);
        console.log(parseOutput.recommendations);
      }

      let tokenClassName = "";

      // Don't check for errors if an error has already been encountered.
      if (expectation != Expectation.UNDEFINED) {
        // Unnecessary closing parenthesis
        if (parentheses.isEmpty() && token == ")") {
          parseOutput.errorString = `Unexpected ')' at pos: ${currentPosition}`;
          tokenClassName += " error";
          expectation = Expectation.UNDEFINED;
        }

        // Operator or ) after an operator. Eg: `23 / *` or `23 / )`
        // Unary `+` and `-` are not an error as they might represent
        // a positive or negative number respectively. But they will still
        // be an error if the formula ends with them.
        else if (
          expectation == Expectation.VARIABLE &&
          !isNumber &&
          token != "(" &&
          !(
            (token == "-" || token == "+") &&
            this.mathematicalOperators.has(previousToken)
          )
        ) {
          parseOutput.errorString = `Expected variable/number at pos: ${currentPosition}`;
          tokenClassName += " error";
          expectation = Expectation.UNDEFINED;
        }

        // Number/Variable after the same. Eg: `a a` or `420 420`.
        // Having a ) is fine. Eg: `23)` might be representing `(23 + 23)
        else if (
          expectation == Expectation.OPERATOR &&
          !isOperator &&
          token != ")"
        ) {
          parseOutput.errorString = `Expected mathematical operator at pos: ${currentPosition}`;
          tokenClassName += " error";
          expectation = Expectation.UNDEFINED;
        }

        // Unknown symbol/variable/word
        else if (!(isNumber || isOperator || isBracket)) {
          parseOutput.errorString = `Unknown word at pos: ${currentPosition}`;
          tokenClassName += " error";
          expectation = Expectation.UNDEFINED;
        }

        // The case of division by zero. Since we can't know if an expression evaluates
        // to zero or not, that case can only be handled during calculation.
        else if (
          isNumber &&
          previousToken == "/" &&
          (this.variables.get(token) == 0 || Number(token) == 0)
        ) {
          parseOutput.errorString = `Division by zero at pos: ${currentPosition}`;
          tokenClassName += " error";
          expectation = Expectation.UNDEFINED;
        }

        // Empty brackets. Default might be takn as 0, but that will only make sense
        // in addition and subtraction and not in other operators, so making this
        // case an error makes more sense.
        else if (previousToken == "(" && token == ")") {
          parseOutput.errorString = `Empty brackets at position ${currentPosition}`;
          tokenClassName += " error";
          expectation = Expectation.UNDEFINED;
        }
      }

      // Setting the expectation for the next token, if we have not encountered an
      // error already.
      if (expectation != Expectation.UNDEFINED) {
        if (token == "(" || isOperator) {
          expectation = Expectation.VARIABLE;
        } else if (token == ")" || isNumber) {
          expectation = Expectation.OPERATOR;
        }
      }

      if (token == "(") {
        parentheses.push(currentPosition);
        tokenClassName += " bracket";
      } else if (token == ")") {
        parentheses.pop();
        tokenClassName += " bracket";
      } else if (isOperator) {
        tokenClassName += " operator";
      } else if (expectation == Expectation.UNDEFINED) {
        tokenClassName += " error";
      }

      // Since not using ShadowDOM, having these specific class names will prevent
      // name collision.
      formattedString = `${formattedString}<span class="wysiwygInternals ${tokenClassName}">${token}</span>`;

      currentPosition += token.length;
      previousToken = token;
    });

    // If the formula ends with a mathematical operator, or has unclosed `(`
    if (this.mathematicalOperators.has(previousToken)) {
      parseOutput.errorString = "Unexpected ending of formula.";
    } else if (!parentheses.isEmpty()) {
      parseOutput.errorString = `Unclosed '(' at position: ${parentheses.top()}`;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(formattedString, "text/html");

    parseOutput.formattedContent = doc.querySelector("body")!;
    parseOutput.formattedString = formattedString;

    return parseOutput;
  }

  buildRPN(formula: string): Queue<string> | null {
    if (this.parseInput(formula).errorString) {
      return null;
    }

    const tokens = formula
      .split(/([-+(),*^/:?\s])/g)
      .filter((el: string) => !/\s+/.test(el) && el !== "");

    // Handling the special case of unary `-` and `+`.

    let previousToken = "";
    let carriedToken: string | null = null;
    const parsedTokens: string[] = [];

    for (const token of tokens) {
      if (
        (token == "+" || token == "-") &&
        this.mathematicalOperators.has(previousToken)
      ) {
        carriedToken = token;
      } else if (carriedToken) {
        parsedTokens.push(carriedToken + token);
        carriedToken = null;
      } else {
        parsedTokens.push(token);
      }

      previousToken = token;
    }

    /**
     * Shunting Yard Algorithm (EW Dijkstra)
     */

    const operatorStack = new Stack<string>();
    const outputQueue = new Queue<string>();

    for (const token of parsedTokens) {
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

    return outputQueue;
  }

  addParentheses(formula: string): string | null {
    const rpn = this.buildRPN(formula);

    if (!rpn) {
      return null;
    }

    const lexedRPN: string[] = [];

    while (!rpn.isEmpty()) {
      lexedRPN.push(rpn.dequeue()!);
    }

    // Stores the operators that we encounter in the RPN
    let operatorStack = new Stack<string | null>();

    // Stores the `results`, which are essentially individual groups
    // of tokens showing a meaningful value.
    let resultStack = new Stack<string>();

    lexedRPN.forEach((symbol) => {
      let parsedLeftExpression: string, parsedRightExpression: string;

      // If we encounter a number or a variable in the RPN, it is itself
      // a calculated entity (say a result in itself), needs no modification
      // and can be directly put into the result stack.

      if (
        this.variables.has(symbol) ||
        (!isNaN(parseFloat(symbol)) && isFinite(parseFloat(symbol)))
      ) {
        resultStack.push(symbol);
        operatorStack.push(null);
      }

      // If it is not a number/variable then it is an operator. We will
      // take out previous operators from the `operatorStack`, compare
      // them with the current one, adds brackets accordingly to the `results`
      // around it, and then finally add it to the `operatorStack` for
      // future reference.
      else if (Object.keys(this.operatorPrecedence).includes(symbol)) {
        let [rightExpression, leftExpression, operatorA, operatorB] = [
          resultStack.pop()!,
          resultStack.pop()!,
          operatorStack.pop()!,
          operatorStack.pop()!,
        ];

        // The conditions that govern when to show a parenthesis.

        if (
          this.operatorPrecedence[operatorB] <=
            this.operatorPrecedence[symbol] ||
          (this.operatorPrecedence[operatorB] ===
            this.operatorPrecedence[symbol] &&
            ["/", "-"].includes(symbol))
        ) {
          parsedLeftExpression = `(${leftExpression})`;
        } else {
          parsedLeftExpression = leftExpression;
        }

        if (
          this.operatorPrecedence[operatorA] <=
            this.operatorPrecedence[symbol] ||
          (this.operatorPrecedence[operatorA] ===
            this.operatorPrecedence[symbol] &&
            ["/", "-"].includes(symbol))
        ) {
          parsedRightExpression = `(${rightExpression})`;
        } else {
          parsedRightExpression = rightExpression;
        }

        // The bracket included expression is now itself a `result`

        resultStack.push(
          `${parsedLeftExpression} ${symbol} ${parsedRightExpression}`
        );

        operatorStack.push(symbol);
      } else throw `${symbol} is not a recognized symbol`;
    });

    if (!resultStack.isEmpty()) {
      return resultStack.pop()!;
    } else throw `${lexedRPN} is not a correct RPN`;
  }

  calculate(formula: string): CalculateResult {
    let rpn = this.buildRPN(formula);
    let calculationResult: CalculateResult = {
      result: undefined,
      errorString: null,
    };

    if (!rpn) {
      return calculationResult;
    }

    let calcStack = new Stack<Big>();

    while (!rpn.isEmpty()) {
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
              if (Big(numB).toNumber() == 0) {
                calculationResult.errorString = "Division by zero encountered";
                return calculationResult;
              }

              calcStack.push(Big(numA).div(Big(numB)));
              break;

            // Big.js doesn't support exponentiating a Big to a Big, which
            // is obvious due to performance overheads. Use this case with care.

            case "^":
              calcStack.push(Big(numA).pow(Big(numB).toNumber()));
          }
        } catch (error: any) {
          calculationResult.errorString = error;
          return calculationResult;
        }
      }
    }

    calculationResult.result = calcStack.top()?.toNumber();
    return calculationResult;
  }
}
