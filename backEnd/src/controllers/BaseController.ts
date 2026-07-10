import { Response } from 'express';

export class BaseController {
  protected sendSuccess(res: Response, data: any, statusCode: number = 200): void {
    res.status(statusCode).json({
      success: true,
      data
    });
  }

  protected sendError(res: Response, errorDetail: string, statusCode: number = 500): void {
    res.status(statusCode).json({
      success: false,
      errorDetail
    });
  }
}
