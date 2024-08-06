import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const FullEvent = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const args = ctx.getArgs();
    return args[0];
  },
);
