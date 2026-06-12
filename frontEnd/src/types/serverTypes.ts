
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
  image: string;
  discordLink: string;
  color: string;
  sections: RuleSection[];
}
