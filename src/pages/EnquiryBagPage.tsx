import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  MessageCircle,
  ArrowRight,
  AlertCircle,
  Check,
  HelpCircle,
  FileText,
} from "lucide-react";
import { DemoStorage } from "../services/storage";
import { BagItem, Enquiry } from "../types";
import { generateReferenceCode, buildBagWhatsAppUrl } from "../utils/rules";

export const EnquiryBagPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<BagItem[]>(DemoStorage.getBag());
  const settings = DemoStorage.getSettings();

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("0312-345678");
  const [customerCity, setCustomerCity] = useState("");
  const [occasion, setOccasion] = useState("Bridal Wedding Celebration");
  const [targetDate, setTargetDate] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const syncBag = () => {
    setItems(DemoStorage.getBag());
  };

  useEffect(() => {
    syncBag();
    window.addEventListener("tsj-storage-updated", syncBag);
    return () => window.removeEventListener("tsj-storage-updated", syncBag);
  }, []);

  const handleUpdateQty = (idx: number, qty: number) => {
    DemoStorage.updateBagQuantity(idx, qty);
  };

  const handleRemove = (idx: number) => {
    DemoStorage.removeFromBag(idx);
  };

  const handleClearBag = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all pieces from your Enquiry Bag?",
      )
    ) {
      DemoStorage.clearBag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setFormError("Please enter a customer name and contact phone number.");
      return;
    }
    if (items.length === 0) {
      setFormError(
        "Your Enquiry Bag is empty. Please add at least one jewellery piece.",
      );
      return;
    }

    const reference = generateReferenceCode("ENQ");
    const newEnquiry: Enquiry = {
      id: "enq-" + Date.now().toString(36),
      reference,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerCity: customerCity.trim() || undefined,
      occasion: occasion.trim() || undefined,
      targetDate: targetDate || undefined,
      notes: notes.trim() || undefined,
      items: [...items],
      status: "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    DemoStorage.saveEnquiry(newEnquiry);
    DemoStorage.clearBag();

    // Navigate to local receipt page
    navigate(`/enquiry-receipt/${reference}`);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-[var(--surface-secondary)] text-[var(--charcoal)] rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-[var(--charcoal)]">
          Your Enquiry Bag is Empty
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
          Select pieces from our bridal suites, gold kadas, or Pakistani Chandi
          collections to assemble a formal quotation request.
        </p>
        <Link
          to="/collections"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--charcoal)] text-[var(--on-dark)] text-xs uppercase tracking-wider font-semibold rounded-xs shadow-xs hover:bg-[var(--action-hover)]"
        >
          <span>Explore Collections</span>
          <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
        </Link>
      </div>
    );
  }

  const directWhatsAppUrl = buildBagWhatsAppUrl(
    items,
    { name: customerName, phone: customerPhone, city: customerCity },
    "DRAFT-DEMO",
    settings.whatsappNumber || "92312345678",
  );

  return (
    <div className="bag-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-8 border-b border-[var(--charcoal)]/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[var(--accent-ink)] font-semibold block mb-1">
            Quotation &amp; Viewing Request
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[var(--charcoal)]">
            Enquiry Bag ({items.reduce((acc, i) => acc + i.quantity, 0)} items)
          </h1>
        </div>

        <button
          type="button"
          onClick={handleClearBag}
          className="text-xs text-[var(--text-secondary)] hover:text-red-700 underline flex items-center gap-1 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Bag
        </button>
      </div>

      {/* Atelier Consultation Notice */}
      <div className="mb-8 p-4 bg-[var(--surface)] border border-[var(--accent)]/30 rounded-2xl flex items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--charcoal)]/10 text-[var(--charcoal)] flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <div>
            <p className="font-semibold text-[var(--charcoal)]">
              Direct Atelier Quotation Request
            </p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              Submit your selected pieces for gold karat verification, exact
              weight testing, and a personalized quotation.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-block font-mono text-[11px] text-[var(--charcoal)] font-semibold bg-white px-3 py-1 rounded-xl border border-[var(--charcoal)]/10">
          Helpline: 0312-345678
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Bag Items List */}
        <div className="lg:col-span-7 space-y-4">
          {items.map((item, idx) => (
            <div
              key={`${item.productId}-${idx}`}
              className="bag-item bg-white border border-[var(--charcoal)]/15 rounded-2xl p-4 sm:p-5 flex gap-4 items-start shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="w-20 sm:w-24 aspect-square bg-[var(--surface)] rounded-xl overflow-hidden shrink-0 border border-[var(--charcoal)]/10">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-[var(--text-secondary)] font-mono tracking-wider">
                      {item.code}
                    </span>
                    <h3 className="font-serif text-base font-semibold text-[var(--charcoal)]">
                      {item.name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="shrink-0 p-1 text-[var(--text-secondary)] hover:text-red-700 transition-colors"
                    aria-label={`Remove ${item.name} from bag`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Selected Options */}
                {item.selectedOptions &&
                  Object.keys(item.selectedOptions).length > 0 && (
                    <div className="mt-2 text-[11px] text-[var(--text-secondary)] space-y-0.5">
                      {Object.entries(item.selectedOptions).map(([k, v]) => (
                        <div
                          key={k}
                          className="flex flex-wrap items-center gap-1.5"
                        >
                          <span className="text-[var(--text-secondary)]">
                            {k}:
                          </span>
                          <span className="font-medium text-[var(--text-primary)]">
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Notes */}
                {item.customerNotes && (
                  <p className="mt-1 text-[11px] text-[var(--text-secondary)] italic">
                    Note: {item.customerNotes}
                  </p>
                )}

                {/* Quantity Controls */}
                <div className="mt-3 flex flex-wrap gap-3 items-center justify-between border-t border-[var(--charcoal)]/5 pt-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-[var(--text-secondary)]">
                      Quantity:
                    </span>
                    <div className="flex items-center border border-[var(--charcoal)]/20 rounded-xs">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(idx, item.quantity - 1)}
                        className="px-2.5 py-0.5 text-xs text-[var(--charcoal)] hover:bg-[var(--on-dark)]"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(idx, item.quantity + 1)}
                        className="px-2.5 py-0.5 text-xs text-[var(--charcoal)] hover:bg-[var(--on-dark)]"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <span className="text-[11px] text-[var(--accent)] font-medium uppercase tracking-wider">
                    Enquiry Piece
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Enquiry Request Form */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-[var(--charcoal)]/15 rounded-2xl p-6 sm:p-8 shadow-sm sticky top-28 space-y-5">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[var(--charcoal)]">
                Customer Consultation Details
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Enter your details to generate a formal bespoke quotation and
                WhatsApp inquiry.
              </p>
            </div>

            <Link to="/checkout" className="button-primary w-full">
              Continue to demo checkout →
            </Link>
            <p className="text-xs text-stone-500">
              Sample order and payment states only. You can still request a
              quotation below.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="enquirybagpage-required-1"
                  className="block text-xs font-semibold text-[var(--charcoal)] uppercase tracking-wider mb-1"
                >
                  Full Name <span className="text-red-700">*</span>
                </label>
                <input
                  id="enquirybagpage-required-1"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Fatima Tariq"
                  className="w-full text-xs px-3.5 py-2.5 bg-[var(--surface)] border border-[var(--charcoal)]/20 rounded-xl focus:outline-none focus:border-[var(--charcoal)]"
                />
              </div>

              <div>
                <label
                  htmlFor="enquirybagpage-required-2"
                  className="block text-xs font-semibold text-[var(--charcoal)] uppercase tracking-wider mb-1"
                >
                  Contact Phone / WhatsApp{" "}
                  <span className="text-red-700">*</span>
                </label>
                <input
                  id="enquirybagpage-required-2"
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0312-345678"
                  className="w-full text-xs px-3.5 py-2.5 bg-[var(--surface)] border border-[var(--charcoal)]/20 rounded-xl focus:outline-none focus:border-[var(--charcoal)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="enquirybagpage-field-1"
                    className="block text-xs font-semibold text-[var(--charcoal)] uppercase tracking-wider mb-1"
                  >
                    City
                  </label>
                  <input
                    id="enquirybagpage-field-1"
                    type="text"
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    placeholder="e.g. Lahore"
                    className="w-full text-xs px-3.5 py-2.5 bg-[var(--surface)] border border-[var(--charcoal)]/20 rounded-xl focus:outline-none focus:border-[var(--charcoal)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="enquirybagpage-field-2"
                    className="block text-xs font-semibold text-[var(--charcoal)] uppercase tracking-wider mb-1"
                  >
                    Occasion
                  </label>
                  <input
                    id="enquirybagpage-field-2"
                    type="text"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    placeholder="e.g. Barat Wedding"
                    className="w-full text-xs px-3.5 py-2.5 bg-[var(--surface)] border border-[var(--charcoal)]/20 rounded-xl focus:outline-none focus:border-[var(--charcoal)]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="enquirybagpage-field-3"
                  className="block text-xs font-semibold text-[var(--charcoal)] uppercase tracking-wider mb-1"
                >
                  General Consultation Notes
                </label>
                <textarea
                  id="enquirybagpage-field-3"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific requests, desired gold karat (21K/22K), or gemstone modifications..."
                  className="w-full text-xs px-3.5 py-2.5 bg-[var(--surface)] border border-[var(--charcoal)]/20 rounded-xl focus:outline-none focus:border-[var(--charcoal)]"
                />
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl">
                  {formError}
                </div>
              )}

              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[var(--charcoal)] hover:bg-[var(--action-hover)] text-[var(--on-dark)] text-xs uppercase tracking-widest font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95"
                >
                  <FileText className="w-4 h-4 text-[var(--accent)]" />
                  <span>Submit Consultation Request</span>
                </button>

                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[var(--surface)] hover:bg-[var(--surface-secondary)] border border-[var(--charcoal)]/20 text-[var(--charcoal)] text-xs uppercase tracking-widest font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-center hover:scale-[1.01] active:scale-95 shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4 text-[var(--accent)]" />
                  <span>Inquire on WhatsApp (0312-345678)</span>
                </a>
              </div>

              <p className="text-[11px] text-[var(--text-secondary)] text-center leading-normal pt-1">
                Clicking "Submit Demo Enquiry" saves this request into this
                browser and routes to the receipt view.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
