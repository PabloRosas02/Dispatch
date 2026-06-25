import { CommandInteraction } from 'discord.js';
import { Command } from '../structures/Command';

export class HelloCommand extends Command {
  constructor() {
    super('hello', 'Saluda al bot');
  }

  public async execute(interaction: CommandInteraction): Promise<void> {
    const user = interaction.user;
    const embed = this.createSuccessEmbed(
      '👋 ¡Hola!',
      `Hola administrador **${user.username}**! ¿Cómo estás?`
    );
    
    await interaction.reply({ embeds: [embed] });
  }
}
