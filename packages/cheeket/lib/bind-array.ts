import BindStrategy from "./bind-strategy";

function bindArray<T>(): BindStrategy<T[], T> {
  return async (context, response, next) => {
    if (context.response === undefined) {
      context.response = [];
    }
    context.response.push(response);
    await next();
  };
}

export default bindArray;
