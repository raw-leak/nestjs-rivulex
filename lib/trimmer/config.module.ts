
import { RivulexTrimmerConfig } from 'rivulex';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<RivulexTrimmerConfig>()
  .setClassMethodName('forRoot')
  .setFactoryMethodName('forRootAsync')
  .build();
