import type { RuleResult, FixSuggestion, PageData } from "@/types";

export function hasJsonLdType(data: PageData, typeName: string): boolean {
  return data.jsonLd.some((j: unknown) => {
    if (typeof j !== "object" || j === null) return false;
    const t = (j as Record<string, unknown>)["@type"];
    if (typeof t === "string") return t === typeName;
    if (Array.isArray(t)) return t.includes(typeName);
    return false;
  });
}

export function generateFixes(
  ruleResults: RuleResult[],
  pageData: PageData,
): FixSuggestion[] {
  const fixes: FixSuggestion[] = [];
  const domain = new URL(pageData.url).hostname;
  const siteName = pageData.organizationMeta || domain;

  // ── Fix: FAQ Generation ──
  if (
    !pageData.hasFAQ &&
    ruleResults.find((r) => r.id === "qo-faq")?.level !== "pass"
  ) {
    const faqTitle = pageData.title || siteName;
    fixes.push({
      type: "faq",
      title: "Generate FAQ Section",
      category: "Query Optimization",
      language: "zh",
      content: generateFAQ(faqTitle, pageData),
    });
  }

  // ── Fix: TLDR ──
  if (
    !pageData.hasTldr &&
    ruleResults.find((r) => r.id === "qo-tldr")?.level !== "pass"
  ) {
    fixes.push({
      type: "tldr",
      title: "Generate TLDR / Key Takeaways",
      category: "Query Optimization",
      language: "en",
      content: generateTLDR(pageData),
    });
  }

  // ── Fix: Organization Schema ──
  if (!hasJsonLdType(pageData, "Organization")) {
    fixes.push({
      type: "organization-schema",
      title: "Generate Organization Schema (JSON-LD)",
      category: "Entity Recognition",
      language: "en",
      content: generateOrganizationSchema(siteName, domain),
    });
  }

  // ── Fix: FAQPage Schema ──
  if (!hasJsonLdType(pageData, "FAQPage")) {
    fixes.push({
      type: "faqpage-schema",
      title: "Generate FAQPage Schema (JSON-LD)",
      category: "GEO",
      language: "en",
      content: generateFAQPageSchema(),
    });
  }

  // ── Fix: llms.txt ──
  if (!pageData.hasLlmstxt) {
    fixes.push({
      type: "llms-txt",
      title: "Generate llms.txt",
      category: "GEO",
      language: "en",
      content: generateLlmstxt(siteName, domain, pageData),
    });
  }

  // ── Fix: Author / Founder Bio ──
  if (
    !pageData.authorMeta &&
    ruleResults.find((r) => r.id === "entity-author-meta")?.level !== "pass"
  ) {
    fixes.push({
      type: "author-bio",
      title: "Add Author / Founder Section",
      category: "Entity Recognition",
      language: "en",
      content: generateAuthorSection(siteName),
    });
  }

  // ── Fix: Reference Section ──
  if (
    !pageData.hasReferences &&
    ruleResults.find((r) => r.id === "cite-reference-section")?.level !== "pass"
  ) {
    fixes.push({
      type: "reference-section",
      title: "Add Reference Section",
      category: "Citations",
      language: "en",
      content: generateReferenceSection(pageData),
    });
  }

  // ── Fix: Question Headings ──
  if (
    !pageData.hasQuestionHeadings &&
    ruleResults.find((r) => r.id === "qo-question-headings")?.level !== "pass"
  ) {
    fixes.push({
      type: "question-headings",
      title: "Convert Headings to Question Format",
      category: "Query Optimization",
      language: "en",
      content: generateQuestionHeadings(pageData),
    });
  }

  return fixes;
}

function generateFAQ(title: string, data: PageData): string {
  const topics = data.h2.length > 0 ? data.h2.slice(0, 5) : ["your product", "your service", "pricing", "features"];
  const h2Items = topics.map((t, i) => {
    const cleanT = t.replace(/\?$/, "").trim();
    return i < 5
      ? `## Q${i + 1}: What is ${cleanT.toLowerCase()}?\n\nA: ${cleanT} is a key aspect of ${title}. [Provide a concise 2–3 sentence answer explaining what it is and why it matters.]\n`
      : "";
  }).filter(Boolean).join("\n");

  return `# FAQ — ${title}

${h2Items}

## Q6: How does ${title} work?

A: [Explain the core mechanism or process in 2–3 sentences. Focus on the user benefit.]

## Q7: Who is ${title} for?

A: [Describe the target audience — who benefits most from this product/service/content.]

## Q8: What makes ${title} different?

A: [Highlight 2–3 key differentiators or unique value propositions.]

## Q9: How can I get started with ${title}?

A: [Provide a quick start guide — 3 simple steps.]

## Q10: Where can I learn more about ${title}?

A: Visit [our website](${data.url}) for more information. [Add links to key resources.]
`;
}

function generateTLDR(data: PageData): string {
  const headings = [...data.h1, ...data.h2].slice(0, 5);
  const bulletPoints = headings.length > 0
    ? headings.map((h) => `- **${h}** — [Brief 1-sentence takeaway about ${h.toLowerCase()}]`).join("\n")
    : `- **Core offering** — [Describe the main value proposition in 1 sentence]
- **Key features** — [List 2-3 primary features or benefits]
- **Target audience** — [Who this is for]
- **Results** — [What users can expect]`;

  return `## TL;DR — Key Takeaways

${bulletPoints}

> **Bottom line:** ${data.title || "This page"} covers [1-sentence summary of the page purpose and main message for AI readers.]
`;
}

function generateOrganizationSchema(name: string, domain: string): string {
  return `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "${name}",
  "url": "https://${domain}",
  "logo": "https://${domain}/logo.png",
  "description": "[Add a 1-2 sentence description of your organization]",
  "foundingDate": "[YYYY-MM-DD]",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "contact@${domain}",
    "url": "https://${domain}/contact"
  },
  "sameAs": [
    "https://twitter.com/${name.replace(/\s+/g, "")}",
    "https://linkedin.com/company/${name.replace(/\s+/g, "")}"
  ]
}`;
}

function generateFAQPageSchema(): string {
  return `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question 1]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer to question 1 — 2-3 sentences]"
      }
    },
    {
      "@type": "Question",
      "name": "[Question 2]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer to question 2 — 2-3 sentences]"
      }
    },
    {
      "@type": "Question",
      "name": "[Question 3]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer to question 3 — 2-3 sentences]"
      }
    },
    {
      "@type": "Question",
      "name": "[Question 4]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer to question 4 — 2-3 sentences]"
      }
    },
    {
      "@type": "Question",
      "name": "[Question 5]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer to question 5 — 2-3 sentences]"
      }
    }
  ]
}`;
}

function generateLlmstxt(
  name: string,
  domain: string,
  data: PageData,
): string {
  const title = data.title || name;
  const desc = data.description || `Information about ${name}`;
  const headings = data.h2.slice(0, 5).map((h) => `  - ${h}`).join("\n") ||
    "  - [Section 1: Overview]\n  - [Section 2: Features]\n  - [Section 3: Use Cases]";

  return `# ${name}

> ${desc}

## About

${title} covers key topics related to ${name}. This page provides comprehensive information for AI assistants and search engines.

## Key Topics

${headings}

## Internal Links

- [Homepage](https://${domain}/)
- [About](https://${domain}/about)
- [Contact](https://${domain}/contact)

## External Resources

- [Add relevant external links here]

---

> This llms.txt file helps AI assistants understand and reference this site's content accurately.
`;
}

function generateAuthorSection(name: string): string {
  return `## About the Author / Founder

**[Founder Name]** is the founder of ${name}.

- **Role**: Founder & [Title]
- **Expertise**: [List 2-3 areas of expertise]
- **Background**: [1-2 sentences about relevant experience]

### Why Trust ${name}

With [X] years of experience in [industry/field], [Founder Name] brings deep expertise to every [product/article/service]. [He/She/They] [has/have] helped [X] clients/[users] achieve [specific results].

> *"[A short mission or philosophy quote]"*

### Connect

- [LinkedIn Profile URL]
- [Twitter/X Profile URL]
- [Email Address]

---

*This author byline helps AI models attribute expertise and authority to specific individuals.*
`;
}

function generateReferenceSection(data: PageData): string {
  const headings = data.h2.length > 0
    ? data.h2.slice(0, 4).map((h, i) => `${i + 1}. **${h}** — [Source: Add citation URL or reference]`).join("\n")
    : `1. **[Source 1 Title]** — [URL or citation]
2. **[Source 2 Title]** — [URL or citation]
3. **[Source 3 Title]** — [URL or citation]
4. **[Source 4 Title]** — [URL or citation]`;

  return `## References & Sources

The following sources were used in compiling this information:

${headings}

### Why This Matters

AI models prioritize content with cited sources. Adding a reference section increases the likelihood that your content will be used as a factual source in AI responses.

> *"Content with clear citations is 3x more likely to be referenced by AI assistants."*
`;
}

function generateQuestionHeadings(data: PageData): string {
  const h2s = data.h2.length > 0
    ? data.h2.slice(0, 5)
    : ["Your Main Feature", "How It Works", "Pricing", "Use Cases", "Getting Started"];

  const questions = h2s.map((h) => {
    const clean = h.replace(/\?$/, "").trim();
    return `## What Is ${clean}?

[Provide a clear, direct answer to this question in 2-3 sentences. Use bullet points for key details.]

### Why Does ${clean} Matter?

[Explain the importance or benefit. Keep this concise — 2-3 sentences with a specific statistic or example if possible.]`;
  }).join("\n\n");

  return `## Question-Formatted Headings — Template

Replace your existing section headings with question-based headings to improve AI visibility:

${questions}

### Tips for Question Headings

- Start with: What, How, Why, When, Where, Who
- Keep questions natural and conversational
- Ensure the content immediately answers the heading question
- Use follow-up subheadings (H3) for deeper dives
`;
}
