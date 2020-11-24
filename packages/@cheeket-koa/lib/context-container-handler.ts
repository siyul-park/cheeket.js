import OnInitHandler from "./on-init-handler";
import OnCloseHandler from "./on-close-handler";

interface ContextContainerHandler extends OnInitHandler, OnCloseHandler {}

export default ContextContainerHandler;
