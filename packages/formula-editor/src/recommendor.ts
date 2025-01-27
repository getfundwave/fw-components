import { Fzf } from 'fzf';

export class Recommender {
  private _fzf: Fzf<Array<string>>;
  private _minimumSuggestionLength: number;

  constructor(variables: Map<string, number>, minSuggestionLen: number) {
    this._minimumSuggestionLength = minSuggestionLen > 0 ? minSuggestionLen : 1;

    const variableList = Array.from(variables.keys());
    this._fzf = new Fzf(variableList);
  }

  getRecommendation(word: string): string[] | null {
    if (word.length < this._minimumSuggestionLength) {
      return null;
    }

    const entries = this._fzf.find(word);

    const recommendations = entries.map(entry => entry.item);

    if (
      recommendations.length === 0 ||
      (recommendations.length === 1 && recommendations[0] === word)
    ) {
      return null;
    }

    return recommendations;
  }
}
