import { interfaces } from "cheeket";

interface OnInitHandler {
  init(container: interfaces.Container): void;
}

export default OnInitHandler;
