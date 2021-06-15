import { Token } from "../token";
import { ContainerEventEmitter, Context, DefaultState } from "../context";
import ResolveChain from "./resolve-chain";

class ContextAdapter<T, State = DefaultState> implements Context<T, State> {
  children: Context<unknown, unknown>[];

  container: ContainerEventEmitter;

  parent?: Context<unknown, unknown>;

  request: Token<T>;

  response?: T;

  state?: State;

  constructor(
    private readonly resolveChain: ResolveChain,
    container: ContainerEventEmitter,
    token: Token<T>,
    parent?: Context<unknown, unknown>
  ) {
    this.children = [];
    this.container = container;
    if (parent != null) {
      this.parent = parent;
      parent.children.push(this);
    }

    this.request = token;
  }

  resolve<U>(token: Token<U>): Promise<U> {
    return this.resolveChain.resolve(token, this);
  }
}

export default ContextAdapter;
