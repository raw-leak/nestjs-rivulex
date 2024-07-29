import { Rivulex, RivulexSubscriberConfig, Subscriber } from 'rivulex';
import { Injectable, Logger } from '@nestjs/common';
import { Server, CustomTransportStrategy } from '@nestjs/microservices';

/**
 * Custom transport strategy for NestJS that integrates with the Rivulex messaging system.
 * This transport layer allows NestJS applications to use Rivulex for message handling and processing.
 */
@Injectable()
export class RivulexTransport extends Server implements CustomTransportStrategy {

  private subscriber: Subscriber;
  private log: Logger;

  /**
   * Constructs a new `RivulexTransport` instance.
   *
   * @param {RivulexSubscriberConfig} config - Configuration for the Rivulex subscriber.
   * @param {Logger} [logger] - Optional custom logger instance. If not provided, a default logger is used.
   */
  constructor(config: RivulexSubscriberConfig, logger?: Logger) {
    super();
    this.log = logger || new Logger(RivulexTransport.name);
    this.subscriber = Rivulex.subscriber(config, this.log);
  }

  /**
   * Initializes the Rivulex subscriber and registers message handlers.
   * This method is called when the microservice starts listening for messages.
   *
   * @param {() => void} done - Callback function to signal that initialization is complete.
   * @returns {Promise<void>}
   */
  public listen = async (done: () => void) => {
    this.log.log('Initializing Rivulex subscriber');

    // Register message handlers
    for (const entry of this.messageHandlers.entries()) {
      const [streamName, action] = entry[0].split(":");
      this.subscriber.streamAction(streamName, action, entry[1]);
      this.log.log(`Registered handlers for stream "${streamName}" and action "${action}"`);
    }

    await this.subscriber.listen();
    this.log.log('Initialized Rivulex subscriber');

    done();
  };

  /**
   * Stops the Rivulex subscriber and cleans up resources.
   * This method is called when the microservice stops listening for messages.
   *
   * @returns {Promise<void>}
   */
  public async close() {
    this.log.log('Stopping Rivulex subscriber');
    if (this.subscriber) {
      await this.subscriber.stop();
    }
    this.log.log('Stopped Rivulex subscriber');
  }
}
