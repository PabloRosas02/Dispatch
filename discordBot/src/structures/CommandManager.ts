import {
  REST,
  Routes,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  AutocompleteInteraction,
  MessageFlags,
  CacheType
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
    console.log(`✅ ${this._registry.size} commands locally registered within local module system.`);
  }

  public async syncCommands(clientId: string, guildId?: string): Promise<void> {
    try {
      const commandsData = this._registry.getCommandsData();
      console.log(`🔄 Synchronizing ${commandsData.length} commands with Discord Gateway API...`);

      if (guildId) {
        await this._rest.put(
          Routes.applicationGuildCommands(clientId, guildId),
          { body: commandsData }
        );
        console.log(`✅ Sync Complete: Application-Guild Commands registered inside guild "${guildId}"`);
      } else {
        await this._rest.put(
          Routes.applicationCommands(clientId),
          { body: commandsData }
        );
        console.log('✅ Sync Complete: Global application commands updated.');
      }
    } catch (error) {
      console.error('❌ Failed syncing application commands with Discord Gateway API:', error);
      throw error;
    }
  }

  public async handleCommand(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
    const command = this._registry.get(interaction.commandName);
    if (!command) {
      await interaction.reply({
        content: '❌ Selected application execution hook was not found.',
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const adminCheck = await AdminGuard.verify(interaction);
    if (!adminCheck.allowed) {
      await interaction.reply({
        content: adminCheck.message,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`❌ Execution exception on slash command ${command.name}:`, error);
      await interaction.reply({ content: '❌ System failure. Could not finalize the requested operation.', flags: MessageFlags.Ephemeral });
    }
  }

  public async handleModal(interaction: ModalSubmitInteraction): Promise<void> {
    const commandName = interaction.customId.replace('_modal', '');
    const command = this._registry.get(commandName);

    if (!command) {
      await interaction.reply({
        content: '❌ No active session maps to this form configuration anymore.',
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const adminCheck = await AdminGuard.verify(interaction);
    if (!adminCheck.allowed) {
      await interaction.reply({
        content: adminCheck.message,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    try {
      await command.onModalSubmit(interaction);
    } catch (error) {
      console.error(`❌ Processing error during modal payload execution inside command ${command.name}:`, error);
      await interaction.reply({ content: '❌ Form payload parsing failed. Contact an administrator.', flags: MessageFlags.Ephemeral });
    }
  }

  public async handleSelectMenu(interaction: StringSelectMenuInteraction): Promise<void> {
    const commandName = interaction.customId.split('_')[0];
    const command = this._registry.get(commandName);

    if (!command) {
      await interaction.reply({ content: '❌ No active command mapped to handle this select input.', flags: MessageFlags.Ephemeral });
      return;
    }

    const adminCheck = await AdminGuard.verify(interaction);
    if (!adminCheck.allowed) {
      await interaction.reply({
        content: adminCheck.message,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    try {
      await command.onSelectMenu(interaction);
    } catch (error) {
      console.error(`❌ Processing error inside select menu hook of command ${command.name}:`, error);
      await interaction.reply({ content: '❌ Failed to parse configuration selection details.', flags: MessageFlags.Ephemeral });
    }
  }

  public async handleAutocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const command = this._registry.get(interaction.commandName);
    if (!command) return;

    try {
      await command.onAutocomplete(interaction);
    } catch (error) {
      console.error(`❌ Failure processing autocomplete choices on command ${command.name}:`, error);
    }
  }

  public get registry(): CommandRegistry {
    return this._registry;
  }
}
