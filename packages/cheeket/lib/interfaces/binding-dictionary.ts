import Token from "./token";
import Provider from "./provider";

interface BindingDictionary {
  set<T>(token: Token<T>, provider: Provider<T>): void;
  get<T>(token: Token<T>): Provider<T> | undefined;
}

export default BindingDictionary;
