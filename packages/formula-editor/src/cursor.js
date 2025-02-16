var _a;
export class Cursor {
    /**
     * The functions `getCurrentCursorPosition`, `setCurrentCursorPosition` and their
     * helpers `_createRange` and `_isChildOf` are not used for caret manipulation,
     * but are still in the code for future reference, if the functionality breaks
     * somehow in some obsolete browser.
     */
    static getCurrentCursorPosition(parentElement) {
        var _b, _c;
        let selection = window.getSelection(), charCount = -1, node;
        if (selection === null || selection === void 0 ? void 0 : selection.focusNode) {
            if (_a._isChildOf(selection.focusNode, parentElement)) {
                node = selection.focusNode;
                charCount = selection.focusOffset;
                while (node) {
                    if (node === parentElement) {
                        break;
                    }
                    if (node.previousSibling) {
                        node = node.previousSibling;
                        charCount += (_c = (_b = node.textContent) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
                    }
                    else {
                        node = node.parentNode;
                        if (node === null) {
                            break;
                        }
                    }
                }
            }
        }
        return charCount;
    }
    static setCurrentCursorPosition(chars, element) {
        if (chars >= 0) {
            var selection = window.getSelection();
            let range = _a._createRange(element, { count: chars }, undefined);
            if (range) {
                range.collapse(false);
                selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
                selection === null || selection === void 0 ? void 0 : selection.addRange(range);
            }
        }
    }
    static _createRange(node, chars, range) {
        if (!range) {
            range = document.createRange();
            range.selectNode(node);
            range.setStart(node, 0);
        }
        if (chars.count === 0) {
            range.setEnd(node, chars.count);
        }
        else if (node && chars.count > 0) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.textContent.length < chars.count) {
                    chars.count -= node.textContent.length;
                }
                else {
                    range.setEnd(node, chars.count);
                    chars.count = 0;
                }
            }
            else {
                for (var lp = 0; lp < node.childNodes.length; lp++) {
                    range = _a._createRange(node.childNodes[lp], chars, range);
                    if (chars.count === 0) {
                        break;
                    }
                }
            }
        }
        return range;
    }
    static _isChildOf(node, parentElement) {
        while (node !== null) {
            if (node === parentElement) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
    static getCaretPosition(shadowRoot, element) {
        // `getSelection` is not defined for the type ShadowRoot in TS,
        // but it does exist.
        const range = shadowRoot.getSelection().getRangeAt(0);
        const prefix = range.cloneRange();
        prefix.selectNodeContents(element);
        prefix.setEnd(range.endContainer, range.endOffset);
        return prefix.toString().length;
    }
    static getCursorRect(shadowRoot) {
        var _b, _c;
        return (_c = (_b = shadowRoot
            .getSelection()) === null || _b === void 0 ? void 0 : _b.getRangeAt(0)) === null || _c === void 0 ? void 0 : _c.getClientRects()[0];
    }
}
_a = Cursor;
Cursor.setCaretPosition = (pos, parent) => {
    for (const node of parent.childNodes) {
        if (node.nodeType == Node.TEXT_NODE) {
            if (node.length >= pos) {
                const range = document.createRange();
                const sel = window.getSelection();
                range.setStart(node, pos);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                return -1;
            }
            else {
                pos = pos - node.length;
            }
        }
        else {
            pos = _a.setCaretPosition(pos, node);
            if (pos < 0) {
                return pos;
            }
        }
    }
    return pos;
};
//# sourceMappingURL=cursor.js.map