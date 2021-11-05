import AsyncEventEmitter from "./async-event-emitter";
import Token from "./token";

const InternalTokens = Object.freeze({
  AsyncEventEmitter: Symbol.for(
    "AsyncEventEmitter"
  ) as Token<AsyncEventEmitter>,
  PreProcess: Symbol.for("PreProcess") as Token<unknown>,
  PostProcess: Symbol.for("PostProcess") as Token<unknown>,
});

export default InternalTokens;
