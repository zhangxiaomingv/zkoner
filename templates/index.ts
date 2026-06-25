/**
 * templates/ — GEO 优化模板库
 *
 * 可复用的修复模板，用户复制即用。
 * 每个模板生成一段可直接添加到网站的代码/内容。
 */

import type { PageData } from "@/types";

export function generateFAQ(title: string, data: PageData): string {
  const topics = data.h2.length > 0 ? data.h2.slice(0, 5) : ["your product", "your service", "pricing", "features"];
  const h2Items = topics
    .map((t, i) => {
      const cleanT = t.replace(/\?$/, "").trim();
      return i < 5
        ? `## Q${i + 1}: What is ${cleanT.toLowerCase()}?\n\nA: ${cleanT} is a key aspect of ${title}. [Provide a concise 2–3 sentence answer explaining what it is and why it matters.]\n`
        : "";
    })
    .filter(Boolean)
    .join("\n");

  return `# FAQ — ${title}\n\n${h2Items}\n\n## Q6: How does ${title} work?\n\nA: [Explain the core mechanism or process in 2–3 sentences. Focus on the user benefit.]\n\n## Q7: Who is ${title} for?\n\nA: [Describe the target audience — who benefits most from this product/service/content.]\n\n## Q8: What makes ${title} different?\n\nA: [Highlight 2–3 key differentiators or unique value propositions.]\n\n## Q9: How can I get started with ${title}?\n\nA: [Provide a quick start guide — 3 simple steps.]\n\n## Q10: Where can I learn more about ${title}?\n\nA: Visit [our website](${data.url}) for more information. [Add links to key resources.]\n`;
}

export function generateTLDR(data: PageData): string {
  const headings = [...data.h1, ...data.h2].slice(0, 5);
  const bulletPoints =
    headings.length > 0
      ? headings
          .map(
            (h) =>
              `- **${h}** — [Brief 1-sentence takeaway about ${h.toLowerCase()}]`,
          )
          .join("\n")
      : `- **Core offering** — [Describe the main value proposition in 1 sentence]\n- **Key features** — [List 2-3 primary features or benefits]\n- **Target audience** — [Who this is for]\n- **Results** — [What users can expect]`;

  return `## TL;DR — Key Takeaways\n\n${bulletPoints}\n\n> **Bottom line:** ${data.title || "This page"} covers [1-sentence summary of the page purpose and main message for AI readers.]\n`;
}

export function generateOrganizationSchema(name: string, domain: string): string {
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

export function generateFAQPageSchema(): string {
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

export function generateLlmstxt(
  name: string,
  domain: string,
  data: PageData,
): string {
  const title = data.title || name;
  const desc = data.description || `Information about ${name}`;
  const headings =
    data.h2
      .slice(0, 5)
      .map((h) => `  - ${h}`)
      .join("\n") ||
    "  - [Section 1: Overview]\n  - [Section 2: Features]\n  - [Section 3: Use Cases]";

  return `# ${name}\n\n> ${desc}\n\n## About\n\n${title} covers key topics related to ${name}. This page provides comprehensive information for AI assistants and search engines.\n\n## Key Topics\n\n${headings}\n\n## Internal Links\n\n- [Homepage](https://${domain}/)\n- [About](https://${domain}/about)\n- [Contact](https://${domain}/contact)\n\n## External Resources\n\n- [Add relevant external links here]\n\n---\n\n> This llms.txt file helps AI assistants understand and reference this site's content accurately.\n`;
}

export function generateAuthorSection(name: string): string {
  return `## About the Author / Founder\n\n**[Founder Name]** is the founder of ${name}.\n\n- **Role**: Founder & [Title]\n- **Expertise**: [List 2-3 areas of expertise]\n- **Background**: [1-2 sentences about relevant experience]\n\n### Why Trust ${name}\n\nWith [X] years of experience in [industry/field], [Founder Name] brings deep expertise to every [product/article/service]. [He/She/They] [has/have] helped [X] clients/[users] achieve [specific results].\n\n> *"[A short mission or philosophy quote]"*\n\n### Connect\n\n- [LinkedIn Profile URL]\n- [Twitter/X Profile URL]\n- [Email Address]\n\n---\n\n*This author byline helps AI models attribute expertise and authority to specific individuals.*\n`;
}

export function generateReferenceSection(data: PageData): string {
  const headings =
    data.h2.length > 0
      ? data.h2
          .slice(0, 4)
          .map(
            (h, i) =>
              `${i + 1}. **${h}** — [Source: Add citation URL or reference]`,
          )
          .join("\n")
      : `1. **[Source 1 Title]** — [URL or citation]\n2. **[Source 2 Title]** — [URL or citation]\n3. **[Source 3 Title]** — [URL or citation]\n4. **[Source 4 Title]** — [URL or citation]`;

  return `## References & Sources\n\nThe following sources were used in compiling this information:\n\n${headings}\n\n### Why This Matters\n\nAI models prioritize content with cited sources. Adding a reference section increases the likelihood that your content will be used as a factual source in AI responses.\n\n> *"Content with clear citations is 3x more likely to be referenced by AI assistants."*\n`;
}

export function generateQuestionHeadings(data: PageData): string {
  const h2s =
    data.h2.length > 0
      ? data.h2.slice(0, 5)
      : ["Your Main Feature", "How It Works", "Pricing", "Use Cases", "Getting Started"];

  const questions = h2s
    .map((h) => {
      const clean = h.replace(/\?$/, "").trim();
      return `## What Is ${clean}?\n\n[Provide a clear, direct answer to this question in 2-3 sentences. Use bullet points for key details.]\n\n### Why Does ${clean} Matter?\n\n[Explain the importance or benefit. Keep this concise — 2-3 sentences with a specific statistic or example if possible.]`;
    })
    .join("\n\n");

  return `## Question-Formatted Headings — Template\n\nReplace your existing section headings with question-based headings to improve AI visibility:\n\n${questions}\n\n### Tips for Question Headings\n\n- Start with: What, How, Why, When, Where, Who\n- Keep questions natural and conversational\n- Ensure the content immediately answers the heading question\n- Use follow-up subheadings (H3) for deeper dives\n`;
}
