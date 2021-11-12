import Resolver from "./resolver";
import Token from "./token";

interface Context<T> extends Resolver {
  request: Token<T>;
  response: T | undefined;

  parent: Context<unknown> | undefined;
  children: Context<unknown>[];
}

export default Context;
