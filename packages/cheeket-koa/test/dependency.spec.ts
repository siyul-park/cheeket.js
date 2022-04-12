import { createMockContext } from '@shopify/jest-koa-mocks';
import { Container, Token } from 'cheeket';
import { Context } from 'koa';
import compose from 'koa-compose';

import { ContainerContext, dependency, InternalTokens } from '../lib';

describe('dependency', () => {
  it('default', async () => {
    const container = new Container();
    const dependencyMiddleware = dependency(container);

    const ctx = createMockContext() as Context & ContainerContext;
    await dependencyMiddleware(ctx, async () => {
      Object.values(InternalTokens).forEach((token: Token<unknown>) => {
        expect(ctx.isRegister(token)).toBeTruthy();
      });

      expect(ctx.containers.global).toEqual(container);
      expect(ctx.containers.local).toBeInstanceOf(Container);
    });

    expect(ctx.containers?.global).toBeUndefined();
    expect(ctx.containers?.local).toBeUndefined();
    expect(ctx.containers).toBeUndefined();
  });

  it('options.override: true, pre initialized: false', async () => {
    const container = new Container();
    const dependencyMiddleware = dependency(container, { override: true });

    const ctx = createMockContext() as Context & ContainerContext;
    await dependencyMiddleware(ctx, async () => {
      Object.values(InternalTokens).forEach((token: Token<unknown>) => {
        expect(ctx.isRegister(token)).toBeTruthy();
      });

      expect(ctx.containers.global).toEqual(container);
      expect(ctx.containers.local).toBeInstanceOf(Container);
    });

    expect(ctx.containers?.global).toBeUndefined();
    expect(ctx.containers?.local).toBeUndefined();
    expect(ctx.containers).toBeUndefined();
  });

  it('options.override: true, pre initialized: true', async () => {
    const container1 = new Container();
    const container2 = new Container();

    const dependencyMiddleware = compose<Context & ContainerContext>([
      dependency(container1),
      async (ctx, next) => {
        expect(ctx.containers.global).toEqual(container1);
        expect(ctx.containers.local).toBeInstanceOf(Container);

        const local = ctx.containers.local;

        await next();

        expect(ctx.containers.global).toEqual(container1);
        expect(ctx.containers.local).toEqual(local);
      },
      dependency(container2, { override: true }),
    ]);

    const ctx = createMockContext() as Context & ContainerContext;
    await dependencyMiddleware(ctx, async () => {
      Object.values(InternalTokens).forEach((token: Token<unknown>) => {
        expect(ctx.isRegister(token)).toBeTruthy();
      });

      expect(ctx.containers.global).toEqual(container2);
      expect(ctx.containers.local).toBeInstanceOf(Container);
    });

    expect(ctx.containers?.global).toBeUndefined();
    expect(ctx.containers?.local).toBeUndefined();
    expect(ctx.containers).toBeUndefined();
  });

  it('options.override: false, pre initialized: false', async () => {
    const container = new Container();
    const dependencyMiddleware = dependency(container, { override: false });

    const ctx = createMockContext() as Context & ContainerContext;
    await dependencyMiddleware(ctx, async () => {
      Object.values(InternalTokens).forEach((token: Token<unknown>) => {
        expect(ctx.isRegister(token)).toBeTruthy();
      });

      expect(ctx.containers.global).toEqual(container);
      expect(ctx.containers.local).toBeInstanceOf(Container);
    });

    expect(ctx.containers?.global).toBeUndefined();
    expect(ctx.containers?.local).toBeUndefined();
    expect(ctx.containers).toBeUndefined();
  });

  it('options.override: false, pre initialized: true', async () => {
    const container1 = new Container();
    const container2 = new Container();

    const dependencyMiddleware = compose<Context & ContainerContext>([
      dependency(container1),
      async (ctx, next) => {
        expect(ctx.containers.global).toEqual(container1);
        expect(ctx.containers.local).toBeInstanceOf(Container);

        const local = ctx.containers.local;

        await next();

        expect(ctx.containers.global).toEqual(container1);
        expect(ctx.containers.local).toEqual(local);
      },
      dependency(container2, { override: false }),
    ]);

    const ctx = createMockContext() as Context & ContainerContext;
    await dependencyMiddleware(ctx, async () => {
      Object.values(InternalTokens).forEach((token: Token<unknown>) => {
        expect(ctx.isRegister(token)).toBeTruthy();
      });

      expect(ctx.containers.global).toEqual(container1);
      expect(ctx.containers.local).toBeInstanceOf(Container);
    });

    expect(ctx.containers?.global).toBeUndefined();
    expect(ctx.containers?.local).toBeUndefined();
    expect(ctx.containers).toBeUndefined();
  });
});
