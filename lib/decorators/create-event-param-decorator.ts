import { Event } from 'rivulex';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export function createEventParamDecorator(key: string): ParameterDecorator {
  return createParamDecorator((_: unknown, ctx: ExecutionContext) => {
    const event = ctx.getArgByIndex(0) as Event<any, any>
    return event[key];
  });
}
