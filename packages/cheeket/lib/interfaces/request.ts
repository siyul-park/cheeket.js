import Token from "./token";

interface Request<T> {
  id: symbol;
  token: Token<T>;
  parent?: Request<unknown>;
  children: Set<Request<unknown>>;
}
export default Request;
