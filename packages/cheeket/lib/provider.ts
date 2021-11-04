import Context from "./context";
import Next from "./next";

type Provider<T> = (context: Context<T>, next: Next) => Promise<void> | void;

export default Provider;
