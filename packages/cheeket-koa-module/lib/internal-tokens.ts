import { Token } from "cheeket";
import { InternalTokens as Parent } from "cheeket-koa";

import Module from "./module";

const InternalTokens = Object.freeze({
  LocalModules: Symbol.for("LocalModules") as Token<Module[]>,
  ...Parent,
});

export default InternalTokens;
