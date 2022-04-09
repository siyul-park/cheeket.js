import BindStrategy from './bind-strategy';
import Context from '../context';

function bindObject<T>(): BindStrategy<T, T> {
  return {
    bind(context: Context<T>, response: T): void {
      context.response = response;
    },
    runNext(): void {},
  };
}

export default bindObject;
