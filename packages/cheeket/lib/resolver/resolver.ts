import Token from '../token';

interface Resolver {
  resolveOrDefault<T, D>(token: Token<T>, other: D): Promise<T | D>;
  resolve<T>(token: Token<T>): Promise<T>;
}

export default Resolver;
