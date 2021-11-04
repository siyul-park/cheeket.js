import Token from "./token";
import Provider from "./provider";

class Storage {
  private readonly map = new Map<Token<unknown>, Provider<unknown>>();

  get<T>(token: Token<T>): Provider<T> | undefined {
    return this.map.get(token);
  }

  set<T>(token: Token<T>, provider: Provider<T>): void {
    this.map.set(token as Token<unknown>, provider as Provider<unknown>);
  }
}

export default Storage;
