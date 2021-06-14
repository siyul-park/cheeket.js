import EventEmitter from "events";

import { Resolver } from "../resolve";
import { DefaultState } from "../context";
import { Binder } from "../binder";
import { MiddlewarePipeline } from "../middleware";

interface Container<State = DefaultState>
  extends EventEmitter,
    Resolver,
    Binder<State>,
    MiddlewarePipeline {
  createChildContainer<ChildState = DefaultState>(): Container<ChildState>;

  close(): void;
}

export default Container;
