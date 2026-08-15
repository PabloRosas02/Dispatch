import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { serverService } from '../services/ServerService';
import {
  RPServer,
  BasicInfo,
  AdditionalInfo,
  BannerDetails,
  RuleSection,
  RuleItem
} from '../interfaces/ServerInterfaces';

export class ServerController extends BaseController {

  public getAll = (req: Request, res: Response): void => {
    try {
      const servers = serverService.getAllServers();

      if (!servers?.length) {
        this.sendError(res, "No hay servidores registrados", 404);
        return;
      }

      this.sendSuccess(res, servers);
    } catch (error: unknown) {
      console.error("[ServerController.getAll] Error:", error);
      this.sendError(res, "Error al obtener servidores", 500);
    }
  };

  public getAllIds = (req: Request, res: Response): void => {
    try {
      const servers = serverService.getAllIds();

      if (!servers?.length) {
        this.sendError(res, "No hay servidores registrados", 404);
        return;
      }

      this.sendSuccess(res, servers);
    } catch (error: unknown) {
      console.error("[ServerController.getAllBasic] Error:", error);
      this.sendError(res, "Error al obtener servidores", 500);
    }
  };

  public getAllBasic = (req: Request, res: Response): void => {
    try {
      const servers = serverService.getAllServersBasicInfo();

      if (!servers?.length) {
        this.sendError(res, "No hay servidores registrados", 404);
        return;
      }

      this.sendSuccess(res, servers);
    } catch (error: unknown) {
      console.error("[ServerController.getAllBasic] Error:", error);
      this.sendError(res, "Error al obtener servidores", 500);
    }
  };

  public getAllAddit = (req: Request, res: Response): void => {
    try {
      const servers = serverService.getAllServersAddit();

      if (!servers?.length) {
        this.sendError(res, "No hay servidores registrados", 404);
        return;
      }

      this.sendSuccess(res, servers);
    } catch (error: unknown) {
      console.error("[ServerController.getAllAddit] Error:", error);
      this.sendError(res, "Error al obtener servidores", 500);
    }
  };

  public getAllRulePage = (req: Request, res: Response): void => {
    try {
      const servers = serverService.getAllServersRules();

      if (!servers?.length) {
        this.sendError(res, "No hay servidores registrados", 404);
        return;
      }

      this.sendSuccess(res, servers);
    } catch (error: unknown) {
      console.error("[ServerController.getAllRulePage] Error:", error);
      this.sendError(res, "Error al obtener servidores", 500);
    }
  };

  public saveComplete = (req: Request, res: Response): void => {
    try {
      const serverData = req.body as RPServer;

      if (!serverData?.basic?.id) {
        this.sendError(res, "Estructura inválida. Requiere 'basic.id'", 400);
        return;
      }

      serverService.setServer(serverData.basic.id, serverData);
      this.sendSuccess(res, serverData, 201);
    } catch (error: unknown) {
      console.error("[ServerController.saveComplete] Error:", error);
      const msg = error instanceof Error ? error.message : "Error interno del servidor";
      this.sendError(res, msg, 500);
    }
  };

  public delete = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;

      if (!serverService.hasServer(id)) {
        this.sendError(res, "Servidor no encontrado", 404);
        return;
      }

      serverService.deleteServer(id);
      res.status(204).send();
    } catch (error: unknown) {
      console.error("[ServerController.delete] Error:", error);
      const msg = error instanceof Error ? error.message : "Error al eliminar servidor";
      this.sendError(res, msg, 500);
    }
  };

  public getBasicInfo = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const data = serverService.getServerBasicInfo(id);

      if (!data) {
        this.sendError(res, "Servidor no encontrado", 404);
        return;
      }

      this.sendSuccess(res, data);
    } catch (error: unknown) {
      console.error("[ServerController.getBasicInfo] Error:", error);
      const msg = error instanceof Error ? error.message : "Error de lectura";
      this.sendError(res, msg, 500);
    }
  };

  public updateBasicInfo = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const basicData = req.body as Partial<BasicInfo>;

      if (!basicData ||
        (basicData.title === undefined && basicData.subtitle === undefined)) {
        this.sendError(res, "Datos de 'basic' incompletos (requiere al menos 'title' o 'subtitle')", 400);
        return;
      }

      if (!serverService.hasServer(id)) {
        this.sendError(res, "Servidor no encontrado", 404);
        return;
      }

      serverService.updateServerBasicInfo(id, basicData);
      this.sendSuccess(res, { ms: "Updated" });
    } catch (error: unknown) {
      console.error("[ServerController.updateBasicInfo] Error:", error);
      const msg = error instanceof Error ? error.message : "Error de actualización";
      this.sendError(res, msg, 500);
    }
  };

  public getAdditionalInfo = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const data = serverService.getServerAdditionalInfo(id);

      if (!data) {
        this.sendError(res, "Servidor no encontrado", 404);
        return;
      }

      this.sendSuccess(res, data);
    } catch (error: unknown) {
      console.error("[ServerController.getAdditionalInfo] Error:", error);
      const msg = error instanceof Error ? error.message : "Error de lectura";
      this.sendError(res, msg, 500);
    }
  };

  public updateAdditionalInfo = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const additData = req.body as Partial<AdditionalInfo>;

      // 1. Guard: Ensure at least one valid field is provided
      const hasColor = additData?.color !== undefined;
      const hasDiscord = additData?.discordLink !== undefined;
      const hasDescription = additData?.description !== undefined;

      if (!additData || (!hasColor && !hasDiscord && !hasDescription)) {
        this.sendError(
          res,
          "Datos de 'addit' incompletos (requiere al menos 'color', 'discordLink' o 'description')",
          400
        );
        return;
      }

      if (!serverService.hasServer(id)) {
        this.sendError(res, "Servidor no encontrado", 404);
        return;
      }

      serverService.updateServerAdditionalInfo(id, additData);
      this.sendSuccess(res, { msg: "Updated" });
    } catch (error: unknown) {
      console.error("[ServerController.updateAdditionalInfo] Error:", error);
      const msg = error instanceof Error ? error.message : "Error de actualización";
      this.sendError(res, msg, 500);
    }
  };

  public getBannerDetails = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const data = serverService.getServerBannerDetails(id);

      if (!data) {
        this.sendError(res, "Servidor no encontrado", 404);
        return;
      }

      this.sendSuccess(res, data);
    } catch (error: unknown) {
      console.error("[ServerController.getBannerDetails] Error:", error);
      const msg = error instanceof Error ? error.message : "Error de lectura";
      this.sendError(res, msg, 500);
    }
  };

  public updateBannerDetails = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      // 1. Cast body as Partial to allow updating one, the other, or both
      const bannerData = req.body as Partial<BannerDetails>;

      const hasLabel = bannerData?.bannerLabel !== undefined;
      const hasDescription = bannerData?.bannerDescription !== undefined;

      // 2. Guard: Ensure at least one of the target fields is provided
      if (!bannerData || (!hasLabel && !hasDescription)) {
        this.sendError(
          res,
          "Datos de 'banner' incompletos (requiere al menos 'bannerLabel' o 'bannerDescription')",
          400
        );
        return;
      }

      if (!serverService.hasServer(id)) {
        this.sendError(res, "Servidor no encontrado", 404);
        return;
      }

      serverService.updateServerBannerDetails(id, bannerData);
      this.sendSuccess(res, { msg: "Updated" });
    } catch (error: unknown) {
      console.error("[ServerController.updateBannerDetails] Error:", error);
      const msg = error instanceof Error ? error.message : "Error de actualización";
      this.sendError(res, msg, 500);
    }
  };

  public getVersionAndStatus = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const data = serverService.getServerVersionAndStatus(id);

      if (!data) {
        this.sendError(res, "Servidor no encontrado", 404);
        return;
      }

      this.sendSuccess(res, data);
    } catch (error: unknown) {
      console.error("[ServerController.getVersionAndStatus] Error:", error);
      const msg = error instanceof Error ? error.message : "Error de lectura";
      this.sendError(res, msg, 500);
    }
  };

  public updateVersionAndStatus = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const { status, version } = req.body as { status?: string; version?: string };

      if (status === undefined && version === undefined) {
        this.sendError(res, "Datos de 'ver' incompletos (requiere 'status' o 'version')", 400);
        return;
      }

      if (!serverService.hasServer(id)) {
        this.sendError(res, "Servidor no encontrado", 404);
        return;
      }

      serverService.updateServerVersionAndStatus(id, version, status);
      this.sendSuccess(res, { msg: "Updated" });
    } catch (error: unknown) {
      console.error("[ServerController.updateVersionAndStatus] Error:", error);
      const msg = error instanceof Error ? error.message : "Error de actualización";
      this.sendError(res, msg, 500);
    }
  };

  public updateStatus = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const { status } = req.body as { status?: string };

      if (!status) {
        this.sendError(res, "El campo 'status' es obligatorio", 400);
        return;
      }

      //serverService.updateServerStatus(id, status);
      const updatedVer = serverService.getServerVersionAndStatus(id);
      this.sendSuccess(res, { message: "Estado actualizado con éxito", ver: updatedVer });
    } catch (error: unknown) {
      console.error("[ServerController.updateStatus] Error:", error);
      const msg = error instanceof Error ? error.message : "Error al actualizar estado";
      this.sendError(res, msg, 500);
    }
  };

  public getSections = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;

      if (!serverService.hasServer(id)) {
        this.sendError(res, "Servidor no encontrado", 404);
        return;
      }

      const data = serverService.getServerSections(id);
      this.sendSuccess(res, data);
    } catch (error: unknown) {
      console.error("[ServerController.getSections] Error:", error);
      const msg = error instanceof Error ? error.message : "Error de lectura";
      this.sendError(res, msg, 500);
    }
  };

  public updateSections = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const sectionsData = req.body as RuleSection[];

      if (!Array.isArray(sectionsData)) {
        this.sendError(res, "El cuerpo de 'sections' debe ser un Array de RuleSection", 400);
        return;
      }

      const srv = serverService.getServer(id);
      if (!srv) {
        this.sendError(res, "Servidor no encontrado", 404);
        return;
      }

      srv.sections = sectionsData;
      serverService.setServer(id, srv);

      this.sendSuccess(res, { message: "Miembro 'sections' reemplazado con éxito", sections: sectionsData });
    } catch (error: unknown) {
      console.error("[ServerController.updateSections] Error:", error);
      const msg = error instanceof Error ? error.message : "Error de guardado";
      this.sendError(res, msg, 500);
    }
  };
}
