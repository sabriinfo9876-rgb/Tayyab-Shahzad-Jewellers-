import React from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  ShoppingBag,
  Lock,
  Sparkles,
  FileCheck,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { DemoStorage } from "../services/storage";

export const DemoGuidePage: React.FC = () => {
  const handleReset = () => {
    if (
      window.confirm(
        "Reset all demo data back to default initial catalogue and settings? All local demo edits will be restored.",
      )
    ) {
      DemoStorage.resetAll();
      alert("Demo data has been reset to default seed values.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-10 border-b border-[var(--charcoal)]/10 pb-6">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[var(--accent-ink)] font-semibold block mb-1">
          Client Presentation Support
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[var(--charcoal)]">
          Demo Guide &amp; Technical Capabilities
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 max-w-xl leading-relaxed">
          A guide for presenting the Tayyab Shahzad Jewellers digital brand
          experience and store management interface to the business owner.
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
        {/* Core Notice */}
        <div className="p-5 bg-[var(--surface-secondary)] border border-[var(--accent)]/50 rounded-xs space-y-2">
          <div className="flex items-center gap-2 font-serif font-bold text-[var(--charcoal)] text-base">
            <AlertTriangle className="w-5 h-5 text-[var(--accent-ink)]" />
            Demonstration Boundaries &amp; Data Scope
          </div>
          <ul className="list-disc pl-5 space-y-1 text-[var(--text-secondary)] text-xs">
            <li>
              <strong>Frontend-only architecture:</strong> No external database
              or backend server is running.
            </li>
            <li>
              <strong>Browser local persistence:</strong> Changes made in admin
              or enquiries submitted in storefront stay on this browser and
              device.
            </li>
            <li>
              <strong>Preview admin credentials:</strong> Admin login
              demonstrates merchant workflows without exposing real secrets.
            </li>
            <li>
              <strong>Scripted assistant:</strong> Chat demo simulates customer
              inquiries in English &amp; Roman Urdu without third-party API
              costs.
            </li>
            <li>
              <strong>No real transactions:</strong> No actual payment
              processing, bullion reservation, or automated courier delivery
              occurs.
            </li>
          </ul>
        </div>

        {/* Presentation Steps */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-semibold text-[var(--charcoal)]">
            Recommended Presentation Flow
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-5 border border-[var(--charcoal)]/15 rounded-xs space-y-2">
              <span className="font-serif font-bold text-sm text-[var(--charcoal)] block">
                1. Storefront Experience
              </span>
              <p className="text-[var(--text-secondary)]">
                Showcase the approved burgundy-and-ivory aesthetic (Image A),
                original circular gold crest (Image B), responsive navigation,
                and 4 collections: Bridal, Gold, Pakistani Chandi, and Italian
                Designs.
              </p>
              <Link
                to="/"
                className="text-[var(--charcoal)] font-semibold underline inline-flex items-center gap-1"
              >
                <span>View Homepage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white p-5 border border-[var(--charcoal)]/15 rounded-xs space-y-2">
              <span className="font-serif font-bold text-sm text-[var(--charcoal)] block">
                2. Enquiry Bag &amp; WhatsApp Handoff
              </span>
              <p className="text-[var(--text-secondary)]">
                Add a piece with customized specifications (e.g. 22K gold,
                matching matha patti), submit a demo enquiry to generate a
                reference number, and test direct WhatsApp redirection.
              </p>
              <Link
                to="/enquiry-bag"
                className="text-[var(--charcoal)] font-semibold underline inline-flex items-center gap-1"
              >
                <span>Open Enquiry Bag</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white p-5 border border-[var(--charcoal)]/15 rounded-xs space-y-2">
              <span className="font-serif font-bold text-sm text-[var(--charcoal)] block">
                3. Store Management Admin
              </span>
              <p className="text-[var(--text-secondary)]">
                Sign in to <code>/admin-demo/login</code> to demonstrate product
                creation, editing Sarafa bullion rates in Asia/Karachi time, and
                quotation preparation.
              </p>
              <Link
                to="/admin-demo/login"
                className="text-[var(--charcoal)] font-semibold underline inline-flex items-center gap-1"
              >
                <span>Enter Admin Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white p-5 border border-[var(--charcoal)]/15 rounded-xs space-y-2">
              <span className="font-serif font-bold text-sm text-[var(--charcoal)] block">
                4. Quotation to Confirmed Order
              </span>
              <p className="text-[var(--text-secondary)]">
                Take an incoming enquiry, prepare a sample quotation (PKR),
                simulate client approval, and view the branded Order
                Confirmation page.
              </p>
              <Link
                to="/order-confirmation/TSJ-ORD-DEMO-2026"
                className="text-[var(--charcoal)] font-semibold underline inline-flex items-center gap-1"
              >
                <span>Preview Order Confirmation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Reset control */}
        <div className="pt-6 border-t border-[var(--charcoal)]/15 flex items-center justify-between">
          <span className="text-xs text-[var(--text-secondary)]">
            Need a fresh slate after demonstrating to the owner?
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-800 border border-red-200 rounded-xs text-xs font-semibold hover:bg-red-100"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-600" />
            <span>Reset Demo to Initial Seed</span>
          </button>
        </div>
      </div>
    </div>
  );
};
