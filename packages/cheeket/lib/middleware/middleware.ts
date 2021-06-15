import Context from "../context/context";
import DefaultState from "../context/default-state";
import Next from "./next";

type Middleware<T, State = DefaultState> = (
  context: Context<T, State>,
  next: Next
) => Promise<void>;

export default Middleware;
