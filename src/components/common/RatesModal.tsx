import React, { useState, useEffect } from "react";
import {
  X,
  TrendingUp,
  AlertCircle,
  MessageCircle,
  RefreshCw,
  WifiOff,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DemoStorage } from "../../services/storage";
import { MetalRatesData } from "../../types";

interface RatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RatesModal: React.FC<RatesModalProps> = ({ isOpen, onClose }) => {
  const [ratesData, setRatesData] = useState<MetalRatesData>(
    DemoStorage.getRates(),
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const settings = DemoStorage.getSettings();

  const syncRates = () => {
    setRatesData(DemoStorage.getRates());
  };

  useEffect(() => {
    if (isOpen) {
      syncRates();
    }
  }, [isOpen]);

  useEffect(() => {
    window.addEventListener("tsj-storage-updated", syncRates);
    return () => window.removeEventListener("tsj-storage-updated", syncRates);
  }, []);

  if (!isOpen) return null;

  const handleSimulateFeedRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const whatsappMessage = encodeURIComponent(
    `Assalam-o-Alaikum Tayyab Shahzad Jewellers, please confirm today's prevailing bullion rates and making charges for jewellery.`,
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60  transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-[var(--on-dark)] rounded-sm shadow-2xl border border-[var(--charcoal)]/20 overflow-hidden z-10">
          {/* Header */}
          <div className="bg-[var(--charcoal)] text-[var(--on-dark)] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-[var(--accent)]" />
              <div>
                <h3 className="font-serif text-lg font-semibold tracking-wide">
                  Gold &amp; Silver Rates
                </h3>
                <p className="text-[11px] text-[var(--accent)] tracking-wider uppercase font-medium">
                  Asia/Karachi Standard Reference
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[var(--on-dark)]/80 hover:text-white rounded-sm transition-colors"
              aria-label="Close rates modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Feed Adapter Status Box */}
            <div className="bg-[var(--surface-secondary)] p-3 rounded-xs border border-[var(--charcoal)]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <WifiOff className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
                <span>
                  Feed Adapter:{" "}
                  <strong className="text-[var(--charcoal)]">
                    Automatic feed not connected
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 bg-[var(--charcoal)]/10 text-[var(--charcoal)] rounded-xs font-semibold uppercase tracking-wider">
                  Sample demo rates
                </span>
                <button
                  onClick={handleSimulateFeedRefresh}
                  className="p-1 text-[var(--text-secondary)] hover:text-[var(--charcoal)] transition-colors"
                  title="Simulate feed check"
                  type="button"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* Meta indicator */}
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] border-b border-[var(--charcoal)]/10 pb-3">
              <span>
                Time reference: <strong>{ratesData.lastUpdatedKarachi}</strong>
              </span>
              <Link
                to="/admin-demo/dashboard"
                onClick={onClose}
                className="text-[11px] text-[var(--accent-ink)] hover:text-[var(--charcoal)] font-semibold underline underline-offset-2 flex items-center gap-1"
              >
                <Settings className="w-3 h-3" />
                <span>Edit in Admin</span>
              </Link>
            </div>

            {/* Rates Table */}
            <div className="border border-[var(--charcoal)]/10 rounded-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--surface-secondary)] text-[var(--charcoal)] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Precious Metal</th>
                    <th className="py-2.5 px-3">Purity / Fineness</th>
                    <th className="py-2.5 px-3">Unit</th>
                    <th className="py-2.5 px-4 text-right">PKR Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--charcoal)]/10 bg-white/60">
                  {ratesData.rates.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[var(--surface-secondary)]/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-[var(--text-primary)]">
                        {item.metal}
                      </td>
                      <td className="py-3 px-3 text-[var(--text-secondary)]">
                        {item.purity}
                      </td>
                      <td className="py-3 px-3 text-[var(--text-secondary)]">
                        {item.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-serif font-bold text-[var(--charcoal)] tabular-nums">
                        PKR {item.ratePKR.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Note & Disclaimers */}
            <div className="bg-[var(--surface-secondary)]/40 border border-[var(--accent)]/30 p-3.5 rounded-xs flex items-start gap-3 text-xs text-[var(--text-secondary)] leading-relaxed">
              <AlertCircle className="w-4 h-4 text-[var(--accent-ink)] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[var(--charcoal)]">
                  {ratesData.disclaimer ||
                    "Sample demo rates. Metal rates are indicative. Contact the team for a final jewellery quotation."}
                </p>
                <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                  Finished jewellery quotations depend on gold/silver weight,
                  making charges (Ujrat), stone weight deduction, and custom
                  craft options.
                </p>
              </div>
            </div>

            {/* Direct WhatsApp Call to Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={`https://wa.me/${settings.whatsappNumber || "92312345678"}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[var(--charcoal)] hover:bg-[var(--action-hover)] text-[var(--on-dark)] text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[var(--accent)]" />
                Enquire for Today's Final Quote
              </a>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-2.5 px-5 border border-[var(--charcoal)]/20 text-[var(--charcoal)] text-xs uppercase tracking-wider rounded-xs hover:bg-[var(--charcoal)]/5 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
