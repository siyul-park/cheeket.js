---
sidebar_position: 1
---

# Container

Containers are managers that manage the creation and lifecycle of objects.  

```typescript
import { Container } from "cheeket";

const container = new Container();
```

A container has a token, which is the key to resolving an object, and a set of middleware that knows how to create it.
By registering tokens and middleware with the container, the container can resolve objects.

```typescript
const LoggerToken = Symbol('Logger') as Token<Logger>;

container.register(LoggerToken, (context) => {
  context.response = (message) => {
    console.log(message);
  };
});
```

Middleware is executed in the order in which it was registered. If you need complex processing to resolve objects, please register additional middleware.

```typescript
const LoggersToken = Symbol('Logger[]') as Token<Logger[]>;

container.register(LoggersToken, async (context, next) => {
  if (context.response === undefined) {
    context.response = [];
  }
  context.response.push((message) => {
    console.log(message);
  });
  
  await next();
});

container.register(LoggersToken, async (context, next) => {
  if (context.response === undefined) {
    context.response = [];
  }
  context.response.push((message) => {
    console.warn(message);
  });

  await next();
});
```

You can add middleware to handle all requests, not just middleware for specific tokens

```typescript
container.use(async (context, next) => {
  console.log(JSON.stringify(context));
  await next();
});
```

A container is also an event emitter. This event emitter has an interface similar to nodejs's event emitter, but responds to Promises.
You can manage the life cycle of an object through events. 
All actions to manage objects are performed through middleware and events

```typescript
import { InternalEvents } from 'cheeket'
import container from "cheeket/dist/container";

container.on(InternalEvents.PreClear, async (value) => {
  if (value === container) { // when clear container
    // TODO
  }
});
```

Containers can create new containers that contain their own middleware but are isolated by creating their own child containers.

```typescript
const child = container.child();
```