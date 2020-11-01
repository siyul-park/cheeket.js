import * as interfaces from "../interfaces";

class Request<T> implements interfaces.Request<T> {
  id = Symbol("");

  children = new Set<interfaces.Request<unknown>>();

  constructor(
    public token: interfaces.Token<T>,
    public parent?: Request<unknown>
  ) {}
}

export default Request;
