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