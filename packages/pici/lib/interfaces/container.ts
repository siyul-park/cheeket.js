import ServiceIdentifier from "./service-identifier";
import LookUp from "./look-up";
import BindingToSyntax from "./binding-to-syntax";

interface Container extends LookUp {
  bind<T>(id: ServiceIdentifier<T>): BindingToSyntax<T>;
  unbind<T>(id: ServiceIdentifier<T>): void;

  registerChild<T>(container: Container): void;
}

export default Container;
