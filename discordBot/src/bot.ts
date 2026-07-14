import {
  Client,
  GatewayIntentBits,
  Interaction,
  Events
} from 'discord.js';
import fs from 'fs';
import path from 'path';
import { CommandManager } from './structures/CommandManager';
import { AdminGuard } from './guards/AdminGuard';

// Importar comandos
import { PingCommand } from './commands/PingCommand';
import { HelloCommand } from './commands/HelloCommand';
import { TupuCommand } from './commands/TupuCommand';

interface BotSecrets {
  ADMIN_ROLE_IDS: string[];
  ADMIN_CHANNEL_ID: string;
  CLIENT_ID: string;
  DISCORD_TOKEN: string;
  GUILD_ID?: string;
}

export class Bot {
  private readonly _client: Client;
  private readonly _commandManager: CommandManager;
  private _secrets!: BotSecrets; // Se inicializará en el constructor

  constructor() {
    this.loadSecrets();

    this._client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
      ]
    });

    this._commandManager = new CommandManager(this._secrets.DISCORD_TOKEN!);
    this.setupEvents();
  }

  private registerCommands(): void {
    const commands = [
      new PingCommand(),
      new HelloCommand(),
      new TupuCommand()
    ];

    this._commandManager.registerCommands(commands);
  }

  private loadSecrets(): void {
    const secretKeys = [
      'ADMIN_ROLE_IDS',
      'ADMIN_CHANNEL_ID',
      'CLIENT_ID',
      'DISCORD_TOKEN',
      'GUILD_ID'
    ] as const;

    const loaded: Partial<Record<typeof secretKeys[number], string>> = {};

    for (const key of secretKeys) {
      const dockerSecretPath = path.join('/run/secrets', key);

      if (fs.existsSync(dockerSecretPath)) {
        // Leer desde Docker Secret
        loaded[key] = fs.readFileSync(dockerSecretPath, 'utf8').trim();
      } else {
        // Fallback a Variable de Entorno estándar (.env o sistema)
        loaded[key] = process.env[key];
      }
    }

    // Validar secretos críticos obligatorios
    if (!loaded.DISCORD_TOKEN || !loaded.CLIENT_ID || !loaded.ADMIN_CHANNEL_ID) {
      throw new Error('❌ Error crítico: Faltan secretos obligatorios para iniciar el bot.');
    }

    // Procesar y asignar los secretos estructurados al objeto de la clase
    this._secrets = {
      ADMIN_ROLE_IDS: loaded.ADMIN_ROLE_IDS?.split(',').filter(id => id.trim() !== '') || [],
      ADMIN_CHANNEL_ID: loaded.ADMIN_CHANNEL_ID,
      CLIENT_ID: loaded.CLIENT_ID,
      DISCORD_TOKEN: loaded.DISCORD_TOKEN,
      GUILD_ID: loaded.GUILD_ID
    };
  }

  private setupEvents(): void {
    this._client.once(Events.ClientReady, async () => {
      console.log(`✅ Bot conectado como ${this._client.user?.tag}`);

      // 🔄 Usando los secretos cargados de forma segura
      AdminGuard.configure(
        this._secrets.ADMIN_CHANNEL_ID,
        this._secrets.ADMIN_ROLE_IDS
      );

      this.registerCommands();

      await this._commandManager.syncCommands(
        this._secrets.CLIENT_ID,
        this._secrets.GUILD_ID
      );

      console.log(`📊 ${this._commandManager.registry.size} comandos cargados`);
    });

    this._client.on(Events.InteractionCreate, async (interaction: Interaction) => {
      if (interaction.isChatInputCommand()) {
        await this._commandManager.handleCommand(interaction);
      }

      if (interaction.isModalSubmit()) {
        await this._commandManager.handleModal(interaction);
      }
    });

    this._client.on(Events.Error, (error) => {
      console.error('❌ Error del cliente:', error);
    });

    this._client.on(Events.Warn, (warning) => {
      console.warn('⚠️ Advertencia:', warning);
    });
  }

  public async start(): Promise<void> {

    await this._client.login(this._secrets.DISCORD_TOKEN);
  }

  public async stop(): Promise<void> {
    console.log('🛑 Apagando bot...');
    await this._client.destroy();
    process.exit(0);
  }
}
