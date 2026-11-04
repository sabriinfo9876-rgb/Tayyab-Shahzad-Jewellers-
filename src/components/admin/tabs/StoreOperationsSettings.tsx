import React, { useState } from "react";
import { DemoStorage } from "../../../services/storage";
import { DEFAULT_CHECKOUT } from "../../../utils/commerce";
import { FormField } from "../../common/FormField";
import type { CheckoutConfiguration } from "../../../types";
export function StoreOperationsSettings({ onSaved }: { onSaved: () => void }) {
  const current = DemoStorage.getSettings();
  const [c, setC] = useState<CheckoutConfiguration>({
      ...DEFAULT_CHECKOUT,
      ...current.checkout,
    }),
    [address, setAddress] = useState(current.address || ""),
    [hours, setHours] = useState(current.openingHours || ""),
    [message, setMessage] = useState(""),
    [error, setError] = useState(false);
  const set = (key: keyof CheckoutConfiguration, value: any) =>
    setC((v) => ({ ...v, [key]: value }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (
        [c.deliveryFeePKR, c.taxPercent, c.discountPKR, c.codMaxPKR].some(
          (v) => !Number.isFinite(v) || v < 0,
        ) ||
        c.taxPercent > 100
      )
        throw new Error(
          "Charges must be non-negative and tax must be between 0 and 100%.",
        );
      if (c.bankEnabled && !c.bankInstructions.trim())
        throw new Error(
          "Enter bank instructions before enabling bank transfer. Never use invented bank details.",
        );
      DemoStorage.saveSettings({
        ...DemoStorage.getSettings(),
        address,
        openingHours: hours,
        checkout: c,
      });
      setError(false);
      setMessage("Demo delivery and payment configuration saved.");
      onSaved();
    } catch (e) {
      setError(true);
      setMessage((e as Error).message);
    }
  };
  const num = (label: string, k: keyof CheckoutConfiguration) => (
    <FormField label={label}>
      <input
        type="number"
        min="0"
        step="0.01"
        max={k === "taxPercent" ? 100 : undefined}
        value={String(c[k])}
        onChange={(e) => set(k, Number(e.target.value))}
      />
    </FormField>
  );
  return (
    <form className="surface-panel p-5 form-stack" onSubmit={submit}>
      <h2 className="text-base font-semibold">
        Store, delivery & payment configuration
      </h2>
      <p className="notice">
        Demo configuration only. Card payments, courier integrations and
        automated notifications are not connected. Never enter API keys,
        provider secrets or real customer details here.
      </p>
      <div className="form-grid">
        <FormField label="Store address">
          <textarea
            value={address}
            rows={2}
            onChange={(e) => setAddress(e.target.value)}
          />
        </FormField>
        <FormField label="Opening hours">
          <input value={hours} onChange={(e) => setHours(e.target.value)} />
        </FormField>
        {num("Delivery fee (PKR)", "deliveryFeePKR")}
        {num("Tax (%)", "taxPercent")}
        {num("Order discount (PKR)", "discountPKR")}
        {num("COD limit (PKR; 0 means no demo limit)", "codMaxPKR")}
        <FormField
          label="COD cities (comma separated; blank means all demo cities)"
          className="full-width"
        >
          <input
            value={c.codCities.join(", ")}
            onChange={(e) =>
              set(
                "codCities",
                e.target.value.split(",").map((v) => v.trim()),
              )
            }
            onBlur={() => set("codCities", c.codCities.filter(Boolean))}
          />
        </FormField>
        <FormField
          label="Delivery estimate (optional)"
          hint="Only enter a supported estimate; shown as a configured demo estimate."
        >
          <input
            value={c.deliveryEstimate}
            onChange={(e) => set("deliveryEstimate", e.target.value)}
          />
        </FormField>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={c.postalCodeRequired}
            onChange={(e) => set("postalCodeRequired", e.target.checked)}
          />
          Require postal code
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={c.codEnabled}
            onChange={(e) => set("codEnabled", e.target.checked)}
          />
          Enable demo cash on delivery
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={c.bankEnabled}
            onChange={(e) => set("bankEnabled", e.target.checked)}
          />
          Enable demo bank transfer
        </label>
        <FormField
          label="Configured bank-transfer instructions"
          className="full-width"
          hint="Leave disabled if instructions are unavailable. No bank details are supplied by this project."
        >
          <textarea
            rows={4}
            value={c.bankInstructions}
            onChange={(e) => set("bankInstructions", e.target.value)}
          />
        </FormField>
      </div>
      {message && (
        <p role="status" className={error ? "field-error text-sm" : "text-sm"}>
          {message}
        </p>
      )}
      <button className="button-primary justify-self-start">
        Save delivery & payment settings
      </button>
    </form>
  );
}
