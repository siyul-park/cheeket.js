import EventEmitter from "events";

import Resolver from "./resolver";
import Token from "./token";

interface Context<T> extends Resolver, EventEmitter {
  request: Token<T>;
  response: T | undefined;

  parent: Context<never>;
  children: Context<never>[];
}

export default Context;
