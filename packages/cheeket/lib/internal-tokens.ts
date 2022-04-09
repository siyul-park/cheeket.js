import { AsyncEventEmitter } from './async';
import Token from './token';

const InternalTokens = Object.freeze({
  AsyncEventEmitter: Symbol('AsyncEventEmitter') as Token<AsyncEventEmitter>,
  PipeLine: Symbol('PipeLine') as Token<unknown>,
});

export default InternalTokens;
