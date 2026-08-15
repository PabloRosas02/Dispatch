import * as fs from 'fs';
import * as path from 'path';

export class CacheService {
  private cache: Map<string, any>;
  private defaultCache: Map<string, any>; // NUEVO: Memoria estática de valores de fábrica

  // Apuntamos estrictamente a la carpeta 'db' dentro del directorio raíz del backend
  private dbDir = path.join(process.cwd(), "db");
  private dbPath = path.join(this.dbDir, "database.json");
  private defaultDbPath = path.join(this.dbDir, "serversDefault.json");

  constructor() {
    this.cache = new Map<string, any>();
    this.defaultCache = new Map<string, any>();
    
    // Cargamos siempre los valores por defecto a la memoria estática
    this.loadDefaultsInMemory();
    
    // Luego cargamos la caché dinámica (modificada) del disco
    this.loadFromDisk();
  }

  // --- NUEVO: CARGA DE DEFAULTS EN MEMORIA ---
  private loadDefaultsInMemory(): void {
    try {
      if (fs.existsSync(this.defaultDbPath)) {
        const defaultContent = fs.readFileSync(this.defaultDbPath, "utf-8");
        const parsedDefault = JSON.parse(defaultContent);

        // Mapeamos exactamente igual que en la caché activa
        if (parsedDefault.welcomeConfig) { //Welcome
          this.defaultCache.set("kinsfolk_page_config", parsedDefault.welcomeConfig);
        }
        if (parsedDefault.newsConfig) { //News
          this.defaultCache.set("news_page_general_config", parsedDefault.newsConfig);
        }
        if (parsedDefault.footerConfig) {//Footer
          this.defaultCache.set("footer_page_config", parsedDefault.footerConfig);
        }
        if (parsedDefault.servers && Array.isArray(parsedDefault.servers)) {
          parsedDefault.servers.forEach((server: any) => {
            if (server.basic && server.basic.id) {
              this.defaultCache.set(`server_page_config_${server.basic.id}`, server);
            }
          });
        }
        console.log("[CacheService] Valores de fábrica estáticos cargados en memoria.");
      } else {
        console.warn(`[CacheService] No se encontró el archivo base -> ${this.defaultDbPath}`);
      }
    } catch (error) {
      console.error("[CacheService] Error leyendo serversDefault.json:", error);
    }
  }

  // --- OPERACIONES DE SISTEMA DE ARCHIVOS ---
  private safeSaveToDisk(): void {
    return;
    try {
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
      console.log("[CacheService] database.json no encontrado. Iniciando limpio (usará defaults en peticiones).");
      // Ya no forzamos restoreToFactoryDefaults aquí, porque get(key) ya sabe buscar en defaultCache.
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
    this.cache.clear(); // Limpiamos las modificaciones
    
    // Clonamos la memoria estática a la caché activa
    this.defaultCache.forEach((value, key) => {
      this.cache.set(key, value);
    });

    this.safeSaveToDisk();
    console.log("[CacheService] Valores de fábrica restaurados en caché activa.");
  }

  // --- MÉTODOS DE CACHÉ GENÉRICA ---
  
  // MODIFICADO: Aquí ocurre la magia. Si no hay datos activos, envía los de fábrica.
  public get(key: string): any {
    const activeData = this.cache.get(key);
    const defaultData = this.defaultCache.get(key);

    return activeData || defaultData || null;
  }

  public set(key: string, value: any): void {
    if (!key || typeof key !== "string") throw new Error("La clave debe ser un string válido");
    if (value === undefined || value === null) throw new Error("El valor no puede ser nulo o indefinido");

    this.cache.set(key, value);
    this.safeSaveToDisk();
  }

  public has(key: string): boolean {
    return this.cache.has(key) || this.defaultCache.has(key); // MODIFICADO
  }

  public delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) this.safeSaveToDisk();
    return deleted;
  }

  public getAll(): Record<string, any> {
    // Retorna una combinación de los defaults sobreescritos por la caché activa
    const allKeys = new Set([...this.defaultCache.keys(), ...this.cache.keys()]);
    const result: Record<string, any> = {};
    
    allKeys.forEach(key => {
      result[key] = this.get(key);
    });
    
    return result;
  }

  public clearAll(): void {
    this.cache.clear();
    this.safeSaveToDisk();
  }
}

export const cacheService = new CacheService();