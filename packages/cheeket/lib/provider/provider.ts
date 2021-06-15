import { Resolver } from "../resolve";

type Provider<T> = (resolver: Resolver) => Promise<T> | T;

export default Provider;
