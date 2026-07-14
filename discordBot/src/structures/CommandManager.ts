import {
  ChatInputCommandInteraction,
  CacheType,
  ModalSubmitInteraction,
  REST,
  Routes
} from 'discord.js';
import { Command } from './Command';
import { CommandRegistry } from './CommandRegistry';
import { AdminGuard } from '../guards/AdminGuard';

export class CommandManager {
  private readonly _registry: CommandRegistry;
  private readonly _rest: REST;

  constructor(token: string) {
    this._registry = new CommandRegistry();
    this._rest = new REST({ version: '10' }).setToken(token);
  }

  public registerCommands(commands: Command[]): void {
    this._registry.registerAll(commands);
    console.log(`✅ ${this._registry.size} comandos registrados localmente`);
  }

  public async syncCommands(clientId: string, guildId?: string): Promise<void> {
    try {
      const commandsData = this._registry.getCommandsData();
      console.log(`🔄 Sincronizando ${commandsData.length} comandos...`);

      if (guildId) {
        await this._rest.put(
          Routes.applicationGuildCommands(clientId, guildId),
          { body: commandsData }
        );
        console.log(`✅ Comandos sincronizados en el servidor ${guildId}`);
      } else {
        await this._rest.put(
          Routes.applicationCommands(clientId),
          { body: commandsData }
        );
        console.log('✅ Comandos sincronizados globalmente');
      }
    } catch (error) {
      console.error('❌ Error sincronizando comandos:', error);
      throw error;
    }
  }

  public async handleCommand(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
    const command = this._registry.get(interaction.commandName);

    if (!command) {
      await interaction.reply({
        content: '❌ Comando no encontrado',
        ephemeral: true
      });
      return;
    }

    const adminCheck = await AdminGuard.verify(interaction);
    if (!adminCheck.allowed) {
      await interaction.reply({
        content: adminCheck.message,
        ephemeral: true
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`❌ Error ejecutando ${command.name}:`, error);
      await interaction.reply({
        content: '❌ Ocurrió un error al ejecutar el comando',
        ephemeral: true
      });
    }
  }

  public async handleModal(interaction: ModalSubmitInteraction): Promise<void> {
    // Extraer el nombre del comando del customId
    const commandName = interaction.customId.replace('_modal', '');
    const command = this._registry.get(commandName);

    if (!command) {
      await interaction.reply({
        content: '❌ Comando no encontrado para este formulario',
        ephemeral: true
      });
      return;
    }

    // Verificar permisos de administrador para el modal también
    const adminCheck = await AdminGuard.verifyModal(interaction);
    if (!adminCheck.allowed) {
      await interaction.reply({
        content: adminCheck.message,
        ephemeral: true
      });
      return;
    }

    try {
      // Usar la implementación por defecto o la sobrescrita
      await command.onModalSubmit(interaction);
    } catch (error) {
      console.error(`❌ Error procesando modal de ${command.name}:`, error);
      await interaction.reply({
        content: '❌ Error al procesar el formulario',
        ephemeral: true
      });
    }
  }

  public get registry(): CommandRegistry {
    return this._registry;
  }
}
