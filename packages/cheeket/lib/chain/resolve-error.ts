import { Token } from "../token";

class ResolveError extends Error {
  constructor(token: Token<unknown>) {
    super(`Can't resolve ${token.toString()}`);
  }
}

export default ResolveError;
