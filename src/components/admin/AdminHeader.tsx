import React, { useState } from "react";
import { Menu, Search } from "lucide-react";
import type {
  MetalRatesData,
  AdminOrderRecord,
  CustomOrderRecord,
  Product,
} from "../../types";
import { DemoAccess } from "../../services/demoAccess";
interface Props {
  onOpenMobileSidebar: () => void;
  ratesData: MetalRatesData;
  orders: AdminOrderRecord[];
  customOrders: CustomOrderRecord[];
  products: Product[];
  onSelectTab: (tab: any) => void;
  onOpenNewProduct: () => void;
  onSelectOrder?: (o: AdminOrderRecord) => void;
  onSignOut?: () => void;
  context?: string;
}
export function AdminHeader({
  onOpenMobileSidebar,
  orders,
  onSelectTab,
  onSelectOrder,
  onSignOut,
  context,
}: Props) {
  const [q, setQ] = useState(""),
    [account, setAccount] = useState(false);
  const session = DemoAccess.get();
  const matches = q.trim()
    ? orders
        .filter((o) =>
          (o.orderReference + " " + o.customerName)
            .toLowerCase()
            .includes(q.toLowerCase()),
        )
        .slice(0, 5)
    : [];
  return (
    <header className="relative bg-white border-b border-stone-200 px-4 sm:px-7 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          className="icon-button lg:hidden"
          onClick={onOpenMobileSidebar}
          aria-label="Open admin navigation"
        >
          <Menu size={21} />
        </button>
        <span className="text-sm font-medium hidden sm:inline">
          {context || "Store management"}
        </span>
      </div>
      {session?.role === "owner" && (
        <div className="relative max-w-sm flex-1">
          <label className="flex items-center gap-2 border border-stone-200 rounded px-3">
            <Search size={16} />
            <input
              aria-label="Search order records"
              className="min-w-0 w-full bg-transparent text-xs outline-none"
              placeholder="Search orders…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
          {q && (
            <div className="absolute inset-x-0 top-full bg-white border border-stone-200 z-40 p-2 shadow-sm">
              {matches.map((o) => (
                <button
                  key={o.orderReference}
                  className="block w-full text-left px-2 text-xs"
                  onClick={() => {
                    onSelectTab("orders");
                    onSelectOrder?.(o);
                    setQ("");
                  }}
                >
                  {o.orderReference} · {o.customerName}
                </button>
              ))}
              {!matches.length && (
                <p className="p-3 text-xs">No matching orders.</p>
              )}
              <button className="quiet-link p-2" onClick={() => setQ("")}>
                Close search
              </button>
            </div>
          )}
        </div>
      )}
      <div className="relative">
        <button
          className="text-xs px-3 border border-stone-200 rounded"
          aria-expanded={account}
          onClick={() => setAccount(!account)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setAccount(false);
          }}
        >
          {session?.role === "owner" ? "Owner" : "Staff"} demo ▾
        </button>
        {account && (
          <div className="absolute right-0 top-full min-w-48 bg-white border border-stone-200 p-3 z-40 shadow-sm">
            <p className="text-xs text-stone-500 mb-2">
              Browser preview · 1 hour session
            </p>
            <button className="quiet-link" onClick={onSignOut}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
