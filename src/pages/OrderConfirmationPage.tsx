import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Check } from "lucide-react";
import { DemoStorage } from "../services/storage";
import { submitDemoTransfer } from "../services/checkoutService";
import { OrderItems, OrderTotals } from "../components/product/OrderSummary";
import { FormField } from "../components/common/FormField";
import type { AdminOrderRecord } from "../types";
export function paymentWording(order: AdminOrderRecord) {
  if (order.paymentStatus === "Paid") return "Payment received.";
  if (order.paymentState === "failed")
    return "Payment failed. No payment has been confirmed.";
  if (order.paymentStatus === "Partial")
    return "Partial payment received. Balance outstanding.";
  if (order.paymentState === "awaiting_verification")
    return "Payment awaiting verification.";
  if (order.paymentMethod === "bank") return "Awaiting bank transfer.";
  if (order.paymentMethod === "cod") return "Payment due on delivery.";
  return "Payment pending.";
}
export function OrderConfirmationPage({
  statusView = false,
}: {
  statusView?: boolean;
}) {
  const { reference } = useParams();
  const [version, refresh] = useState(0),
    [transfer, setTransfer] = useState(""),
    [feedback, setFeedback] = useState("");
  useEffect(() => {
    const sync = () => refresh((v) => v + 1);
    window.addEventListener("tsj-storage-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("tsj-storage-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const order = reference
    ? DemoStorage.getOrderByReference(reference)
    : undefined;
  const settings = DemoStorage.getSettings();
  if (!order)
    return (
      <main className="confirmation-page">
        <h1>Order not found.</h1>
        <p>
          Check the exact order link. Demo records are available only in the
          browser where they were created. No other customer’s order is shown.
        </p>
        <Link to="/collections" className="button-primary mt-6">
          Continue Shopping
        </Link>
      </main>
    );
  const name = order.customerName.trim().split(/\s+/)[0];
  const address = order.deliveryAddress;
  const transferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      submitDemoTransfer(order.orderReference, transfer);
      setFeedback(
        "Transfer reference saved in the demo. Payment is awaiting verification; no funds were processed.",
      );
    } catch (e) {
      setFeedback((e as Error).message);
    }
  };
  return (
    <main className="confirmation-page">
      <div className="print-invoice">
        <div className="confirmation-intro">
          <span className="inline-flex items-center justify-center w-8 h-8 border border-[var(--accent)] rounded-full mb-3">
            <Check size={17} />
          </span>
          <h1>{statusView ? "Order status" : `Thank you, ${name}.`}</h1>
          <p className="text-sm text-stone-600">
            {statusView
              ? "Current status of your saved order."
              : "Your order has been received."}
          </p>
          <div className="confirmation-meta">
            <span>
              Reference <strong>{order.orderReference}</strong>
            </span>
            <span>
              {new Date(order.confirmedDate).toLocaleDateString("en-PK", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span>
              Status <strong>{order.fulfilmentStatus || "New"}</strong>
            </span>
          </div>
          <p className="notice">
            Demo order · browser-only sample records. No real payment, shipment,
            email or WhatsApp confirmation was sent.
          </p>
        </div>
        <div className="confirmation-content mt-7">
          <OrderItems items={order.items} />
          <OrderTotals
            subtotal={order.subtotalPKR}
            delivery={order.deliveryPKR}
            tax={order.taxPKR}
            discount={order.discountPKR}
            total={order.agreedAmountPKR || 0}
          />
          <div className="confirmation-detail">
            <section>
              <h2>Delivery</h2>
              {address ? (
                <p>
                  {address.fullName}
                  <br />
                  {address.address}
                  <br />
                  {address.city}, {address.province} {address.postalCode}
                  <br />
                  {address.phone}
                  {address.instructions && (
                    <>
                      <br />
                      Instructions: {address.instructions}
                    </>
                  )}
                </p>
              ) : (
                <p>
                  {order.customerName}
                  <br />
                  {order.customerPhone}
                  <br />
                  {order.customerCity || "Delivery details not recorded."}
                </p>
              )}
              {order.deliveryEstimateSnapshot && (
                <p className="mt-3">
                  Configured demo estimate: {order.deliveryEstimateSnapshot}
                </p>
              )}
            </section>
            <section>
              <h2>Payment</h2>
              <p>
                {order.paymentMethod === "bank"
                  ? "Bank transfer"
                  : order.paymentMethod === "cod"
                    ? "Cash on delivery"
                    : "Recorded payment method"}
                <br />
                <strong>{paymentWording(order)}</strong>
              </p>
              {order.paymentMethod === "bank" &&
                order.paymentStatus !== "Paid" && (
                  <>
                    <p className="mt-3 whitespace-pre-wrap">
                      {order.bankInstructionsSnapshot ||
                        "Bank instructions have not been configured. Contact support before making a transfer."}
                    </p>
                    <p className="mt-3">
                      Use order reference:{" "}
                      <strong>{order.orderReference}</strong>
                    </p>
                    {order.transferReference && (
                      <p>Transfer reference: {order.transferReference}</p>
                    )}
                  </>
                )}
            </section>
          </div>
          {statusView && order.timeline.length > 0 && (
            <section className="form-section mt-7">
              <h2 className="text-sm font-medium mb-4">
                Recorded order updates
              </h2>
              <ol className="space-y-4">
                {order.timeline.map((s, i) => (
                  <li className="text-xs" key={i}>
                    <strong>{s.status}</strong> ·{" "}
                    {new Date(s.date).toLocaleDateString("en-PK")}
                    <p className="text-stone-500 mt-1">{s.description}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </div>
      {order.paymentMethod === "bank" && order.paymentStatus !== "Paid" && (
        <form className="form-stack mt-7 max-w-md" onSubmit={transferSubmit}>
          <FormField
            label="Transfer reference"
            hint="Demo only. This records a reference, not proof of payment."
          >
            <input
              required
              value={transfer}
              onChange={(e) => setTransfer(e.target.value)}
            />
          </FormField>
          <button className="button-secondary">
            Submit demo transfer reference
          </button>
          {feedback && (
            <p role="status" className="text-sm">
              {feedback}
            </p>
          )}
        </form>
      )}
      <div className="button-row mt-7 print:hidden">
        <Link
          className="button-primary"
          to={"/order-status/" + order.orderReference}
        >
          View Order Status
        </Link>
        <Link className="button-secondary" to="/collections">
          Continue Shopping
        </Link>
        <Link className="quiet-link" to="/contact">
          Contact Support
        </Link>
        <button className="quiet-link" onClick={() => window.print()}>
          Print / Save Invoice PDF
        </button>
      </div>
    </main>
  );
}
