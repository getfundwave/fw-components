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

  parseInput(formula: string, prevCurPos: number | null = null, recommendation: string | null = null): ParseResult {
    let tokens = formula.match(/'[^']*'|\d+|[A-Za-z_][A-Za-z0-9_]*|[-+(),*^/:?\s]/g);

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

    let currentTokens = "";

    // The object that we return as the output of the parsing result.
    let parseOutput: ParseResult = {
      recommendations: null,
      formattedContent: null,
      formattedString: null,
      newCursorPosition: prevCurPos ?? -1,
      errorString: null,
    };


    if(!formula.trim()){
      if(recommendation){
        formattedString = `${recommendation}`;
        currentPosition += recommendation.length;

        const parser = new DOMParser();
        const doc = parser.parseFromString(formattedString, "text/html");

        parseOutput.formattedContent = doc.querySelector("body")!;
        parseOutput.formattedString = formattedString;
        parseOutput.newCursorPosition = recommendation.length;
        return parseOutput;
      }
    }

    
    tokens?.forEach((token) => {
      // It is a number is either it's in the defined variables, or
      // it's a valid number literal.
      
      let isNumber = token.trim() !== "" && (this.variables.has(token) || !Number.isNaN(Number(token)));
      let isOperator = this.mathematicalOperators.has(token);
      let isSpace = token.trim() == "";
      let isBracket = token == "(" || token == ")";

      if(isSpace) {
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

      if (currentPosition <= prevCurPos! && currentPosition + token.length >= prevCurPos!)  {
        if (recommendation) {
          // Since we are sure that the recommendation will always correspond
          // to a variable.
          isNumber = true;

          if (this.mathematicalOperators.has(token)) {
            // append recommendation at the end if token is an operator
            const updatedTokenString = `${token} ${recommendation}`;
            formattedString += updatedTokenString;
            currentPosition += updatedTokenString.length;
            parseOutput.newCursorPosition = currentPosition;

            recommendation = null;
            return;            
          };

          // If the new cursor length somehow becomes larger than the
          // length of the formula string, setting the caret to that
          // length will move the caret to the start. Although this overflow
          // won't happen, but still, this check prevents that.
          const updatedTokenLength = recommendation.length - token.length;
          parseOutput.newCursorPosition = Math.min(parseOutput.newCursorPosition, formula.length) + updatedTokenLength;

          token = recommendation;
          recommendation = null;
        }

        parseOutput.recommendations = this._recommender.getRecommendation(token);
      }

      let tokenClassName = "";

      // Don't check for errors if an error has already been encountered.
      if (expectation != Expectation.UNDEFINED) {

        if(this.mathematicalOperators.has(previousToken) && isOperator) {
          parseOutput.errorString = `Multiple operators at position ${currentPosition}`;
          expectation = Expectation.UNDEFINED;
        }

        // Unnecessary closing parenthesis
        else if (parentheses.isEmpty() && token == ")") {
          parseOutput.errorString = `Unexpected ')' at position ${currentPosition}`;
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
          !isSpace && 
          token != "(" &&
          !(
            (token == "-" || token == "+") &&
            (!currentTokens.trim() || previousToken === "(" || this.mathematicalOperators.has(previousToken))
          )
        ) {
          parseOutput.errorString = `Expected variable/number at position ${currentPosition}`;
          tokenClassName += " error";
          expectation = Expectation.UNDEFINED;
        }

        // Number/Variable after the same. Eg: `a a` or `420 420`.
        // Having a ) is fine. Eg: `23)` might be representing `(23 + 23)
        else if (
          expectation == Expectation.OPERATOR &&
          !isOperator &&
          !isSpace &&
          token != ")"
        ) {
          parseOutput.errorString = `Expected mathematical operator at position ${currentPosition}`;
          tokenClassName += " error";
          expectation = Expectation.UNDEFINED;
        }

        // Unknown symbol/variable/word
        else if (!(isNumber || isOperator || isBracket || isSpace)) {
          parseOutput.errorString = `Unknown word at position ${currentPosition}`;
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
          parseOutput.errorString = `Division by zero at position ${currentPosition}`;
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

      if (token == "(") parentheses.push(currentPosition);
      else if (token == ")") parentheses.pop();
      
      formattedString = `${formattedString}${token}`;
      previousToken = token;
      currentPosition += token.length;
      currentTokens += token;
    });

    if(recommendation){
      parseOutput.newCursorPosition = Math.min(
        parseOutput.newCursorPosition +
          recommendation.length,
        formula.length + recommendation.length
      );

      formattedString = `${formattedString}${recommendation}`;
    }

    // formula ends with a mathematical operator
    if (this.mathematicalOperators.has(previousToken) || !previousToken.trim().length) {
      parseOutput.recommendations = !parseOutput.errorString?.length ? Array.from(this.variables.keys()) : [];
    } 
    
    // formula has unclosed `(`
    if (!parentheses.isEmpty()) {
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
      .match(/'[^']*'|\d+|[A-Za-z_][A-Za-z0-9_]*|[-+(),*^/:?\s]/g)
      ?.filter((el: string) => !/\s+/.test(el) && el !== "");

    // Handling the special case of unary `-` and `+`.

    let previousToken = "";
    let carriedToken: string | null = null;
    const parsedTokens: string[] = [];
    let currentTokens = "";

    for (const token of tokens) {
      if (
        (token == "+" || token == "-") &&
        (!currentTokens.trim() || currentTokens.trim() === "(" || this.mathematicalOperators.has(previousToken))
      ) {
        carriedToken = token;
      } else if (carriedToken) {
        parsedTokens.push(carriedToken + token);
        carriedToken = null;
      } else {
        parsedTokens.push(token);
      }

      previousToken = token;
      currentTokens+= token;
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
        ((symbol === "+" || symbol[0] === "-") && this.variables.has(symbol.substring(1))) || 
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
        const [sign, variableKey] = /^[+-]/.test(frontItem) ? [frontItem[0], frontItem.slice(1)] : ["", frontItem];
        const operandValue = Number.parseFloat(this.variables.get(variableKey)?.toString() ?? variableKey);

        const number = Number.parseFloat(sign + "1") * operandValue;
        calcStack.push(Big(number));
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
              if (parseFloat(Big(numB).toString()) == 0) {
                calculationResult.errorString = "Division by zero encountered";
                return calculationResult;
              }

              calcStack.push(Big(numA).div(Big(numB)));
              break;

            // Big.js doesn't support exponentiating a Big to a Big, which
            // is obvious due to performance overheads. Use this case with care.

            case "^":
              calcStack.push(Big(numA).pow(parseFloat(Big(numB).toString())));
          }
        } catch (error: any) {
          calculationResult.errorString = error;
          return calculationResult;
        }
      }
    }

    calculationResult.result = parseFloat(calcStack.top().toString());
    return calculationResult;
  }
}
