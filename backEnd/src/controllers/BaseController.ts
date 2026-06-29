import { Response } from 'express';

export abstract class BaseController {
  
  protected sendSuccess(res: Response, data: any, message = 'Operación exitosa', statusCode = 200): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  protected sendError(res: Response, message = 'Ocurrió un error en el servidor', statusCode = 500, errorDetails: any = null): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      error: errorDetails
    });
  }
}