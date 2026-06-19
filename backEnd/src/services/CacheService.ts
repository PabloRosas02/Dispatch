import { RPServer } from '../interfaces/ServerInterfaces';

export class CacheService {
  private cache: Map<string, any>;
  private servers: Map<string, RPServer>;

  constructor() {
    this.cache = new Map<string, any>();
    this.servers = new Map<string, RPServer>();
    
    // Poblado automático de datos de prueba al iniciar el servidor
    this.seedMockData();
  }

  // --- MÉTODOS PARA SERVIDORES RP ---
  public getServer(id: string): RPServer | null {
    return this.servers.get(id) || null;
  }

  public setServer(id: string, server: RPServer): void {
    this.servers.set(id, server);
  }

  public hasServer(id: string): boolean {
    return this.servers.has(id);
  }

  public deleteServer(id: string): boolean {
    return this.servers.delete(id);
  }

  public getAllServers(): RPServer[] {
    return Array.from(this.servers.values());
  }

  // --- MÉTODOS DE CACHÉ GENÉRICA ---
  public get(key: string): any {
    return this.cache.get(key) || null;
  }

  public set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  public has(key: string): boolean {
    return this.cache.has(key);
  }

  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  public getAll(): Record<string, any> {
    return Object.fromEntries(this.cache);
  }

  public clearAll(): void {
    this.cache.clear();
    this.servers.clear();
  }

  private seedMockData(): void {
    const mockServer: RPServer = {
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
    };
    
    this.servers.set(mockServer.id, mockServer);
    this.cache.set('status', 'Backend corriendo perfectamente');
  }
}

export const cacheService = new CacheService();