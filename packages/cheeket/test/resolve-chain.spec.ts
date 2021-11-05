import ProviderStorage from "../lib/provider-storage";
import ResolveProcessor from "../lib/resolve-processor";
import InternalTokens from "../lib/internal-tokens";

class Dummy1 {}
class Dummy2 {}

describe("ResolveChain", () => {
  test("resolve", async () => {
    const storage = new ProviderStorage();
    const chain = new ResolveProcessor(storage);

    storage.set(Dummy1, (context) => {
      context.response = new Dummy1();

      expect(context.request).toEqual(Dummy1);
    });

    expect(await chain.resolve(Dummy1)).toBeTruthy();
  });

  test("resolve: chaining", async () => {
    const parentStorage = new ProviderStorage();
    const parentChain = new ResolveProcessor(parentStorage);

    const childStorage = new ProviderStorage();
    const childChain = new ResolveProcessor(childStorage);

    childStorage.set(InternalTokens.PostProcess, async (context, next) => {
      context.response = await parentChain.resolve(context.request, context);
      await next();
    });

    parentStorage.set(Dummy1, (context) => {
      context.response = new Dummy1();
    });

    expect(await childChain.resolve(Dummy1)).toBeTruthy();
  });

  test("resolve: multi provider", async () => {
    const parentStorage = new ProviderStorage();
    const parentChain = new ResolveProcessor(parentStorage);

    const childStorage = new ProviderStorage();
    const childChain = new ResolveProcessor(childStorage);

    childStorage.set(InternalTokens.PostProcess, async (context, next) => {
      context.response = await parentChain.resolve(context.request, context);
      await next();
    });

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
    const chain = new ResolveProcessor(storage);

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
    const chain = new ResolveProcessor(storage);

    storage.set(Dummy1, (context) => {
      context.response = new Dummy1();
    });

    expect(await chain.resolveOrDefault(Dummy1, null)).toBeTruthy();
  });

  test("resolveOrDefault: not resolved", async () => {
    const storage = new ProviderStorage();
    const chain = new ResolveProcessor(storage);

    expect(await chain.resolveOrDefault(Dummy1, null)).toBe(null);
  });
});
