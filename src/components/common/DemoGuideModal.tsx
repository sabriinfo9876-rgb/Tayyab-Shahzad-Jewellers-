import React from "react";
import { Link } from "react-router-dom";
import {
  X,
  HelpCircle,
  ShoppingBag,
  Lock,
  Sparkles,
  Search,
  FileCheck,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { DemoStorage } from "../../services/storage";

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleReset = () => {
    if (
      window.confirm(
        "Reset all demo data back to default initial catalogue and settings? All local demo edits will be restored.",
      )
    ) {
      DemoStorage.resetAll();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60  transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-[var(--on-dark)] rounded-sm shadow-2xl border border-[var(--charcoal)]/20 overflow-hidden z-10 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-[var(--charcoal)] text-[var(--on-dark)] px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[var(--accent)]" />
              <div>
                <h3 className="font-serif text-lg font-semibold tracking-wide">
                  Client Presentation Guide
                </h3>
                <p className="text-[11px] text-[var(--accent)] tracking-wider uppercase">
                  Tayyab Shahzad Jewellers Concept Demo
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[var(--on-dark)]/80 hover:text-white rounded-sm"
              aria-label="Close demo guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 space-y-6 overflow-y-auto text-xs leading-relaxed text-[var(--text-primary)]">
            {/* Clear Limitations Notice Box */}
            <div className="bg-[var(--surface-secondary)] border border-[var(--accent)]/40 p-4 rounded-xs space-y-2">
              <div className="flex items-center gap-2 font-serif font-bold text-[var(--charcoal)] text-sm">
                <AlertTriangle className="w-4 h-4 text-[var(--accent-ink)]" />
                Demo Scope &amp; Local Persistence Notice
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[var(--text-secondary)]">
                <li>
                  <strong>All data stays in this browser:</strong> Changes are
                  saved to your current browser storage. No server database is
                  connected.
                </li>
                <li>
                  <strong>Admin access is a preview:</strong> Credentials are
                  demo-only to showcase management workflows.
                </li>
                <li>
                  <strong>Assistant replies are scripted:</strong> The chat
                  widget simulates customer interactions without an external API
                  key.
                </li>
                <li>
                  <strong>Simulated transactions:</strong> No real payments,
                  stock reservation, or automated courier bookings take place.
                </li>
              </ul>
            </div>

            {/* Step-by-Step Presentation Highlights */}
            <div className="space-y-4">
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[var(--charcoal)] border-b border-[var(--charcoal)]/10 pb-1">
                What Can Be Demonstrated to the Owner
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-white/60 border border-[var(--charcoal)]/10 rounded-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[var(--charcoal)]">
                    <ShoppingBag className="w-4 h-4 text-[var(--accent)]" />
                    1. Customer Journey &amp; Bag
                  </div>
                  <p className="text-[var(--text-secondary)]">
                    Add pieces with options to the Enquiry Bag, submit a demo
                    request, generate a reference number, and test direct
                    WhatsApp handoff.
                  </p>
                </div>

                <div className="p-3 bg-white/60 border border-[var(--charcoal)]/10 rounded-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[var(--charcoal)]">
                    <Lock className="w-4 h-4 text-[var(--accent)]" />
                    2. Store Admin Dashboard
                  </div>
                  <p className="text-[var(--text-secondary)]">
                    Enter at{" "}
                    <Link
                      to="/admin-demo/login"
                      onClick={onClose}
                      className="text-[var(--charcoal)] font-semibold underline"
                    >
                      /admin-demo/login
                    </Link>{" "}
                    to edit products, update metal rates, and customize homepage
                    announcements.
                  </p>
                </div>

                <div className="p-3 bg-white/60 border border-[var(--charcoal)]/10 rounded-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[var(--charcoal)]">
                    <FileCheck className="w-4 h-4 text-[var(--accent)]" />
                    3. Quotation &amp; Lifecycle
                  </div>
                  <p className="text-[var(--text-secondary)]">
                    Open incoming enquiries, enter sample quotations, simulate
                    client approval, and preview generated order confirmations.
                  </p>
                </div>

                <div className="p-3 bg-white/60 border border-[var(--charcoal)]/10 rounded-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[var(--charcoal)]">
                    <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                    4. Scripted Assistant &amp; SEO
                  </div>
                  <p className="text-[var(--text-secondary)]">
                    Test bilingual Roman Urdu/English inquiries and inspect the
                    metadata social card preview in admin.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links & Reset Actions */}
            <div className="pt-2 border-t border-[var(--charcoal)]/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Link
                  to="/admin-demo/login"
                  onClick={onClose}
                  className="px-3.5 py-2 bg-[var(--charcoal)] text-[var(--on-dark)] text-xs uppercase tracking-wider rounded-xs hover:bg-[var(--action-hover)]"
                >
                  Enter Demo Admin
                </Link>
                <Link
                  to="/order-confirmation/TSJ-ORD-DEMO-2026"
                  onClick={onClose}
                  className="px-3.5 py-2 border border-[var(--charcoal)]/30 text-[var(--charcoal)] text-xs uppercase tracking-wider rounded-xs hover:bg-[var(--charcoal)]/5"
                >
                  View Sample Order
                </Link>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-red-700 hover:text-red-900 font-medium underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Demo to Initial Seed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
