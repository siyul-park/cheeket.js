---
sidebar_position: 2
---

# Scope

Scope manages the lifecycle of an object.
To use scope, you need a factory that creates an object

```typescript
import { Factory } from "cheeket";
```
```typescript
type Factory<T> = (context: Context<unknown>) => Promise<T> | T;
```

After implementing the factory, you can give the created object a lifetime through the provided scope decorator.

```typescript
import { containerScope } from "cheeket";

const loggerFactroy = containerScope(() => (message) => {
  console.log(message);
});
```
```typescript
import { requestScope } from "cheeket";

const loggerFactroy = requestScope(() => (message) => {
  console.log(message);
});
```

A factory can be used as middleware through a binder that binds the created object to the context's response appropriately.
```typescript
import { asObject } from "cheeket";

container.register(LoggerToken, asObject(loggerFactory));
```
```typescript
import { asArray } from "cheeket";

container.register(LoggerToken, asArray(loggerFactory));
```

Scope decorator creates objects and emits appropriate events. Also, to manage the lifetime of an object, it listens for appropriate events, clears objects when necessary, and emit appropriate events

```typescript
import { InternalEvents } from "cheeket";

container.on(InternalEvents.PostClear, async (value) => {
  if (value === loggerFactory.get(container)) {
    // TODO
  }
});
```