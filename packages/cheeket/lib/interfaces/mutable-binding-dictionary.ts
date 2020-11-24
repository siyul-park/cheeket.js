import Token from "./token";
import Provider from "./provider";
import BindingDictionary from "./binding-dictionary";

interface MutableBindingDictionary extends BindingDictionary {
  set<T>(token: Token<T>, provider: Provider<T>): void;
  get<T>(token: Token<T>): Provider<T> | undefined;
  getAll<T>(token: Token<T>): Provider<T>[];
  delete<T>(token: Token<T>): void;
  clear(): void;
  has<T>(token: Token<T>): boolean;
}

export default MutableBindingDictionary;
