import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";

export class AuthGuard implements CanActivate {
  // when this function returns truthy value, the request will go through
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.user) throw new ForbiddenException(request.sessionError);
    return request.user;
  }
}
