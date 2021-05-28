import { Token } from "../token";

interface Resolver<OPTIONS = unknown> {
  resolve<T>(token: Token<T>, options?: OPTIONS): T;
}

export default Resolver;
