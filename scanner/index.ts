/**
 * scanner/ — 扫描调度引擎
 *
 * 编排 crawler → parser → rules → scoring → fixes 全流程。
 *
 * 🔌 Hook 系统（用于闭源插件）：
 *   - beforeScore: 拦截评分，可替换为 AI 增强评分
 *   - afterScan: 扫描完成后的回调
 */

import { crawlUrl } from "@/crawler";
import { parsePageData } from "@/parser";
import { getAllRules, categories } from "@/rules";
import { evaluateRule, calculateScore } from "@/lib/scoring";
import { generateFixes } from "@/fix-generator";
import { storeResult } from "@/history";
import { generateId } from "@/lib/utils";

import type { RuleResult, ScanResult, CategoryResult } from "@/types";

// ── Hook 类型（供闭源插件实现） ──

export interface ScanHooks {
  /** 替换默认评分的 hook。返回 undefined 则走默认评分。 */
  beforeScore?: (
    ruleResults: RuleResult[],
    pageData: import("@/types").PageData,
  ) => number | undefined;

  /** 扫描完成后的回调 */
  afterScan?: (result: ScanResult) => void;
}

let hooks: ScanHooks = {};

/**
 * 注册扫描 hook（由闭源插件调用）。
 * 开源版本默认无 hook，插上闭源插件后替换评分算法。
 */
export function registerScanHooks(pluginHooks: ScanHooks): void {
  hooks = { ...hooks, ...pluginHooks };
}

// ── 核心扫描函数 ──

export async function scanUrl(url: string): Promise<ScanResult> {
  // 1. Crawl
  const crawl = await crawlUrl(url);

  // 2. Parse
  const pageData = parsePageData(url, crawl);

  // 3. Evaluate rules
  const allRules = getAllRules();
  const ruleResults: RuleResult[] = allRules.map((rule) =>
    evaluateRule(rule, pageData),
  );

  // 4. Score — 如果有闭源 hook 则走闭源评分
  const totalScore =
    hooks.beforeScore?.(ruleResults, pageData) ?? calculateScore(ruleResults);

  // 5. Category breakdown
  const categoryResults: CategoryResult[] = categories.map((cat) => {
    const catRules = ruleResults.filter((r) => r.category === cat.id);
    const maxScore = catRules.reduce((sum, r) => sum + r.weight, 0);
    const score = catRules.reduce((sum, r) => {
      if (r.level === "pass") return sum + r.weight;
      if (r.level === "warn") return sum + r.weight * 0.4;
      return sum + 0;
    }, 0);
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    let level: "pass" | "warn" | "fail" = "pass";
    const failCount = catRules.filter((r) => r.level === "fail").length;
    const warnCount = catRules.filter((r) => r.level === "warn").length;
    if (failCount > 0) level = "fail";
    else if (warnCount > 2) level = "warn";

    return {
      id: cat.id,
      name: cat.name,
      score,
      maxScore,
      percentage,
      level,
      ruleResults: catRules,
    };
  });

  // 6. Generate fixes
  const fixes = generateFixes(ruleResults, pageData);

  // 7. Build result
  const result: ScanResult = {
    id: generateId(),
    url,
    timestamp: new Date().toISOString(),
    score: totalScore,
    categories: categoryResults,
    rules: ruleResults,
    fixes,
    pageData,
  };

  // 8. Store
  storeResult(result);

  // 9. Post-scan hook
  hooks.afterScan?.(result);

  return result;
}
