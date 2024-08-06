import { Global, Module } from '@nestjs/common';
import { RivulexPublisherService } from './publisher.service';
import { ConfigurableModuleClass } from './config.module';

@Global()
@Module({
  exports: [RivulexPublisherService],
})
export class RivulexPublisherModule extends ConfigurableModuleClass { }
