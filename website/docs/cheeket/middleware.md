---
sidebar_position: 3
---

# Middleware
Middleware defines the process for processing requests. Cheeket creates a context when requested and calls middleware.
```typescript
type Middleware<T> = (context: Context<T>, next: Next) => Promise<void> | void;
```

Cheeket handles all operations as middleware, such as those that inherit the container from the parent container (chain) or those that route middleware to the appropriate token (route).
```
|       | -> next -> |       |
|       |            |       | -> next -> .....
|       |            |       | <--------  .....
|       |            | route | 
|       | <--------- |       |
| chain |            |       |

```
```typescript
function chain(resolver: NestedResolver | undefined): Middleware<unknown> {
  return async (context, next) => {
    await next();

    if (context.response === undefined) {
      context.response = await resolver?.resolve(context.request, context);
    }
  };
}
```
```typescript
function route(storage: MiddlewareStorage): Middleware<unknown> {
  return async (context, next) => {
    await next();

    if (context.response === undefined) {
      const middleware = storage.get(context.request);
      await middleware?.(context, async () => {});
    }
  };
}
```

New solutions can be defined by adding new middleware

```typescript
container.use(mocker.mock());
```