/* eslint-disable @typescript-eslint/no-unused-vars */

import { Container } from "cheeket";

abstract class Module {
  configureGlobal(container: Container): void {}

  configureRequest(container: Container): void {}
}

export default Module;
