
// Define types of server
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
  id: string;

  title: string;
  subtitle: string;
  description: string;

  filename: string;
  color: string;
  discordLink: string;

  /* Banner */

  bannerImage: string;
  bannerLabel: string;
  bannerDescription: string;

  /* Status */

  version: string;
  lastUpdate: string;
  status: string;

  sections: RuleSection[];
}

export interface NewsArticle {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  date: string;
  author: string;
  category: string;
  images: string[];
  videoUrl?: string;
}