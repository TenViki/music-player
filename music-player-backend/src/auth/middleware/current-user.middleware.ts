import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async use(req: Request, res: Response, next: (error?: any) => void) {
    const { authorization } = req.headers;
    if (!authorization) return next();

    try {
      const { id } = jwt.verify(authorization, process.env.JWT_KEY) as {
        id: string;
      };
      req.user = await this.repo.findOne({ where: { id } });
      next();
    } catch (error) {
      return next();
    }
  }
}
