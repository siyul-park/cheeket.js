---
sidebar_position: 2
---

# Context
context represents the context that restores the value. In the context, the request value must be connected to the token value delivered at the time of the resolve request, and the response must be connected to the object to respond to the resolve.
```typescript
interface Context<T> extends Resolver {
  request: Token<T>;
  response: T | undefined;

  parent: Context<unknown> | undefined;
  children: Context<unknown>[];
}
```

The context also implements a resolver, and you can resolve the object again within the context. When resolve, a new object is created that has the requested context as the parent context.
```typescript
const other = await context.resolve(OtherToken);
```