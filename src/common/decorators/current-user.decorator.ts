import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RequestUser } from '../types/request-user.type';

type AuthenticatedRequest = Request & {
  user?: RequestUser;
};

export const CurrentUser = createParamDecorator((_: unknown, context: ExecutionContext): RequestUser => {
  const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

  if (!request.user) {
    throw new Error('Authenticated request is missing user.');
  }

  return request.user;
});
