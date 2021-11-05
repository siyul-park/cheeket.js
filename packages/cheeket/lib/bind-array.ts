import BindStrategy from "./bind-strategy";

function bindArray<T>(): BindStrategy<T[], T> {
  return {
    bind(context, response): void {
      if (context.response === undefined) {
        context.response = [];
      }
      context.response.push(response);
    },
    async runNext(context, next): Promise<void> {
      await next();
    },
  };
}

export default bindArray;
