import type { Rule } from "@/types";
import { technicalRules } from "./technical";
import { aiBotAccessRules } from "./ai-bot-access";
import { entityRecognitionRules } from "./entity-recognition";
import { queryOptimizationRules } from "./query-optimization";
import { citationsRules } from "./citations";
import { geoRules } from "./geo";

export const categories = [
  { id: "Technical", name: "Technical", rules: technicalRules },
  { id: "AI Bot Access", name: "AI Bot Access", rules: aiBotAccessRules },
  {
    id: "Entity Recognition",
    name: "Entity Recognition",
    rules: entityRecognitionRules,
  },
  {
    id: "Query Optimization",
    name: "Query Optimization",
    rules: queryOptimizationRules,
  },
  { id: "Citations", name: "Citations", rules: citationsRules },
  { id: "GEO", name: "GEO", rules: geoRules },
] as const;

export function getAllRules(): Rule[] {
  return categories.flatMap((cat) => cat.rules);
}

export function getCategoryRules(categoryId: string): Rule[] {
  const cat = categories.find((c) => c.id === categoryId);
  return cat ? cat.rules : [];
}

export function getTotalWeight(): number {
  return getAllRules().reduce((sum, r) => sum + r.weight, 0);
}
