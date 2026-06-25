import type { Rule } from "@/types";

export const citationsRules: Rule[] = [
  {
    id: "cite-reference-section",
    name: "Reference / Sources Section",
    category: "Citations",
    weight: 10,
    level: "warn",
    message: "",
    recommendation:
      "Include a dedicated References or Sources section. AI models prioritize content with cited sources for factual answers.",
  },
  {
    id: "cite-source-attribution",
    name: "Source Attribution Inline",
    category: "Citations",
    weight: 8,
    level: "warn",
    message: "",
    recommendation:
      "Attribute claims and statistics to their sources inline. AI models look for verifiable attributions.",
  },
  {
    id: "cite-statistics",
    name: "Statistics with Sources",
    category: "Citations",
    weight: 7,
    level: "warn",
    message: "",
    recommendation:
      "Cite specific statistics with their sources. Data-backed content is more likely to be cited by AI responses.",
  },
  {
    id: "cite-blockquote",
    name: "Blockquote for Quotations",
    category: "Citations",
    weight: 5,
    level: "warn",
    message: "",
    recommendation:
      "Use <blockquote> tags for quotations. AI models recognize blockquotes as cited external content.",
  },
  {
    id: "cite-bibliography",
    name: "Bibliography / Further Reading",
    category: "Citations",
    weight: 5,
    level: "warn",
    message: "",
    recommendation:
      "Include a bibliography or further reading section to demonstrate depth of research and increase authority signals.",
  },
  {
    id: "cite-link-external",
    name: "External Links to Authorities",
    category: "Citations",
    weight: 6,
    level: "warn",
    message: "",
    recommendation:
      "Link to authoritative external sources. AI models use outbound link patterns as a credibility signal.",
  },
];
