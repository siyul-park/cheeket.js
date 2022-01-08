/* eslint-disable max-classes-per-file */

import { createMockContext } from "@shopify/jest-koa-mocks";
import { Container } from "cheeket";
import { Context } from "koa";
import compose from "koa-compose";
import { ContainerContext, dependency } from "cheeket-koa";
import { InlineModule } from "cheeket-koa-module";

import { InlineMockModule } from "../lib";

class Dummy1 {}
class Dummy2 {}

describe("InlineMockModule", () => {
  it("configure: function call", async () => {
    const container = new Container();
    const dependencyMiddleware = dependency(container);

    const globalFunc = jest.fn(() => {});
    const localFunc = jest.fn(() => {});

    const module = new InlineMockModule({
      configure: {
        global: globalFunc,
        local: localFunc,
      },
    });

    const ctx = createMockContext() as Context & ContainerContext;
    const middleware = compose([dependencyMiddleware, module.modules()]);

    await middleware(ctx, async () => {});

    expect(globalFunc.mock.calls.length).toEqual(1);
    expect(localFunc.mock.calls.length).toEqual(1);

    await middleware(ctx, async () => {});

    expect(globalFunc.mock.calls.length).toEqual(1);
    expect(localFunc.mock.calls.length).toEqual(1);
  });

  it("configure: register", async () => {
    const container = new Container();
    const dependencyMiddleware = dependency(container);

    const module = new InlineMockModule({
      configure: {
        global: (register) => {
          register.register(Dummy1, (context) => {
            context.response = new Dummy1();
          });
        },
        local: (register) => {
          register.register(Dummy2, (context) => {
            context.response = new Dummy2();
          });
        },
      },
    });

    const ctx = createMockContext() as Context & ContainerContext;
    const middleware = compose([dependencyMiddleware, module.modules()]);

    await middleware(ctx, async () => {
      expect(module.isInstalled(container)).toBeTruthy();

      expect(ctx.isRegister(Dummy1)).toBeFalsy();
      expect(ctx.isRegister(Dummy2)).toBeFalsy();

      expect(await ctx.resolve(Dummy1)).toBeInstanceOf(Dummy1);
      expect(await ctx.resolve(Dummy2)).toBeInstanceOf(Dummy2);
    });
  });

  it("configure: override", async () => {
    const container = new Container();
    const dependencyMiddleware = dependency(container);

    const mockDummy1 = new Dummy1();
    const mockDummy2 = new Dummy2();

    const mockModule = new InlineMockModule({
      configure: {
        global: (register) => {
          register.register(Dummy1, (context) => {
            context.response = mockDummy1;
          });
        },
        local: (register) => {
          register.register(Dummy2, (context) => {
            context.response = mockDummy2;
          });
        },
      },
    });

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
    const middleware = compose([dependencyMiddleware, mockModule.modules(), module.modules()]);

    await middleware(ctx, async () => {
      expect(module.isInstalled(container)).toBeTruthy();

      expect(ctx.isRegister(Dummy1)).toBeTruthy();
      expect(ctx.isRegister(Dummy2)).toBeTruthy();

      expect(await ctx.resolve(Dummy1)).toEqual(mockDummy1);
      expect(await ctx.resolve(Dummy2)).toEqual(mockDummy2);
    });
  });
});
