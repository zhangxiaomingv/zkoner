/**
 * lib/parser.ts — 向后兼容包装器
 *
 * 新架构：crawler/ 负责抓取，parser/ 负责解析HTML
 * 新代码请直接 import from "@/crawler" 或 "@/parser"
 */
export { crawlUrl } from "@/crawler";
export type { CrawlResult, FetchResult } from "@/crawler";
export { parsePageData, AI_BOT_NAMES } from "@/parser";
