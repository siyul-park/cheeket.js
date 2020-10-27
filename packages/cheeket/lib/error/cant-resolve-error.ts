import interfaces from "../interfaces/interfaces";

class CantResolveError extends Error {
  constructor(token: interfaces.Token<unknown>, context: interfaces.Context) {
    super(`Cant resolve ${token.toString()} in ${context}`);
  }
}

export default CantResolveError;
