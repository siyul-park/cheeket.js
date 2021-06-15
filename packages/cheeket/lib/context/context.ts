import { Token } from "../token";
import { Resolver } from "../resolve";
import DefaultState from "./default-state";
import ContainerEventEmitter from "./container-event-emitter";

interface Context<T, State = DefaultState> extends Resolver {
  request: Token<T>;
  response?: T;

  state?: State;

  parent?: Context<unknown, unknown>;
  children: Context<unknown, unknown>[];

  container: ContainerEventEmitter;
}

export default Context;
