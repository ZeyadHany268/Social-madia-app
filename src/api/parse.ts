/* eslint-disable @typescript-eslint/no-explicit-any */
// The backend wraps everything as { success, message, data, meta }.
// These helpers read lists/objects without depending on one exact key name.

export function payload(res: any) {
  return res?.data?.data ?? res?.data ?? null;
}

export function listFrom<T = any>(res: any, keys: string[] = []): T[] {
  const d = payload(res);
  if (Array.isArray(d)) return d;
  if (!d || typeof d !== "object") return [];
  for (const k of keys) if (Array.isArray(d[k])) return d[k];
  const firstArray = Object.values(d).find(Array.isArray);
  return (firstArray as T[]) ?? [];
}

export function objectFrom<T = any>(res: any, keys: string[] = []): T | null {
  const d = payload(res);
  if (!d || typeof d !== "object") return null;
  for (const k of keys) if (d[k] && typeof d[k] === "object") return d[k];
  return d as T;
}

export function numberFrom(res: any, keys: string[] = []): number {
  const d = payload(res);
  if (typeof d === "number") return d;
  for (const k of keys) if (typeof d?.[k] === "number") return d[k];
  const firstNumber = d && typeof d === "object" ? Object.values(d).find((v) => typeof v === "number") : 0;
  return (firstNumber as number) ?? 0;
}

// ids can come back as plain strings or populated objects
export const idOf = (v: any): string => (typeof v === "string" ? v : (v?._id ?? v?.id ?? ""));
export const hasId = (list: any[] | undefined, id?: string) =>
  !!id && (list ?? []).some((v) => idOf(v) === id);
