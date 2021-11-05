import ProviderStorage from "../lib/provider-storage";
import ResolveChain from "../lib/resolve-chain";

class Dummy1 {}
class Dummy2 {}

describe("ResolveChain", () => {
  test("resolve", async () => {
    const storage = new ProviderStorage();
    const chain = new ResolveChain(storage);

    storage.set(Dummy1, (context) => {
      context.response = new Dummy1();

      expect(context.request).toEqual(Dummy1);
    });

    expect(await chain.resolve(Dummy1)).toBeTruthy();
  });

  test("resolve: chaining", async () => {
    const parentStorage = new ProviderStorage();
    const parentChain = new ResolveChain(parentStorage);

    const childStorage = new ProviderStorage();
    const childChain = new ResolveChain(childStorage, parentChain);

    parentStorage.set(Dummy1, (context) => {
      context.response = new Dummy1();
    });

    expect(await childChain.resolve(Dummy1)).toBeTruthy();
  });

  test("resolve: multi provider", async () => {
    const parentStorage = new ProviderStorage();
    const parentChain = new ResolveChain(parentStorage);

    const childStorage = new ProviderStorage();
    const childChain = new ResolveChain(childStorage, parentChain);

    childStorage.set(Dummy1, async (context, next) => {
      await next();
    });
    childStorage.set(Dummy1, async (context, next) => {
      context.response = new Dummy1();
      await next();
    });
    parentStorage.set(Dummy1, () => {
      throw new Error();
    });

    expect(await childChain.resolve(Dummy1)).toBeTruthy();
  });

  test("resolve: nested", async () => {
    const storage = new ProviderStorage();
    const chain = new ResolveChain(storage);

    storage.set(Dummy1, async (context) => {
      await context.resolve(Dummy2);
      context.response = new Dummy1();

      expect(context.request).toEqual(Dummy1);
    });
    storage.set(Dummy2, async (context) => {
      context.response = new Dummy2();

      expect(context.request).toEqual(Dummy2);
      expect(context.parent).toBeTruthy();
      expect(context.parent?.children[0]).toEqual(context);
    });

    expect(await chain.resolve(Dummy1)).toBeTruthy();
  });

  test("resolveOrDefault", async () => {
    const storage = new ProviderStorage();
    const chain = new ResolveChain(storage);

    storage.set(Dummy1, (context) => {
      context.response = new Dummy1();
    });

    expect(await chain.resolveOrDefault(Dummy1, null)).toBeTruthy();
  });

  test("resolveOrDefault: not resolved", async () => {
    const storage = new ProviderStorage();
    const chain = new ResolveChain(storage);

    expect(await chain.resolveOrDefault(Dummy1, null)).toBe(null);
  });
});
