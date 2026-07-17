import {
  GuildMember,
  CommandInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  PermissionsBitField
} from 'discord.js';

export class AdminGuard {
  private static ADMIN_CHANNEL_ID: string;
  private static ADMIN_ROLE_IDS: string[] = [];

  public static configure(channelId: string, roleIds: string[]): void {
    this.ADMIN_CHANNEL_ID = channelId;
    this.ADMIN_ROLE_IDS = roleIds;
  }

  public static async verify(interaction: CommandInteraction | ModalSubmitInteraction | StringSelectMenuInteraction): Promise<{
    allowed: boolean;
    message: string
  }> {
    // Verificar canal
    const channelCheck = await this.checkChannel(interaction.channelId);
    if (!channelCheck.allowed) {
      return channelCheck;
    }

    // Verificar admin
    const adminCheck = await this.checkAdmin(interaction.member as GuildMember | null);
    if (!adminCheck.allowed) {
      return adminCheck;
    }

    // Verificar roles específicos
    const roleCheck = await this.checkRoles(interaction.member as GuildMember | null, interaction.guildId);
    if (!roleCheck.allowed) {
      return roleCheck;
    }

    return {
      allowed: true,
      message: '✅ Verificado como administrador'
    };
  }

  private static async checkChannel(
    channelId: string | null
  ): Promise<{ allowed: boolean; message: string }> {
    if (!this.ADMIN_CHANNEL_ID) {
      return {
        allowed: false,
        message: '❌ Canal de administradores no configurado'
      };
    }

    if (!channelId) {
      return {
        allowed: false,
        message: '❌ No se pudo identificar el canal'
      };
    }

    if (channelId !== this.ADMIN_CHANNEL_ID) {
      const adminChannel = this.getChannelName(channelId);
      return {
        allowed: false,
        message: `❌ Este comando solo puede usarse en ${adminChannel}`
      };
    }

    return { allowed: true, message: 'Canal correcto' };
  }

  private static async checkAdmin(
    member: GuildMember | null
  ): Promise<{ allowed: boolean; message: string }> {
    if (!member) {
      return {
        allowed: false,
        message: '❌ No se pudo verificar tu identidad'
      };
    }
    const hasRequiredRole = member.roles.cache.some(role =>
      this.ADMIN_ROLE_IDS.includes(role.id)
    );

    // Verificar si tiene permisos de administrador
    if (!hasRequiredRole) {
      return {
        allowed: false,
        message: '❌ Necesitas ser administrador del servidor'
      };
    }

    return { allowed: true, message: 'Administrador verificado' };
  }

  private static async checkRoles(
    member: GuildMember | null,
    guildId: string | null
  ): Promise<{ allowed: boolean; message: string }> {
    if (this.ADMIN_ROLE_IDS.length === 0) {
      return { allowed: true, message: 'Sin roles adicionales requeridos' };
    }

    if (!member) {
      return {
        allowed: false,
        message: '❌ No se pudo verificar tu identidad'
      };
    }

    const hasRequiredRole = this.ADMIN_ROLE_IDS.some(roleId =>
      member.roles.cache.has(roleId)
    );

    if (!hasRequiredRole) {
      const roleNames = this.ADMIN_ROLE_IDS
        .map(id => {
          const role = member.guild?.roles.cache.get(id);
          return role ? `@${role.name}` : id;
        })
        .join(', ');

      return {
        allowed: false,
        message: `❌ Necesitas uno de estos roles: ${roleNames}`
      };
    }

    return { allowed: true, message: 'Roles verificados' };
  }

  /**
   * Obtiene el nombre de un canal por su ID (si está disponible en caché)
   */
  private static getChannelName(channelId: string): string {
    // Este método necesita acceso al cliente, pero como no lo tenemos,
    // devolvemos un mensaje genérico
    return `#${channelId}`;
  }
}
