---
sidebar_position: 1
---

# Introduction

cheeket is a new IoC framework, which aims to be a smaller, more expressive, and more robust foundation. By leveraging async functions, cheeket allows you to inject dependency as async. cheeket allows you to easily extend functionality and manage the lifecycle of your dependencies through middleware and event listeners. 

## Installation
```bash npm2yarn
npm install cheeket
```

## Basic Usage

```typescript
import { Container, Token, InternalEvents, containerScope, asObject, asArray } from 'cheeket';

interface Logger {
  log: (message: string) => void;
}

type Strategy = (message: string) => string | null;

class ChatBot {
  private readonly stategies: Strategy[] = [];
  
  constructor(
    private readonly logger: Logger
  ) {
  }
  
  register(strategy: Strategy): this {
    this.stategies.push(strategy);
    return this;
  }
  
  chat(message: string): string | null {
    this.logger(`request: ${message}`);

    let response: string | null = null;
    for (const statege of this.stategies) {
      response = statege(message);
      if (response !== null) {
        break;
      }
    }
    
    this.logger(`response: ${message}`);
    return response;
  }
}


const LoggerToken = Symbol('Logger') as Token<Logger>;
const StrategiesToken = Symbol('Strategy[]') as Token<Strategy[]>;
const ChatbotToken = Symbol('ChatBot') as Token<ChatBot>;

const loggerFactroy = containerScope<Logger>(() => (message) => {
  console.log(message);
});
const passStrategyFactroy = containerScope<Strategy>(() => (message) => message);
const chatbotFactory = containerScope<ChatBot>(async (context) => {
  const logger = await context.resolve(LoggerToken);
  return new ChatBot(logger);
});


const container = new Container();

container.register(LoggerToken, asObject(loggerFactroy));
container.register(StrategiesToken, asArray(passStrategyFactroy));
container.register(ChatbotToken, asObject(chatbotFactory));

container.on(InternalEvents.PostCreate, async (context) => {
  if (context.request !== ChatbotToken) {
    return;
  }

  const strategies = await context.resolve(StrategiesToken);
  strategies.forEach((stratege) => {
    (context.response as ChatBot).register(stratege);
  });
});


const chatbot = container.resolve(ChatbotToken);
```