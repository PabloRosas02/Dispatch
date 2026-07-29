import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../structures/Command';

export class PingCommand extends Command {
  constructor() {
    super('ping', 'Verifica la latencia del bot');
  }

  public async execute(interaction: CommandInteraction): Promise<void> {
    const startTime = Date.now();
    await interaction.reply('🏓 Calculando...');
    
    const endTime = Date.now();
    const latency = endTime - startTime;
    
    const apiLatency = interaction.client.ws.ping ?? 0;
    const apiLatencyDisplay = apiLatency > 0 ? `${apiLatency}ms` : 'Calculando...';

    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('🏓 Pong!')
      .setDescription(`📡 Latencia: ${latency}ms\n🔄 API Discord: ${apiLatencyDisplay}`)
      .setTimestamp();

    await interaction.editReply({
      content: null,
      embeds: [embed]
    });
  }
}
