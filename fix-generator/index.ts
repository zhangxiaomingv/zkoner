/**
 * fix-generator/ — 自动修复方案生成器
 *
 * 基于扫描结果，调用 templates/ 生成可复用的修复代码。
 */

import type { RuleResult, FixSuggestion, PageData } from "@/types";
import * as templates from "@/templates";

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

  // FAQ
  if (
    !pageData.hasFAQ &&
    ruleResults.find((r) => r.id === "qo-faq")?.level !== "pass"
  ) {
    fixes.push({
      type: "faq",
      title: "Generate FAQ Section",
      category: "Query Optimization",
      language: "zh",
      content: templates.generateFAQ(pageData.title || siteName, pageData),
    });
  }

  // TLDR
  if (
    !pageData.hasTldr &&
    ruleResults.find((r) => r.id === "qo-tldr")?.level !== "pass"
  ) {
    fixes.push({
      type: "tldr",
      title: "Generate TLDR / Key Takeaways",
      category: "Query Optimization",
      language: "en",
      content: templates.generateTLDR(pageData),
    });
  }

  // Organization Schema
  if (!hasJsonLdType(pageData, "Organization")) {
    fixes.push({
      type: "organization-schema",
      title: "Generate Organization Schema (JSON-LD)",
      category: "Entity Recognition",
      language: "en",
      content: templates.generateOrganizationSchema(siteName, domain),
    });
  }

  // FAQPage Schema
  if (!hasJsonLdType(pageData, "FAQPage")) {
    fixes.push({
      type: "faqpage-schema",
      title: "Generate FAQPage Schema (JSON-LD)",
      category: "GEO",
      language: "en",
      content: templates.generateFAQPageSchema(),
    });
  }

  // llms.txt
  if (!pageData.hasLlmstxt) {
    fixes.push({
      type: "llms-txt",
      title: "Generate llms.txt",
      category: "GEO",
      language: "en",
      content: templates.generateLlmstxt(siteName, domain, pageData),
    });
  }

  // Author / Founder Bio
  if (
    !pageData.authorMeta &&
    ruleResults.find((r) => r.id === "entity-author-meta")?.level !== "pass"
  ) {
    fixes.push({
      type: "author-bio",
      title: "Add Author / Founder Section",
      category: "Entity Recognition",
      language: "en",
      content: templates.generateAuthorSection(siteName),
    });
  }

  // Reference Section
  if (
    !pageData.hasReferences &&
    ruleResults.find((r) => r.id === "cite-reference-section")?.level !== "pass"
  ) {
    fixes.push({
      type: "reference-section",
      title: "Add Reference Section",
      category: "Citations",
      language: "en",
      content: templates.generateReferenceSection(pageData),
    });
  }

  // Question Headings
  if (
    !pageData.hasQuestionHeadings &&
    ruleResults.find((r) => r.id === "qo-question-headings")?.level !== "pass"
  ) {
    fixes.push({
      type: "question-headings",
      title: "Convert Headings to Question Format",
      category: "Query Optimization",
      language: "en",
      content: templates.generateQuestionHeadings(pageData),
    });
  }

  return fixes;
}
