import Context from "./context";

type Provider<T> = (context: Context) => Promise<T>;

export default Provider;
