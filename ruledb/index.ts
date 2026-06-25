/**
 * ruledb/ — 规则数据库
 *
 * 社区可贡献的规则存储。开源版包含基础规则，
 * 高级规则预留在 ruledb/premium/ 目录供闭源插件使用。
 *
 * 社区规则格式：
 *   ruledb/contrib/<category>/<rule-name>.ts
 */

import type { Rule } from "@/types";
import { getAllRules } from "@/rules";

// 社区规则注册表（开源贡献者可通过 PR 添加）
const communityRules: Rule[] = [];

/**
 * 注册一条社区规则
 */
export function registerRule(rule: Rule): void {
  communityRules.push(rule);
}

/**
 * 批量注册社区规则
 */
export function registerRules(rules: Rule[]): void {
  communityRules.push(...rules);
}

/**
 * 获取所有开源规则（基础规则 + 社区贡献规则）
 */
export function getAllOpenSourceRules(): Rule[] {
  return [...getAllRules(), ...communityRules];
}

/**
 * 获取社区规则列表
 */
export function getCommunityRules(): Rule[] {
  return [...communityRules];
}

/**
 * 统计规则数量
 */
export function getRuleStats(): { base: number; community: number; total: number } {
  const base = getAllRules().length;
  return {
    base,
    community: communityRules.length,
    total: base + communityRules.length,
  };
}
