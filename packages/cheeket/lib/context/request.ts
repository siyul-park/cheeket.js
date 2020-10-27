import interfaces from "../interfaces/interfaces";

class Request<T> implements interfaces.Request<T> {
  id = Symbol("");

  constructor(public token: interfaces.Token<T>) {}
}

export default Request;
