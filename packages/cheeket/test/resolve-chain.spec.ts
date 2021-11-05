/* eslint-disable no-plusplus,@typescript-eslint/no-loop-func */

import ProviderStorage from "../lib/provider-storage";
import ResolveChain from "../lib/resolve-chain";

class Dummy {}

describe("ResolveChain", () => {
  test("resolve", async () => {
    const storage = new ProviderStorage();
    const chain = new ResolveChain(storage);

    storage.set(Dummy, (context) => {
      context.response = new Dummy();
    });

    expect(await chain.resolve(Dummy)).toBeTruthy();
  });

  test("resolve: chaining", async () => {
    const parentStorage = new ProviderStorage();
    const parentChain = new ResolveChain(parentStorage);

    const childStorage = new ProviderStorage();
    const childChain = new ResolveChain(childStorage, parentChain);

    parentStorage.set(Dummy, (context) => {
      context.response = new Dummy();
    });

    expect(await childChain.resolve(Dummy)).toBeTruthy();
  });

  test("resolve: multi provider", async () => {
    const parentStorage = new ProviderStorage();
    const parentChain = new ResolveChain(parentStorage);

    const childStorage = new ProviderStorage();
    const childChain = new ResolveChain(childStorage, parentChain);

    childStorage.set(Dummy, async (context, next) => {
      await next();
    });
    childStorage.set(Dummy, async (context, next) => {
      context.response = new Dummy();
      await next();
    });
    parentStorage.set(Dummy, () => {
      throw new Error();
    });

    expect(await childChain.resolve(Dummy)).toBeTruthy();
  });

  test("resolveOrDefault", async () => {
    const storage = new ProviderStorage();
    const chain = new ResolveChain(storage);

    storage.set(Dummy, (context) => {
      context.response = new Dummy();
    });

    expect(await chain.resolveOrDefault(Dummy, null)).toBeTruthy();
  });

  test("resolveOrDefault: not resolved", async () => {
    const storage = new ProviderStorage();
    const chain = new ResolveChain(storage);

    expect(await chain.resolveOrDefault(Dummy, null)).toBe(null);
  });
});
