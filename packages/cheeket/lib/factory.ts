import Context from './context';

type Factory<T, U> = (context: Context<T>) => Promise<U> | U;

export default Factory;
