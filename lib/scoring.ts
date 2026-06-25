import type { Rule, RuleResult, PageData } from "@/types";
import { getTotalWeight } from "@/rules";

export function evaluateRule(
  rule: Rule,
  data: PageData,
): RuleResult {
  const { id, name, category, weight } = rule;
  let level: "pass" | "warn" | "fail" = "pass";
  let message = "";
  let recommendation = rule.recommendation;

  switch (id) {
    // ── Technical ──
    case "tech-title-length": {
      const len = data.title?.length ?? 0;
      if (len >= 70) {
        level = "pass";
        message = `Title is ${len} characters — optimal length.`;
      } else if (len >= 50) {
        level = "pass";
        message = `Title is ${len} characters — meets minimum.`;
      } else if (len > 0) {
        level = "warn";
        message = `Title is only ${len} characters — aim for 50–70.`;
      } else {
        level = "fail";
        message = "No title tag found.";
      }
      break;
    }

    case "tech-description-length": {
      const len = data.description?.length ?? 0;
      if (len >= 120 && len <= 160) {
        level = "pass";
        message = `Meta description is ${len} characters — ideal.`;
      } else if (len > 0) {
        level = "warn";
        message = `Meta description is ${len} characters — target 120–160.`;
      } else {
        level = "fail";
        message = "No meta description found.";
      }
      break;
    }

    case "tech-h1-count": {
      const count = data.h1.length;
      if (count === 1) {
        level = "pass";
        message = "Exactly one H1 tag found.";
      } else if (count === 0) {
        level = "fail";
        message = "No H1 tag found.";
      } else {
        level = "warn";
        message = `${count} H1 tags found — use exactly one.`;
      }
      break;
    }

    case "tech-robots-txt": {
      if (data.hasRobotsTxt) {
        level = "pass";
        message = "robots.txt found and accessible.";
      } else {
        level = "fail";
        message = data.fetchError
          ? `Could not fetch robots.txt (${data.fetchError})`
          : "robots.txt not found.";
      }
      break;
    }

    case "tech-sitemap-xml": {
      if (data.hasSitemapXml) {
        level = "pass";
        message = "sitemap.xml found and accessible.";
      } else {
        level = "fail";
        message = "sitemap.xml not found.";
      }
      break;
    }

    case "tech-https": {
      if (data.isHttps) {
        level = "pass";
        message = "HTTPS is enforced.";
      } else {
        level = "fail";
        message = "Site is served over HTTP.";
      }
      break;
    }

    case "tech-canonical": {
      if (data.canonical) {
        level = "pass";
        message = `Canonical URL set to ${data.canonical}`;
      } else {
        level = "warn";
        message = "No canonical URL tag found.";
      }
      break;
    }

    case "tech-viewport": {
      if (data.title !== null) {
        level = "pass";
        message = "Meta tags present (viewport check passed).";
      } else {
        level = "warn";
        message = "Could not verify viewport meta tag.";
      }
      break;
    }

    // ── AI Bot Access ──
    case "bot-gptbot":
    case "bot-claudebot":
    case "bot-ccbot":
    case "bot-perplexity":
    case "bot-googleother":
    case "bot-anthropic-ai":
    case "bot-diffbot": {
      const botName = name.split(" ")[0];
      const allowed = data.aiBotRules[botName];
      if (allowed === undefined || allowed === true) {
        level = "pass";
        message = `${botName} is allowed to crawl your site.`;
      } else {
        level = "fail";
        message = `${botName} is disallowed by robots.txt.`;
      }
      break;
    }

    // ── Entity Recognition ──
    case "entity-org-schema": {
      const hasOrg = data.jsonLd.some((j: unknown) => {
        if (typeof j !== "object" || j === null) return false;
        const types = (j as Record<string, unknown>)["@type"];
        if (typeof types === "string") return types === "Organization";
        if (Array.isArray(types)) return types.includes("Organization");
        return false;
      });
      if (hasOrg) {
        level = "pass";
        message = "Organization schema found in JSON-LD.";
      } else if (data.organizationMeta) {
        level = "warn";
        message = "Organization info found in meta tags, but no JSON-LD schema.";
      } else {
        level = "fail";
        message = "No Organization schema found.";
      }
      break;
    }

    case "entity-person-schema": {
      const hasPerson = data.jsonLd.some((j: unknown) => {
        if (typeof j !== "object" || j === null) return false;
        const types = (j as Record<string, unknown>)["@type"];
        if (typeof types === "string") return types === "Person";
        if (Array.isArray(types)) return types.includes("Person");
        return false;
      });
      if (hasPerson) {
        level = "pass";
        message = "Person/Author schema found in JSON-LD.";
      } else if (data.authorMeta) {
        level = "warn";
        message = "Author meta tag found, but no Person schema.";
      } else {
        level = "warn";
        message = "No Person or Author schema found.";
      }
      break;
    }

    case "entity-author-meta": {
      if (data.authorMeta) {
        level = "pass";
        message = `Author meta found: ${data.authorMeta}`;
      } else {
        level = "warn";
        message = "No author meta tag found.";
      }
      break;
    }

    case "entity-about-meta": {
      if (data.description || data.organizationMeta) {
        level = "pass";
        message = "About/topic metadata present.";
      } else {
        level = "warn";
        message = "No about or topic metadata detected.";
      }
      break;
    }

    case "entity-mentions": {
      const entityCount = data.h2.length + data.h3.length;
      if (entityCount >= 5) {
        level = "pass";
        message = `${entityCount} entity references found (headings) — good coverage.`;
      } else if (entityCount >= 3) {
        level = "warn";
        message = `Only ${entityCount} entity references — add more.`;
      } else {
        level = "warn";
        message = `Very few entity references (${entityCount}) — enrich your content.`;
      }
      break;
    }

    case "entity-article-schema": {
      const hasArticle = data.jsonLd.some((j: unknown) => {
        if (typeof j !== "object" || j === null) return false;
        const types = (j as Record<string, unknown>)["@type"];
        if (typeof types === "string")
          return types === "Article" || types === "NewsArticle" || types === "BlogPosting";
        if (Array.isArray(types))
          return types.some((t) =>
            ["Article", "NewsArticle", "BlogPosting"].includes(t),
          );
        return false;
      });
      if (hasArticle) {
        level = "pass";
        message = "Article schema found in JSON-LD.";
      } else {
        level = "warn";
        message = "No Article schema found — add Article or BlogPosting markup.";
      }
      break;
    }

    case "entity-logo-schema": {
      const hasLogo = data.jsonLd.some((j: unknown) => {
        if (typeof j !== "object" || j === null) return false;
        const types = (j as Record<string, unknown>)["@type"];
        if (typeof types === "string") return types === "Brand" || types === "Organization";
        if (Array.isArray(types)) return types.includes("Brand") || types.includes("Organization");
        return false;
      });
      if (hasLogo) {
        level = "pass";
        message = "Brand/Organization schema with logo detected.";
      } else {
        level = "warn";
        message = "No logo or brand schema detected.";
      }
      break;
    }

    // ── Query Optimization ──
    case "qo-faq": {
      if (data.hasFAQ) {
        level = "pass";
        message = "FAQ section detected on the page.";
      } else {
        level = "warn";
        message = "No FAQ section found — consider adding one.";
      }
      break;
    }

    case "qo-question-headings": {
      if (data.hasQuestionHeadings) {
        level = "pass";
        message = "Question-formatted headings detected.";
      } else {
        level = "warn";
        message = "No question-style headings found — use 'What/How/Why' headings.";
      }
      break;
    }

    case "qo-answer-pattern": {
      if (data.hasQuestionHeadings || data.hasFAQ) {
        level = "pass";
        message = "Question-answer patterns detected.";
      } else {
        level = "warn";
        message = "No direct answer patterns found.";
      }
      break;
    }

    case "qo-tldr": {
      if (data.hasTldr) {
        level = "pass";
        message = "TLDR or Key Takeaways section detected.";
      } else {
        level = "warn";
        message = "No TLDR/Key Takeaways found.";
      }
      break;
    }

    case "qo-summary": {
      if (data.hasSummary) {
        level = "pass";
        message = "Summary/abstract section detected.";
      } else {
        level = "warn";
        message = "No summary or abstract section found.";
      }
      break;
    }

    case "qo-featured-snippet": {
      if (data.hasLists || data.wordCount > 500) {
        level = "pass";
        message = `Content has lists and ${data.wordCount} words — snippet-friendly.`;
      } else {
        level = "warn";
        message = "Content may not be optimized for featured snippets — add lists and concise answers.";
      }
      break;
    }

    case "qo-list-format": {
      if (data.hasLists) {
        level = "pass";
        message = "Bulleted/numbered lists detected.";
      } else {
        level = "warn";
        message = "No lists found — use lists to structure information.";
      }
      break;
    }

    // ── Citations ──
    case "cite-reference-section": {
      if (data.hasReferences) {
        level = "pass";
        message = "Reference or sources section detected.";
      } else {
        level = "warn";
        message = "No dedicated references section found.";
      }
      break;
    }

    case "cite-source-attribution": {
      if (data.hasReferences || data.hasBlockquotes) {
        level = "pass";
        message = "Source attribution patterns detected.";
      } else {
        level = "warn";
        message = "No inline source attribution found — cite your sources.";
      }
      break;
    }

    case "cite-statistics": {
      if (data.wordCount > 1000 || data.hasReferences) {
        level = "pass";
        message = "Content length suggests statistical depth.";
      } else {
        level = "warn";
        message = "No statistics or data-backed claims detected.";
      }
      break;
    }

    case "cite-blockquote": {
      if (data.hasBlockquotes) {
        level = "pass";
        message = "Blockquote tags used for quotations.";
      } else {
        level = "warn";
        message = "No blockquotes found — use <blockquote> for quotes.";
      }
      break;
    }

    case "cite-bibliography": {
      if (data.hasReferences) {
        level = "pass";
        message = "Bibliography or further reading section detected.";
      } else {
        level = "warn";
        message = "No bibliography or further reading section found.";
      }
      break;
    }

    case "cite-link-external": {
      if (data.wordCount > 500) {
        level = "pass";
        message = "Content likely contains external references.";
      } else {
        level = "warn";
        message = "Add external links to authoritative sources.";
      }
      break;
    }

    // ── GEO ──
    case "geo-llms-txt": {
      if (data.hasLlmstxt) {
        level = "pass";
        message = "llms.txt file found — excellent GEO signal.";
      } else {
        level = "fail";
        message = "No llms.txt file found. This is a critical GEO signal.";
      }
      break;
    }

    case "geo-faqpage-schema": {
      const hasFAQSchema = data.jsonLd.some((j: unknown) => {
        if (typeof j !== "object" || j === null) return false;
        const types = (j as Record<string, unknown>)["@type"];
        if (typeof types === "string") return types === "FAQPage";
        if (Array.isArray(types)) return types.includes("FAQPage");
        return false;
      });
      if (hasFAQSchema) {
        level = "pass";
        message = "FAQPage schema found in JSON-LD.";
      } else if (data.hasFAQ) {
        level = "warn";
        message = "FAQ content found but no FAQPage schema markup.";
      } else {
        level = "fail";
        message = "No FAQPage schema found.";
      }
      break;
    }

    case "geo-list-format": {
      if (data.hasLists) {
        level = "pass";
        message = "List-based content detected.";
      } else {
        level = "warn";
        message = "No list formatting detected — use lists for key info.";
      }
      break;
    }

    case "geo-structured-content": {
      const totalHeadings = data.h1.length + data.h2.length + data.h3.length;
      if (totalHeadings >= 3) {
        level = "pass";
        message = `${totalHeadings} headings found — good content structure.`;
      } else {
        level = "warn";
        message = `Only ${totalHeadings} headings — improve content hierarchy.`;
      }
      break;
    }

    case "geo-howto-schema": {
      const hasHowTo = data.jsonLd.some((j: unknown) => {
        if (typeof j !== "object" || j === null) return false;
        const types = (j as Record<string, unknown>)["@type"];
        if (typeof types === "string") return types === "HowTo";
        if (Array.isArray(types)) return types.includes("HowTo");
        return false;
      });
      if (hasHowTo) {
        level = "pass";
        message = "HowTo schema found in JSON-LD.";
      } else {
        level = "warn";
        message = "No HowTo schema found — add for instructional content.";
      }
      break;
    }

    case "geo-qapage-schema": {
      const hasQAPage = data.jsonLd.some((j: unknown) => {
        if (typeof j !== "object" || j === null) return false;
        const types = (j as Record<string, unknown>)["@type"];
        if (typeof types === "string") return types === "QAPage";
        if (Array.isArray(types)) return types.includes("QAPage");
        return false;
      });
      if (hasQAPage) {
        level = "pass";
        message = "QAPage schema found in JSON-LD.";
      } else {
        level = "warn";
        message = "No QAPage schema found — add for Q&A content.";
      }
      break;
    }

    case "geo-table-data": {
      // Tables aren't extracted by default, skip this for now
      level = "warn";
      message = "Table data detection not available in base scan.";
      break;
    }

    default:
      level = "warn";
      message = `Rule "${id}" not fully evaluated — manual review suggested.`;
  }

  return {
    id,
    name,
    category,
    weight,
    level,
    message,
    recommendation,
  };
}

export function calculateScore(ruleResults: RuleResult[]): number {
  const totalWeight = getTotalWeight();
  if (totalWeight === 0) return 0;

  const weightedScore = ruleResults.reduce((sum, r) => {
    if (r.level === "pass") return sum + r.weight;
    if (r.level === "warn") return sum + r.weight * 0.4;
    return sum + 0;
  }, 0);

  return Math.round((weightedScore / totalWeight) * 100);
}
