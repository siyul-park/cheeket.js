import { DefaultContext } from 'koa';
import { Register } from 'cheeket';

import MockModule from './mock-module';

export interface InlineMockModuleConfig {
  override?: boolean;
  configure: {
    global: (register: Register) => void;
    local: (register: Register) => void;
  };
}
class InlineMockModule<ContextT = DefaultContext> extends MockModule<ContextT> {
  constructor(private readonly config: InlineMockModuleConfig) {
    super({ override: config.override });
  }

  protected configureGlobal(register: Register): void {
    this.config.configure.global(register);
  }

  protected configureLocal(register: Register): void {
    this.config.configure.local(register);
  }
}

export default InlineMockModule;
