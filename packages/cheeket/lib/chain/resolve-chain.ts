import Context from "../context/context";
import { Token } from "../token";

interface ResolveChain {
  resolve<T>(token: Token<T>, parent?: Context<unknown, unknown>): Promise<T>;
}

export default ResolveChain;
