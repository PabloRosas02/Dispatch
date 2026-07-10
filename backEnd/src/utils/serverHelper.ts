import {
  RPServer,
  BasicInfo,
  AdditionalInfo,
  BannerDetails,
  VersionAndStatus,
  RuleSection,
  RuleItem
} from "../interfaces/ServerInterfaces"; // Adjust path as needed

export class RPServerHelper {

  // ==========================================
  // 1. BASIC INFO MEMBER FUNCTIONS
  // ==========================================
  public static getId(server: RPServer): string {
    return server.basic.id;
  }

  /** Gets the basic info block */
  public static getBasicInfo(server: RPServer): BasicInfo {
    return server.basic;
  }

  /** Updates the entire basic info block */
  public static updateBasicInfo(server: RPServer, basic: BasicInfo): void {
    server.basic = basic;
  }

  /** Specific reference updater for basic.title */
  public static updateTitle(server: RPServer, title: string): void {
    server.basic.title = title;
  }

  /** Specific reference updater for basic.subtitle */
  public static updateSubtitle(server: RPServer, subtitle: string): void {
    server.basic.subtitle = subtitle;
  }


  // ==========================================
  // 2. ADDITIONAL INFO MEMBER FUNCTIONS
  // ==========================================

  /** Gets the additional info block */
  public static getAdditionalInfo(server: RPServer): AdditionalInfo {
    return server.addit;
  }

  /** Updates the entire additional info block */
  public static updateAdditionalInfo(server: RPServer, addit: AdditionalInfo): void {
    server.addit = addit;
  }

  /** Safely updates the optional discord link */
  public static updateDiscordLink(server: RPServer, link?: string): void {
    server.addit.discordLink = link;
  }


  // ==========================================
  // 3. BANNER DETAILS MEMBER FUNCTIONS
  // ==========================================

  /** Gets the banner configuration */
  public static getBannerDetails(server: RPServer): BannerDetails {
    return server.banner;
  }

  /** Updates the entire banner configuration */
  public static updateBannerDetails(server: RPServer, banner: BannerDetails): void {
    server.banner = banner;
  }

  /** Reference helper to change just the banner image URL */
  public static updateBannerImage(server: RPServer, imageUrl?: string): void {
    server.banner.bannerImage = imageUrl;
  }


  // ==========================================
  // 4. VERSION AND STATUS MEMBER FUNCTIONS
  // ==========================================

  /** Gets the versioning block */
  public static getVersionAndStatus(server: RPServer): VersionAndStatus {
    return server.ver;
  }

  /** Updates the versioning block and auto-stamps the date string */
  public static updateVersion(server: RPServer, version: string, status?: string): void {
    server.ver.version = version;
    server.ver.status = status || server.ver.status;
    server.ver.lastUpdate = new Date().toISOString(); // Auto-stamping real ISO string
  }


  // ==========================================
  // 5. SECTIONS / RULES MEMBER FUNCTIONS
  // ==========================================

  /** Gets all rule sections */
  public static getSections(server: RPServer): RuleSection[] {
    return server.sections;
  }

  /** Adds a completely new rule section (e.g., "General Rules") */
  public static addSection(server: RPServer, title: string): void {
    server.sections.push({ title, rules: [] });
  }

  /** * Adds a rule item to a specific section by section title matching
   * Returns true if successful, false if section wasn't found
   */
  public static addRuleToSection(server: RPServer, sectionTitle: string, rule: RuleItem): boolean {
    const section = server.sections.find(s => s.title.toLowerCase() === sectionTitle.toLowerCase());
    if (section) {
      section.rules.push(rule);
      return true;
    }
    return false;
  }

  /** Clear all rules from a section */
  public static clearSectionRules(server: RPServer, sectionTitle: string): boolean {
    const section = server.sections.find(s => s.title.toLowerCase() === sectionTitle.toLowerCase());
    if (section) {
      section.rules = [];
      return true;
    }
    return false;
  }

  /**
   * Toma un objeto plano del JSON y garantiza que tenga todas las ramas estructurales 
   * requeridas por la interfaz RPServer para evitar errores de propiedades indefinidas.
   */
  public static hydrateServer(raw: any): RPServer {
    return {
      basic: {
        id: raw?.basic?.id.trim() || "",
        title: raw?.basic?.title || "",
        subtitle: raw?.basic?.subtitle || "",
        filename: raw?.basic?.filename || ""
      },
      addit: {
        color: raw?.addit?.color || "#ffffff",
        description: raw?.addit?.description,
        discordLink: raw?.addit?.discordLink
      },
      banner: {
        bannerImage: raw?.banner?.bannerImage,
        bannerLabel: raw?.banner?.bannerLabel,
        bannerDescription: raw?.banner?.bannerDescription
      },
      ver: {
        version: raw?.ver?.version,
        lastUpdate: raw?.ver?.lastUpdate,
        status: raw?.ver?.status
      },
      // ⚠️ CRÍTICO: Garantizamos que las secciones siempre sean un array iterable
      sections: Array.isArray(raw?.sections) ? raw.sections : []
    };
  }

}
