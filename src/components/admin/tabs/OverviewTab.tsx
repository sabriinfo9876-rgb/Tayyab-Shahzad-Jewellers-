import React, { useState } from "react";
import type {
  AdminOrderRecord,
  CustomOrderRecord,
  Product,
} from "../../../types";
import { pkr } from "../../../utils/commerce";
interface Props {
  orders: AdminOrderRecord[];
  customOrders: CustomOrderRecord[];
  products: Product[];
  onSelectTab: (tab: any) => void;
  onSelectOrder: (order: AdminOrderRecord) => void;
  onOpenNewProduct: () => void;
}
export function OverviewTab({
  orders,
  customOrders,
  products,
  onSelectTab,
  onSelectOrder,
}: Props) {
  const [days, setDays] = useState(30),
    [inspection, setInspection] = useState(
      "Select a bar to inspect order value.",
    );
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - days + 1);
  from.setHours(0, 0, 0, 0);
  const periodOrders = orders.filter(
    (o) =>
      new Date(o.confirmedDate) >= from &&
      new Date(o.confirmedDate) <= now &&
      o.fulfilmentStatus !== "Cancelled",
  );
  const sales = periodOrders.reduce((s, o) => s + (o.agreedAmountPKR || 0), 0);
  const action = orders.filter((o) =>
    ["New", "In Production", "Ready for Pickup"].includes(
      o.fulfilmentStatus || "New",
    ),
  );
  const outstanding =
    orders
      .filter((o) => o.fulfilmentStatus !== "Cancelled")
      .reduce(
        (s, o) =>
          s + Math.max(0, (o.agreedAmountPKR || 0) - (o.paidAmountPKR || 0)),
        0,
      ) +
    customOrders
      .filter((c) => c.stage !== "New Request")
      .reduce(
        (s, c) => s + Math.max(0, c.quotedAmountPKR - c.depositPaidPKR),
        0,
      );
  const low = products.filter(
    (p) => p.published && (p.stockQuantity ?? 0) <= (p.lowStockThreshold ?? 2),
  );
  const overdue = customOrders.filter(
    (c) =>
      c.stage !== "Delivered" &&
      c.promisedDeliveryDate &&
      c.promisedDeliveryDate < now.toISOString().slice(0, 10),
  );
  const bins = Array.from({ length: 7 }, (_, i) => {
    const start = new Date(
      from.getTime() + ((now.getTime() - from.getTime()) * i) / 7,
    );
    const end = new Date(
      from.getTime() + ((now.getTime() - from.getTime()) * (i + 1)) / 7,
    );
    const list = periodOrders.filter(
      (o) =>
        new Date(o.confirmedDate) >= start &&
        (i === 6
          ? new Date(o.confirmedDate) <= now
          : new Date(o.confirmedDate) < end),
    );
    return {
      label: start.toLocaleDateString("en-PK", {
        day: "numeric",
        month: "short",
      }),
      value: list.reduce((s, o) => s + (o.agreedAmountPKR || 0), 0),
      count: list.length,
    };
  });
  const peak = Math.max(1, ...bins.map((b) => b.value));
  const recent = [...orders]
    .sort((a, b) => Date.parse(b.confirmedDate) - Date.parse(a.confirmedDate))
    .slice(0, 5);
  return (
    <div className="form-stack">
      <div className="admin-title">
        <div>
          <h1>Overview</h1>
          <p>
            Sample records · {from.toLocaleDateString("en-PK")} –{" "}
            {now.toLocaleDateString("en-PK")}
          </p>
        </div>
        <label className="text-xs">
          Sales period{" "}
          <select
            aria-label="Sales period"
            className="ml-2 border border-stone-200 bg-white px-3 rounded"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </label>
      </div>
      <div className="metric-grid">
        {[
          {
            label: "Sales for selected period",
            value: pkr(sales),
            detail: "Booked order value · excludes cancellations",
          },
          {
            label: "Orders awaiting action",
            value: String(action.length),
            detail: "All open records",
          },
          {
            label: "Outstanding balances",
            value: pkr(outstanding),
            detail: "Open orders and quoted commissions",
          },
          {
            label: "Low-stock products",
            value: String(low.length),
            detail: "At or below each stock threshold",
          },
        ].map((m) => (
          <section className="metric" key={m.label}>
            <p>{m.label}</p>
            <strong>{m.value}</strong>
            <small>{m.detail}</small>
          </section>
        ))}
      </div>
      <div className="admin-two-columns">
        <section className="surface-panel">
          <div className="panel-heading">
            <h2>Sales over the selected period</h2>
            <span className="text-xs text-stone-500">PKR</span>
          </div>
          <p className="px-6 pt-4 text-xs text-stone-500" aria-live="polite">
            {inspection}
          </p>
          <div className="sales-chart" role="group" aria-label="Sales chart">
            {bins.map((b, i) => (
              <div className="sales-bar" key={i}>
                <button
                  aria-label={`${b.label}: ${pkr(b.value)}, ${b.count} orders`}
                  onFocus={() =>
                    setInspection(
                      `${b.label} · ${pkr(b.value)} · ${b.count} orders`,
                    )
                  }
                  onClick={() =>
                    setInspection(
                      `${b.label} · ${pkr(b.value)} · ${b.count} orders`,
                    )
                  }
                >
                  <span
                    aria-hidden="true"
                    style={{ height: Math.max(2, (b.value / peak) * 150) }}
                  />
                </button>
                <span>{b.label}</span>
              </div>
            ))}
          </div>
          {!periodOrders.length && (
            <p className="px-6 pb-5 text-xs text-stone-500">
              No orders in this period.
            </p>
          )}
        </section>
        <section className="surface-panel">
          <div className="panel-heading">
            <h2>Needs attention</h2>
          </div>
          <div className="attention-list">
            <button onClick={() => onSelectTab("custom_orders")}>
              {overdue.length} overdue custom orders
              <small>Review promised dates and production stages</small>
            </button>
            <button onClick={() => onSelectTab("orders")}>
              {
                orders.filter(
                  (o) =>
                    o.fulfilmentStatus !== "Cancelled" &&
                    o.paymentStatus !== "Paid",
                ).length
              }{" "}
              orders with unpaid balances
              <small>Verify payments before recording them</small>
            </button>
            <button onClick={() => onSelectTab("inventory")}>
              {low.length} products need stock review
              <small>Includes out-of-stock active pieces</small>
            </button>
          </div>
        </section>
      </div>
      <section className="surface-panel">
        <div className="panel-heading">
          <h2>Recent orders</h2>
          <button className="quiet-link" onClick={() => onSelectTab("orders")}>
            View orders →
          </button>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Customer</th>
                <th>Item</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Fulfilment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.orderReference}>
                  <td>{o.orderReference}</td>
                  <td>{o.customerName}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      {o.items[0]?.image && (
                        <img
                          src={o.items[0].image}
                          width={34}
                          height={34}
                          className="object-cover w-9 h-9"
                          alt=""
                        />
                      )}
                      {o.items[0]?.name || "Custom piece"}
                    </div>
                  </td>
                  <td>{pkr(o.agreedAmountPKR || 0)}</td>
                  <td>
                    <span
                      className={`status-pill ${o.paymentStatus === "Paid" ? "status-pill--paid" : ""}`}
                    >
                      {o.paymentStatus || "Pending"}
                    </span>
                  </td>
                  <td>{o.fulfilmentStatus || "New"}</td>
                  <td>
                    <button
                      className="quiet-link"
                      onClick={() => onSelectOrder(o)}
                    >
                      View order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!recent.length && <p className="empty-state">No orders yet.</p>}
        </div>
      </section>
    </div>
  );
}
