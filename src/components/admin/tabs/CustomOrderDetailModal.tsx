import React, { useState } from "react";
import type { CustomOrderRecord, CustomOrderStage } from "../../../types";
import { DemoStorage } from "../../../services/storage";
import { FormField } from "../../common/FormField";
import { AccessibleDialog } from "../../common/AccessibleDialog";
import { normalizePKPhone, pkr } from "../../../utils/commerce";
interface Props {
  customOrder: CustomOrderRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated: () => void;
}
export const CUSTOM_STAGES: CustomOrderStage[] = [
  "New Request",
  "Quoted",
  "Approved",
  "In Production",
  "Quality Check",
  "Ready",
  "Delivered",
];
export function CustomOrderDetailModal(props: Props) {
  return props.isOpen ? (
    <CustomEditor key={props.customOrder?.id || "new"} {...props} />
  ) : null;
}
function CustomEditor({ customOrder: o, onClose, onOrderUpdated }: Props) {
  const [name, setName] = useState(o?.customerName || ""),
    [phone, setPhone] = useState(o?.customerPhone || ""),
    [city, setCity] = useState(o?.customerCity || ""),
    [type, setType] = useState(o?.jewelleryType || ""),
    [purity, setPurity] = useState(o?.metalPurity || "22K Gold"),
    [karat, setKarat] = useState(o?.karatCode || "22K"),
    [stage, setStage] = useState<CustomOrderStage>(o?.stage || "New Request"),
    [size, setSize] = useState(o?.size || ""),
    [estimate, setEstimate] = useState(o?.estimatedWeightGrams || 0),
    [actual, setActual] = useState(o?.actualWeightGrams || 0),
    [quote, setQuote] = useState(o?.quotedAmountPKR || 0),
    [deposit, setDeposit] = useState(o?.depositPaidPKR || 0),
    [artisan, setArtisan] = useState(o?.assignedKarigar || ""),
    [date, setDate] = useState(o?.promisedDeliveryDate || ""),
    [notes, setNotes] = useState(o?.notes || ""),
    [image, setImage] = useState(o?.sampleSketchUrl || ""),
    [stones, setStones] = useState(o?.stoneRequirements || ""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!name.trim() || !type.trim() || !normalizePKPhone(phone))
        throw new Error(
          "Enter customer name, jewellery requirements and a valid Pakistani phone.",
        );
      if (deposit > (quote || 0))
        throw new Error("Deposit cannot exceed the quotation.");
      if (
        o &&
        deposit < o.depositPaidPKR &&
        !window.confirm(
          "Reduce the recorded demo deposit? An adjustment will remain in the payment history.",
        )
      )
        return;
      const now = new Date().toISOString();
      const history = [...(o?.history || [])];
      if (!o || stage !== o.stage)
        history.push({
          stage,
          date: now,
          note: o ? "Stage updated by Owner demo" : "Demo request created",
        });
      const payments = [...(o?.paymentHistory || [])];
      if (deposit !== (o?.depositPaidPKR || 0))
        payments.push({
          amountPKR: deposit - (o?.depositPaidPKR || 0),
          date: now,
          note: "Owner demo deposit adjustment",
        });
      const updated: CustomOrderRecord = {
        ...o,
        id: o?.id || "custom-" + crypto.randomUUID(),
        reference:
          o?.reference ||
          "TSJ-CUSTOM-" + crypto.randomUUID().slice(0, 8).toUpperCase(),
        customerName: name.trim(),
        customerPhone: normalizePKPhone(phone)!,
        customerCity: city,
        jewelleryType: type.trim(),
        metalPurity: purity,
        karatCode: karat,
        stage,
        size,
        estimatedWeightGrams: estimate,
        estimatedWeightTolas: Number((estimate / 11.664).toFixed(3)),
        actualWeightGrams: actual,
        quotedAmountPKR: quote,
        depositPaidPKR: deposit,
        assignedKarigar: artisan || "Unassigned",
        promisedDeliveryDate: date,
        notes,
        sampleSketchUrl: image || undefined,
        stoneRequirements: stones,
        history,
        paymentHistory: payments,
        createdAt: o?.createdAt || now,
        updatedAt: now,
      };
      setBusy(true);
      DemoStorage.saveCustomOrder(updated);
      onOrderUpdated();
      onClose();
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  };
  const num = (label: string, value: number, set: (n: number) => void) => (
    <FormField label={label}>
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(e) => set(Number(e.target.value))}
      />
    </FormField>
  );
  return (
    <AccessibleDialog
      title={o ? `Custom order ${o.reference}` : "New custom order"}
      onClose={onClose}
      wide
    >
      <form className="form-stack" onSubmit={save}>
        <p className="notice">
          Demo commission · no real funds, artisan notification or delivery
          booking is processed.
        </p>
        <div className="form-grid">
          <FormField label="Customer name">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormField>
          <FormField label="Customer phone">
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </FormField>
          <FormField label="City">
            <input value={city} onChange={(e) => setCity(e.target.value)} />
          </FormField>
          <FormField label="Stage">
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as CustomOrderStage)}
            >
              {CUSTOM_STAGES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </FormField>
          <FormField
            label="Jewellery / design requirements"
            className="full-width"
          >
            <textarea
              required
              rows={3}
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </FormField>
          <FormField label="Metal and purity">
            <input
              required
              value={purity}
              onChange={(e) => setPurity(e.target.value)}
            />
          </FormField>
          <FormField label="Rate category">
            <select
              value={karat}
              onChange={(e) => setKarat(e.target.value as typeof karat)}
            >
              {["24K", "22K", "21K", "18K", "925 Silver"].map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Size / measurements">
            <input value={size} onChange={(e) => setSize(e.target.value)} />
          </FormField>
          <FormField label="Stone requirements">
            <input value={stones} onChange={(e) => setStones(e.target.value)} />
          </FormField>
          {num("Estimated net metal weight (g)", estimate, setEstimate)}
          {num("Actual net metal weight (g)", actual, setActual)}
          {num("Quotation (PKR)", quote, setQuote)}
          {num("Recorded deposit (PKR)", deposit, setDeposit)}
          <FormField label="Assigned artisan">
            <input
              value={artisan}
              onChange={(e) => setArtisan(e.target.value)}
            />
          </FormField>
          <FormField label="Promised delivery date">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormField>
          <FormField
            label="Reference image URL / local asset"
            className="full-width"
          >
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/hero-bridal.webp"
              pattern="(/[^ ].*|https://.*)"
            />
          </FormField>
          <FormField label="Production notes" className="full-width">
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </FormField>
        </div>
        <p className="text-sm">
          Balance: <strong>{pkr(Math.max(0, quote - deposit))}</strong>
        </p>
        {o?.history?.length ? (
          <section className="form-section">
            <h3>Recorded status timeline</h3>
            <ol className="space-y-2">
              {o.history.map((h, i) => (
                <li className="text-xs" key={i}>
                  {h.stage} · {new Date(h.date).toLocaleString("en-PK")} ·{" "}
                  {h.note}
                </li>
              ))}
            </ol>
          </section>
        ) : (
          <p className="text-xs text-stone-500">
            No historical status events recorded for this sample.
          </p>
        )}
        {!!o?.paymentHistory?.length && (
          <section className="form-section">
            <h3>Deposit history</h3>
            {o.paymentHistory.map((p, i) => (
              <p className="text-xs mb-2" key={i}>
                {pkr(p.amountPKR)} · {p.date} · {p.note}
              </p>
            ))}
          </section>
        )}
        {error && (
          <p className="field-error text-sm" role="alert">
            {error}
          </p>
        )}
        <div className="button-row justify-end">
          <button className="button-secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="button-primary" disabled={busy}>
            {busy ? "Saving…" : "Save custom order"}
          </button>
        </div>
      </form>
    </AccessibleDialog>
  );
}
