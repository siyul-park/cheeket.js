import uniqid from "uniqid";
import * as interfaces from "../interfaces";

class Request<T> implements interfaces.Request<T> {
  id = Symbol(uniqid());

  resolved?: T | T[] = undefined;

  constructor(public token: interfaces.Token<T>) {}
}

export default Request;
