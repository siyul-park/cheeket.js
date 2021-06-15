import { Resolver } from "../resolve";
import { DefaultState, ContainerEventEmitter } from "../context";
import { Binder } from "../binder";
import { MiddlewarePipeline } from "../middleware";

interface Container<State = DefaultState>
  extends ContainerEventEmitter,
    Resolver,
    Binder<State>,
    MiddlewarePipeline {
  id: string;

  createChildContainer<ChildState = DefaultState>(): Container<ChildState>;

  close(): void;
}

export default Container;
