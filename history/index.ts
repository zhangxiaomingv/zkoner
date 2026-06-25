/**
 * history/ — 扫描历史记录
 *
 * 存储和管理扫描结果。
 * 开源版：内存存储（重启丢失）
 * 付费版：可替换为数据库持久化
 */

import type { ScanResult } from "@/types";

const resultStore = new Map<string, ScanResult>();

export function storeResult(result: ScanResult): void {
  resultStore.set(result.id, result);
}

export function getResult(id: string): ScanResult | undefined {
  return resultStore.get(id);
}

export function getAllResults(): ScanResult[] {
  return Array.from(resultStore.values());
}

export function deleteResult(id: string): boolean {
  return resultStore.delete(id);
}

export function getResultCount(): number {
  return resultStore.size;
}

/**
 * 清空所有结果（用于测试）
 */
export function clearResults(): void {
  resultStore.clear();
}
