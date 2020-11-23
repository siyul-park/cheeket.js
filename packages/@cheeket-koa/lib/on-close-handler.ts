import { interfaces } from "cheeket";

interface OnCloseHandler {
  close(container: interfaces.Container): void;
}

export default OnCloseHandler;
