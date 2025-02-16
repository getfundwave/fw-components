export declare class Stack<Type> {
    private _elements;
    push(item: Type): void;
    pop(): Type | undefined;
    top(): Type | undefined;
    isEmpty(): boolean;
    print(): void;
}
export declare class Queue<Type> {
    private _elements;
    private _head;
    private _tail;
    enqueue(item: Type): void;
    dequeue(): Type | undefined;
    peek(): Type;
    isEmpty(): boolean;
    print(): void;
}
export declare enum Expectation {
    VARIABLE = 0,
    OPERATOR = 1,
    UNDEFINED = 2
}
