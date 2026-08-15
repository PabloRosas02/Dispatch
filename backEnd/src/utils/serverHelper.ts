import {
  RPServer,
  BasicInfo,
  AdditionalInfo,
  BannerDetails,
  RuleSection,
  RuleItem
} from "../interfaces/ServerInterfaces"; // Adjust path as needed

export class RPServerHelper {

  private static getLastUpdate(): string {
    const MONTHS_ES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const now = new Date();

    const dayNum = now.getDate(); // 1 - 31
    const monthIdx = now.getMonth(); // 0 - 11
    const year = now.getFullYear(); // e.g., 2026

    const day = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const month = MONTHS_ES[monthIdx];

    return `${day} ${month} ${year}`;
  }

  /** Updates the entire basic info block */
  public static updateBasicInfo(server: RPServer, basic: Partial<BasicInfo>): void {

    if (!server?.basic) {
      return;
    }

    if (basic.title !== undefined) {
      server.basic.title = basic.title;
    }

    if (basic.subtitle !== undefined) {
      server.basic.subtitle = basic.subtitle;
    }

    if (server?.ver) {
      server.ver.lastUpdate = this.getLastUpdate();
    }
  }

  // ==========================================
  // 2. ADDITIONAL INFO MEMBER FUNCTIONS
  // ==========================================
  /** Updates the entire additional info block */
  public static updateAdditionalInfo(server: RPServer, addit: Partial<AdditionalInfo>): void {
    if (!server?.addit) return;

    if (addit.color !== undefined) {
      server.addit.color = addit.color;
    }
    if (addit.discordLink !== undefined) {
      server.addit.discordLink = addit.discordLink;
    }
    if (addit.description !== undefined) {
      server.addit.description = addit.description;
    }
    if (server?.ver) {
      server.ver.lastUpdate = this.getLastUpdate();
    }
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
    if (!server?.banner) return;

    if (banner.bannerLabel !== undefined) {
      server.banner.bannerLabel = banner.bannerLabel;
    }

    if (banner.bannerDescription !== undefined) {
      server.banner.bannerDescription = banner.bannerDescription;
    }

    if (server?.ver) {
      server.ver.lastUpdate = this.getLastUpdate();
    }
  }

  // ==========================================
  // 4. VERSION AND STATUS MEMBER FUNCTIONS
  // ==========================================

  /** Updates the versioning block and auto-stamps the date string */
  public static updateVersionAndStatus(server: RPServer, version?: string, status?: string): void {
    if (!server?.ver) return;

    // 1. Update status if provided
    if (status !== undefined) {
      server.ver.status = status;
    }

    // 2. Update version if explicitly provided
    if (version !== undefined) {
      server.ver.version = version;
    }

    server.ver.lastUpdate = this.getLastUpdate();
  }


  // ==========================================
  // 5. SECTIONS / RULES MEMBER FUNCTIONS
  // ==========================================
  /** Adds a completely new rule section (e.g., "General Rules") */
  public static addSection(server: RPServer, title: string): void {
    server.sections.push({ title, rules: [] });
    if (server?.ver) {
      server.ver.lastUpdate = this.getLastUpdate();
    }
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
      sections: Array.isArray(raw?.sections) ? raw.sections : [],
      
       images: Array.isArray(raw?.images) ? raw.images : []
    };
  }

}
