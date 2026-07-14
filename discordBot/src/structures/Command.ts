import {
  SlashCommandBuilder,
  CommandInteraction,
  ModalSubmitInteraction,
  ChatInputCommandInteraction,
  CacheType,
  EmbedBuilder,
  ColorResolvable
} from 'discord.js';

export abstract class Command {
  private readonly _name: string;
  private readonly _description: string;
  private readonly _data: SlashCommandBuilder;

  constructor(name: string, description: string) {
    this._name = name;
    this._description = description;
    this._data = new SlashCommandBuilder()
      .setName(name)
      .setDescription(description);
  }

  public get name(): string {
    return this._name;
  }

  public get description(): string {
    return this._description;
  }

  public get data(): SlashCommandBuilder {
    return this._data;
  }

  protected createSuccessEmbed(
    title: string,
    description: string,
    color: ColorResolvable = '#00ff00'
  ): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description)
      .setTimestamp();
  }

  protected createErrorEmbed(
    message: string,
    color: ColorResolvable = '#ff0000'
  ): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(color)
      .setTitle('❌ Error')
      .setDescription(message)
      .setTimestamp();
  }

  /**
   * Método principal de ejecución del comando
   */
  public abstract execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void>;

  /**
   * Hook para manejar envíos de formularios (modals)
   * Implementación por defecto: responde que el comando no usa formularios
   */
  public async onModalSubmit(interaction: ModalSubmitInteraction): Promise<void> {
    await interaction.reply({
      content: '❌ Este comando no utiliza formularios',
      ephemeral: true
    });
  }
}
