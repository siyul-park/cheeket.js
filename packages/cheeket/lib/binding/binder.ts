import Identifier from "../identifier/identifier";
import Provider from "../provider/provider";

interface Binder {
  bind<T>(id: Identifier<T>, provider: Provider<T>): void;

  unbind<T>(id: Identifier<T>): void;
}

export default Binder;
