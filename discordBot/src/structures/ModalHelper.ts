import {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ModalActionRowComponentBuilder
} from 'discord.js';

export interface FormFieldConfig {
  customId: string;
  label: string;
  style: TextInputStyle;
  placeholder?: string;
  required?: boolean;
  value?: string;
  minLength?: number;
  maxLength?: number;
}

export class ModalHelper {
  public static create(
    commandName: string,
    title: string,
    fields: FormFieldConfig[]
  ): ModalBuilder {
    if (fields.length > 5) {
      throw new Error('Discord modals cannot exceed 5 fields.');
    }

    const modalCustomId = commandName.endsWith('_modal') ? commandName : `${commandName}_modal`;
    const modal = new ModalBuilder()
      .setCustomId(modalCustomId)
      .setTitle(title);

    const rows = fields.map((field) => {
      const input = new TextInputBuilder()
        .setCustomId(field.customId)
        .setLabel(field.label)
        .setStyle(field.style)
        .setRequired(field.required ?? false);

      if (field.placeholder) input.setPlaceholder(field.placeholder);

      // Prevent "null" or "undefined" from being rendered as literal text
      if (field.value !== undefined && field.value !== null) {
        input.setValue(String(field.value));
      }

      if (field.minLength !== undefined) input.setMinLength(field.minLength);
      if (field.maxLength !== undefined) input.setMaxLength(field.maxLength);

      return new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(input);
    });

    modal.setComponents(rows);
    return modal;
  }
}
