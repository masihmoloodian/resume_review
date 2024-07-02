import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: any, req: ExecutionContext) => req.switchToHttp().getRequest().user,
);
