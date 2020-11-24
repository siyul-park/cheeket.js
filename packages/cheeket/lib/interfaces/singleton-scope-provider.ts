import Provider from "./provider";

interface SingletonScopeProvider<T> extends Provider<T> {
  clear(): void;
}

export default SingletonScopeProvider;
