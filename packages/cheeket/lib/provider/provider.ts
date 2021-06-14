import { Resolver } from "../resolve";

type Provider<T> = (resolver: Resolver) => Promise<T>;

export default Provider;
