import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  MessageCircle,
  Video,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  Lock,
  Info,
} from "lucide-react";
import { TsjLogo } from "./TsjLogo";
import { DemoStorage } from "../../services/storage";

interface FooterProps {
  onOpenDemoGuide: () => void;
  onOpenRates: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenDemoGuide,
  onOpenRates,
}) => {
  const [settings, setSettings] = useState(DemoStorage.getSettings());

  const syncSettings = () => {
    setSettings(DemoStorage.getSettings());
  };

  useEffect(() => {
    syncSettings();
    window.addEventListener("tsj-storage-updated", syncSettings);
    return () =>
      window.removeEventListener("tsj-storage-updated", syncSettings);
  }, []);

  return (
    <footer className="bg-[var(--action-hover)] text-[var(--on-dark)] pt-16 pb-12 border-t border-[var(--accent)]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section with Original Crest & Brand Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[var(--on-dark)]/10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              className="inline-block"
              aria-label="Tayyab Shahzad Jewellers Home"
            >
              <TsjLogo size={56} showTextLabel={true} lightText={true} />
            </Link>
            <p className="text-xs text-[var(--on-dark)]/70 max-w-sm leading-relaxed mt-2">
              Artisanal bridal suites, handcrafted 21K/22K gold jewellery,
              authentic Pakistani Chandi, contemporary Italian goldsmithing, and
              bespoke custom commissions.
            </p>
            {/* Direct Official Contact Channels */}
            <div className="pt-2 space-y-2 text-xs text-[var(--on-dark)]/90">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <span>
                  Direct: {settings.phone} ({settings.internationalPhone})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsappNumber || "92312345678"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--accent)] underline underline-offset-2 transition-colors inline-flex items-center gap-1"
                >
                  WhatsApp: +{settings.whatsappNumber || "92312345678"}
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <a
                  href={
                    settings.tiktokUrl ||
                    "https://www.tiktok.com/@tayyab.shahzad.jewellers"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--accent)] underline underline-offset-2 transition-colors inline-flex items-center gap-1"
                >
                  TikTok: @tayyab.shahzad.jewellers
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
              {/* Optional Configured Details - Rendered strictly if present */}
              {settings.address && (
                <div className="pt-1 text-[var(--on-dark)]/70">
                  <span className="text-[var(--accent)] font-medium">
                    Location:{" "}
                  </span>
                  {settings.address}
                </div>
              )}
              {settings.openingHours && (
                <div className="text-[var(--on-dark)]/70">
                  <span className="text-[var(--accent)] font-medium">
                    Hours:{" "}
                  </span>
                  {settings.openingHours}
                </div>
              )}
            </div>
          </div>

          {/* Collections Column */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm uppercase tracking-wider text-[var(--accent)]">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-[var(--on-dark)]/80">
              <li>
                <Link
                  to="/bridal"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  The Bridal Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/rings"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  Gold Rings &amp; Solitaires
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/bangles"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  Nakshi Bangles &amp; Kadas
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/necklaces"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  Chokers &amp; Haars
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/earrings"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  Jhumkas &amp; Chandbalis
                </Link>
              </li>
            </ul>
          </div>

          {/* Departments Column */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm uppercase tracking-wider text-[var(--accent)]">
              Specialties
            </h4>
            <ul className="space-y-2 text-xs text-[var(--on-dark)]/80">
              <li>
                <Link
                  to="/pakistani-chandi"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  Pakistani Chandi (925 Silver)
                </Link>
              </li>
              <li>
                <Link
                  to="/italian-designs"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  Italian Designs
                </Link>
              </li>
              <li>
                <Link
                  to="/custom-orders"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  Custom Orders &amp; Sketches
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenRates}
                  className="hover:text-[var(--accent)] transition-colors text-left"
                >
                  Gold &amp; Silver Rates
                </button>
              </li>
              <li>
                <Link
                  to="/our-story"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  Atelier Craftsmanship
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Presentation & Demo Column */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm uppercase tracking-wider text-[var(--accent)]">
              Presentation Demo
            </h4>
            <ul className="space-y-2 text-xs text-[var(--on-dark)]/80">
              <li>
                <button
                  type="button"
                  onClick={onOpenDemoGuide}
                  className="flex items-center gap-1.5 text-[var(--accent)] hover:underline font-medium"
                >
                  <Info className="w-3.5 h-3.5" />
                  Demo Guide &amp; Controls
                </button>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  Client FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/order-confirmation/TSJ-ORD-DEMO-2026"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  Sample Order Confirmation
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  Contact &amp; Inquiries
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  to="/admin-demo/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--charcoal)] hover:bg-[var(--charcoal)] border border-[var(--accent)]/40 rounded-xs text-[11px] text-[var(--on-dark)] tracking-wider uppercase transition-colors"
                >
                  <Lock className="w-3 h-3 text-[var(--accent)]" />
                  Store Admin Demo
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner with Concept Demo Notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--on-dark)]/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
            <span>
              Tayyab Shahzad Jewellers · Concept Demo &amp; Digital Storefront
              Architecture
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>In-browser local storage demonstration</span>
            <span>·</span>
            <button
              type="button"
              onClick={onOpenDemoGuide}
              className="text-[var(--accent)] hover:underline"
            >
              Demo Scope &amp; Disclaimers
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
