import Application from "koa";
import { interfaces } from "cheeket";
import { IncomingMessage, ServerResponse } from "http";
import * as accepts from "accepts";
import CookiesFunction from "cookies";

export const Context: interfaces.Token<Application.Context> = Symbol(
  "Application.Context"
);

export const Request: interfaces.Token<Application.Request> = Symbol(
  "Application.Request"
);

export const Response: interfaces.Token<Application.Response> = Symbol(
  "Application.Response"
);

export const Req: interfaces.Token<IncomingMessage> = Symbol("IncomingMessage");

export const Res: interfaces.Token<ServerResponse> = Symbol("ServerResponse");

export const OriginalUrl: interfaces.Token<string> = Symbol("originalUrl");

export const Cookies: interfaces.Token<CookiesFunction> = Symbol("Cookies");

export const Accepts: interfaces.Token<accepts.Accepts> = Symbol("Accepts");

export const Respond: interfaces.Token<boolean> = Symbol("Respond");
