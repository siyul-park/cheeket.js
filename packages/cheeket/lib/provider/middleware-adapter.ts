import { Middleware } from "../middleware";
import Provider from "./provider";
import { DefaultState } from "../context";

interface ArrayMiddlewareAdapterOptions {
  array: true;
}
interface SingleMiddlewareAdapterOptions {
  array: false | undefined;
}
export type MiddlewareAdapterOptions =
  | ArrayMiddlewareAdapterOptions
  | SingleMiddlewareAdapterOptions;

type MiddlewareAdapter<T, State = DefaultState> = {
  bind(options: ArrayMiddlewareAdapterOptions): Middleware<T[], State>;
  bind(options?: SingleMiddlewareAdapterOptions): Middleware<T, State>;
} & Provider<T>;

export default MiddlewareAdapter;
