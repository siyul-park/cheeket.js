import Factory from '../factory';
import Middleware from '../middleware';

type Binder<T, U> = (factory: Factory<T>) => Middleware<U>;

export default Binder;
