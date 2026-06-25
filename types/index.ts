export type RuleLevel = "pass" | "warn" | "fail";

export interface Rule {
  id: string;
  name: string;
  category: string;
  weight: number;
  level: RuleLevel;
  message: string;
  recommendation: string;
}

export interface RuleResult {
  id: string;
  name: string;
  category: string;
  weight: number;
  level: RuleLevel;
  message: string;
  recommendation: string;
}

export interface CategoryResult {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: RuleLevel;
  ruleResults: RuleResult[];
}

export interface FixSuggestion {
  type: string;
  title: string;
  category: string;
  content: string;
  language: "zh" | "en";
}

export interface PageData {
  url: string;
  title: string | null;
  description: string | null;
  h1: string[];
  h2: string[];
  h3: string[];
  jsonLd: unknown[];
  canonical: string | null;
  robotsMeta: string | null;
  authorMeta: string | null;
  organizationMeta: string | null;
  hasFAQ: boolean;
  hasReferences: boolean;
  hasBlockquotes: boolean;
  hasLists: boolean;
  hasTldr: boolean;
  hasSummary: boolean;
  hasQuestionHeadings: boolean;
  wordCount: number;
  hasRobotsTxt: boolean;
  hasSitemapXml: boolean;
  hasLlmstxt: boolean;
  isHttps: boolean;
  robotsTxtContent: string | null;
  llmstxtContent: string | null;
  aiBotRules: Record<string, boolean>;
  statusCode: number;
  fetchError: string | null;
}

export interface ScanResult {
  id: string;
  url: string;
  timestamp: string;
  score: number;
  categories: CategoryResult[];
  rules: RuleResult[];
  fixes: FixSuggestion[];
  pageData: PageData;
}

export interface ScanRequest {
  url: string;
}

export interface ScanResponse {
  id: string;
}
