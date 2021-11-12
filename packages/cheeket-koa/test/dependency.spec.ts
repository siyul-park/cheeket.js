import { createMockContext } from "@shopify/jest-koa-mocks";
import { Container, Token } from "cheeket";
import { Context } from "koa";

import { ContainerContext, dependency, InternalTokens } from "../lib";

describe("dependency", () => {
  it("initialized all member.", async () => {
    const container = new Container();
    const dependencyMiddleware = dependency(container);

    const ctx = createMockContext() as Context & ContainerContext;
    await dependencyMiddleware(ctx, async () => {
      Object.values(InternalTokens).forEach((token: Token<unknown>) => {
        expect(ctx.containers.local.isRegister(token)).toBeTruthy();
      });
    });

    expect(ctx.containers.global).toEqual(container);
    expect(ctx.containers.local).toBeInstanceOf(Container);
    Object.values(InternalTokens).forEach((token: Token<unknown>) => {
      expect(ctx.containers.local.isRegister(token)).toBeFalsy();
    });
  });
});
