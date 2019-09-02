import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();

    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = {
      status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message.error || exception.message,
    };

    Logger.error(
      `${request.method} ${request.url}`,
      `ERROR OCCURED: ${exception.message.error || exception.message}`,
      'ExceptionFilter',
    );

    response.status(status).json(errorResponse);
  }
}
