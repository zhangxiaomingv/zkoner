import type { Rule } from "@/types";

export const aiBotAccessRules: Rule[] = [
  {
    id: "bot-gptbot",
    name: "GPTBot Allowed in robots.txt",
    category: "AI Bot Access",
    weight: 8,
    level: "fail",
    message: "",
    recommendation:
      "Allow GPTBot (OpenAI) in your robots.txt to ensure ChatGPT can index your content. Use: User-agent: GPTBot, Allow: /",
  },
  {
    id: "bot-claudebot",
    name: "ClaudeBot Allowed in robots.txt",
    category: "AI Bot Access",
    weight: 8,
    level: "fail",
    message: "",
    recommendation:
      "Allow ClaudeBot (Anthropic) in your robots.txt so Claude can reference your site. Use: User-agent: ClaudeBot, Allow: /",
  },
  {
    id: "bot-ccbot",
    name: "CCBot Allowed in robots.txt",
    category: "AI Bot Access",
    weight: 6,
    level: "fail",
    message: "",
    recommendation:
      "Allow CCBot (Common Crawl) in your robots.txt. Many AI models train on Common Crawl data. Use: User-agent: CCBot, Allow: /",
  },
  {
    id: "bot-perplexity",
    name: "PerplexityBot Allowed in robots.txt",
    category: "AI Bot Access",
    weight: 7,
    level: "fail",
    message: "",
    recommendation:
      "Allow PerplexityBot in your robots.txt so Perplexity AI can discover your content. Use: User-agent: PerplexityBot, Allow: /",
  },
  {
    id: "bot-googleother",
    name: "GoogleOther Allowed in robots.txt",
    category: "AI Bot Access",
    weight: 5,
    level: "warn",
    message: "",
    recommendation:
      "Allow GoogleOther in your robots.txt — used by Google's AI training pipelines. Use: User-agent: GoogleOther, Allow: /",
  },
  {
    id: "bot-anthropic-ai",
    name: "anthropic-ai Allowed in robots.txt",
    category: "AI Bot Access",
    weight: 7,
    level: "fail",
    message: "",
    recommendation:
      "Allow anthropic-ai in your robots.txt. This covers additional Anthropic AI crawlers. Use: User-agent: anthropic-ai, Allow: /",
  },
  {
    id: "bot-diffbot",
    name: "Diffbot Allowed in robots.txt",
    category: "AI Bot Access",
    weight: 4,
    level: "warn",
    message: "",
    recommendation:
      "Allow Diffbot in your robots.txt. Diffbot powers several AI knowledge graphs. Use: User-agent: Diffbot, Allow: /",
  },
];
