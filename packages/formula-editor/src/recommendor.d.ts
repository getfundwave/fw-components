export declare class Recommender {
    private _trie;
    private _mininumSuggestionLength;
    constructor(variables: Map<string, number>, minSuggestionLen: number);
    insert(word: string, position?: number, node?: TrieNode | undefined): void;
    getRecommendation(word: string): string[] | null;
    private _traverseAndGet;
}
declare class TrieNode {
    constructor();
    private _children;
    get children(): Map<string, TrieNode>;
    getChild(char: string): TrieNode | undefined;
    addChild(char: string): void;
}
export {};
