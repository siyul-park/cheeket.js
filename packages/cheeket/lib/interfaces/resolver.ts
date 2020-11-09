import Token from "./token";

interface Resolver {
  resolve<T>(token: Token<T>): Promise<T>;
  resolveAll<T>(token: Token<T>): Promise<T[]>;
}

export default Resolver;
