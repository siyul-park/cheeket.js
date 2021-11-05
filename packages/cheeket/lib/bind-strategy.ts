import Context from "./context";
import Next from "./next";

type BindStrategy<T, U> = (
  context: Context<T>,
  response: U,
  next: Next
) => Promise<void> | void;

export default BindStrategy;
