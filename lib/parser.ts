import * as cheerio from "cheerio";
import type { PageData } from "@/types";

export interface FetchResult {
  html: string | null;
  statusCode: number;
  error: string | null;
}

const AI_BOT_NAMES = [
  "GPTBot",
  "ClaudeBot",
  "CCBot",
  "PerplexityBot",
  "GoogleOther",
  "anthropic-ai",
  "Diffbot",
  "cohere-ai",
  "ImagesiftBot",
  "Bytespider",
];

async function fetchWithTimeout(
  url: string,
  timeoutMs = 10000,
): Promise<FetchResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "GEO-Scanner/1.0 (AI Visibility Analyzer; +https://geoscanner.dev)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });

    clearTimeout(timeout);

    const text = await response.text();
    return {
      html: text,
      statusCode: response.status,
      error: null,
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown fetch error";
    return {
      html: null,
      statusCode: 0,
      error: message,
    };
  }
}

function parseRobotsForBots(
  content: string,
): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  const lines = content.split("\n");

  let currentUserAgent: string | null = null;
  const disallowRules: Array<{ agent: string; disallowed: boolean }> = [];

  for (const line of lines) {
    const trimmed = line.trim().toLowerCase();

    if (trimmed.startsWith("user-agent:")) {
      currentUserAgent = trimmed.replace("user-agent:", "").trim();
    }

    if (trimmed.startsWith("disallow:") && currentUserAgent) {
      const path = trimmed.replace("disallow:", "").trim();
      const disallowed = path !== "" && path !== "/";
      disallowRules.push({
        agent: currentUserAgent,
        disallowed,
      });
    }

    if (trimmed.startsWith("allow:") && currentUserAgent) {
      const path = trimmed.replace("allow:", "").trim();
      if (path === "/") {
        disallowRules.push({
          agent: currentUserAgent,
          disallowed: false,
        });
      }
    }
  }

  for (const botName of AI_BOT_NAMES) {
    const lower = botName.toLowerCase();
    const matchingRules = disallowRules.filter(
      (r) =>
        r.agent === lower ||
        r.agent === "*" ||
        r.agent.includes(lower),
    );

    if (matchingRules.length === 0) {
      result[botName] = true;
    } else {
      const lastRule = matchingRules[matchingRules.length - 1];
      result[botName] = !lastRule.disallowed;
    }
  }

  return result;
}

export async function fetchPageData(url: string): Promise<PageData> {
  const baseUrl = url.endsWith("/") ? url.slice(0, -1) : url;
  const parsedUrl = new URL(baseUrl);
  const origin = parsedUrl.origin;

  const [pageResult, robotsResult, sitemapResult, llmsResult] =
    await Promise.all([
      fetchWithTimeout(baseUrl),
      fetchWithTimeout(`${origin}/robots.txt`),
      fetchWithTimeout(`${origin}/sitemap.xml`),
      fetchWithTimeout(`${origin}/llms.txt`),
    ]);

  const isHttps = origin.startsWith("https://");
  const hasRobotsTxt = robotsResult.statusCode === 200 && !!robotsResult.html;
  const hasSitemapXml =
    sitemapResult.statusCode === 200 && !!sitemapResult.html;
  const hasLlmstxt = llmsResult.statusCode === 200 && !!llmsResult.html;

  let aiBotRules: Record<string, boolean> = {};
  AI_BOT_NAMES.forEach((name) => {
    aiBotRules[name] = true;
  });

  if (hasRobotsTxt && robotsResult.html) {
    aiBotRules = parseRobotsForBots(robotsResult.html);
  }

  if (!pageResult.html) {
    return {
      url,
      title: null,
      description: null,
      h1: [],
      h2: [],
      h3: [],
      jsonLd: [],
      canonical: null,
      robotsMeta: null,
      authorMeta: null,
      organizationMeta: null,
      hasFAQ: false,
      hasReferences: false,
      hasBlockquotes: false,
      hasLists: false,
      hasTldr: false,
      hasSummary: false,
      hasQuestionHeadings: false,
      wordCount: 0,
      hasRobotsTxt,
      hasSitemapXml,
      hasLlmstxt,
      isHttps,
      robotsTxtContent: robotsResult.html,
      llmstxtContent: llmsResult.html,
      aiBotRules,
      statusCode: pageResult.statusCode,
      fetchError: pageResult.error || "No HTML content returned",
    };
  }

  const $ = cheerio.load(pageResult.html);

  const title = $("title").first().text().trim() || null;

  const description =
    $('meta[name="description"]').attr("content")?.trim() || null;

  const h1: string[] = [];
  $("h1").each((_, el) => {
    const text = $(el).text().trim();
    if (text) h1.push(text);
  });

  const h2: string[] = [];
  $("h2").each((_, el) => {
    const text = $(el).text().trim();
    if (text) h2.push(text);
  });

  const h3: string[] = [];
  $("h3").each((_, el) => {
    const text = $(el).text().trim();
    if (text) h3.push(text);
  });

  const jsonLd: unknown[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const content = $(el).html();
    if (content) {
      try {
        const parsed = JSON.parse(content);
        jsonLd.push(parsed);
      } catch {
        // Skip invalid JSON-LD
      }
    }
  });

  const canonical =
    $('link[rel="canonical"]').attr("href")?.trim() || null;

  const robotsMeta =
    $('meta[name="robots"]').attr("content")?.trim() ||
    $('meta[name="googlebot"]').attr("content")?.trim() ||
    null;

  const authorMeta =
    $('meta[name="author"]').attr("content")?.trim() ||
    $('meta[name="article:author"]').attr("content")?.trim() ||
    null;

  const organizationMeta =
    $('meta[property="og:site_name"]').attr("content")?.trim() || null;

  const hasFAQ =
    $("section.faq").length > 0 ||
    $(".faq").length > 0 ||
    $('[itemtype*="FAQPage"]').length > 0 ||
    jsonLd.some((j: unknown) => {
      if (typeof j !== "object" || j === null) return false;
      const t = (j as Record<string, unknown>)["@type"];
      if (typeof t === "string") return t === "FAQPage";
      if (Array.isArray(t)) return t.includes("FAQPage");
      return false;
    });

  const hasReferences =
    $("section.references").length > 0 ||
    $("#references").length > 0 ||
    $(".references").length > 0 ||
    $("section.sources").length > 0 ||
    $("#sources").length > 0 ||
    $("section.bibliography").length > 0 ||
    /references|sources|bibliography|further\s*reading/i.test(
      $("h2, h3").text(),
    );

  const hasBlockquotes = $("blockquote").length > 0;

  const hasLists = $("ul, ol").length > 2;

  const hasTldr =
    /tldr|tl;dr|too\s*long\s*[;,]?\s*didn'?t\s*read|key\s*takeaways|quick\s*summary/i.test(
      $("h2, h3, strong, b").text(),
    ) || /^tldr|^tl;dr/i.test($("p").first().text().trim());

  const hasSummary =
    /summary|abstract|executive\s*summary|overview/i.test(
      $("h2, h3").text(),
    );

  const hasQuestionHeadings =
    /^[A-Z][a-z]*\s.*\?$/gm.test(
      $("h2, h3")
        .map((_, el) => $(el).text().trim())
        .get()
        .join("\n"),
    );

  const bodyText = $("body").text();
  const wordCount = bodyText
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  return {
    url,
    title,
    description,
    h1,
    h2,
    h3,
    jsonLd,
    canonical,
    robotsMeta,
    authorMeta,
    organizationMeta,
    hasFAQ,
    hasReferences,
    hasBlockquotes,
    hasLists,
    hasTldr,
    hasSummary,
    hasQuestionHeadings,
    wordCount,
    hasRobotsTxt,
    hasSitemapXml,
    hasLlmstxt,
    isHttps,
    robotsTxtContent: robotsResult.html,
    llmstxtContent: llmsResult.html,
    aiBotRules,
    statusCode: pageResult.statusCode,
    fetchError: pageResult.error,
  };
}
