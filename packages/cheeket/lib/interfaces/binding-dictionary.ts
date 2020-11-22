import Token from "./token";
import Provider from "./provider";

interface BindingDictionary {
  get<T>(token: Token<T>): Provider<T> | undefined;
  getAll<T>(token: Token<T>): Provider<T>[];
  has<T>(token: Token<T>): boolean;
}

export default BindingDictionary;
