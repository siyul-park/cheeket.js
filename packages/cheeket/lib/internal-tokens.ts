import AsyncEventEmitter from "./async-event-emitter";
import Token from "./token";

const InternalTokens = Object.freeze({
  AsyncEventEmitter: Symbol.for("AsyncEventEmitter") as Token<AsyncEventEmitter>,
  PipeLine: Symbol.for("PipeLine") as Token<unknown>,
});

export default InternalTokens;
