import {
  ChatInputCommandInteraction,
  CacheType,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../structures/Command';

export class TupuCommand extends Command {
  constructor() {
    super('tupu', 'TUPU');

    (this.data as SlashCommandBuilder)
      .addUserOption(option =>
        option
          .setName('usuario')
          .setDescription('El usuario a tupu')
          .setRequired(true)
      );
  }

  public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
    const targetUser = interaction.options.getUser('usuario');

    if (!targetUser) {
      await interaction.reply({
        content: '❌ Por favor menciona a un usuario válido',
        flags: MessageFlags.Ephemeral
      });
      return;
    }
    const userMention = targetUser.toString();

    const embed = this.createSuccessEmbed(
      `TUPU`,
      `TUPU **${userMention}**`
    );

    await interaction.reply({ embeds: [embed] });

  }
}
