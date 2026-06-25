import { 
  Client, 
  GatewayIntentBits,
  Interaction,
  Events
} from 'discord.js';
import { CommandManager } from './structures/CommandManager';
import { AdminGuard } from './guards/AdminGuard';

// Importar comandos
import { PingCommand } from './commands/PingCommand';
import { HelloCommand } from './commands/HelloCommand';
import { TupuCommand } from './commands/TupuCommand';

export class Bot {
  private readonly _client: Client;
  private readonly _commandManager: CommandManager;

  constructor() {
    this._client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
      ]
    });

    this._commandManager = new CommandManager(process.env.DISCORD_TOKEN!);
    this.setupEvents();
  }

  private setupEvents(): void {
    // ✅ Usar Events.ClientReady en lugar de 'ready'
    this._client.once(Events.ClientReady, async () => {
      console.log(`✅ Bot conectado como ${this._client.user?.tag}`);
      
      AdminGuard.configure(
        process.env.ADMIN_CHANNEL_ID!,
        process.env.ADMIN_ROLE_IDS?.split(',').filter(id => id.trim() !== '') || []
      );

      this.registerCommands();
      
      await this._commandManager.syncCommands(
        process.env.CLIENT_ID!,
        process.env.GUILD_ID
      );

      console.log(`📊 ${this._commandManager.registry.size} comandos cargados`);
    });

    // ✅ Usar Events.InteractionCreate en lugar de 'interactionCreate'
    this._client.on(Events.InteractionCreate, async (interaction: Interaction) => {
      if (interaction.isCommand()) {
        await this._commandManager.handleCommand(interaction);
      }
      
      if (interaction.isModalSubmit()) {
        await this._commandManager.handleModal(interaction);
      }
    });

    // Manejador de errores
    this._client.on(Events.Error, (error) => {
      console.error('❌ Error del cliente:', error);
    });

    // Manejador de advertencias
    this._client.on(Events.Warn, (warning) => {
      console.warn('⚠️ Advertencia:', warning);
    });
  }

  private registerCommands(): void {
    const commands = [
      new PingCommand(),
      new HelloCommand(),
      new TupuCommand()
    ];

    this._commandManager.registerCommands(commands);
  }

  public async start(): Promise<void> {
    const token = process.env.DISCORD_TOKEN;
    if (!token) {
      throw new Error('❌ DISCORD_TOKEN no encontrado en .env');
    }

    await this._client.login(token);
  }

  public async stop(): Promise<void> {
    console.log('🛑 Apagando bot...');
    await this._client.destroy();
    process.exit(0);
  }
}
