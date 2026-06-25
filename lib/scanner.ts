import type { RuleResult, ScanResult, CategoryResult, FixSuggestion } from "@/types";
import { fetchPageData } from "./parser";
import { getAllRules, categories } from "@/rules";
import { calculateScore, evaluateRule } from "./scoring";
import { generateFixes } from "./fix-generator";
import { generateId } from "./utils";
import { storeResult } from "./store";

export async function scanUrl(url: string): Promise<ScanResult> {
  const pageData = await fetchPageData(url);

  const allRules = getAllRules();
  const ruleResults: RuleResult[] = [];

  for (const rule of allRules) {
    const result = evaluateRule(rule, pageData);
    ruleResults.push(result);
  }

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

  const totalScore = calculateScore(ruleResults);
  const fixes = generateFixes(ruleResults, pageData);

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

  storeResult(result);

  return result;
}
