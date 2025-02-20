import { matchSorter } from "match-sorter";

export class Recommender {
  private _minimumSuggestionLength: number;
  private variableList: string[];

  constructor(variables: string[], minSuggestionLen: number) {
    this._minimumSuggestionLength = minSuggestionLen > 0 ? minSuggestionLen : 1;
    this.variableList = variables;
  }

  getRecommendations(word: string): string[] {
    if (word.length < this._minimumSuggestionLength) return [];

    const recommendations = matchSorter(this.variableList, word);

    if (recommendations.length === 0 || (recommendations.length === 1 && recommendations[0] === word)) return [];

    return recommendations;
  }
}
