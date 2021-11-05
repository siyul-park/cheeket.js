/* eslint-disable no-plusplus,@typescript-eslint/no-loop-func */

import ProviderStorage from "../lib/provider-storage";
import { Provider } from "../lib";

class Dummy {}

describe("ProviderStorage", () => {
  test("set", async () => {
    const storage = new ProviderStorage();

    storage.set(Dummy, (context) => {
      context.response = new Dummy();
    });
  });

  test("get", async () => {
    const storage = new ProviderStorage();

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

  test("has", async () => {
    const storage = new ProviderStorage();

    const provider: Provider<Dummy> = async (context, next) => {
      await next();
    };
    storage.set(Dummy, provider);

    expect(storage.has(Dummy)).toBeTruthy();
    expect(storage.has(Dummy, provider)).toBeTruthy();
  });

  test("delete", async () => {
    const storage = new ProviderStorage();

    const provider: Provider<Dummy> = async (context, next) => {
      await next();
    };
    storage.set(Dummy, provider);
    storage.delete(Dummy, provider);

    expect(storage.has(Dummy)).toBeFalsy();
    expect(storage.has(Dummy, provider)).toBeFalsy();

    storage.set(Dummy, provider);
    storage.set(Dummy, provider);
    storage.delete(Dummy, provider);

    expect(storage.has(Dummy)).toBeTruthy();
    expect(storage.has(Dummy, provider)).toBeTruthy();

    storage.delete(Dummy);

    expect(storage.has(Dummy)).toBeFalsy();
    expect(storage.has(Dummy, provider)).toBeFalsy();
  });
});
