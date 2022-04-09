import { Token, InternalTokens as Parent } from 'cheeket';
import Application from 'koa';
import Koa from 'koa';
import { IncomingMessage, ServerResponse } from 'http';
import * as Cookies from 'cookies';
import * as accepts from 'accepts';

const InternalTokens = Object.freeze({
  Application: Symbol('Application') as Token<Application>,
  Context: Symbol('Application.Context') as Token<Koa.Context>,
  Request: Symbol('Application.Request') as Token<Koa.Request>,
  Response: Symbol('Application.Response') as Token<Koa.Response>,
  Req: Symbol('IncomingMessage') as Token<IncomingMessage>,
  Res: Symbol('ServerResponse') as Token<ServerResponse>,
  OriginalUrl: Symbol('OriginalUrl') as Token<string>,
  Cookies: Symbol('Cookies') as Token<Cookies.ICookies>,
  Accepts: Symbol('Accepts') as Token<accepts.Accepts>,
  Respond: Symbol('Respond') as Token<boolean>,
  ...Parent,
});

export default InternalTokens;
