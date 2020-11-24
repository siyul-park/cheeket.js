import Provider from "./provider";

interface ResolveScopeProvider<T> extends Provider<T> {
  size: number;
}

export default ResolveScopeProvider;
