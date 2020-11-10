import Token from "./token";

interface Request<T> {
  id: symbol;
  token: Token<T>;
  resolved?: T;
}
export default Request;
