import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { serverService } from '../services/ServerService';
import {
  RPServer,
  BasicInfo,
  AdditionalInfo,
  BannerDetails,
  VersionAndStatus,
  RuleSection,
  RuleItem
} from '../interfaces/ServerInterfaces';

export class ServerController extends BaseController {

  public getAll = (req: Request, res: Response): void => {
    try {
      const servers = serverService.getAllServers();
      if (!servers || servers.length === 0) return this.sendError(res, "No hay servidores registrados", 404);
      this.sendSuccess(res, servers);
    } catch (error: any) {
      this.sendError(res, error.message || "Error al obtener servidores", 500);
    }
  };

  public getAllBasic = (req: Request, res: Response): void => {
    try {
      const servers = serverService.getAllServersBasicInfo();
      if (!servers || servers.length === 0) return this.sendError(res, "No hay servidores registrados", 404);
      this.sendSuccess(res, servers);
    } catch (error: any) {
      this.sendError(res, error.message || "Error al obtener servidores", 500);
    }
  };

  public getAllAddit = (req: Request, res: Response): void => {
    try {
      const servers = serverService.getAllServersAddit();
      if (!servers || servers.length === 0) return this.sendError(res, "No hay servidores registrados", 404);
      this.sendSuccess(res, servers);
    } catch (error: any) {
      this.sendError(res, error.message || "Error al obtener servidores", 500);
    }
  };

  public getAllRulePage = (req: Request, res: Response): void => {
    try {
      const servers = serverService.getAllServersRules();
      if (!servers || servers.length === 0) return this.sendError(res, "No hay servidores registrados", 404);
      this.sendSuccess(res, servers);
    } catch (error: any) {
      this.sendError(res, error.message || "Error al obtener servidores", 500);
    }
  };


  public saveComplete = (req: Request, res: Response): void => {
    try {
      const serverData = req.body;
      if (!serverData?.basic?.id) return this.sendError(res, "Estructura inválida. Requiere 'basic.id'", 400);

      serverService.setServer(serverData.basic.id, serverData);
      this.sendSuccess(res, serverData, 201);
    } catch (error: any) {
      this.sendError(res, error.message, 500);
    }
  };

  public delete = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      if (!serverService.hasServer(id)) return this.sendError(res, "Servidor no encontrado", 404);

      serverService.deleteServer(id);
      res.status(204).send();
    } catch (error: any) {
      this.sendError(res, error.message, 500);
    }
  };

  // 1. MIEMBRO: BASIC INFO (basic)
  public getBasicInfo = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const data = serverService.getServerBasicInfo(id);
      if (!data) return this.sendError(res, "Servidor no encontrado", 404);
      this.sendSuccess(res, data);
    } catch (error: any) {
      this.sendError(res, error.message, 500);
    }
  };

  public updateBasicInfo = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const basicData = req.body as BasicInfo;

      if (!basicData || !basicData.title || !basicData.filename) {
        return this.sendError(res, "Datos de 'basic' incompletos (requiere title y filename)", 400);
      }

      serverService.updateServerBasicInfo(id, basicData);
      this.sendSuccess(res, { message: "Miembro 'basic' actualizado con éxito", basic: basicData });
    } catch (error: any) {
      this.sendError(res, error.message, 500);
    }
  };

  // 2. MIEMBRO: ADDITIONAL INFO (addit)
  public getAdditionalInfo = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const data = serverService.getServerAdditionalInfo(id);
      if (!data) return this.sendError(res, "Servidor no encontrado", 404);
      this.sendSuccess(res, data);
    } catch (error: any) {
      this.sendError(res, error.message, 500);
    }
  };

  public updateAdditionalInfo = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const additData = req.body as AdditionalInfo;

      if (!additData || !additData.color) {
        return this.sendError(res, "Datos de 'addit' incompletos (requiere color)", 400);
      }

      serverService.updateServerAdditionalInfo(id, additData);
      this.sendSuccess(res, { message: "Miembro 'addit' actualizado con éxito", addit: additData });
    } catch (error: any) {
      this.sendError(res, error.message, 500);
    }
  };

  // 3. MIEMBRO: BANNER DETAILS (banner)
  public getBannerDetails = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const data = serverService.getServerBannerDetails(id);
      if (!data) return this.sendError(res, "Servidor no encontrado", 404);
      this.sendSuccess(res, data);
    } catch (error: any) {
      this.sendError(res, error.message, 500);
    }
  };

  public updateBannerDetails = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const bannerData = req.body as BannerDetails;

      if (!bannerData) return this.sendError(res, "El cuerpo del bloque 'banner' no puede estar vacío", 400);

      serverService.updateServerBannerDetails(id, bannerData);
      this.sendSuccess(res, { message: "Miembro 'banner' actualizado con éxito", banner: bannerData });
    } catch (error: any) {
      this.sendError(res, error.message, 500);
    }
  };

  // 4. MIEMBRO: VERSION AND STATUS (ver)
  public getVersionAndStatus = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const data = serverService.getServerVersionAndStatus(id);
      if (!data) return this.sendError(res, "Servidor no encontrado", 404);
      this.sendSuccess(res, data);
    } catch (error: any) {
      this.sendError(res, error.message, 500);
    }
  };
  /////////////
  //agregar endpoint para updateStatus 
  ///////////////
  public updateVersionAndStatus = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const { version, status } = req.body as { version?: string; status?: string };

      // Si envían versión o estado, usamos las funciones del servicio (las cuales actualizan el timestamp automáticamente)
      if (version) serverService.updateServerVersion(id, version);
      const updatedVer = serverService.getServerVersionAndStatus(id);
      this.sendSuccess(res, { message: "Miembro 'ver' actualizado con éxito", ver: updatedVer });
    } catch (error: any) {
      this.sendError(res, error.message, 500);
    }
  };

  // 5. MIEMBRO: SECTIONS & RULES (sections)
  public getSections = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      if (!serverService.hasServer(id)) return this.sendError(res, "Servidor no encontrado", 404);

      const data = serverService.getServerSections(id);
      this.sendSuccess(res, data);
    } catch (error: any) {
      this.sendError(res, error.message, 500);
    }
  };

  public updateSections = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const sectionsData = req.body as RuleSection[];

      if (!Array.isArray(sectionsData)) {
        return this.sendError(res, "El cuerpo de 'sections' debe ser un Array de RuleSection", 400);
      }

      // Reutiliza el setServer obteniendo el objeto completo y mutando solo las secciones
      const srv = serverService.getServer(id);
      if (!srv) return this.sendError(res, "Servidor no encontrado", 404);

      srv.sections = sectionsData;
      serverService.setServer(id, srv); // Guarda e impacta el JSON

      this.sendSuccess(res, { message: "Miembro 'sections' reemplazado con éxito", sections: sectionsData });
    } catch (error: any) {
      this.sendError(res, error.message, 500);
    }
  };
}
