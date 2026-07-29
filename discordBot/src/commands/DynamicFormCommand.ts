import {
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  MessageFlags,
  CacheType,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} from 'discord.js';
import { Command } from '../structures/Command';
import { ModalHelper, FormFieldConfig } from '../structures/ModalHelper';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface DynamicFormConfig {
  commandName: string;
  description: string;
  section: 'basic' | 'addit' | 'ver' | 'banner';
  fields: Omit<FormFieldConfig, 'value'>[];
}

export class DynamicFormCommand extends Command {
  private readonly _section: 'basic' | 'addit' | 'ver' | 'banner';
  private readonly _fieldConfigs: Omit<FormFieldConfig, 'value'>[];
  private readonly _apiBaseUrl = 'http://main-proxy/api'; // Replace with your production API URL

  // Maps UserID -> Selected ServerID
  private activeEdits = new Map<string, string>();

  constructor(config: DynamicFormConfig) {
    super(config.commandName, config.description);
    this._section = config.section;
    this._fieldConfigs = config.fields;
  }

  /**
   * Step 1: User runs /update-basic -> Fetches IDs & returns StringSelectMenu dropdown
   */
  public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
    await interaction.deferReply({ ephemeral: true });

    try {
      const response = await fetch(`${this._apiBaseUrl}/servers/ids`);
      if (!response.ok) throw new Error('API server list was unreachable.');

      const result = (await response.json()) as ApiResponse<string[]>;
      if (!result.success || !result.data.length) {
        await interaction.editReply({ content: '⚠️ No se encontraron servidores registrados' });
        return;
      }

      const selectOptions = result.data.slice(0, 25).map((id) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(`Servidor: ${id}`)
          .setValue(id)
          .setDescription(`Selecciona el servidor a editar [${this._section.toUpperCase()}] propiedades`)
      );

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`${this.name}_select`)
        .setPlaceholder('Selecciona una instancia activa...')
        .addOptions(selectOptions);

      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

      await interaction.editReply({
        content: '⚙️ **Server Configuration Panel:** Select the system ID you wish to update:',
        components: [row]
      });

    } catch (error) {
      console.error(`[Execution Error - ${this.name}]:`, error);
      const errorEmbed = this.createErrorEmbed('Failed to establish a network handshake with the backend database.');
      await interaction.editReply({ embeds: [errorEmbed], components: [] });
    }
  }

  /**
   * Step 2: User selects a server -> Fetch configuration and display Pre-filled Modal
   */
  public override async onSelectMenu(interaction: StringSelectMenuInteraction): Promise<void> {
    const serverId = interaction.values[0];
    const userId = interaction.user.id;

    this.activeEdits.set(userId, serverId);

    try {
      const response = await fetch(`${this._apiBaseUrl}/servers/${serverId}/${this._section}`);
      if (!response.ok) throw new Error(`Could not fetch data for section ${this._section}`);

      const result = (await response.json()) as ApiResponse<Record<string, any>>;
      const currentValues = result.success ? result.data : {};

      const fieldsWithData: FormFieldConfig[] = this._fieldConfigs.map((field) => ({
        ...field,
        value: currentValues[field.customId] ?? ''
      }));

      const modal = ModalHelper.create(
        this.name,
        `Edit ${this._section.toUpperCase()}: ${serverId}`,
        fieldsWithData
      );

      await interaction.showModal(modal);

      await interaction.editReply({
        content: `📝 **Editing Form Initialized:** Updating \`${this._section.toUpperCase()}\` properties for server **\`${serverId}\`**. Please complete the popped-up form.`,
        components: []
      });

    } catch (error) {
      console.error(`[Select Menu Error - ${this.name}]:`, error);
      const errorEmbed = this.createErrorEmbed(`Failed to load structural properties for ${serverId}.`);
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }

  /**
   * Step 3: User submits modal -> Persist values via API PUT request
   */
  public override async onModalSubmit(interaction: ModalSubmitInteraction): Promise<void> {
    const userId = interaction.user.id;
    const serverId = this.activeEdits.get(userId);

    if (!serverId) {
      return void interaction.reply({
        content: '❌ Your configuration session expired. Please run the command again.',
        flags: MessageFlags.Ephemeral
      });
    }

    await interaction.deferReply({ ephemeral: true });
    this.activeEdits.delete(userId);

    const updatedPayload: Record<string, string> = {};
    for (const field of this._fieldConfigs) {
      updatedPayload[field.customId] = interaction.fields.getTextInputValue(field.customId);
    }

    try {
      const response = await fetch(`${this._apiBaseUrl}/servers/${serverId}/${this._section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPayload),
      });

      if (!response.ok) throw new Error('API remote database update rejected the changes.');

      const changesBreakdown = Object.entries(updatedPayload)
        .map(([key, val]) => `• **${key}:** ${val ? `\`${val}\`` : '*Not Set*'}`)
        .join('\n');

      const successEmbed = this.createSuccessEmbed(
        `✅ Section [${this._section.toUpperCase()}] Updated Successfully`,
        `Properties for server **\`${serverId}\`** were securely patched on your REST API.\n\n${changesBreakdown}`
      );

      interaction.editReply({
        content: 'Updated',
      });

      if (interaction.channel && 'send' in interaction.channel) {
        await interaction.channel.send({
          content: `🔔 Section updated by <@${interaction.user.id}>`,
          embeds: [successEmbed]
        });
      }

    } catch (error) {
      console.error(`[Modal Submission Error - ${this.name}]:`, error);
      const errorEmbed = this.createErrorEmbed(`Values modified locally, but the remote database failed to save updates.`);
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
}
