export function getFormulaTokens(formulaString: string, formulaRegex: RegExp): string[] {
  if (!formulaString?.length) return [];

  return formulaString.match(formulaRegex) || [];
}
