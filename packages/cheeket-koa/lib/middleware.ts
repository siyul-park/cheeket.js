import * as Koa from 'koa';

import ContainerContext from './container-context';

type Middleware<StateT = Koa.DefaultState, ContextT = Koa.DefaultContext, ResponseBodyT = any> = Koa.Middleware<
StateT,
ContextT & ContainerContext,
ResponseBodyT
>;

export default Middleware;
