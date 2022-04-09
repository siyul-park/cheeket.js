import Context from '../context';
import Next from '../next';

interface BindStrategy<T, U> {
  bind(context: Context<T>, response: U): Promise<void> | void;
  runNext(context: Context<T>, next: Next): Promise<void> | void;
}

export default BindStrategy;
