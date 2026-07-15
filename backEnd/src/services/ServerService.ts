import * as fs from 'fs';
import * as path from 'path';
import { RPServerHelper } from '../utils/serverHelper';
import {
  RPServer,
  BasicInfo,
  AdditionalInfo,
  BannerDetails,
  VersionAndStatus,
  RuleSection,
  RuleItem
} from '../interfaces/ServerInterfaces';

interface ServerRules {
  id: string;
  banner: BannerDetails;
  sections: RuleSection[];
}


export class ServerService {
  private servers: Map<string, RPServer>;

  // Ruta absoluta hacia el archivo físico de persistencia (database.json en la raíz del proyecto)
  private dbDir = path.resolve("/app", "db");
  private dbPath = path.join(this.dbDir, "serverdata.json");
  private dbDefaultPath = path.join(this.dbDir, "serversDefault.json");

  constructor() {
    this.servers = new Map<string, RPServer>();

    // Al arrancar, intenta cargar los datos previos del disco o inicializa con los de fábrica
    this.loadFromDisk();
  }

  // --- OPERACIONES DE SISTEMA DE ARCHIVOS (PERSISTENCIA FÍSICA) ---
  private safeSaveToDisk(): void {
    try {
      const dataToSave = {
        servers: Array.from(this.servers.values())
      };

      const tmpPath = this.dbPath + ".tmp";
      fs.writeFileSync(tmpPath, JSON.stringify(dataToSave, null, 2), "utf-8");
      fs.renameSync(tmpPath, this.dbPath);
    } catch (error) {
      console.error("[CacheService] Error al guardar en disco:", error);
      throw error; // Propaga para que el controlador pueda devolver 500
    }
  }

  private loadFromDisk(): void {

    if (!fs.existsSync(this.dbPath)) {
      console.log("[ServerService] No se detectó base de datos previa. Inicializando desde valores por defecto (factory)...");
      this.restoreToFactoryDefaults();
      return;
    }

    this.servers.clear();

    try {
      const fileContent = fs.readFileSync(this.dbPath, "utf-8");
      const parsedData = JSON.parse(fileContent) as { servers: RPServer[] };

      // Rehydrate server map using RPServerHelper to correctly reference server.basic.id
      if (parsedData && Array.isArray(parsedData.servers)) {
        parsedData.servers.forEach((rawSrv: RPServer) => {
          // Hidratamos la estructura de datos completa garantizando todos sus miembros
          const fullServer = RPServerHelper.hydrateServer(rawSrv);
          // Verificamos el ID a través del Helper de forma segura
          const id = fullServer?.basic?.id;

          if (id) {
            // 🎯 Insertamos el servidor completo mapeado perfectamente con todos sus miembros
            this.servers.set(id, fullServer);
          } else {
            console.warn("[ServerService] Servidor omitido durante la carga: El campo 'basic.id' está vacío o inválido.");
          }
        });
      }
      console.log(`[ServerService] Estado rehidratado exitosamente desde ${path.basename(this.dbPath)}.`);
    } catch (error) {
      console.error("[ServerService] Error crítico al leer o parsear la base de datos:", error);
      this.restoreToFactoryDefaults();
    }
  }

  /**
   * Restaura la base de datos local y la memoria a su estado inicial de fábrica
   */
  public restoreToFactoryDefaults(): void {
    this.servers.clear();

    if (!fs.existsSync(this.dbDefaultPath)) {
      return;
    }

    try {
      const defaultContent = fs.readFileSync(this.dbDefaultPath, "utf-8");
      const parsedData = JSON.parse(defaultContent) as { servers: RPServer[] };

      if (parsedData && Array.isArray(parsedData.servers)) {
        parsedData.servers.forEach((rawSrv: RPServer) => {

          const fullServer = RPServerHelper.hydrateServer(rawSrv);
          const id = fullServer?.basic?.id;

          if (id) {
            // 🎯 Insertamos el servidor completo mapeado perfectamente con todos sus miembros
            this.servers.set(id, fullServer);
          } else {
            console.warn("[ServerService] Servidor omitido durante la carga: El campo 'basic.id' está vacío o inválido.");
          }
        });
      }
    } catch (error) {
      console.error("[ServerService] Error crítico al leer o parsear la base de datos:", error);
    }

    this.safeSaveToDisk();
  }

  public getServerBasicInfo(id: string): BasicInfo | undefined {
    return this.getServer(id)?.basic;
  }

  public updateServerBasicInfo(id: string, basic: Partial<BasicInfo>): void {
    const srv = this.getServer(id);
    if (!srv) return;
    RPServerHelper.updateBasicInfo(srv, basic);
    this.setServer(id, srv);
  }

  // --- 2. ADDITIONAL INFO ---
  public getServerAdditionalInfo(id: string): AdditionalInfo | undefined {
    return this.getServer(id)?.addit;
  }

  public updateServerAdditionalInfo(id: string, addit: Partial<AdditionalInfo>): void {
    const srv = this.getServer(id);
    if (!srv) return;
    RPServerHelper.updateAdditionalInfo(srv, addit);
    this.setServer(id, srv);
  }

  // --- 3. BANNER DETAILS ---
  public getServerBannerDetails(id: string): BannerDetails | undefined {
    return this.getServer(id)?.banner;
  }

  public updateServerBannerDetails(id: string, banner: BannerDetails): void {
    const srv = this.getServer(id);
    if (!srv) return;
    RPServerHelper.updateBannerDetails(srv, banner);
    this.setServer(id, srv);
  }

  // --- 4. VERSION AND STATUS ---
  public getServerVersionAndStatus(id: string): VersionAndStatus | undefined {
    return this.getServer(id)?.ver;
  }

  public updateServerVersionAndStatus(id: string, version?: string, status?: string): void {
    const srv = this.getServer(id);
    if (!srv) return;
    RPServerHelper.updateVersionAndStatus(srv, version, status);
    this.setServer(id, srv);
  }

  // --- 5. SECTIONS & RULES ---
  public getServerSections(id: string): RuleSection[] {
    return this.getServer(id)?.sections ?? [];
  }

  public addServerSection(id: string, title: string): void {
    const srv = this.getServer(id);
    if (!srv) throw new Error(`Server ${id} not found`);
    RPServerHelper.addSection(srv, title);
    this.setServer(id, srv);
  }

  public addRuleToServerSection(id: string, sectionTitle: string, rule: RuleItem): boolean {
    const srv = this.getServer(id);
    if (!srv) return false;
    const added = RPServerHelper.addRuleToSection(srv, sectionTitle, rule);
    if (added) this.setServer(id, srv);
    return added;
  }

  // --- MÉTODOS PARA SERVIDORES RP ---
  public getServer(id: string): RPServer | undefined {
    return this.servers.get(id);
  }

  public setServer(id: string, server: RPServer): void {

    if (!this.servers.has(id)) {
      this.servers.set(id, server);
    }

    this.safeSaveToDisk(); // Sincroniza al insertar o actualizar
  }

  public hasServer(id: string): boolean {
    return this.servers.has(id);
  }

  public deleteServer(id: string): boolean {
    const deleted = this.servers.delete(id);
    if (deleted) this.safeSaveToDisk(); // Sincroniza si la eliminación fue exitosa
    return deleted;
  }

  public getAllIds(): string[] {
    return Array.from(this.servers.keys());
  }

  public getAllServersBasicInfo(): BasicInfo[] {
    const arrayBasicInfo: BasicInfo[] = [];
    for (const server of this.servers.values()) {
      if (server?.basic) {
        arrayBasicInfo.push(server.basic);
      }
    }

    return arrayBasicInfo;
  }

  public getAllServersAddit(): (AdditionalInfo & { id: string })[] {
    const arrayAdditInfo: (AdditionalInfo & { id: string })[] = [];

    for (const server of this.servers.values()) {
      if (server?.addit && server.basic?.id) {
        arrayAdditInfo.push({
          id: server.basic.id,
          ...server.addit
        });
      }
    }
    return arrayAdditInfo;
  }

  public getAllServersRules(): ServerRules[] {
    const result: ServerRules[] = [];

    for (const srv of this.servers.values()) {

      if (srv) {
        result.push({
          id: srv.basic?.id || '',
          banner: srv.banner || { bannerImage: '', bannerLabel: '', bannerDescription: '' },
          sections: srv.sections || []
        });
      }
    }
    return result;
  }

  public getAllServers(): RPServer[] {
    return Array.from(this.servers.values());
  }

  public clearAllServers(): void {
    this.servers.clear();
    this.safeSaveToDisk();
  }
}

export const serverService = new ServerService();

