export declare class Cursor {
    /**
     * The functions `getCurrentCursorPosition`, `setCurrentCursorPosition` and their
     * helpers `_createRange` and `_isChildOf` are not used for caret manipulation,
     * but are still in the code for future reference, if the functionality breaks
     * somehow in some obsolete browser.
     */
    static getCurrentCursorPosition(parentElement: any): number;
    static setCurrentCursorPosition(chars: number, element: any): void;
    static _createRange(node: any, chars: any, range: any): any;
    static _isChildOf(node: any, parentElement: any): boolean;
    static getCaretPosition(shadowRoot: ShadowRoot, element: HTMLElement): any;
    static setCaretPosition: (pos: any, parent: any) => any;
    static getCursorRect(shadowRoot: ShadowRoot): any;
}
