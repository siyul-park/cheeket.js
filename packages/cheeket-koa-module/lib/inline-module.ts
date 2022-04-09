import { DefaultContext } from 'koa';
import SimpleModule from './simple-module';
import { Container } from 'cheeket';

export interface InlineModuleConfig {
  override?: boolean;
  configure: {
    global: (container: Container) => void;
    local: (container: Container) => void;
  };
}
class InlineModule<ContextT = DefaultContext> extends SimpleModule<ContextT> {
  constructor(private readonly config: InlineModuleConfig) {
    super(config);
  }

  protected configureGlobal(container: Container): void {
    this.config.configure.global(container);
  }

  protected configureLocal(container: Container): void {
    this.config.configure.local(container);
  }
}

export default InlineModule;
