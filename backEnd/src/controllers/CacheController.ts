import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { cacheService } from '../services/CacheService';

export class CacheController extends BaseController {

  public getAllCache = (req: Request, res: Response): void => {
    try {
      const data = cacheService.getAll();

      if (!data || Object.keys(data).length === 0) {
        return this.sendError(res, "No hay elementos en caché", 404);
      }

      this.sendSuccess(res, data); // 200 por defecto
    } catch (error: any) {
      this.sendError(res, error.message || "Error al obtener la caché", 500);
    }
  };

  public getByKey = (req: Request, res: Response): void => {
    try {
      const { key } = req.params;

      if (!key) {
        return this.sendError(res, "El parámetro 'key' es obligatorio", 400);
      }

      const data = cacheService.get(key);

      if (!data) {
        return this.sendError(res, `Elemento '${key}' no encontrado`, 404);
      }

      this.sendSuccess(res, data); // 200 por defecto
    } catch (error: any) {
      this.sendError(res, error.message || "Error al recuperar el elemento", 500);
    }
  };

  public setCache = (req: Request, res: Response): void => {
    try {
      const { key, value } = req.body;

      if (!key || typeof key !== "string") {
        return this.sendError(res, "El campo 'key' es obligatorio y debe ser un string", 400);
      }

      if (value === undefined || value === null) {
        return this.sendError(res, "El campo 'value' es obligatorio", 400);
      }

      cacheService.set(key, value);
      this.sendSuccess(res, { key, value }, 201); // Created
    } catch (error: any) {
      this.sendError(res, error.message || "Error al guardar en caché", 500);
    }
  };

  public deleteByKey = (req: Request, res: Response): void => {
    try {
      const { key } = req.params;

      if (!key) {
        return this.sendError(res, "El parámetro 'key' es obligatorio", 400);
      }

      if (!cacheService.has(key)) {
        return this.sendError(res, `La llave '${key}' no existe`, 404);
      }

      cacheService.delete(key);
      res.status(204).send(); // No Content
    } catch (error: any) {
      this.sendError(res, error.message || "Error al eliminar el elemento", 500);
    }
  };
}
