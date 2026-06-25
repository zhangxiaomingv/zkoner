import type { Rule } from "@/types";

export const entityRecognitionRules: Rule[] = [
  {
    id: "entity-org-schema",
    name: "Organization Schema (JSON-LD)",
    category: "Entity Recognition",
    weight: 10,
    level: "fail",
    message: "",
    recommendation:
      "Add Organization schema markup to help AI models identify your brand, logo, and social profiles. Use JSON-LD format.",
  },
  {
    id: "entity-person-schema",
    name: "Person / Author Schema",
    category: "Entity Recognition",
    weight: 8,
    level: "warn",
    message: "",
    recommendation:
      "Add Person schema for authors or key team members. AI models use this to attribute expertise and authority.",
  },
  {
    id: "entity-author-meta",
    name: "Author Meta Tag Present",
    category: "Entity Recognition",
    weight: 5,
    level: "warn",
    message: "",
    recommendation:
      "Include an author meta tag or byline on articles. AI crawlers use it to establish content authorship.",
  },
  {
    id: "entity-about-meta",
    name: "About / Topic Metadata",
    category: "Entity Recognition",
    weight: 5,
    level: "warn",
    message: "",
    recommendation:
      "Add about or topic metadata to help AI models categorize your content correctly.",
  },
  {
    id: "entity-mentions",
    name: "Entity Mentions / References",
    category: "Entity Recognition",
    weight: 6,
    level: "warn",
    message: "",
    recommendation:
      "Include clear entity mentions (people, brands, technologies) in your content. AI models use these as topical signals.",
  },
  {
    id: "entity-article-schema",
    name: "Article Schema (JSON-LD)",
    category: "Entity Recognition",
    weight: 8,
    level: "warn",
    message: "",
    recommendation:
      "Add Article schema markup to help AI models understand your content type, headline, and publication date.",
  },
  {
    id: "entity-logo-schema",
    name: "Logo / Brand Schema",
    category: "Entity Recognition",
    weight: 5,
    level: "warn",
    message: "",
    recommendation:
      "Add Logo or Brand schema so AI models can correctly associate your brand identity with your content.",
  },
];
