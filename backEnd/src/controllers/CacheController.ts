import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { cacheService } from '../services/CacheService';

export class CacheController extends BaseController {

  public getAllCache = (req: Request, res: Response): void => {
    try {
      const data = cacheService.getAll();
      this.sendSuccess(res, data, 'Caché completa recuperada.');
    } catch (error: any) {
      this.sendError(res, 'Error al obtener la caché', 500, error.message);
    }
  };

  public getByKey = (req: Request, res: Response): void => {
    try {
      const { key } = req.params;
      
      // Intentamos recuperar el elemento directamente. 
      // Si no existe, nuestro CacheService se encargará de gestionar el fallback o retornar null.
      const data = cacheService.get(key);
      
      this.sendSuccess(res, data, `Elemento '${key}' procesado correctamente.`);
    } catch (error: any) {
      this.sendError(res, 'Error al recuperar el elemento', 500, error.message);
    }
  };

  public setCache = (req: Request, res: Response): void => {
    try {
      const { key, value } = req.body;

      if (!key) {
        this.sendError(res, "El campo 'key' es obligatorio en el body", 400);
        return;
      }

      cacheService.set(key, value);
      this.sendSuccess(res, { key, value }, `Elemento '${key}' guardado en caché con éxito.`, 201);
    } catch (error: any) {
      this.sendError(res, 'Error al guardar en caché', 500, error.message);
    }
  };

  public deleteByKey = (req: Request, res: Response): void => {
    try {
      const { key } = req.params;

      // El DELETE sí se puede mantener con verificación o simplemente intentar borrar directamente
      if (!cacheService.has(key)) {
        this.sendError(res, `La llave '${key}' no existe`, 404);
        return;
      }

      cacheService.delete(key);
      this.sendSuccess(res, null, `Elemento '${key}' eliminado de la caché.`);
    } catch (error: any) {
      this.sendError(res, 'Error al eliminar el elemento', 500, error.message);
    }
  };
}