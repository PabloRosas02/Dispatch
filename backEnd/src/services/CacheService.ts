import * as fs from 'fs';
import * as path from 'path';
import { RPServer } from '../interfaces/ServerInterfaces';

export class CacheService {
  private cache: Map<string, any>;
  private servers: Map<string, RPServer>;

  // Ruta absoluta hacia el archivo físico de persistencia (database.json en la raíz del proyecto)
  private dbDir = path.resolve("/app", "db");
  private dbPath = path.join(this.dbDir, "database.json");

  // --- VALORES DE FÁBRICA / ORIGINALES (DISEÑO Y TEXTOS SINCRO-DEFAULT) ---
  private readonly factoryCacheDefaults: Record<string, any> = {
    'status': 'Backend corriendo perfectamente',
    'kinsfolk_page_config': {
      welcomeTitle: 'Bienvenido a <span class="highlight-text">Kinsfolk</span>',
      welcomeDescription: 'Explora nuestros proyectos y soluciones de diseño exclusivos integrados en nuestro ecosistema.',
      ctaText: 'Únete',
      logoUrl: '' // Se deja vacío para usar el recurso SVG local por defecto en el cliente
    }
  };

  private readonly factoryServerDefaults: RPServer[] = [
    {
      id: "saga-rp",
      title: "SAGA ROLEPLAY",
      subtitle: "Un servidor de comunidad estricta",
      description: "Servidor enfocado en la simulación realista.",
      filename: "mapa.png",
      discordLink: "https://discord.gg/ejemplo",
      color: "#ECAF44",
      sections: [
        {
          title: "Normativa General",
          rules: [
            {
              title: "RDM (Random Deathmatch)",
              description: "Matar o atacar a un jugador sin un motivo de rol previo o válido.",
              example: "Dispararle a alguien en la calle simplemente porque pasó caminando."
            },
            {
              title: "VDM (Vehicle Deathmatch)",
              description: "Utilizar un vehículo como un arma para atropellar o dañar de forma intencional.",
              example: "Embestir repetidamente a peatones en zonas seguras sin rol previo."
            }
          ]
        }
      ]
    }
  ];

  constructor() {
    this.cache = new Map<string, any>();
    this.servers = new Map<string, RPServer>();

    // Al arrancar, intenta cargar los datos previos del disco o inicializa con los de fábrica
    this.loadFromDisk();
  }

  // --- OPERACIONES DE SISTEMA DE ARCHIVOS (PERSISTENCIA FÍSICA) ---
  private safeSaveToDisk(): void {
    try {
      const dataToSave = {
        cache: Object.fromEntries(this.cache),
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
    try {
      if (fs.existsSync(this.dbPath)) {
        const fileContent = fs.readFileSync(this.dbPath, 'utf-8');
        const parsedData = JSON.parse(fileContent);

        // Rehidratar mapa de caché genérica
        this.cache = new Map(Object.entries(parsedData.cache || {}));

        // Rehidratar mapa de servidores
        this.servers.clear();
        if (Array.isArray(parsedData.servers)) {
          parsedData.servers.forEach((srv: RPServer) => this.servers.set(srv.id, srv));
        }
        console.log('[CacheService] Estado rehidratado exitosamente desde database.json.');
      } else {
        console.log('[CacheService] No se detectó base de datos previa. Inicializando valores de fábrica...');
        this.restoreToFactoryDefaults();
      }
    } catch (error) {
      console.error('[CacheService] Error al leer el disco. Cargando valores por defecto:', error);
      this.restoreToFactoryDefaults();
    }
  }

  /**
   * Restaura la base de datos local y la memoria a su estado inicial de fábrica
   */
  public restoreToFactoryDefaults(): void {
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
  }

  // --- MÉTODOS PARA SERVIDORES RP ---
  public getServer(id: string): RPServer | null {
    return this.servers.get(id) || null;
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

  public getAllServers(): RPServer[] {
    return Array.from(this.servers.values());
  }

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
    this.servers.clear();
    this.safeSaveToDisk();
  }
}

// Exportamos una única instancia compartida (Patrón Singleton)
export const cacheService = new CacheService();
