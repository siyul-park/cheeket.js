import OnCloseHandler from "./on-close-handler";
import OnInitHandler from "./on-init-handler";

interface Handler extends OnInitHandler, OnCloseHandler {}

export default Handler;
