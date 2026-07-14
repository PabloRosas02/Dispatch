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

  /** Updates the versioning block and auto-stamps the date string */
  public static updateVersion(server: RPServer, version: string, status?: string): void {
    server.ver.version = version;
    server.ver.status = status ?? server.ver.status;
    server.ver.lastUpdate = new Date().toISOString(); // Auto-stamping real ISO string
  }


  // ==========================================
  // 5. SECTIONS / RULES MEMBER FUNCTIONS
  // ==========================================
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
  public static hydrateServer(raw: RPServer): RPServer {
    return {
      basic: {
        id: raw?.basic?.id.trim() ?? "",
        title: raw?.basic?.title ?? "",
        subtitle: raw?.basic?.subtitle ?? "",
        filename: raw?.basic?.filename ?? ""
      },
      addit: {
        color: raw?.addit?.color ?? "#ffffff",
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
