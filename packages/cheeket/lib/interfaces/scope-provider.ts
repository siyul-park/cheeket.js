import Provider from "./provider";

interface ScopeProvider<T> extends Provider<T> {
  clear(): void;
}

export default ScopeProvider;
