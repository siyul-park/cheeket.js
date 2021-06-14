import ProviderWrappingOptions from "./provider-wrapping-options";
import DefaultState from "../context/default-state";
import { Context } from "../context";

function bindInContext<T, State = DefaultState>(
  context: Context<T | T[], State>,
  value: T,
  options?: ProviderWrappingOptions
): void {
  if (options?.array === true) {
    const values = (context.response ?? []) as T[];
    values.push(value);
    context.response = values;
  } else {
    context.response = value;
  }

  context.container.emit("create", value);
}

export default bindInContext;
