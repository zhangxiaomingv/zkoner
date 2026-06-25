import type { Rule } from "@/types";

export const geoRules: Rule[] = [
  {
    id: "geo-llms-txt",
    name: "llms.txt File Present",
    category: "GEO",
    weight: 10,
    level: "fail",
    message: "",
    recommendation:
      "Create an llms.txt file at /llms.txt following the LLMstxt standard. This is the #1 GEO signal — it tells AI crawlers exactly what your site offers.",
  },
  {
    id: "geo-faqpage-schema",
    name: "FAQPage Schema (JSON-LD)",
    category: "GEO",
    weight: 9,
    level: "fail",
    message: "",
    recommendation:
      "Add FAQPage schema markup. AI models use this structured data to surface Q&A content in conversational responses.",
  },
  {
    id: "geo-list-format",
    name: "List / Bullet-Point Content",
    category: "GEO",
    weight: 6,
    level: "warn",
    message: "",
    recommendation:
      "Format key information as lists. AI models parse list structures more reliably than dense paragraphs.",
  },
  {
    id: "geo-structured-content",
    name: "Structured / Semantic Content",
    category: "GEO",
    weight: 7,
    level: "warn",
    message: "",
    recommendation:
      "Use semantic HTML5 elements (<article>, <section>, <nav>, <aside>) to help AI crawlers understand your content hierarchy.",
  },
  {
    id: "geo-howto-schema",
    name: "HowTo Schema (JSON-LD)",
    category: "GEO",
    weight: 7,
    level: "warn",
    message: "",
    recommendation:
      "Add HowTo schema for instructional content. AI models frequently use HowTo data in step-by-step answers.",
  },
  {
    id: "geo-qapage-schema",
    name: "QAPage Schema (JSON-LD)",
    category: "GEO",
    weight: 6,
    level: "warn",
    message: "",
    recommendation:
      "Add QAPage schema for Q&A content. Helps AI models identify and surface question-answer pairs.",
  },
  {
    id: "geo-table-data",
    name: "Tabular Data Present",
    category: "GEO",
    weight: 5,
    level: "warn",
    message: "",
    recommendation:
      "Use HTML tables for comparative or structured data. AI models extract table data for direct answers.",
  },
];
