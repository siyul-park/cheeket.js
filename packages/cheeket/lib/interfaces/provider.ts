import Context from "./context";

type Provider<T> = (context: Context) => T | Promise<T>;

export default Provider;
