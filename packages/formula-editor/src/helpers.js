export class Stack {
    constructor() {
        this._elements = [];
    }
    push(item) {
        this._elements.push(item);
    }
    pop() {
        return this._elements.pop();
    }
    top() {
        return this._elements.at(-1);
    }
    isEmpty() {
        return this._elements.length == 0;
    }
    print() {
        console.log(this._elements);
    }
}
export class Queue {
    constructor() {
        this._elements = {};
        this._head = 0;
        this._tail = 0;
    }
    enqueue(item) {
        this._elements[this._tail] = item;
        this._tail++;
    }
    dequeue() {
        if (this._tail === this._head)
            return undefined;
        const element = this._elements[this._head];
        delete this._elements[this._head];
        this._head++;
        return element;
    }
    peek() {
        return this._elements[this._head];
    }
    isEmpty() {
        return this._head == this._tail;
    }
    print() {
        console.log(this._elements);
    }
}
export var Expectation;
(function (Expectation) {
    Expectation[Expectation["VARIABLE"] = 0] = "VARIABLE";
    Expectation[Expectation["OPERATOR"] = 1] = "OPERATOR";
    Expectation[Expectation["UNDEFINED"] = 2] = "UNDEFINED";
})(Expectation || (Expectation = {}));
//# sourceMappingURL=helpers.js.map