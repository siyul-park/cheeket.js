import Token from "./token";

interface Resolver {
  resolve<T>(token: Token<T>): Promise<T | undefined>;
}

export default Resolver;
