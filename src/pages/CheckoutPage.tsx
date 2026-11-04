import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DemoStorage } from "../services/storage";
import { placeDemoOrder } from "../services/checkoutService";
import {
  checkoutLines,
  totals,
  DEFAULT_CHECKOUT,
  normalizePKPhone,
  pkr,
} from "../utils/commerce";
import type { DeliveryAddress, BagItem } from "../types";
import { FormField } from "../components/common/FormField";
import { OrderItems, OrderTotals } from "../components/product/OrderSummary";
const emptyAddress: DeliveryAddress = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  instructions: "",
};
export function CheckoutPage() {
  const navigate = useNavigate();
  const [version, refresh] = useState(0);
  const [address, setAddress] = useState<DeliveryAddress>(() => {
      try {
        return (
          JSON.parse(
            sessionStorage.getItem("tsj_demo_checkout_draft") || "null",
          ) || emptyAddress
        );
      } catch {
        return emptyAddress;
      }
    }),
    [method, setMethod] = useState<"cod" | "bank">("cod"),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [summaryOpen, setSummaryOpen] = useState(true);
  const lock = useRef(false);
  const key = useRef(crypto.randomUUID());
  useEffect(() => {
    const sync = () => refresh((v) => v + 1);
    window.addEventListener("tsj-storage-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("tsj-storage-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const config = DemoStorage.getSettings().checkout || DEFAULT_CHECKOUT;
  const bag = DemoStorage.getBag();
  let lines: BagItem[] = [],
    lineError = "";
  try {
    lines = checkoutLines(
      bag,
      DemoStorage.getProducts(),
      DemoStorage.getRates(),
    );
  } catch (e) {
    lineError = (e as Error).message;
  }
  const amounts = totals(lines, config);
  const cod =
    config.codEnabled &&
    (!config.codMaxPKR || amounts.total <= config.codMaxPKR) &&
    (!config.codCities.length ||
      config.codCities.some(
        (c) => c.toLowerCase() === address.city.trim().toLowerCase(),
      ));
  const bank = config.bankEnabled && !!config.bankInstructions.trim();
  useEffect(() => {
    if (method === "cod" && !cod && bank) setMethod("bank");
    else if (method === "bank" && !bank && cod) setMethod("cod");
  }, [cod, bank, method]);
  const update = (name: keyof DeliveryAddress, value: string) => {
    setAddress((a) => {
      const n = { ...a, [name]: value };
      try {
        sessionStorage.setItem("tsj_demo_checkout_draft", JSON.stringify(n));
      } catch {}
      return n;
    });
    setErrors((e) => ({ ...e, [name]: "" }));
  };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lock.current) return;
    setError("");
    const next: Record<string, string> = {};
    for (const name of ["fullName", "address", "city", "province"] as const)
      if (!address[name].trim()) next[name] = "This field is required.";
    if (!normalizePKPhone(address.phone))
      next.phone = "Use 03XXXXXXXXX or +923XXXXXXXXX.";
    if (address.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email))
      next.email = "Enter a valid email address.";
    if (config.postalCodeRequired && !address.postalCode?.trim())
      next.postalCode = "Postal code is required.";
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>("[aria-invalid=true]")?.focus(),
      );
      return;
    }
    if (lineError) {
      setError(lineError);
      return;
    }
    lock.current = true;
    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 180));
      const order = placeDemoOrder({
        key: key.current,
        address,
        method,
        reviewedTotal: amounts.total,
        reviewedLines: lines,
      });
      sessionStorage.removeItem("tsj_demo_checkout_draft");
      navigate("/order-confirmation/" + order.orderReference, {
        replace: true,
      });
    } catch (e) {
      setError((e as Error).message);
      refresh((v) => v + 1);
      lock.current = false;
      setBusy(false);
    }
  };
  if (!bag.length)
    return (
      <main className="checkout-page">
        <h1>Your bag is empty.</h1>
        <p>Add a piece before starting checkout.</p>
        <Link className="button-primary mt-6" to="/collections">
          Explore collections
        </Link>
      </main>
    );
  const field = (
    name: keyof DeliveryAddress,
    label: string,
    autocomplete: string,
    type = "text",
    hint?: string,
  ) => (
    <FormField label={label} error={errors[name]} hint={hint}>
      <input
        name={name}
        type={type}
        autoComplete={autocomplete}
        value={address[name] || ""}
        onChange={(e) => update(name, e.target.value)}
      />
    </FormField>
  );
  return (
    <main className="checkout-page">
      <Link className="quiet-link" to="/bag">
        ← Return to bag
      </Link>
      <h1>Checkout</h1>
      <p>Guest checkout · review your pieces and delivery details.</p>
      <p className="notice mt-5">
        Demo checkout only. Use sample details. Orders and payment states are
        simulated in this browser; no real payment, delivery or confirmation
        message is processed.
      </p>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={submit} noValidate>
          <section>
            <h2 className="text-lg font-medium mb-5">Contact details</h2>
            <div className="form-grid">
              {field("fullName", "Full name", "name")}
              {field(
                "phone",
                "Phone",
                "tel",
                "tel",
                "Pakistani local or +92 format",
              )}
              {field(
                "email",
                "Email (optional)",
                "email",
                "email",
                "No confirmation emails are sent in this demo.",
              )}
            </div>
          </section>
          <section className="form-section">
            <h2 className="text-lg font-medium mb-5">Delivery address</h2>
            <div className="form-grid">
              <div className="full-width">
                {field("address", "Address", "street-address")}
              </div>
              {field("city", "City", "address-level2")}
              {field("province", "Province / region", "address-level1")}
              {field(
                "postalCode",
                config.postalCodeRequired
                  ? "Postal code"
                  : "Postal code (optional)",
                "postal-code",
              )}
              <FormField
                label="Delivery instructions (optional)"
                className="full-width"
              >
                <textarea
                  autoComplete="off"
                  rows={3}
                  value={address.instructions || ""}
                  onChange={(e) => update("instructions", e.target.value)}
                />
              </FormField>
            </div>
          </section>
          <section className="form-section">
            <h2 className="text-lg font-medium mb-5">Payment method</h2>
            <div className="form-stack">
              {cod && (
                <label className="payment-choice">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={method === "cod"}
                    onChange={() => setMethod("cod")}
                  />
                  <span>
                    Cash on delivery{" "}
                    <small className="block text-xs text-stone-500 mt-1">
                      Payment due on delivery · simulated demo option
                    </small>
                  </span>
                </label>
              )}
              {bank && (
                <label className="payment-choice">
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={method === "bank"}
                    onChange={() => setMethod("bank")}
                  />
                  <span>
                    Bank transfer{" "}
                    <small className="block text-xs text-stone-500 mt-1">
                      Verification required · no transfer processed here
                    </small>
                  </span>
                </label>
              )}
              {method === "bank" && bank && (
                <p className="notice whitespace-pre-wrap">
                  {config.bankInstructions}
                </p>
              )}
              {!cod && !bank && (
                <p role="status" className="notice">
                  No payment method is configured for this order and city.
                  Return to your bag or contact the store. In the demo, the
                  Owner can configure options in Settings.
                </p>
              )}
            </div>
          </section>
          {(error || lineError) && (
            <p className="field-error text-sm" role="alert">
              {error || lineError}
            </p>
          )}
          <button
            className="button-primary w-full"
            disabled={busy || !!lineError || (!cod && !bank)}
          >
            {busy
              ? "Placing demo order…"
              : `Place order · ${pkr(amounts.total)}`}
          </button>
          <small className="text-xs text-stone-500">
            All prices shown are demo PKR amounts. No card details are
            collected.
          </small>
        </form>
        <details
          className="checkout-summary"
          open={summaryOpen}
          onToggle={(e) => setSummaryOpen(e.currentTarget.open)}
        >
          <summary>Order summary · {pkr(amounts.total)}</summary>
          <div className="checkout-summary__items">
            <OrderItems items={lines} />
            <OrderTotals {...amounts} />
            <p className="text-xs text-stone-500 mt-5">
              Delivery, tax and discount use the current demo configuration.
              Agreed prices are saved when the order is created.
            </p>
          </div>
        </details>
      </div>
    </main>
  );
}
