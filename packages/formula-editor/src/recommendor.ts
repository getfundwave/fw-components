export class Recommender {
  private _trie: TrieNode;
  private _minSuggestionLen: number;

  constructor(variables: Map<string, number>, minSuggestionLen: number) {
    this._minSuggestionLen = minSuggestionLen > 0 ? minSuggestionLen : 1;
    this._trie = new TrieNode();
    this._trie.insertAll();

    for (let variable of variables) {
      this.insert(variable[0]);
    }
  }

  insert(
    word: string,
    position: number = -1,
    node: TrieNode | undefined = undefined
  ): void {
    if (position == -1) {
      this.insert(word, 0, this._trie);
      return;
    }

    if (position == word.length) {
      node?.addChild("\0");
      return;
    }

    if (!node!.getChild(word[position])) {
      node?.addChild(word[position]);
    }

    this.insert(word, position + 1, node!.getChild(word[position]));
  }

  getRecommendation(word: string): string[] | null {
    if (word.length < this._minSuggestionLen) {
      return null;
    }

    let recommendations: string[] = [];
    let currentPosition = 0;
    let currentNode: TrieNode | undefined = this._trie;

    while (currentNode && currentPosition < word.length) {
      currentNode = currentNode.getChild(word[currentPosition]);
      currentPosition++;
    }

    if (!currentNode) {
      return null;
    }

    this._traverseAndGet(recommendations, currentNode, word, currentPosition);

    return recommendations;
  }

  _traverseAndGet(
    recommendations: string[],
    node: TrieNode,
    word: string,
    position: number,
    currentStr: string = ""
  ) {
    // if (currentStr != "") {
    //   recommendations.push(word + currentStr);
    // }

    // if (node.children.size == 0) {
    //   return;
    // }

    for (let child of node.children) {
      if (child[0] == "\0") {
        recommendations.push(word + currentStr);
        // return;
      }

      this._traverseAndGet(
        recommendations,
        child[1],
        word,
        position,
        currentStr + child[0]
      );
    }
  }
}

class TrieNode {
  constructor() {
    this._children = new Map<string, TrieNode>();
  }

  private _children: Map<string, TrieNode>;
  get children() {
    return this._children;
  }

  insertAll() {
    const LOWERCASE_ASCII_BEGIN = 97;

    for (let char = 0; char < 26; char++) {
      this._children.set(
        String.fromCharCode(char + LOWERCASE_ASCII_BEGIN),
        new TrieNode()
      );
    }
  }

  getChild(char: string) {
    return this._children.get(char);
  }

  addChild(char: string) {
    this._children.set(char, new TrieNode());
  }
}
