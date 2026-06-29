import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { cacheService } from '../services/CacheService';
import { RPServer } from '../interfaces/ServerInterfaces';

export class ServerController extends BaseController {

  public getAll = (req: Request, res: Response): void => {
    try {
      const servers = cacheService.getAllServers();
      this.sendSuccess(res, servers, 'Lista de servidores recuperada.');
    } catch (error: any) {
      this.sendError(res, 'Error al obtener los servidores', 500, error.message);
    }
  };

  public getById = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;

      if (!cacheService.hasServer(id)) {
        this.sendError(res, `El servidor con ID '${id}' no existe en la caché`, 404);
        return;
      }

      const server = cacheService.getServer(id);
      this.sendSuccess(res, server, `Servidor '${id}' recuperado.`);
    } catch (error: any) {
      this.sendError(res, 'Error al recuperar el servidor', 500, error.message);
    }
  };

  public save = (req: Request, res: Response): void => {
    try {
      const serverData = req.body as RPServer;

      if (!serverData.id || !serverData.title) {
        this.sendError(res, "Los campos 'id' y 'title' son obligatorios para registrar el servidor", 400);
        return;
      }

      cacheService.setServer(serverData.id, serverData);
      this.sendSuccess(res, serverData, `Servidor '${serverData.title}' guardado con éxito en la caché.`, 201);
    } catch (error: any) {
      this.sendError(res, 'Error al procesar el servidor', 500, error.message);
    }
  };

  public delete = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;

      if (!cacheService.hasServer(id)) {
        this.sendError(res, `No se encontró el servidor con ID '${id}'`, 404);
        return;
      }

      cacheService.deleteServer(id);
      this.sendSuccess(res, null, `Servidor con ID '${id}' eliminado correctamente.`);
    } catch (error: any) {
      this.sendError(res, 'Error al eliminar el servidor', 500, error.message);
    }
  };
}