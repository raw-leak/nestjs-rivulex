import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { RivulexTransport, RivulexSubscriberConfig } from 'nestjs-rivulex';

async function bootstrap() {
    const rivulexConfig: RivulexSubscriberConfig = {
        redis: {
            host: 'localhost',
            port: 6379,
        },
        // Additional configuration options if needed
    };

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        strategy: new RivulexTransport(rivulexConfig),
    });

    await app.listen();
}

bootstrap();