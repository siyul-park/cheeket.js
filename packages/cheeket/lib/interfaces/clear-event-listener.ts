import Container from "./container";

interface ClearEventListener {
  (context: Container): void | Promise<void>;
}

export default ClearEventListener;
