import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Event } from 'rivulex';

export function createEventParamDecorator(key: string) {
  return createParamDecorator(
    (_: unknown, ctx: ExecutionContext) => {
      const event = ctx.getArgByIndex(0) as Event<any, any>;
      return event && event[key] !== undefined ? event[key] : undefined;
    },
  );
}