import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { cacheService } from '../services/CacheService';
import { RPServer } from '../interfaces/ServerInterfaces';

export class ServerController extends BaseController {

  public getAll = (req: Request, res: Response): void => {
    try {
      const servers = cacheService.getAllServers();

      if (!servers || servers.length === 0) {
        return this.sendError(res, "No hay servidores registrados", 404);
      }

      this.sendSuccess(res, servers); // 200 por defecto
    } catch (error: any) {
      this.sendError(res, error.message || "Error al obtener los servidores", 500);
    }
  };

  public getById = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;

      if (!id) {
        return this.sendError(res, "El parámetro 'id' es obligatorio", 400);
      }

      if (!cacheService.hasServer(id)) {
        return this.sendError(res, `El servidor con ID '${id}' no existe`, 404);
      }

      const server = cacheService.getServer(id);
      this.sendSuccess(res, server); // 200 por defecto
    } catch (error: any) {
      this.sendError(res, error.message || "Error al recuperar el servidor", 500);
    }
  };

  public save = (req: Request, res: Response): void => {
    try {
      const serverData = req.body as RPServer;

      if (!serverData || typeof serverData !== "object") {
        return this.sendError(res, "El cuerpo de la petición debe contener un objeto válido", 400);
      }

      if (!serverData.id || typeof serverData.id !== "string") {
        return this.sendError(res, "El campo 'id' es obligatorio y debe ser un string", 400);
      }

      if (!serverData.title || typeof serverData.title !== "string") {
        return this.sendError(res, "El campo 'title' es obligatorio y debe ser un string", 400);
      }

      cacheService.setServer(serverData.id, serverData);
      this.sendSuccess(res, serverData, 201); // Created
    } catch (error: any) {
      this.sendError(res, error.message || "Error al procesar el servidor", 500);
    }
  };

  public delete = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;

      if (!id) {
        return this.sendError(res, "El parámetro 'id' es obligatorio", 400);
      }

      if (!cacheService.hasServer(id)) {
        return this.sendError(res, `No se encontró el servidor con ID '${id}'`, 404);
      }

      cacheService.deleteServer(id);
      res.status(204).send(); // No Content
    } catch (error: any) {
      this.sendError(res, error.message || "Error al eliminar el servidor", 500);
    }
  };
}
