import { Module } from '@nestjs/common';
import { RivulexTrimmerModule } from '../../lib';

@Module({
  imports: [
    RivulexTrimmerModule.forRootAsync({
      useFactory: async () => ({
        redis: { host: 'localhost', port: 6379 },
        group: 'my-group',
        streams: ['my-default-stream'],
        intervalTime: 86400000, // 24 hours
        retentionPeriod: 604800000, // 7 days
      }),
      inject: [],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
