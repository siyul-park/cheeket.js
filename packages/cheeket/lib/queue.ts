class Queue<T> {
  private readonly arr: T[] = [];

  enqueue(item: T): void {
    this.arr.push(item);
  }

  dequeue(item?: T): T | undefined {
    if (item === undefined) {
      return this.arr.shift();
    }
    const index = this.arr.findIndex((value) => value === item);
    if (index < 0) {
      return undefined;
    }
    return this.arr.splice(index, 1)[0];
  }

  first(): T | undefined {
    return this.arr[0];
  }

  get size(): number {
    return this.arr.length;
  }
}

export default Queue;
