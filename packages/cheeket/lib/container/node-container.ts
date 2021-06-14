import EventEmitter from "events";
import { Token } from "../token";
import Container from "./container";
import { DefaultState } from "../context";
import {
  joinMiddleware,
  Middleware,
  MiddlewareManager,
  resolveMiddleware,
} from "../middleware";
import { ResolveChain, MiddlewareResolveChain } from "../chain";
import { BinderAdapter } from "../binder";

class NodeContainer<State = DefaultState>
  extends EventEmitter
  implements Container<State> {
  private readonly bindMap = new Map<
    Token<unknown>,
    Middleware<unknown, unknown>[]
  >();

  private readonly binder = new BinderAdapter<State>(this.bindMap);

  private readonly middlewareManager = new MiddlewareManager();

  private readonly resolveChain: ResolveChain;

  private readonly resolveMiddleware: Middleware<unknown, unknown>;

  private middleware?: Middleware<unknown, unknown>;

  constructor(parent?: ResolveChain) {
    super({ captureRejections: true });

    this.resolveMiddleware = resolveMiddleware(this.bindMap);

    const middlewareProvider = () => {
      if (this.middleware != null) {
        return this.middleware;
      }

      let middleware: Middleware<unknown, unknown>;
      if (this.middlewareManager.size > 0) {
        middleware = joinMiddleware(
          this.middlewareManager.compact(),
          resolveMiddleware(this.bindMap)
        );
      } else {
        middleware = resolveMiddleware(this.bindMap);
      }

      this.middleware = middleware;

      return middleware;
    };
    this.resolveChain = new MiddlewareResolveChain(
      middlewareProvider,
      this,
      parent
    );
  }

  bind<T>(token: Token<T>, middleware: Middleware<T, State>): void {
    this.binder.bind(token, middleware);
  }

  unbind<T>(token: Token<T>, middleware?: Middleware<T, State>): void {
    this.binder.unbind(token, middleware);
  }

  isBound<T>(token: Token<T>, middleware?: Middleware<T, State>): boolean {
    return this.binder.isBound(token, middleware);
  }

  resolve<T>(token: Token<T>): Promise<T> {
    return this.resolveChain.resolve(token);
  }

  use(...middlewares: Middleware<unknown, unknown>[]): void {
    this.middleware = undefined;
    this.middlewareManager.use(...middlewares);
  }

  createChildContainer<ChildState = DefaultState>(): Container<ChildState> {
    return new NodeContainer(this.resolveChain);
  }

  close(): void {
    this.emit("close", this);
  }
}

export default NodeContainer;
