export interface FactionData {
  title: string;         // Ej: "L.E.O ROL"
  subtitle: string;      // Ej: "LAW ENFORCEMENT & ORDER'"
  description: string;   // Texto descriptivo largo
  imageUrl: string;      // URL de la imagen dentro de la Polaroid
  exploreBtnText: string;// Ej: "EXPLORA L.E.O ROL"
  discordLink: string;   // Enlace de invitación a Discord
}

export interface KinsfolkPageConfig {
  // Pantalla Principal (Hero)
  welcomeTitle: string;
  welcomeDescription: string;
  ctaText: string;
  
  // Secciones de Facciones (Mapeadas por ID: 'leo', 'sams', 'illegales')
  factions: Record<string, FactionData>;
}