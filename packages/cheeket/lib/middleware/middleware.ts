import Context from "../context";
import Next from "../next";

type Middleware<T> = (context: Context<T>, next: Next) => Promise<void> | void;

export default Middleware;
