import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../config/metadata';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const token = this.getAuthenticationToken(context);

    const user = await this.authService.validateToken(token);

    if (!user) throw new UnauthorizedException('Invalid Authentication Token');

    context.switchToHttp().getRequest().user = user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (!token) {
      throw new UnauthorizedException(
        'No value was provided for Authentication',
      );
    }

    if (type !== 'Bearer') {
      throw new UnauthorizedException(
        'Authentication type must be Bearer token',
      );
    }
    return type === 'Bearer' ? token : undefined;
  }

  private getAuthenticationToken(context: ExecutionContext) {
    return this.extractTokenFromHeader(context.switchToHttp().getRequest());
  }
}
