import { Rivulex, Trimmer, RivulexTrimmerConfig } from 'rivulex';
import { Inject, Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from './config.module';

/**
 * The `RivulexTrimmerService` class is responsible for managing the trimming of old messages from Redis streams.
 * It ensures that messages older than a specified retention period are removed at regular intervals.
 * The trimming process is distributed and coordinated using Redis to avoid conflicts between multiple instances.
 */
@Injectable()
export class RivulexTrimmerService implements OnApplicationBootstrap, OnApplicationShutdown {
  private trimmer: Trimmer;
  private readonly logger = new Logger(RivulexTrimmerService.name);

  /**
   * Creates an instance of the `RivulexTrimmerService`.
   * @param {RivulexTrimmerConfig} config - The configuration object for Rivulex trimmer.
   */
  constructor(@Inject(MODULE_OPTIONS_TOKEN) config: RivulexTrimmerConfig) {
    this.trimmer = Rivulex.trimmer(config, this.logger);
  }

  /**
 * This method is called once the application has bootstrapped.
 * It starts the trimmer service to begin trimming old messages from Redis streams.
 */
  async onApplicationBootstrap(): Promise<void> {
    try {
      await this.trimmer.start();
      this.logger.log('Trimmer service started successfully.');
    } catch (error) {
      this.logger.error('Failed to start the trimmer service', (error as Error).stack);
    }
  }

  /**
   * This method is called when the application is shutting down.
   * It stops the trimmer service to ensure a clean shutdown.
   */
  async onApplicationShutdown(): Promise<void> {
    try {
      this.trimmer.stop();
      this.logger.log('Trimmer service stopped successfully.');
    } catch (error) {
      this.logger.error('Failed to stop the trimmer service', (error as Error).stack);
    }
  }
}
