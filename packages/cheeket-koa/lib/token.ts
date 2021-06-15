import Koa from "koa";
import { IncomingMessage, ServerResponse } from "http";
import * as accepts from "accepts";
import * as Cookies from "cookies";
import { Token } from "cheeket";

// eslint-disable-next-line @typescript-eslint/no-redeclare
const Token = Object.freeze({
  Application: Symbol("Application") as Token<Koa>,
  Context: Symbol("Application.Context") as Token<Koa.Context>,
  Request: Symbol("Application.Request") as Token<Koa.Request>,
  Response: Symbol("Application.Response") as Token<Koa.Response>,
  Req: Symbol("IncomingMessage") as Token<IncomingMessage>,
  Res: Symbol("ServerResponse") as Token<ServerResponse>,
  OriginalUrl: Symbol("OriginalUrl") as Token<string>,
  Cookies: Symbol("Cookies") as Token<Cookies>,
  Accepts: Symbol("Accepts") as Token<accepts.Accepts>,
  Respond: Symbol("Respond") as Token<boolean>,
});

export default Token;
