class Queue<T> {
  private readonly arr: T[] = [];

  enqueue(item: T): void {
    this.arr.push(item);
  }

  dequeue(): T | undefined {
    return this.arr.shift();
  }

  first(): T | undefined {
    return this.arr[0];
  }

  get size(): number {
    return this.arr.length;
  }
}

export default Queue;
