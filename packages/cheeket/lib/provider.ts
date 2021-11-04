import Context from "./context";

type Provider<T> = (context: Context<T>) => Provider<void> | void;

export default Provider;
