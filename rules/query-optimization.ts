import type { Rule } from "@/types";

export const queryOptimizationRules: Rule[] = [
  {
    id: "qo-faq",
    name: "FAQ Section Present",
    category: "Query Optimization",
    weight: 10,
    level: "warn",
    message: "",
    recommendation:
      "Include an FAQ section on key pages. AI models frequently surface FAQ content in direct answers.",
  },
  {
    id: "qo-question-headings",
    name: "Question-Formatted Headings",
    category: "Query Optimization",
    weight: 8,
    level: "warn",
    message: "",
    recommendation:
      "Use question-style headings (e.g., 'How does X work?') in your content. AI models match these to user queries.",
  },
  {
    id: "qo-answer-pattern",
    name: "Direct Answer Patterns",
    category: "Query Optimization",
    weight: 7,
    level: "warn",
    message: "",
    recommendation:
      "Structure content with clear question-then-answer patterns. AI models extract these for featured snippets.",
  },
  {
    id: "qo-tldr",
    name: "TLDR / Key Takeaways Section",
    category: "Query Optimization",
    weight: 7,
    level: "warn",
    message: "",
    recommendation:
      "Add a TLDR or Key Takeaways section at the top of long-form content. AI models use this for concise summaries.",
  },
  {
    id: "qo-summary",
    name: "Executive Summary / Abstract",
    category: "Query Optimization",
    weight: 6,
    level: "warn",
    message: "",
    recommendation:
      "Include a summary or abstract section. AI models often pull from summaries when generating overviews.",
  },
  {
    id: "qo-featured-snippet",
    name: "Featured Snippet Friendly",
    category: "Query Optimization",
    weight: 8,
    level: "warn",
    message: "",
    recommendation:
      "Use bullet points, numbered lists, and concise paragraphs (40–50 words) to increase chances of being used as a featured snippet by AI.",
  },
  {
    id: "qo-list-format",
    name: "Bulleted / Numbered Lists",
    category: "Query Optimization",
    weight: 5,
    level: "warn",
    message: "",
    recommendation:
      "Use lists to break down complex information. AI models and search engines favor well-structured list content.",
  },
];
