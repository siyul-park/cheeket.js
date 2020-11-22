import { interfaces } from "cheeket";

interface Handler {
  init(container: interfaces.Container): void;
  close(container: interfaces.Container): void;
}

export default Handler;
