import React, { useState } from "react";
import type {
  AdminOrderRecord,
  FulfilmentStatus,
  OrderPayment,
} from "../../../types";
import { DemoStorage } from "../../../services/storage";
import { AccessibleDialog } from "../../common/AccessibleDialog";
import { FormField } from "../../common/FormField";
import { OrderItems, OrderTotals } from "../../product/OrderSummary";
import { pkr } from "../../../utils/commerce";
interface Props {
  order: AdminOrderRecord | null;
  onClose: () => void;
  onOrderUpdated: () => void;
}
export function OrderDetailDrawer(props: Props) {
  return props.order ? (
    <OrderDetail
      key={props.order.orderReference}
      {...props}
      order={props.order}
    />
  ) : null;
}
function OrderDetail({
  order: initial,
  onClose,
  onOrderUpdated,
}: Props & { order: AdminOrderRecord }) {
  const order =
    DemoStorage.getOrderByReference(initial.orderReference) || initial;
  const [tab, setTab] = useState("details"),
    [amount, setAmount] = useState(
      Math.max(0, (order.agreedAmountPKR || 0) - (order.paidAmountPKR || 0)),
    ),
    [method, setMethod] = useState<OrderPayment["method"]>(
      "Bank Transfer (IBFT)",
    ),
    [reference, setReference] = useState(""),
    [verified, setVerified] = useState(false),
    [note, setNote] = useState(""),
    [message, setMessage] = useState("");
  const run = (fn: () => void) => {
    try {
      fn();
      setMessage("Demo record saved.");
      onOrderUpdated();
    } catch (e) {
      setMessage((e as Error).message);
    }
  };
  const balance = Math.max(
    0,
    (order.agreedAmountPKR || 0) - (order.paidAmountPKR || 0),
  );
  return (
    <AccessibleDialog
      title={`Order ${order.orderReference}`}
      onClose={onClose}
      wide
    >
      <div className="form-stack">
        <p className="notice">
          Sample order · recording a payment here simulates owner verification;
          it does not process funds.
        </p>
        <div className="button-row">
          {["details", "payments", "notes"].map((t) => (
            <button
              type="button"
              key={t}
              className={tab === t ? "button-primary" : "button-secondary"}
              aria-pressed={tab === t}
              onClick={() => {
                setTab(t);
                setMessage("");
              }}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        {message && (
          <p role="status" className="text-sm">
            {message}
          </p>
        )}
        {tab === "details" && (
          <>
            <div className="form-grid">
              <FormField label="Fulfilment status">
                <select
                  value={order.fulfilmentStatus || "New"}
                  onChange={(e) => {
                    const value = e.target.value as FulfilmentStatus;
                    if (
                      value === "Cancelled" &&
                      !window.confirm(
                        "Cancel this demo order? Payments remain in its history. Stock must be reviewed manually.",
                      )
                    )
                      return;
                    run(() =>
                      DemoStorage.updateOrderStatus(
                        order.orderReference,
                        value,
                      ),
                    );
                  }}
                >
                  {[
                    "New",
                    "In Production",
                    "Ready for Pickup",
                    "Dispatched",
                    "Delivered",
                    "Cancelled",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Assigned artisan">
                <input
                  value={order.assignedKarigar || ""}
                  placeholder="Unassigned"
                  onChange={(e) =>
                    run(() =>
                      DemoStorage.updateOrderKarigar(
                        order.orderReference,
                        e.target.value,
                      ),
                    )
                  }
                />
              </FormField>
            </div>
            <div className="print-invoice">
              <h2 className="text-lg font-medium">
                Tayyab Shahzad Jewellers · Demo invoice
              </h2>
              <p className="text-sm my-3">
                {order.orderReference} ·{" "}
                {new Date(order.confirmedDate).toLocaleDateString("en-PK")}
                <br />
                {order.customerName} · {order.customerPhone}
                <br />
                Payment: {order.paymentStatus || "Pending"} · Fulfilment:{" "}
                {order.fulfilmentStatus || "New"}
              </p>
              <OrderItems items={order.items} />
              <OrderTotals
                subtotal={order.subtotalPKR}
                delivery={order.deliveryPKR}
                tax={order.taxPKR}
                discount={order.discountPKR}
                total={order.agreedAmountPKR || 0}
              />
              <p className="text-sm mt-5">
                Paid: {pkr(order.paidAmountPKR || 0)} · Outstanding:{" "}
                {pkr(balance)}
              </p>
              <section className="form-section mt-6">
                <h3>Delivery details</h3>
                <p className="text-sm leading-7">
                  {order.deliveryAddress ? (
                    <>
                      {order.deliveryAddress.address}
                      <br />
                      {order.deliveryAddress.city},{" "}
                      {order.deliveryAddress.province}{" "}
                      {order.deliveryAddress.postalCode}
                      <br />
                      {order.deliveryAddress.instructions}
                    </>
                  ) : (
                    order.customerCity || "Not recorded."
                  )}
                </p>
              </section>
            </div>
            <div className="button-row">
              <button
                className="button-secondary"
                onClick={() => window.print()}
              >
                Print / Save Invoice PDF
              </button>
            </div>
            <section className="form-section">
              <h3>Status history</h3>
              {order.timeline.length ? (
                <ol className="space-y-3">
                  {order.timeline.map((s, i) => (
                    <li className="text-xs" key={i}>
                      <strong>{s.status}</strong> · {s.date}
                      <p className="text-stone-500 mt-1">{s.description}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm">No status updates recorded.</p>
              )}
            </section>
          </>
        )}
        {tab === "payments" && (
          <>
            <div className="form-grid">
              <p className="text-sm">
                Payment status:{" "}
                <strong>{order.paymentStatus || "Pending"}</strong>
              </p>
              <p className="text-sm">
                Outstanding: <strong>{pkr(balance)}</strong>
              </p>
            </div>
            {order.transferReference && (
              <p className="notice">
                Customer transfer reference: {order.transferReference}. Verify
                independently before recording a payment.
              </p>
            )}
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.payments || []).map((p) => (
                    <tr key={p.id}>
                      <td>{p.date}</td>
                      <td>{pkr(p.amountPKR)}</td>
                      <td>{p.method}</td>
                      <td>{p.reference || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!order.payments?.length && (
                <p className="empty-state">No payment entries recorded.</p>
              )}
            </div>
            {balance > 0 && order.fulfilmentStatus !== "Cancelled" && (
              <form
                className="form-stack form-section"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!verified) {
                    setMessage(
                      "Confirm verification before recording a simulated payment.",
                    );
                    return;
                  }
                  run(() =>
                    DemoStorage.recordOrderPayment(order.orderReference, {
                      amountPKR: amount,
                      date: new Date().toISOString(),
                      method,
                      reference: reference || undefined,
                      note: "Owner-verified demo payment",
                    }),
                  );
                  setVerified(false);
                }}
              >
                <h3>Record verified payment · simulation</h3>
                <div className="form-grid">
                  <FormField label="Amount (PKR)">
                    <input
                      type="number"
                      min="0.01"
                      max={balance}
                      step="0.01"
                      required
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                  </FormField>
                  <FormField label="Payment method">
                    <select
                      value={method}
                      onChange={(e) =>
                        setMethod(e.target.value as OrderPayment["method"])
                      }
                    >
                      {[
                        "Cash / Sarafa Counter",
                        "Bank Transfer (IBFT)",
                        "Cheque",
                        "Advance Gold Deposit",
                      ].map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Payment reference">
                    <input
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      required={method === "Bank Transfer (IBFT)"}
                    />
                  </FormField>
                </div>
                <label className="text-sm flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={verified}
                    onChange={(e) => setVerified(e.target.checked)}
                  />
                  I confirm this simulated payment has been verified.
                </label>
                <button className="button-primary">Record demo payment</button>
              </form>
            )}
          </>
        )}
        {tab === "notes" && (
          <>
            <ol className="space-y-4">
              {(order.internalNotes || []).map((n) => (
                <li
                  className="text-sm border-b border-stone-200 pb-3"
                  key={n.id}
                >
                  <p>{n.text}</p>
                  <small className="text-stone-500">
                    {n.author} · {n.timestamp}
                  </small>
                </li>
              ))}
            </ol>
            {!order.internalNotes?.length && (
              <p className="text-sm">No internal notes.</p>
            )}
            <form
              className="form-stack"
              onSubmit={(e) => {
                e.preventDefault();
                if (!note.trim()) return;
                run(() =>
                  DemoStorage.addOrderNote(
                    order.orderReference,
                    note.trim(),
                    "Owner demo",
                  ),
                );
                setNote("");
              }}
            >
              <FormField label="Internal note">
                <textarea
                  required
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </FormField>
              <button className="button-primary">Add note</button>
            </form>
          </>
        )}
      </div>
    </AccessibleDialog>
  );
}
