/**
 * crawler/ — 网页抓取引擎
 *
 * 负责抓取目标页面的 HTML、robots.txt、sitemap.xml、llms.txt
 * 纯抓取，不解析。结果交给 parser/ 处理。
 */

export interface FetchResult {
  html: string | null;
  statusCode: number;
  error: string | null;
}

export interface CrawlResult {
  page: FetchResult;
  robots: FetchResult;
  sitemap: FetchResult;
  llms: FetchResult;
  origin: string;
  isHttps: boolean;
}

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

/**
 * Crawl a URL: fetch page HTML + robots.txt + sitemap.xml + llms.txt in parallel.
 */
export async function crawlUrl(url: string): Promise<CrawlResult> {
  const baseUrl = url.endsWith("/") ? url.slice(0, -1) : url;
  const parsedUrl = new URL(baseUrl);
  const origin = parsedUrl.origin;
  const isHttps = origin.startsWith("https://");

  const [page, robots, sitemap, llms] = await Promise.all([
    fetchWithTimeout(baseUrl),
    fetchWithTimeout(`${origin}/robots.txt`),
    fetchWithTimeout(`${origin}/sitemap.xml`),
    fetchWithTimeout(`${origin}/llms.txt`),
  ]);

  return { page, robots, sitemap, llms, origin, isHttps };
}
