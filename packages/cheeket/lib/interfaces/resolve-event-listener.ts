import Context from "./context";

interface ResolveEventListener {
  (context: Context): void | Promise<void>;
}

export default ResolveEventListener;
