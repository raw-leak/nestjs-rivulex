
<div align="center">
  <h1>Rivulex NestJS [in-progress]</h1>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Last Tag](https://img.shields.io/github/v/tag/raw-leak/nestjs-rivulex?label=Last%20Tag)
![Version](https://img.shields.io/npm/v/nestjs-rivulex)
![Contributors](https://img.shields.io/github/contributors/raw-leak/nestjs-rivulex)
</div>

`nestjs-rivulex` provides a custom transport layer for integrating [Rivulex](https://github.com/raw-leak/rivulex) with NestJS applications. It leverages Rivulex’s Redis Streams-based messaging system and offers an easy-to-use abstraction for event-driven communication in NestJS.

### Key Features
- **At-Least-Once Delivery**: Rivulex ensures that every message is delivered at least once, making it suitable for scenarios where message loss is unacceptable.
- **FIFO Messaging**: Leveraging Redis Streams, Rivulex provides a FIFO (First-In-First-Out) order for message processing, ensuring predictable and reliable message handling.
- **Distributed and Scalable**: Built to handle horizontal scaling, Rivulex supports the creation of consumer groups, allowing you to efficiently scale out your messaging system across multiple instances.
- **Flexible Configuration**: Easily configure timeouts, blocking behavior, retries, and more to tailor the system to your specific needs.
- **Error Handling and Logging**: Integrates customizable error handling and logging, providing insights into message processing and failures.

### Use Cases:
- **Event-Driven Architectures**: Perfect for building systems that rely on events and need reliable message delivery.
- **Microservices**: Facilitates communication between microservices in distributed systems.
- **Real-Time Data Processing**: Suitable for applications that require real-time processing and streaming of data.

With Rivulex, you can build scalable, reliable, and efficient messaging systems that are well-suited for modern distributed environments.


## Rivulex
For more details about Rivulex, including its features and API documentation, visit the Rivulex [GitHub repository](https://github.com/raw-leak/rivulex).

## Installation

To install `nestjs-rivulex`, use npm or yarn:

```bash
npm install nestjs-rivulex
```

## Configuration

### Configure in `main.ts`

Configure the custom transport strategy in your NestJS application's `main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { RivulexTransport, RivulexSubscriberConfig } from 'nestjs-rivulex';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const rivulexConfig: RivulexSubscriberConfig = {
    redis: {
      host: 'localhost',
      port: 6379,
    },
    // Additional configuration options if needed
    group: 'group',
  };

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      strategy: new RivulexTransport(rivulexConfig),
    },
  );

  await app.listen();
}

bootstrap();
```

## Examples

In this section, we will explore different ways of defining handlers in `nestjs-rivulex` using a single abstraction for a specific stream and a single abstraction with StreamAction decorators handling different actions for different streams.

<details>
<summary>More on Examples</summary>

### Single Abstraction for a Specific Stream
In this example, we use the `@Stream` decorator to define a single abstraction that handles multiple actions within a specific stream with `@Action` decorators. This approach is ideal when you want to organize event handlers for all actions associated with a particular stream in one place.

```typescript
import { Done, Event, Action, Stream } from 'nestjs-rivulex';

interface CustomHeaders {
    requestId: string;
    userId: string;
}

interface UserCreatedPayload {
    id: string;
    email: string;
}

interface UserDeletedPayload {
    id: string;
    email: string;
}

@Stream('users')
export class UsersHandlers {

    @Action('user_created')
    async handleUserCreated(event: Event<UserCreatedPayload, CustomHeaders>) {
        const { action, headers, payload, attempt, ack, channel } = event;
        // Handle 'user_created' event
        await ack();
    }

    @Action('user_deleted')
    async handleUserDeleted(event: Event<UserDeletedPayload, CustomHeaders>) {
        const { action, headers, payload, attempt, ack, channel } = event;
        // Handle 'user_deleted' event
         await ack();
    }
}
```

### Single Abstraction Handling Actions for Different Streams
In this example, we use the @StreamAction decorator to define a single abstraction that handles actions for different streams. This approach is useful when you need to manage event handlers for various streams in a single class, avoiding the need to create separate layers for each stream.

```typescript
import { Done, Event, StreamAction, FullEvent, EventPayload, EventId, EventHeaders, EventAttempt, EventAck } from 'nestjs-rivulex';

interface CustomHeaders {
    requestId: string;
    userId: string;
}

interface OrderCreatedPayload {
    orderId: string;
    userId: string;
}

interface PaymentProcessedPayload {
    paymentId: string;
    orderId: string;
}

export class EventHandlers {

    @StreamAction('orders', 'order_created')
    async handleOrderCreated(event: Event<OrderCreatedPayload, CustomHeaders>) {
        // Handle 'order_created' event
        await event.ack();
    }

    @StreamAction('payments', 'payment_processed')
    async handlePaymentProcessed(event: Event<PaymentProcessedPayload, CustomHeaders>) {
        // Handle 'payment_processed' event
        await event.ack();
    }
}

```
</details>

## Decorators

`nestjs-rivulex` provides a comprehensive set of decorators to simplify and abstract the management of stream subscriptions, associating events with specific actions, and working with event parameters. These decorators help you organize your code in a clean and intuitive way, making it easier to define and handle events in your NestJS applications.

<details>
<summary>More on Decorators</summary>

### Class Decorators
**`@Stream(streamName: string)`** Decorate a class to specify the Redis stream name. This decorator indicates that the class contains methods to handle events from the specified Redis stream.


Example:
```typescript
@Stream('users')
export class UsersHandlers {
  // Method handlers
}
```

**Recommendation**: Use the `@Stream` with `@Action` decorators when you want to define a single abstraction to handle events from a specific stream. This approach helps you manage and organize event handlers for all actions within the same stream in a cohesive manner.

### Method Decorators
**`@Action(actionName: string)`** Decorate a method to handle a specific action within the stream.

Example:
```typescript
@Action('user_created')
async handleUserCreated(event: Event<UserCreatedPayload, CustomHeaders>) {
    // Handle 'user_created' event
    await event.ack();
}
```
**`@StreamAction(stream: string, action: string)`** Decorate a class to specify the Redis stream name.

Example:
```typescript
@StreamAction('users', 'user_created')
async handleUserCreated(event: Event<UserCreatedPayload, CustomHeaders>) {
    // Handle 'user_created' event
    await event.ack();
}
```

**Recommendation**: Use the `@StreamAction` decorator when you want a single abstraction to handle actions from different streams. This is particularly useful when you need to handle a few events from various streams. By grouping them together under the same abstraction, you avoid the need to create a separate layer for each stream, leading to a more streamlined and efficient event handling architecture.

### Parameter Decorators
Parameter decorators are used to extract specific parts of the event object and inject them as parameters into your method. If no parameter decorator is used, the entire event object is provided as the first argument.

**`@FullEvent()`** Decorate a method parameter to extract the entire event object. Note that if no parameter decorator is used, the method will receive the full event object as the first argument by default.

Example:
```typescript
async handleUserCreated(@FullEvent() event: Event<UserCreatedPayload, CustomHeaders>) {
    // Handle event
    await event.ack();
}
```

**`@EventPayload()`** Decorate a method parameter to extract the payload from the event.

Example:
```typescript
async handleUserCreated(@EventPayload() payload: UserCreatedPayload) {
    // Handle payload
}
```

**`@EventId()`** Decorate a method parameter to extract the event ID.

Example:
```typescript
async handleUserCreated(@EventId() eventId: string) {
    // Handle payload
}
```
**`@EventHeaders()`** Decorate a method parameter to extract the headers from the event.

Example:
```typescript
async handleUserCreated(@EventHeaders() headers: Headers<CustomHeaders>) {
    // Handle headers
}
```

**`@EventAttempt()`** Decorate a method parameter to extract the attempt number from the event.

Example:
```typescript
async handleUserCreated(@EventAttempt() attempt: number) {
    // Handle attempt number
}
```

**`@EventAck()`** Decorate a method parameter to extract the ack function from the event.
Example:
```typescript
async handleUserCreated(@EventAck() ack: Ack) {
    // Acknowledge event
    await ack();
}
```

### Advance Decorators Example

In this section, we provide advanced examples demonstrating different combinations of class, method, and parameter decorators.

```typescript
import { Done, Event, Action, Stream, StreamAction, Ack } from 'nestjs-rivulex';
import { FullEvent, EventPayload, EventId, EventHeaders, EventAttempt, EventAck } from 'nestjs-rivulex';

interface CustomHeaders {
    requestId: string;
    userId: string;
}

interface UserCreatedPayload {
    id: string;
    email: string;
}

interface UserUpdatedPayload {
    id: string;
    email: string;
    changes: Record<string, any>;
}

interface UserDeletedPayload {
    id: string;
    email: string;
}

@Stream('users')
export class UsersHandlers {

    // Using @FullEvent to handle the entire event
    @Action('user_created')
    async handleUserCreated(
        @FullEvent() event: Event<UserCreatedPayload, CustomHeaders>
    ) {
        const { action, headers, payload, attempt, ack, channel } = event;
        await ack();
    }

    // Extracting specific parts of the event using parameter decorators
    @Action('user_updated')
    async handleUserUpdated(
        @EventPayload() payload: UserUpdatedPayload,
        @EventId() eventId: string,
        @EventHeaders() headers: CustomHeaders,
        @EventAttempt() attempt: number,
        @EventAck() ack: Ack
    ) {
        // Process the update
        await ack();
    }

    // Handling actions for specific stream using @StreamAction
    @StreamAction('users', 'user_deleted')
    async handleUserDeleted(
        @FullEvent() event: Event<UserDeletedPayload, CustomHeaders>,
        @EventPayload() payload: UserDeletedPayload,
        @EventId() eventId: string,
        @EventHeaders() headers: CustomHeaders,
        @EventAttempt() attempt: number,
        @EventAck() ack: () => void
    ) {
        // Process the deletion
        await ack();
    }

    // Handling a complex event with different payload and headers types
    @StreamAction('users', 'user_updated')
    async handleComplexUserUpdate(
        @FullEvent() event: Event<UserUpdatedPayload, CustomHeaders>,
        @EventPayload() payload: UserUpdatedPayload,
        @EventId() eventId: string,
        @EventHeaders() headers: CustomHeaders,
        @EventAttempt() attempt: number,
        @EventAck() ack: () => void
    ) {
        // Handle the update with complex logic
        await ack();
    }
}

```
</details>

## Configuration

### `RivulexSubscriberConfig`

- **`redis`**: Configuration for the Redis connection, including options such as host, port, and authentication details.
- **Additional Options**: Customize settings like `group`, `timeout`, `count`, `block`, and `retries` according to your application's needs.

For a complete list of additional settings and configuration details, visit the [Rivulex documentation](https://github.com/raw-leak/rivulex).

### Custom Logger

You can pass a custom logger to the `RivulexTransport` constructor. The logger should implement NestJS’s `Logger` interface or any custom logger service that adheres to the same API.

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For any issues or support, please open an issue on the [GitHub repository](https://github.com/yourusername/nestjs-rivulex/issues).
