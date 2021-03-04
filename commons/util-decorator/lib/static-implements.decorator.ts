function staticImplements<T>(): <U extends T>(constructor: U) => void {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return <U extends T>(_: U) => {};
}

export default staticImplements;
