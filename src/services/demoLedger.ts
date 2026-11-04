import type { AdminOrderRecord } from "../types";
export const LEDGER_KEY = "tsj_demo_checkout_v1";
export interface DemoLedger {
  orders: AdminOrderRecord[];
  stock: Record<string, number>;
}
export function readLedger(): DemoLedger {
  const raw = localStorage.getItem(LEDGER_KEY);
  if (!raw) return { orders: [], stock: {} };
  try {
    const d = JSON.parse(raw);
    if (!Array.isArray(d.orders) || !d.stock) throw new Error();
    return d;
  } catch {
    throw new Error(
      "Demo order records could not be read. Restore a valid backup before continuing.",
    );
  }
}
export function writeLedger(d: DemoLedger) {
  // Order snapshots and stock changes commit together to one localStorage value.
  localStorage.setItem(LEDGER_KEY, JSON.stringify(d));
  window.dispatchEvent(new Event("tsj-storage-updated"));
}
