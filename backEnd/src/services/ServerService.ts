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

    if (fs.existsSync(this.dbPath) == false) {
      console.log("[ServerService] No se detectó base de datos previa. Inicializando desde valores por defecto (factory)...");
      this.restoreToFactoryDefaults();
      return;
    }

    this.servers.clear();
    const fd = fs.openSync(this.dbDefaultPath, "r");

    try {
      const fileContent = fs.readFileSync(fd, "utf-8");
      const parsedData = JSON.parse(fileContent);

      // Rehydrate server map using RPServerHelper to correctly reference server.basic.id
      if (parsedData && Array.isArray(parsedData.servers)) {
        parsedData.servers.forEach((rawSrv: any) => {
          // Hidratamos la estructura de datos completa garantizando todos sus miembros
          const fullServer = RPServerHelper.hydrateServer(rawSrv);
          // Verificamos el ID a través del Helper de forma segura
          const id = RPServerHelper.getId(fullServer);

          if (id !== "") {
            // 🎯 Insertamos el servidor completo mapeado perfectamente con todos sus miembros
            this.servers.set(id, fullServer);
          } else {
            console.warn("[ServerService] Servidor omitido durante la carga: El campo 'basic.id' está vacío o inválido.");
          }
        });
      }
      console.log(`[ServerService] Estado rehidratado exitosamente desde ${path.basename(this.dbPath)}.`);
    } finally {
      // el archivo se cierra aquí obligatoriamente liberando el recurso.
      fs.closeSync(fd);
    }
  }

  /**
   * Restaura la base de datos local y la memoria a su estado inicial de fábrica
   */
  public restoreToFactoryDefaults(): void {
    this.servers.clear();

    if (fs.existsSync(this.dbDefaultPath) == false) {
      return;
    }

    // 1. Abrimos el descriptor de archivo (File Descriptor)
    const fd = fs.openSync(this.dbDefaultPath, "r");

    try {
      // 2. Leemos todo el contenido usando el descriptor
      const defaultContent = fs.readFileSync(fd, "utf-8");
      const parsedData = JSON.parse(defaultContent);

      if (parsedData && Array.isArray(parsedData.servers)) {
        parsedData.servers.forEach((rawSrv: any) => {
          // Hidratamos la estructura de datos completa garantizando todos sus miembros
          const fullServer = RPServerHelper.hydrateServer(rawSrv);
          // Verificamos el ID a través del Helper de forma segura
          const id = RPServerHelper.getId(fullServer);

          if (id !== "") {
            // 🎯 Insertamos el servidor completo mapeado perfectamente con todos sus miembros
            this.servers.set(id, fullServer);
          } else {
            console.warn("[ServerService] Servidor omitido durante la carga: El campo 'basic.id' está vacío o inválido.");
          }
        });
      }
    } finally {
      // el archivo se cierra aquí obligatoriamente liberando el recurso.
      fs.closeSync(fd);
    }

    this.safeSaveToDisk();
  }

  public getServerBasicInfo(id: string): BasicInfo | null {
    const srv = this.getServer(id);
    return srv ? RPServerHelper.getBasicInfo(srv) : null;
  }

  public updateServerBasicInfo(id: string, basic: BasicInfo): void {
    const srv = this.getServer(id);
    if (!srv) throw new Error(`Server ${id} not found`);
    RPServerHelper.updateBasicInfo(srv, basic);
    this.setServer(id, srv);
  }

  // --- 2. ADDITIONAL INFO ---
  public getServerAdditionalInfo(id: string): AdditionalInfo | null {
    const srv = this.getServer(id);
    return srv ? RPServerHelper.getAdditionalInfo(srv) : null;
  }

  public updateServerAdditionalInfo(id: string, addit: AdditionalInfo): void {
    const srv = this.getServer(id);
    if (!srv) throw new Error(`Server ${id} not found`);
    RPServerHelper.updateAdditionalInfo(srv, addit);
    this.setServer(id, srv);
  }

  // --- 3. BANNER DETAILS ---
  public getServerBannerDetails(id: string): BannerDetails | null {
    const srv = this.getServer(id);
    return srv ? RPServerHelper.getBannerDetails(srv) : null;
  }

  public updateServerBannerDetails(id: string, banner: BannerDetails): void {
    const srv = this.getServer(id);
    if (!srv) throw new Error(`Server ${id} not found`);
    RPServerHelper.updateBannerDetails(srv, banner);
    this.setServer(id, srv);
  }

  // --- 4. VERSION AND STATUS ---
  public getServerVersionAndStatus(id: string): VersionAndStatus | null {
    const srv = this.getServer(id);
    return srv ? RPServerHelper.getVersionAndStatus(srv) : null;
  }

  public updateServerVersion(id: string, version: string, status?: string): void {
    const srv = this.getServer(id);
    if (!srv) throw new Error(`Server ${id} not found`);
    RPServerHelper.updateVersion(srv, version, status);
    this.setServer(id, srv);
  }

  // --- 5. SECTIONS & RULES ---
  public getServerSections(id: string): RuleSection[] {
    const srv = this.getServer(id);
    return srv ? RPServerHelper.getSections(srv) : [];
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
  public getServer(id: string): RPServer | null {
    return this.servers.get(id.trim()) || null;
  }

  public setServer(id: string, server: RPServer): void {
    this.servers.set(id, server);
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

  public getAllServersBasicInfo(): BasicInfo[] {
    // Extrae los IDs de las llaves del Map, mapea con tu función y remueve los nulos
    return Array.from(this.servers.keys())
      .map(id => this.getServerBasicInfo(id))
      .filter((info): info is BasicInfo => info !== null);
  }

  public getAllServersAddit(): (AdditionalInfo & { id: string })[] {
    return Array.from(this.servers.keys())
      .map(id => {
        const info = this.getServerAdditionalInfo(id);
        if (!info) return null; // Si es nulo, lo pasamos para que el filter lo limpie

        return {
          id,
          ...info
        };
      })
      // El filter ahora asegura que lo que queda son objetos válidos con su ID
      .filter((info): info is (AdditionalInfo & { id: string }) => info !== null);
  }

  public getAllServersRules(): ServerRules[] {
    // Obtenemos los IDs del mapa de servidores
    return Array.from(this.servers.keys()).map(id => {
      // 1. Obtenemos el servidor completo usando el ID
      const server = this.servers.get(id);

      // Si por alguna razón el servidor no existe en el mapa, devolvemos una estructura vacía
      if (!server) {
        return {
          id,
          banner: { bannerImage: '', bannerLabel: '', bannerDescription: '' },
          sections: []
        };
      }

      // 2. Utilizamos tus funciones estáticas pasándole el servidor encontrado
      return {
        id,
        banner: RPServerHelper.getBannerDetails(server), // Reemplaza 'NombreDeTuClase' por el nombre real de tu clase backend
        sections: RPServerHelper.getSections(server)
      };
    });
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

