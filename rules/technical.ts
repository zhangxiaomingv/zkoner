import type { Rule } from "@/types";

export const technicalRules: Rule[] = [
  {
    id: "tech-title-length",
    name: "Title Tag Length ≥ 50 characters",
    category: "Technical",
    weight: 8,
    level: "warn",
    message: "",
    recommendation:
      "Ensure your title tag is at least 50 characters long. Titles under 50 characters may not fully describe the page content to AI crawlers.",
  },
  {
    id: "tech-description-length",
    name: "Meta Description Length (120–160 chars)",
    category: "Technical",
    weight: 8,
    level: "warn",
    message: "",
    recommendation:
      "Keep meta descriptions between 120–160 characters. AI models often use this snippet to summarize your page in search results.",
  },
  {
    id: "tech-h1-count",
    name: "Exactly One H1 Tag",
    category: "Technical",
    weight: 6,
    level: "warn",
    message: "",
    recommendation:
      "Use exactly one H1 tag per page. Multiple H1s confuse both search engines and AI parsers about the primary topic.",
  },
  {
    id: "tech-robots-txt",
    name: "robots.txt Present",
    category: "Technical",
    weight: 5,
    level: "fail",
    message: "",
    recommendation:
      "Add a robots.txt file at /robots.txt to guide AI crawlers on which parts of your site they can access.",
  },
  {
    id: "tech-sitemap-xml",
    name: "sitemap.xml Present",
    category: "Technical",
    weight: 5,
    level: "fail",
    message: "",
    recommendation:
      "Submit a sitemap.xml to help AI crawlers discover all important pages on your site.",
  },
  {
    id: "tech-https",
    name: "HTTPS Enforced",
    category: "Technical",
    weight: 8,
    level: "fail",
    message: "",
    recommendation:
      "Serve your site over HTTPS. AI crawlers and modern browsers treat HTTP sites as less trustworthy.",
  },
  {
    id: "tech-canonical",
    name: "Canonical URL Present",
    category: "Technical",
    weight: 5,
    level: "warn",
    message: "",
    recommendation:
      "Add a canonical URL tag to prevent duplicate content issues when AI models index your pages.",
  },
  {
    id: "tech-viewport",
    name: "Viewport Meta Tag",
    category: "Technical",
    weight: 3,
    level: "warn",
    message: "",
    recommendation:
      "Add a viewport meta tag for proper mobile rendering, which indirectly affects mobile-first AI crawlers.",
  },
];
