import BindStrategy from "./bind-strategy";

function bindObject<T>(): BindStrategy<T, T> {
  return async (context, response) => {
    context.response = response;
  };
}

export default bindObject;
