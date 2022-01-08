/* eslint-disable max-classes-per-file */

import { createMockContext } from "@shopify/jest-koa-mocks";
import { Container } from "cheeket";
import { Context } from "koa";
import compose from "koa-compose";
import { ContainerContext, dependency } from "cheeket-koa";

import { InlineModule } from "../lib";

class Dummy1 {}
class Dummy2 {}

describe("InlineModule", () => {
  it("configure: function call", async () => {
    const container = new Container();
    const dependencyMiddleware = dependency(container);

    const globalFunc = jest.fn(() => {});
    const localFunc = jest.fn(() => {});

    const module = new InlineModule({
      configure: {
        global: globalFunc,
        local: localFunc,
      },
    });

    const ctx = createMockContext() as Context & ContainerContext;
    const middleware = compose([dependencyMiddleware, module.modules()]);

    await middleware(ctx, async () => {});

    expect(globalFunc.mock.calls.length).toEqual(1);
    expect(globalFunc.mock.calls[0]).toEqual([container]);
    expect(localFunc.mock.calls.length).toEqual(1);
    expect(localFunc.mock.calls[0]).not.toEqual([container]);

    await middleware(ctx, async () => {});

    expect(globalFunc.mock.calls.length).toEqual(1);
    expect(globalFunc.mock.calls[0]).toEqual([container]);
    expect(localFunc.mock.calls.length).toEqual(2);
    expect(localFunc.mock.calls[0]).not.toEqual([container]);
    expect(localFunc.mock.calls[1]).not.toEqual([container]);
  });

  it("configure: register", async () => {
    const container = new Container();
    const dependencyMiddleware = dependency(container);

    const module = new InlineModule({
      configure: {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        global: (container) => {
          container.register(Dummy1, (context) => {
            context.response = new Dummy1();
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-shadow
        local: (container) => {
          container.register(Dummy2, (context) => {
            context.response = new Dummy2();
          });
        },
      },
    });

    const ctx = createMockContext() as Context & ContainerContext;
    const middleware = compose([dependencyMiddleware, module.modules()]);

    await middleware(ctx, async () => {
      expect(module.isInstalled(container)).toBeTruthy();

      expect(ctx.isRegister(Dummy1)).toBeTruthy();
      expect(ctx.isRegister(Dummy2)).toBeTruthy();

      expect(await ctx.resolve(Dummy1)).toBeInstanceOf(Dummy1);
      expect(await ctx.resolve(Dummy2)).toBeInstanceOf(Dummy2);
    });
  });
});
