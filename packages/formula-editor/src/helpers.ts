export class Stack<Type> {
  private _inner: Type[] = [];

  push(item: Type): void {
    this._inner.push(item);
  }

  pop(): Type | undefined {
    return this._inner.pop();
  }

  top(): Type | undefined {
    return this._inner.at(-1);
  }

  empty(): boolean {
    return this._inner.length == 0;
  }

  print(): void {
    console.log(this._inner);
  }
}

export class Queue<Type> {
  private _inner: { [key: number]: Type } = {};
  private _head: number = 0;
  private _tail: number = 0;

  enqueue(item: Type): void {
    this._inner[this._tail] = item;
    this._tail++;
  }

  dequeue(): Type | undefined {
    if (this._tail === this._head) return undefined;

    const element = this._inner[this._head];
    delete this._inner[this._head];
    this._head++;

    return element;
  }

  peek(): Type {
    return this._inner[this._head];
  }

  empty(): boolean {
    return this._head == this._tail;
  }

  print(): void {
    console.log(this._inner);
  }
}

export enum Expectation {
  VARIABLE,
  OPERATOR,
  UNDEF,
}
