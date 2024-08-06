import { Module } from '@nestjs/common';
import { RivulexModule } from "../../lib";

@Module({
  imports: [
    RivulexModule.forRootAsync({
      useFactory: () => {
        return {
          redis: {},
          group: "group",
          defaultStream: "default_stream"
        }
      },
      inject: []
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
