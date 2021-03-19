type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export default DeepPartial;
