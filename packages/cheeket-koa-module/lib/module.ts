import { Container } from "cheeket";

interface Module {
  configure(container: Container): void;
}

export default Module;
