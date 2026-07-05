import * as fs from 'fs';
import * as path from 'path';

export class CacheService {
  private cache: Map<string, any>;

  // Ruta absoluta hacia el archivo físico de persistencia (database.json en la raíz del proyecto)
  private dbDir = path.resolve("/app", "db");
  private dbPath = path.join(this.dbDir, "database.json");

  constructor() {
    this.cache = new Map<string, any>();
    // Al arrancar, intenta cargar los datos previos del disco o inicializa con los de fábrica
    this.loadFromDisk();
  }

  // --- OPERACIONES DE SISTEMA DE ARCHIVOS (PERSISTENCIA FÍSICA) ---
  private safeSaveToDisk(): void {
    try {
      const dataToSave = {
        cache: Object.fromEntries(this.cache),
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
    try {
      if (fs.existsSync(this.dbPath)) {
        const fileContent = fs.readFileSync(this.dbPath, "utf-8");
        const parsedData = JSON.parse(fileContent);

        // Rehydrate generic cache map
        this.cache = new Map(Object.entries(parsedData.cache || {}));

        // Rehydrate server map using RPServerHelper to correctly reference server.basic.id
        console.log("[CacheService] Estado rehidratado exitosamente desde database.json.");
      } else {
        console.log("[CacheService] No se detectó base de datos previa. Inicializando valores de fábrica...");
        //this.restoreToFactoryDefaults();
      }
    } catch (error) {
      console.error("[CacheService] Error al leer el disco. Cargando valores por defecto:", error);
      //this.restoreToFactoryDefaults();
    }
  }

  /**
   * Restaura la base de datos local y la memoria a su estado inicial de fábrica
   */
  /*public restoreToFactoryDefaults(): void {
    this.cache.clear();
    this.servers.clear();

    // Poblar caché de fábrica
    Object.entries(this.factoryCacheDefaults).forEach(([key, val]) => {
      this.cache.set(key, val);
    });

    // Poblar servidores de fábrica (Clonación profunda para romper referencias)
    this.factoryServerDefaults.forEach((server) => {
      this.servers.set(server.id, JSON.parse(JSON.stringify(server)));
    });

    // Escribir inmediatamente en el archivo físico
    this.safeSaveToDisk();
  }*/

  // --- MÉTODOS DE CACHÉ GENÉRICA (BIENVENIDAS Y CONFIGURACIONES) ---
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
    this.safeSaveToDisk();
  }

  public has(key: string): boolean {
    return this.cache.has(key);
  }

  public delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) this.safeSaveToDisk(); // Sincroniza si se borra una llave
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

// Exportamos una única instancia compartida (Patrón Singleton)
export const cacheService = new CacheService();
