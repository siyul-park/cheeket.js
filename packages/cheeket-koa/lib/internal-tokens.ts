import { Token, InternalTokens as Parent } from "cheeket";
import Application from "koa";
import Koa from "koa";
import { IncomingMessage, ServerResponse } from "http";
import * as Cookies from "cookies";
import * as accepts from "accepts";

const InternalTokens = Object.freeze({
  Application: Symbol.for("Application") as Token<Application>,
  Context: Symbol.for("Application.Context") as Token<Koa.Context>,
  Request: Symbol.for("Application.Request") as Token<Koa.Request>,
  Response: Symbol.for("Application.Response") as Token<Koa.Response>,
  Req: Symbol.for("IncomingMessage") as Token<IncomingMessage>,
  Res: Symbol.for("ServerResponse") as Token<ServerResponse>,
  OriginalUrl: Symbol.for("OriginalUrl") as Token<string>,
  Cookies: Symbol.for("Cookies") as Token<Cookies>,
  Accepts: Symbol.for("Accepts") as Token<accepts.Accepts>,
  Respond: Symbol.for("Respond") as Token<boolean>,
  ...Parent,
});

export default InternalTokens;
