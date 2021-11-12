import MiddlewareStorage from "../lib/middleware/middleware-storage";
import { Middleware } from "../lib";

class Dummy {}

describe("MiddlewareStorage", () => {
  test("set", async () => {
    const storage = new MiddlewareStorage();

    storage.set(Dummy, (context) => {
      context.response = new Dummy();
    });
  });

  test("get", async () => {
    const storage = new MiddlewareStorage();

    let counter = 0;
    const size = 100;

    const middleware: Middleware<Dummy> = async (context, next) => {
      counter++;
      await next();
    };
    for (let i = 0; i < size; i++) {
      storage.set(Dummy, middleware);
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
    const storage = new MiddlewareStorage();

    const middleware: Middleware<Dummy> = async (context, next) => {
      await next();
    };
    storage.set(Dummy, middleware);

    expect(storage.has(Dummy)).toBeTruthy();
    expect(storage.has(Dummy, middleware)).toBeTruthy();
  });

  test("delete", async () => {
    const storage = new MiddlewareStorage();

    const middleware: Middleware<Dummy> = async (context, next) => {
      await next();
    };
    storage.set(Dummy, middleware);
    storage.delete(Dummy, middleware);

    expect(storage.has(Dummy)).toBeFalsy();
    expect(storage.has(Dummy, middleware)).toBeFalsy();

    storage.set(Dummy, middleware);
    storage.set(Dummy, middleware);
    storage.delete(Dummy, middleware);

    expect(storage.has(Dummy)).toBeTruthy();
    expect(storage.has(Dummy, middleware)).toBeTruthy();

    storage.delete(Dummy);

    expect(storage.has(Dummy)).toBeFalsy();
    expect(storage.has(Dummy, middleware)).toBeFalsy();
  });
});
