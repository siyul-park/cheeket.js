import Context from "./context";

interface ClearEventListener {
  (context: Context): void | Promise<void>;
}

export default ClearEventListener;
