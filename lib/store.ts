// In-memory result store — persists for the lifetime of the server process.
// Reports are lost on restart. For production, replace with a database.

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
