interface Type<T> extends Function {
  new (...args: never[]): T;
}

export default Type;
