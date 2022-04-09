/* eslint-disable no-plusplus,@typescript-eslint/no-loop-func,max-classes-per-file */

import { Container } from '../lib';

class Dummy1 {}
class Dummy2 {}

describe('Container', () => {
  test('resolve', async () => {
    const container = new Container();

    container.register(Dummy1, (context) => {
      context.response = new Dummy1();

      expect(context.request).toEqual(Dummy1);
    });

    expect(await container.resolve(Dummy1)).toBeTruthy();
  });

  test('resolve: chaining', async () => {
    const parent = new Container();
    const child = parent.createChild();

    parent.register(Dummy1, (context) => {
      context.response = new Dummy1();
    });

    expect(await child.resolve(Dummy1)).toBeTruthy();
  });

  test('resolve: multi middleware', async () => {
    const parent = new Container();
    const child = parent.createChild();

    child.register(Dummy1, async (context, next) => {
      await next();
    });
    child.register(Dummy1, async (context, next) => {
      context.response = new Dummy1();
      await next();
    });
    parent.register(Dummy1, () => {
      throw new Error();
    });

    expect(await child.resolve(Dummy1)).toBeTruthy();
  });

  test('resolve: nested', async () => {
    const container = new Container();

    container.register(Dummy1, async (context) => {
      await context.resolve(Dummy2);
      context.response = new Dummy1();

      expect(context.request).toEqual(Dummy1);
    });
    container.register(Dummy2, async (context) => {
      context.response = new Dummy2();

      expect(context.request).toEqual(Dummy2);
      expect(context.parent).toBeTruthy();
      expect(context.parent?.children[0]).toEqual(context);
    });

    expect(await container.resolve(Dummy1)).toBeTruthy();
  });

  test('resolveOrDefault', async () => {
    const container = new Container();

    container.register(Dummy1, (context) => {
      context.response = new Dummy1();
    });

    expect(await container.resolveOrDefault(Dummy1, null)).toBeTruthy();
  });

  test('resolveOrDefault: not resolved', async () => {
    const container = new Container();

    expect(await container.resolveOrDefault(Dummy1, null)).toBe(null);
  });

  test('use', async () => {
    const container = new Container();

    container.use(async (context, next) => {
      context.response = new Dummy1();
      await next();
    });

    expect(await container.resolve(Dummy1)).toBeInstanceOf(Dummy1);

    container.use(async (context, next) => {
      context.response = new Dummy2();
      await next();
    });

    expect(await container.resolve(Dummy2)).toBeInstanceOf(Dummy2);
  });
});
