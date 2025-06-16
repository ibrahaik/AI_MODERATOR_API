import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const apiKeyHeader = req.headers['x-api-key'];
    const validApiKey = this.configService.get<string>('API_KEY');

    if (!apiKeyHeader || apiKeyHeader !== validApiKey) {
      throw new UnauthorizedException('API key missing or invalid');
    }

    next();
  }
}
