import interfaces from "../interfaces/interfaces";

class CantResolveError extends Error {
  constructor(token: interfaces.Token<unknown>, resolver: interfaces.Resolver) {
    super(`Cant resolve ${token.toString()} in ${resolver}`);
  }
}

export default CantResolveError;
