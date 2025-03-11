import { matchSorter } from "match-sorter";

export class Recommender {
  private _wordLimitForSuggestions: number;
  private variableList: string[];

  constructor(variables: string[], minSuggestionLen: number) {
    this._wordLimitForSuggestions = minSuggestionLen > 0 ? minSuggestionLen : 1;
    this.variableList = variables;
  }

  getRecommendations(inputString: string): string[] {
    if (inputString.length < this._wordLimitForSuggestions) return [];

    const recommendations = matchSorter(this.variableList, inputString);

    if (recommendations.length === 0) return [];

    return recommendations;
  }
}
