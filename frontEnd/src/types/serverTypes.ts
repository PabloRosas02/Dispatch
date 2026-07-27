
// Define types of server
export interface BasicInfo {
  id: string;
  title: string;
  subtitle: string;
  filename: string;
}

export interface AdditionalInfo {
  color: string;
  description: string;
  discordLink: string;
}

export interface BannerDetails {
  bannerImage: string;
  bannerLabel: string;
  bannerDescription: string;
}

export interface VersionAndStatus {
  version: string;
  lastUpdate: string;
  status: string;
}


export interface RuleItem {
  title: string;
  description: string;
  example?: string;
}

export interface RuleSection {
  title: string;
  rules: RuleItem[];
}

export interface RPServer {
  basic: BasicInfo;
  addit: AdditionalInfo;
  banner: BannerDetails;
  ver: VersionAndStatus;
  sections: RuleSection[];
  images?: string[];
}
