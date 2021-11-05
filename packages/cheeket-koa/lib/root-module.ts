import { Container, Done, InternalEvents } from "cheeket";
import NestedModule from "./nested-module";

class RootModule extends NestedModule {
  configureGlobal(container: Container): void {
    container.addListener(InternalEvents.CreateAsync, async (value: unknown, done: Done) => {
      if (value instanceof NestedModule) {
        const children = await Promise.all(value.children.map((it) => container.resolve(it)));
        children.forEach((it) => {
          it.configureGlobal(container);
        });
      }

      done();
    });
  }

  configureLocal(container: Container): void {
    container.addListener(InternalEvents.CreateAsync, async (value: unknown, done: Done) => {
      if (value instanceof NestedModule) {
        const children = await Promise.all(value.children.map((it) => container.resolve(it)));
        children.forEach((it) => {
          it.configureLocal(container);
        });
      }

      done();
    });
  }
}

export default RootModule;
