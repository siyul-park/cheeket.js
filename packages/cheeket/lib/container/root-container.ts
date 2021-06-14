import NodeContainer from "./node-container";
import { DefaultState } from "../context";

class RootContainer<State = DefaultState> extends NodeContainer<State> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }
}

export default RootContainer;
