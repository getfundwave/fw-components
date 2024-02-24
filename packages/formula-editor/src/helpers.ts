export class Stack<Type> {
  private _elements: Type[] = [];

  push(item: Type): void {
    this._elements.push(item);
  }

  pop(): Type | undefined {
    return this._elements.pop();
  }

  top(): Type | undefined {
    return this._elements.at(-1);
  }

  isEmpty(): boolean {
    return this._elements.length == 0;
  }

  print(): void {
    console.log(this._elements);
  }
}

export class Queue<Type> {
  private _elements: { [key: number]: Type } = {};
  private _head: number = 0;
  private _tail: number = 0;

  enqueue(item: Type): void {
    this._elements[this._tail] = item;
    this._tail++;
  }

  dequeue(): Type | undefined {
    if (this._tail === this._head) return undefined;

    const element = this._elements[this._head];
    delete this._elements[this._head];
    this._head++;

    return element;
  }

  peek(): Type {
    return this._elements[this._head];
  }

  isEmpty(): boolean {
    return this._head == this._tail;
  }

  print(): void {
    console.log(this._elements);
  }
}

export enum Expectation {
  VARIABLE,
  OPERATOR,
  UNDEFINED,
}
