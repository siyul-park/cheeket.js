import { Context, DefaultState } from "../context";

type Provider<T, State = DefaultState> = (
  context: Context<unknown, State>
) => Promise<T> | T;

export default Provider;
