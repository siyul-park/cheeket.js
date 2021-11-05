/* eslint-disable no-plusplus,@typescript-eslint/no-loop-func */

import ProviderStorage from "../lib/provider-storage";
import { Provider } from "../lib";

class Dummy {}

describe("ProviderStorage", () => {
  const storage = new ProviderStorage();

  test("set", async () => {
    storage.set(Dummy, (context) => {
      context.response = new Dummy();
    });
  });

  test("get", async () => {
    let counter = 0;
    const size = 100;

    const provider: Provider<Dummy> = async (context, next) => {
      counter++;
      await next();
    };
    for (let i = 0; i < size; i++) {
      storage.set(Dummy, provider);
    }

    const merged = storage.get(Dummy);
    await merged?.(
      {
        request: Dummy,
        response: undefined,

        parent: undefined,
        children: [],

        resolve<T>(): Promise<T> {
          return Promise.reject();
        },
        resolveOrDefault<T, D>(): Promise<T | D> {
          return Promise.reject();
        },
      },
      async () => {}
    );

    expect(counter).toEqual(size);
  });
});
