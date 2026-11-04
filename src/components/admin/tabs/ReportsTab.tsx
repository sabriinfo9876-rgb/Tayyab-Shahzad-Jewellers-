import React, { useState } from "react";
import type {
  AdminOrderRecord,
  CustomOrderRecord,
  Product,
  CustomerRecord,
} from "../../../types";
import { pkr, exportRows } from "../../../utils/commerce";
import { FormField } from "../../common/FormField";
interface Props {
  orders: AdminOrderRecord[];
  customOrders: CustomOrderRecord[];
  products: Product[];
  customers: CustomerRecord[];
}
export function ReportsTab({ orders, customOrders, products }: Props) {
  const [from, setFrom] = useState(
      new Date(new Date().setDate(new Date().getDate() - 30))
        .toISOString()
        .slice(0, 10),
    ),
    [to, setTo] = useState(new Date().toISOString().slice(0, 10)),
    [type, setType] = useState("sales"),
    [status, setStatus] = useState("");
  const inRange = (date: string) =>
    date.slice(0, 10) >= from && date.slice(0, 10) <= to;
  const filtered = orders.filter((o) => inRange(o.confirmedDate));
  const active = filtered.filter((o) => o.fulfilmentStatus !== "Cancelled");
  const inventory = products.filter((p) => inRange(p.createdAt));
  const jobs = customOrders.filter((c) => inRange(c.createdAt));
  const rows: Record<string, unknown>[] =
    type === "inventory"
      ? inventory.map((p) => ({
          SKU: p.code,
          Name: p.name,
          Category: p.category,
          "Created date": p.createdAt,
          "Stock pieces": p.stockQuantity ?? 0,
          "Low-stock threshold": p.lowStockThreshold ?? 2,
          "Net weight g": p.netWeightGrams ?? "",
          "Price mode": p.pricingMode || "fixed",
          "Fixed demo price PKR": p.samplePricePKR ?? "",
          Status: p.lifecycle || (p.published ? "active" : "draft"),
        }))
      : type === "custom"
        ? jobs.map((c) => ({
            Reference: c.reference,
            Customer: c.customerName,
            Created: c.createdAt,
            Stage: c.stage,
            "Quotation PKR": c.quotedAmountPKR,
            "Deposit PKR": c.depositPaidPKR,
            "Balance PKR": Math.max(0, c.quotedAmountPKR - c.depositPaidPKR),
          }))
        : filtered.map((o) => ({
            Reference: o.orderReference,
            Customer: o.customerName,
            Date: o.confirmedDate,
            "Total PKR": o.agreedAmountPKR ?? 0,
            "Paid PKR": o.paidAmountPKR ?? 0,
            "Balance PKR":
              o.fulfilmentStatus === "Cancelled"
                ? 0
                : Math.max(
                    0,
                    (o.agreedAmountPKR || 0) - (o.paidAmountPKR || 0),
                  ),
            Payment: o.paymentStatus || "Pending",
            Fulfilment: o.fulfilmentStatus || "New",
          }));
  const valid = from && to && from <= to;
  const keys = Object.keys(rows[0] || {});
  return (
    <div className="form-stack">
      <div className="admin-title">
        <div>
          <h1>Reports</h1>
          <p>
            Calculated from saved sample records. No profit or growth estimates.
          </p>
        </div>
      </div>
      <section className="surface-panel p-5">
        <div className="report-toolbar">
          <FormField label="From date">
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </FormField>
          <FormField
            label="To date"
            error={!valid ? "Choose a valid date range." : undefined}
          >
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </FormField>
          <FormField label="Report">
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="sales">Sales & orders</option>
              <option value="inventory">Inventory by creation date</option>
              <option value="custom">Custom orders</option>
            </select>
          </FormField>
          <button
            className="button-primary"
            disabled={!valid}
            onClick={() => {
              exportRows(
                `TSJ-demo-${type}-${from}-${to}.csv`,
                rows,
                keys.length ? keys : ["No records"],
              );
              setStatus(
                `Exported ${rows.length} records for the selected dates.`,
              );
            }}
          >
            Export CSV
          </button>
        </div>
        <p className="text-xs text-stone-500 mt-4">
          Inventory shows current stock for products created in the selected
          dates; historical stock valuation is unavailable.
        </p>
        {status && (
          <p role="status" className="text-xs mt-3">
            {status}
          </p>
        )}
      </section>
      <div className="metric-grid">
        <section className="metric">
          <p>Booked sales · excludes cancelled</p>
          <strong>
            {pkr(active.reduce((s, o) => s + (o.agreedAmountPKR || 0), 0))}
          </strong>
        </section>
        <section className="metric">
          <p>Orders in period</p>
          <strong>{filtered.length}</strong>
        </section>
        <section className="metric">
          <p>Recorded payments on these orders</p>
          <strong>
            {pkr(active.reduce((s, o) => s + (o.paidAmountPKR || 0), 0))}
          </strong>
        </section>
        <section className="metric">
          <p>Outstanding on these orders</p>
          <strong>
            {pkr(
              active.reduce(
                (s, o) =>
                  s +
                  Math.max(
                    0,
                    (o.agreedAmountPKR || 0) - (o.paidAmountPKR || 0),
                  ),
                0,
              ),
            )}
          </strong>
        </section>
      </div>
      <section className="surface-panel">
        <div className="panel-heading">
          <h2>{rows.length} matching records</h2>
        </div>
        {valid && rows.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  {keys.map((k) => (
                    <th key={k}>{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    {keys.map((k) => (
                      <td key={k}>{String(r[k] ?? "")}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-state">
            {valid ? "No records match this period." : "Review the date range."}
          </p>
        )}
      </section>
    </div>
  );
}
