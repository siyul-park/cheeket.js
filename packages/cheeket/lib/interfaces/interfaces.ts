// eslint-disable-next-line @typescript-eslint/no-namespace
namespace interfaces {
  export interface Abstract<T> {
    prototype: T;
  }

  export type Type<T> = new (...args: any[]) => T;

  export type Token<T> = string | symbol | Type<T> | Abstract<T>;

  export interface Resolver {
    resolve<T>(token: Token<T>): Promise<T>;
  }

  export interface Request<T> {
    id: symbol;
    token: Token<T>;
    parent?: Request<unknown>;
    children: Set<Request<unknown>>;
  }

  export interface Context extends Resolver {
    id: symbol;
    request?: Request<unknown>;
  }

  export type Provider<T> = (context: Context) => T | Promise<T>;

  export interface Binder {
    bind<T>(token: Token<T>, provider: Provider<T>): void;
  }

  export interface Binding<T> {
    token: Token<T>;
    provider: Provider<T>;
  }

  export interface BindingDictionary {
    set<T>(token: Token<T>, provider: Provider<T>): void;
    get<T>(token: Token<T>): Provider<T> | undefined;
  }

  export interface Container extends Resolver, Binder {}
}

export default interfaces;
