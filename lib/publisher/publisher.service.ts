import { Publisher, Rivulex, RivulexPublisherConfig } from 'rivulex';
import { Inject, Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from './config.module';

/**
 * The `RivulexPublisherService` class provides methods to publish events to a stream using the Rivulex library.
 * This service is designed to be used within a NestJS application and handles both single and batch event publishing.
 */
@Injectable()
export class RivulexPublisherService implements OnApplicationShutdown {
  private publisher: Publisher;
  private readonly logger = new Logger(RivulexPublisherService.name);

  /**
  * Creates an instance of the `PublisherService`.
  * @param {RivulexPublisherConfig} config - The configuration object for Rivulex publisher.
  */
  constructor(@Inject(MODULE_OPTIONS_TOKEN) config: RivulexPublisherConfig) {
    this.publisher = Rivulex.publisher(config, this.logger);
  }

  /**
  * Publishes a single event to a specified stream.
  * @param {string} stream - The stream to which the event will be published.
  * @param {string} action - The action associated with the event.
  * @param {P} payload - The payload of the event.
  * @param {H} [headers] - Optional headers for the event.
  * @returns {Promise<string>} - A promise that resolves to the ID of the published event.
  */
  public async publish<P extends Record<any, any>, H extends Record<any, any>>(stream: string, action: string, payload: P, headers?: H): Promise<string> {
    return this.publisher.publish(stream, action, payload, headers)
  }

  public async publishBatch<P extends Record<any, any>, H extends Record<any, any>>(events: Array<{
    action: string;
    payload: P;
    headers: H;
  }>): Promise<Array<{
    ok: boolean;
    id?: string;
    error: Error | null;
  }>> {
    return this.publisher.publishBatch(events)
  }

  onApplicationShutdown() {
    return this.publisher.stop()
  }
}
