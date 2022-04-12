---
sidebar_position: 3
---

# Event

Event provides a way to communicate with middleware. 
The events used internally by cheket are as follows. 
Events that begin with Pre are executed before the default event is imported, and events that begin with post are executed after the default event is imported
```typescript
const InternalEvents = Object.freeze({
  PreClear: 'pre-clear',
  Clear: 'clear',
  PostClear: 'post-clear',

  PreCreate: 'pre-create',
  PostCreate: 'post-create',
});
```

A clear (including pre-clear, post-clear) event sends a cleared object with the value of the event.
```typescript
import { InternalEvents } from "cheeket";

container.on(InternalEvents.PostClear, async (value) => {
  if (value === loggerFactory.get(container)) {
    // TODO
  }
});
```

A create (representing pre-create, post-create) event sends the context used when creating with the value of the event. The reason why there is no create event is because the create process is handled by the factory.
```typescript
container.on(InternalEvents.PostCreate, async (context) => {
  if (context.request !== ChatbotToken) {
    return;
  }

  const strategies = await context.resolve(StrategiesToken);
  strategies.forEach((stratege) => {
    (context.response as ChatBot).register(stratege);
  });
});
```
