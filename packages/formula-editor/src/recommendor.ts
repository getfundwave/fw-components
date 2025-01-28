import {matchSorter} from 'match-sorter'

export class Recommender {
  private _minimumSuggestionLength: number;
  private variableList: Array<string>;

  constructor(variables: Map<string, number>, minSuggestionLen: number) {
    this._minimumSuggestionLength = minSuggestionLen > 0 ? minSuggestionLen : 1;
    this.variableList = Array.from(variables.keys());
  }

  getRecommendation(word: string): string[] | null {
    if (word.length < this._minimumSuggestionLength) {
      return null;
    }

    const recommendations = matchSorter(this.variableList,word)

    if (
      recommendations.length === 0 ||
      (recommendations.length === 1 && recommendations[0] === word)
    ) {
      return null;
    }

    return recommendations;
  }
}
