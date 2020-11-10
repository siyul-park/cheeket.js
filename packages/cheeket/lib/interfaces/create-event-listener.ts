import Context from "./context";

interface CreateEventListener<T> {
  (value: T, context: Context): void | Promise<void>;
}

export default CreateEventListener;
