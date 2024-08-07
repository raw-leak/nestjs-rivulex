import { Module } from '@nestjs/common';
import { RivulexPublisherModule } from "../../lib";

@Module({
  imports: [
    RivulexPublisherModule.forRootAsync({
      useFactory: () => {
        return {
          redis: {},
          group: "group",
          defaultStream: "default_stream",
          // setting trimmer (optional, read more about Trimmer)
          trimmer: {
            group: "group",
            streams: ["default_stream"],
            intervalTime: 86400000, // 24 hours
            retentionPeriod: 604800000, // 7 days
          }
        }
      },
      inject: []
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
