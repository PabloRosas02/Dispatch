import * as fs from 'fs';
import * as path from 'path';

export class CacheService {
  private cache: Map<string, any>;

  // Apuntamos estrictamente a la carpeta 'db' dentro del directorio raíz del backend
  private dbDir = path.join(process.cwd(), "db");
  private dbPath = path.join(this.dbDir, "database.json");
  private defaultDbPath = path.join(this.dbDir, "serversDefault.json");

  constructor() {
    this.cache = new Map<string, any>();
    this.loadFromDisk();
  }

  // --- OPERACIONES DE SISTEMA DE ARCHIVOS ---
  private safeSaveToDisk(): void {
    try {
      // Si por alguna razón la carpeta db no existe, la crea automáticamente
      if (!fs.existsSync(this.dbDir)) {
        fs.mkdirSync(this.dbDir, { recursive: true });
      }

      const dataToSave = {
        cache: Object.fromEntries(this.cache),
      };
      
      const tmpPath = this.dbPath + ".tmp";
      fs.writeFileSync(tmpPath, JSON.stringify(dataToSave, null, 2), "utf-8");
      fs.renameSync(tmpPath, this.dbPath);
      
      console.log(`[CacheService] Base de datos persistida exitosamente en: ${this.dbPath}`);
    } catch (error) {
      console.error("[CacheService] Error crítico al guardar en disco:", error);
    }
  }

  private loadFromDisk(): void {
    if (!fs.existsSync(this.dbPath)) {
      console.log("[CacheService] database.json no encontrado. Cargando valores por defecto...");
      this.restoreToFactoryDefaults();
      return;
    }

    try {
      const fileContent = fs.readFileSync(this.dbPath, "utf-8");
      const parsedData = JSON.parse(fileContent);

      this.cache = new Map(Object.entries(parsedData.cache || {}));
      console.log("[CacheService] Estado rehidratado correctamente desde database.json");
    } catch (error) {
      console.error("[CacheService] Error leyendo database.json:", error);
    }
  }

  public restoreToFactoryDefaults(): void {
    this.cache.clear();

    try {
      if (fs.existsSync(this.defaultDbPath)) {
        const defaultContent = fs.readFileSync(this.defaultDbPath, "utf-8");
        const parsedDefault = JSON.parse(defaultContent);

        // 1. Restaurar configuraciones genéricas
        if (parsedDefault.welcomeConfig) {
          this.cache.set("kinsfolk_page_config", parsedDefault.welcomeConfig);
        }
        if (parsedDefault.newsConfig) {
          this.cache.set("news_page_general_config", parsedDefault.newsConfig);
        }

        // 2. Restaurar servidores estructurados
        if (parsedDefault.servers && Array.isArray(parsedDefault.servers)) {
          parsedDefault.servers.forEach((server: any) => {
            if (server.basic && server.basic.id) {
              this.cache.set(`server_page_config_${server.basic.id}`, server);
            }
          });
        }

        // 3. Forzar el guardado crea el database.json por primera vez
        this.safeSaveToDisk();
        console.log("[CacheService] Valores de fábrica restaurados desde serversDefault.json");
      } else {
        console.error(`[CacheService] CRÍTICO: No se encontró el archivo base -> ${this.defaultDbPath}`);
      }
    } catch (error) {
      console.error("[CacheService] Error restaurando defaults (Verifica la sintaxis del JSON):", error);
    }
  }

  // --- MÉTODOS DE CACHÉ GENÉRICA ---
  public get(key: string): any {
    return this.cache.get(key) || null;
  }

  public set(key: string, value: any): void {
    if (!key || typeof key !== "string") {
      throw new Error("La clave debe ser un string válido");
    }
    if (value === undefined || value === null) {
      throw new Error("El valor no puede ser nulo o indefinido");
    }

    this.cache.set(key, value);
    this.safeSaveToDisk(); // Sincroniza al actualizar
  }

  public has(key: string): boolean {
    return this.cache.has(key);
  }

  public delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) this.safeSaveToDisk();
    return deleted;
  }

  public getAll(): Record<string, any> {
    return Object.fromEntries(this.cache);
  }

  public clearAll(): void {
    this.cache.clear();
    this.safeSaveToDisk();
  }
}

export const cacheService = new CacheService();