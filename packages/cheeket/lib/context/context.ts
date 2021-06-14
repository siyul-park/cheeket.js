import EventEmitter from "events";

import { Token } from "../token";
import { Resolver } from "../resolve";
import DefaultState from "./default-state";

interface Context<T, State = DefaultState> extends Resolver {
  request: Token<T>;
  response?: T;

  state?: State;

  parent?: Context<unknown, unknown>;
  children: Context<unknown, unknown>[];

  container: EventEmitter;
}

export default Context;
