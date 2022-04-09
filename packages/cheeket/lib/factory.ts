import Context from './context';

type Factory<T> = (context: Context<unknown>) => Promise<T> | T;

export default Factory;
