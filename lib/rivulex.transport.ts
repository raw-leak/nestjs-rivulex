import { Rivulex, Subscriber } from 'rivulex';
import { Injectable, Logger } from '@nestjs/common';
import { Server, CustomTransportStrategy } from '@nestjs/microservices';

interface RivulexTransportConfig {
  redis: any
}

@Injectable()
export class RivulexTransport extends Server implements CustomTransportStrategy {

  private subscriber: Subscriber;
  private log = new Logger(RivulexTransport.name);

  constructor(config: RivulexTransportConfig) {
    super();
    this.subscriber = Rivulex.subscriber({ redis: config.redis });
  }

  listen = async (done: () => void) => {
    this.log.log('Initializing rivulex subscriber');

    for (const entry of this.messageHandlers.entries()) {
      const [streamName, action] = entry[0].split(":")
      this.subscriber.streamAction(streamName, action, entry[1])
      this.log.log(`Registered handlers for stream "${streamName}" and action "${action}"`);
    }

    await this.subscriber.listen()
    this.log.log('Initialized rivulex subscriber');

    done();
  };

  public async close() {
    this.log.log('Stopping rivulex subscriber');
    if (this.subscriber) {
      // await this.subscriber.close()//TODO:
    }
    this.log.log('Stopped');
  }
}
