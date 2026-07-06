import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new ForbiddenException('دسترسی غیرمجاز.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new ForbiddenException('دسترسی غیرمجاز.');
    }

    try {
      const payload = this.jwtService.verify(token);
      if (!payload.isAdmin) {
        throw new ForbiddenException('دسترسی ادمین الزامی است.');
      }
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('دسترسی ادمین الزامی است.');
    }
  }
}
