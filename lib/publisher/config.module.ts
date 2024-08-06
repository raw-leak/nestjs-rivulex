import { RivulexPublisherConfig } from 'rivulex';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<RivulexPublisherConfig>()
  .setClassMethodName('forRoot')
  .setFactoryMethodName('forRootAsync')
  .build();
