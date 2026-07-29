import {
  Client,
  GatewayIntentBits,
  Events,
  Interaction,
  TextInputStyle
} from 'discord.js';
import fs from 'fs';
import path from 'path';
import { CommandManager } from './structures/CommandManager';
import { AdminGuard } from './guards/AdminGuard';

// import Commands
import { PingCommand } from './commands/PingCommand';
import { TupuCommand } from './commands/TupuCommand';
import { DynamicFormCommand } from './commands/DynamicFormCommand';

interface BotSecrets {
  CLIENT_ID: string;
  DISCORD_TOKEN: string;
  GUILD_ID?: string;
  ADMIN_CHANNEL_ID: string;
  ADMIN_ROLE_IDS: string[];
}

export class Bot {
  private readonly _client: Client;
  private readonly _commandManager: CommandManager;
  private _secrets!: BotSecrets;

  constructor() {
    this.loadSecrets();

    this._client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
      ]
    });

    this._commandManager = new CommandManager(this._secrets.DISCORD_TOKEN);
    this.setupEvents();
  }

  private registerCommands(): void {
    const commands = [
      new PingCommand(),
      new TupuCommand(),
      // 1. Basic configuration command definition
      new DynamicFormCommand({
        commandName: 'update-basic',
        description: 'Modify Core Server identification credentials',
        section: 'basic',
        fields: [
          { customId: 'title', label: 'Titulo servidor', style: TextInputStyle.Short, required: true },
          { customId: 'subtitle', label: 'Subtitulo', style: TextInputStyle.Short, required: true }
        ]
      }),

      // 2. Extra metadata configuration command definition
      new DynamicFormCommand({
        commandName: 'update-addit',
        description: 'Modify secondary connection link and styling properties',
        section: 'addit',
        fields: [
          { customId: 'color', label: 'Color HEX Code', style: TextInputStyle.Short, required: true },
          { customId: 'discordLink', label: 'Official Invite Link', style: TextInputStyle.Short, required: false },
          { customId: 'description', label: 'Long Description Text', style: TextInputStyle.Paragraph, required: false }
        ]
      }),

      new DynamicFormCommand({
        commandName: 'update-banner',
        description: 'Modify secondary connection link and styling properties',
        section: 'banner',
        fields: [
          { customId: 'bannerLabel', label: 'Banner label', style: TextInputStyle.Paragraph, required: true },
          { customId: 'bannerDescription', label: 'Official Invite Link', style: TextInputStyle.Paragraph, required: false }
        ]
      }),

      // 3. Current Versioning properties definition
      new DynamicFormCommand({
        commandName: 'update-ver',
        description: 'Modify status parameters of an active server instance',
        section: 'ver',
        fields: [
          { customId: 'version', label: 'Current Release Target', style: TextInputStyle.Short, required: true },
          { customId: 'status', label: 'Current Status Message', style: TextInputStyle.Short, required: true }
        ]
      })
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
      console.log(`✅ System connected to API Services. Authenticated as: ${this._client.user?.tag}`);

      AdminGuard.configure(
        this._secrets.ADMIN_CHANNEL_ID,
        this._secrets.ADMIN_ROLE_IDS
      );

      this.registerCommands();

      await this._commandManager.syncCommands(
        this._secrets.CLIENT_ID,
        this._secrets.GUILD_ID
      );

      console.log(`📊 Command synchronization process successfully terminated. Commands compiled: ${this._commandManager.registry.size}`);
    });

    this._client.on(Events.InteractionCreate, async (interaction: Interaction) => {

      if (interaction.isChatInputCommand()) {
        await this._commandManager.handleCommand(interaction);
      } else if (interaction.isModalSubmit()) {
        await this._commandManager.handleModal(interaction);
      } else if (interaction.isStringSelectMenu()) {
        await this._commandManager.handleSelectMenu(interaction);
      } else if (interaction.isAutocomplete()) {
        await this._commandManager.handleAutocomplete(interaction);
      }

    });

    this._client.on(Events.Error, (error) => console.error('❌ Connection error:', error));
    this._client.on(Events.Warn, (warn) => console.warn('⚠️ Client system warning:', warn));
  }

  public async start(): Promise<void> {
    await this._client.login(this._secrets.DISCORD_TOKEN);
  }

  public async stop(): Promise<void> {
    console.log('🛑 Shutting down Bot services...');
    await this._client.destroy();
    process.exit(0);
  }
}
