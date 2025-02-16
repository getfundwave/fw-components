export class Recommender {
    constructor(variables, minSuggestionLen) {
        this._mininumSuggestionLength = minSuggestionLen > 0 ? minSuggestionLen : 1;
        this._trie = new TrieNode();
        for (let variable of variables) {
            this.insert(variable[0]);
        }
    }
    insert(word, position = -1, node = undefined) {
        if (position == -1) {
            this.insert(word, 0, this._trie);
            return;
        }
        if (position == word.length) {
            node === null || node === void 0 ? void 0 : node.addChild("\0");
            return;
        }
        if (!node.getChild(word[position])) {
            node === null || node === void 0 ? void 0 : node.addChild(word[position]);
        }
        this.insert(word, position + 1, node.getChild(word[position]));
    }
    getRecommendation(word) {
        if (word.length < this._mininumSuggestionLength) {
            return null;
        }
        let recommendations = [];
        let currentPosition = 0;
        let currentNode = this._trie;
        while (currentNode && currentPosition < word.length) {
            currentNode = currentNode.getChild(word[currentPosition]);
            currentPosition++;
        }
        if (!currentNode) {
            return null;
        }
        this._traverseAndGet(recommendations, currentNode, word);
        if (recommendations.length == 0 ||
            (recommendations.length == 1 && recommendations[0] == word)) {
            return null;
        }
        return recommendations;
    }
    _traverseAndGet(recommendations, node, word, currentString = "") {
        for (let child of node.children) {
            if (child[0] == "\0") {
                recommendations.push(word + currentString);
                // return;
            }
            this._traverseAndGet(recommendations, child[1], word, currentString + child[0]);
        }
    }
}
class TrieNode {
    constructor() {
        this._children = new Map();
    }
    get children() {
        return this._children;
    }
    getChild(char) {
        return this._children.get(char);
    }
    addChild(char) {
        this._children.set(char, new TrieNode());
    }
}
//# sourceMappingURL=recommendor.js.map