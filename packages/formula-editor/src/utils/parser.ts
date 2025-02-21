import Big from "big.js";
import { Recommender } from "./recommendor.js";
import { Stack } from "./stack.js";
import { Queue } from "./queue.js";
import { CalculateResult, Expectation, ParseResult } from "../types";
import { mathematicalOperators, operatorPrecedence, unaryOperators } from "./constants.js";

export class Parser {
  private _recommender: Recommender;
  variables: Map<string, number>;

  constructor(variables: Map<string, number>, minSuggestionLen: number) {
    this.variables = variables;
    this._recommender = new Recommender(Array.from(this.variables.keys()), minSuggestionLen);
  }

  getFormulaTokens(formulaString: string): string[] {
    if(!formulaString?.length) return [];

    return formulaString.match(/'[^']*'|\d+|[A-Za-z_][A-Za-z0-9_]*|[-+(),*^/:?\s]/g);
  }

  parseInput(formula: string, prevCurPos: number | null = null, recommendation: string | null = null): ParseResult {
    const tokens = this.getFormulaTokens(formula);
    const parentheses = new Stack<number>();
    let expectation = Expectation.VARIABLE;
    let currentPosition = 0;
    let previousToken = "";
    let parsedString = "";

    const parseOutput: ParseResult = {
      recommendations: [],
      formattedString: "",
      newCursorPosition: prevCurPos ?? -1,
      errorString: null,
    };


    if (!formula.trim() && recommendation){
      parseOutput.formattedString = recommendation;
      parseOutput.newCursorPosition = recommendation.length;

      return parseOutput;
    }

    
    tokens?.forEach((token) => {
      let isNumber = token.trim() !== "" && (this.variables.has(token) || !Number.isNaN(Number(token)));
      const isOperator = mathematicalOperators.has(token);
      const isSpace = token.trim() === "";
      const isBracket = token === "(" || token === ")";

      if (isSpace) {
        parseOutput.formattedString += token;
        currentPosition += token.length;
        
        return;
      }

      /**
       * Check if the cursor is in between the formula string
       * 
       * - If we've got a recommendation to add, replace the word with the recommendation
       * - Update recommendations based on the token/word
       */
      if (currentPosition <= prevCurPos! && currentPosition + token.length >= prevCurPos!)  {
        if (recommendation) {
          isNumber = true;

          if (mathematicalOperators.has(token)) {
            const updatedTokenString = `${token} ${recommendation}`;

            parseOutput.formattedString += updatedTokenString;
            currentPosition += updatedTokenString.length;
            parseOutput.newCursorPosition = currentPosition;

            recommendation = null;
            return;            
          };

          const updatedTokenLength = recommendation.length - token.length;
          parseOutput.newCursorPosition = Math.min(parseOutput.newCursorPosition, formula.length) + updatedTokenLength;

          token = recommendation;
          recommendation = null;
        }

        parseOutput.recommendations = this._recommender.getRecommendations(token);
      }

      /**
       * Error checks
       * skip error check if there is one already
       */
      if (expectation != Expectation.UNDEFINED) {
        if (mathematicalOperators.has(previousToken) && isOperator) {
          parseOutput.errorString = `Multiple operators at position ${currentPosition}`;
          expectation = Expectation.UNDEFINED;
        }

        else if (parentheses.isEmpty() && token === ")") {
          parseOutput.errorString = `Unexpected ')' at position ${currentPosition}`;
          expectation = Expectation.UNDEFINED;
        }

        /**
         * Operator or ')' after an operator (Eg: '23 / *' or '23 / )')
         * No error for Unary `+` and `-` as they might represent a positive or negative number respectively
         */
        else if (expectation === Expectation.VARIABLE && !isNumber && !isSpace && token != "(" 
          && !((unaryOperators.includes(token)) && (!parsedString.trim() || previousToken === "(" || mathematicalOperators.has(previousToken)))
        ) {
          parseOutput.errorString = `Expected variable/number at position ${currentPosition}`;
          expectation = Expectation.UNDEFINED;
        }

        /**
         * Multiple number/variable together without operator
         */
        else if (expectation === Expectation.OPERATOR && !isOperator && !isSpace && token != ")") {
          parseOutput.errorString = `Expected mathematical operator at position ${currentPosition}`;
          expectation = Expectation.UNDEFINED;
        }

        /**
         * Unknown symbol/variable/word
         */
        else if (!(isNumber || isOperator || isBracket || isSpace)) {
          parseOutput.errorString = `Unknown word at position ${currentPosition}`;
          expectation = Expectation.UNDEFINED;
        }

        /**
         * division by zero
         */
        else if (isNumber && previousToken === "/" && (this.variables.get(token) === 0 || Number(token) === 0)) {
          parseOutput.errorString = `Division by zero at position ${currentPosition}`;
          expectation = Expectation.UNDEFINED;
        }

        /**
         * Empty brackets
         */
        else if (previousToken === "(" && token === ")") {
          parseOutput.errorString = `Empty brackets at position ${currentPosition}`;
          expectation = Expectation.UNDEFINED;
        }
      }

      /**
       * Setting the expectation for the next token, if no error is there till now
       */
      if (expectation != Expectation.UNDEFINED) {
        if (token === "(" || isOperator) {
          expectation = Expectation.VARIABLE;
        } else if (token === ")" || isNumber) {
          expectation = Expectation.OPERATOR;
        }
      }

      if (token === "(") parentheses.push(currentPosition);
      else if (token === ")") parentheses.pop();
      
      parseOutput.formattedString += token;
      currentPosition += token.length;
      parsedString += token;
      previousToken = token;
    });

    if (recommendation){
      parseOutput.newCursorPosition = Math.min(parseOutput.newCursorPosition, formula.length) + recommendation.length;
      parseOutput.formattedString += recommendation;
      previousToken = recommendation;
    }

    if (mathematicalOperators.has(previousToken) || !previousToken.trim().length) {
      parseOutput.recommendations = !parseOutput.errorString?.length ? Array.from(this.variables.keys()) : [];
    } 
    
    if (mathematicalOperators.has(previousToken)) {
      parseOutput.errorString = `Unexpected ending with mathematical operator at position: ${currentPosition}`;
    } 

    if (!parentheses.isEmpty()) {
      parseOutput.errorString = `Unclosed '(' at position: ${parentheses.top()}`;
    }

    return parseOutput;
  }

  buildRPN(formula: string): Queue<string> | null {
    if (this.parseInput(formula).errorString) return null;    

    const tokens = this.getFormulaTokens(formula)?.filter((el: string) => !/\s+/.test(el) && el !== "");

    let previousToken = "";
    let carriedToken: string | null = null;
    const parsedTokens: string[] = [];
    let currentTokens = "";
    
    // Check if variables include unary operators `-` and `+`.
    for (const token of tokens) {
      if ((unaryOperators.includes(token)) && (!currentTokens.trim() || previousToken === "(" || mathematicalOperators.has(previousToken))) {
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
      if (token === "(") {
        operatorStack.push("(");
      } else if (token === ")") {
        while (operatorStack.top() != "(") {
          outputQueue.enqueue(operatorStack.pop()!);
        }

        operatorStack.pop();
      } else if (mathematicalOperators.has(token)) {
        while (
          mathematicalOperators.has(operatorStack.top()!) && operatorPrecedence[token] <= operatorPrecedence[operatorStack.top()!]) {
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
    if (!rpn) return null;

    const lexedRPN: string[] = [];

    while (!rpn.isEmpty()) {
      lexedRPN.push(rpn.dequeue()!);
    }

    const operatorStack = new Stack<string | null>();
    const resultStack = new Stack<string>();

    lexedRPN.forEach((symbol) => {
      let parsedLeftExpression: string;
      let parsedRightExpression: string;

      // check if the symbol is a number or variable or unaryOperatorPreceded Variable
      if (((unaryOperators.includes(symbol[0])) && this.variables.has(symbol.substring(1))) || 
        this.variables.has(symbol) ||
        (!Number.isNaN(parseFloat(symbol)) && Number.isFinite(parseFloat(symbol)))
      ) {
        resultStack.push(symbol);
        operatorStack.push(null);
      }
      
      // If symbol is an operator, check operatorStack, adds brackets accordingly to the result and add it to operatorStack
      else if (Object.keys(operatorPrecedence).includes(symbol)) {
        const [rightExpression, leftExpression, operatorA, operatorB] = [
          resultStack.pop()!,
          resultStack.pop()!,
          operatorStack.pop()!,
          operatorStack.pop()!,
        ];

        if ((operatorPrecedence[operatorB] <= operatorPrecedence[symbol]) || 
          (operatorPrecedence[operatorB] === operatorPrecedence[symbol] && ["/", "-"].includes(symbol))
        ) {
          parsedLeftExpression = `(${leftExpression})`;
        } else {
          parsedLeftExpression = leftExpression;
        }

        if (operatorPrecedence[operatorA] <= operatorPrecedence[symbol] ||
          (operatorPrecedence[operatorA] === operatorPrecedence[symbol] && ["/", "-"].includes(symbol))
        ) {
          parsedRightExpression = `(${rightExpression})`;
        } else {
          parsedRightExpression = rightExpression;
        }

        resultStack.push(`${parsedLeftExpression} ${symbol} ${parsedRightExpression}`);

        operatorStack.push(symbol);
      } else throw `${symbol} is not a recognized symbol`;
    });

    if (resultStack.isEmpty()) throw `${lexedRPN} is not a correct RPN`;

    return resultStack.pop()!;
  }

  calculate(formula: string): CalculateResult {
    const formulaRPN = this.buildRPN(formula);
    const calculationResult: CalculateResult = {
      result: undefined,
      errorString: null,
    };

    if (!formulaRPN) return calculationResult;

    const calcStack = new Stack<Big>();

    while (!formulaRPN.isEmpty()) {
      const frontItem = formulaRPN.dequeue()!;
      if (!mathematicalOperators.has(frontItem)) {
        const [sign, variableKey] = /^[+-]/.test(frontItem) ? [frontItem[0], frontItem.slice(1)] : ["", frontItem];
        const operandValue = Number.parseFloat(this.variables.get(variableKey)?.toString() ?? variableKey);

        const number = Number.parseFloat(sign + "1") * operandValue;
        calcStack.push(Big(number));
      } else {
        const operator = frontItem;
        const numB = calcStack.pop()!;
        const numA = calcStack.pop()!;

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
              if (parseFloat(Big(numB).toString()) === 0) {
                calculationResult.errorString = "Division by zero encountered";
                return calculationResult;
              }

              calcStack.push(Big(numA).div(Big(numB)));
              break;
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
