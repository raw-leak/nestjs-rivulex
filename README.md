
<div align="center">
  <h1>Rivulex NestJS [in-progress]</h1>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Last Tag](https://img.shields.io/github/v/tag/raw-leak/nestjs-rivulex?label=Last%20Tag)
![Version](https://img.shields.io/npm/v/nestjs-rivulex)
![Dependencies](https://img.shields.io/david/raw-leak/nestjs-rivulex)
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

or

```bash
yarn add nestjs-rivulex
```

## Configuration

### Configure in `main.ts`

Configure the custom transport strategy in your NestJS application's `main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
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
  };

  app.connectMicroservice({
    transport: Transport.CUSTOM,
    options: {
      customTransport: new RivulexTransport(rivulexConfig),
    },
  });

  await app.startAllMicroservices();
  await app.listen(PORT);
}

bootstrap();
```

## Usage

Once configured, use NestJS decorators to define message handlers for specific events. Here's an example using decorators to handle events:

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
    async handleUserCreated(event: Event<UserCreatedPayload, CustomHeaders>, done: Done) {
        const { action, headers, payload, attempt } = event;
        // Handle 'user_created' event
        await done();
    }

    @Action('user_deleted')
    async handleUserDeleted(event: Event<UserDeletedPayload, CustomHeaders>, done: Done) {
        const { action, headers, payload, attempt } = event;
        // Handle 'user_deleted' event
        await done();
    }
}
```

### Decorators

- **`@Stream(streamName: string)`**: Decorate a class to specify the Redis stream name.
- **`@Action(actionName: string)`**: Decorate a method to handle a specific action within the stream.

## Configuration Options

Here's an improved and concise configuration section for the `RivulexSubscriberConfig`, including a reference to the original Rivulex library for more details:

---

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
