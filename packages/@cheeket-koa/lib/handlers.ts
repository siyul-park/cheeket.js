import OnInitHandler from "./on-init-handler";
import Handler from "./handler";

interface Handlers {
  global: OnInitHandler;
  local: Handler;
}

export default Handlers;
