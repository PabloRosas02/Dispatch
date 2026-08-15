export class Validators {
  /**
   * Valida un ID de Discord (17-20 dígitos)
   */
  static isValidDiscordId(value: string): boolean {
    return /^\d{17,20}$/.test(value);
  }

  /**
   * Valida un ID alfanumérico con guiones
   */
  static isValidId(value: string): boolean {
    return /^[a-zA-Z0-9-]+$/.test(value) && value.length >= 3;
  }

  /**
   * Valida un color hex
   */
  static isValidHexColor(value: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
  }
}
