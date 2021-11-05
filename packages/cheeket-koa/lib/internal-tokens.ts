import { Token } from "cheeket";
import Application from "koa";

const InternalTokens = Object.freeze({
  Application: Symbol.for("Application") as Token<Application>,
});

export default InternalTokens;
