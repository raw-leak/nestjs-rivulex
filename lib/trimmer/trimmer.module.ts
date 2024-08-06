import { Global, Module } from '@nestjs/common';
import { RivulexTrimmerService } from './trimmer.service';
import { ConfigurableModuleClass } from './config.module';

@Global()
@Module({
  providers: [RivulexTrimmerService],
})
export class RivulexTrimmerModule extends ConfigurableModuleClass { }
