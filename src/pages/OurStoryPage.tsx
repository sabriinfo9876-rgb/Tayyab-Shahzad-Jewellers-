import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { TsjLogo } from "../components/common/TsjLogo";

export const OurStoryPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-20">
      {/* Editorial Hero */}
      <section className="bg-[var(--charcoal)] text-[var(--on-dark)] py-16 sm:py-24 border-b border-[var(--accent)]/30">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <TsjLogo size={64} className="mx-auto" />
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] font-medium block">
            Atelier Philosophy &amp; Craft
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal leading-tight text-balance">
            Generations of Goldsmithing Reverence
          </h1>
          <p className="text-xs sm:text-sm text-[var(--on-dark)]/80 max-w-xl mx-auto leading-relaxed">
            At Tayyab Shahzad Jewellers, jewellery is never merely ornamental—it
            is a celebration of bridal milestone, legacy metalwork, and heirloom
            preservation.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-xs sm:text-sm leading-relaxed text-[var(--text-primary)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-[var(--charcoal)]">
              Imperial Pakistani Kundan Tradition
            </h2>
            <p className="text-[var(--text-secondary)]">
              Rooted in centuries-old subcontinent metalcraft, our bridal suites
              utilize genuine 21K and 22K gold, set with uncut stones and
              hand-strung natural pearls. Each piece is constructed by master
              craftsmen who have practiced their specialty for decades.
            </p>
          </div>
          <div className="aspect-[4/3] rounded-xs overflow-hidden border border-[var(--charcoal)]/15 shadow-sm">
            <img
              src="/images/15-illustrative-bridal-detail.webp"
              alt="Master goldsmith at jeweler bench"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="aspect-[4/3] rounded-xs overflow-hidden border border-[var(--charcoal)]/15 shadow-sm order-2 md:order-1">
            <img
              src="/images/06-filigree-charm-bracelet.webp"
              alt="Authentic Pakistani Chandi Fine Silver"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4 order-1 md:order-2">
            <h2 className="font-serif text-2xl font-semibold text-[var(--charcoal)]">
              Pakistani Chandi &amp; Modern Italian Curation
            </h2>
            <p className="text-[var(--text-secondary)]">
              Beyond our hallmark bridal gold, we honor the rich legacy of 925
              Pakistani Chandi—delicate silver payals, oxidized polki chokers,
              and generational silverwork. In parallel, our Italian designs
              bring architectural precision and flexible woven gold cuffs for
              the contemporary wardrobe.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[var(--surface-secondary)] p-8 rounded-xs text-center space-y-4 border border-[var(--charcoal)]/10">
          <h3 className="font-serif text-xl font-semibold text-[var(--charcoal)]">
            Experience Our Pieces in Person
          </h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
            Book a private bridal consultation or discuss your bespoke heirloom
            commission with our team directly.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              to="/custom-orders"
              className="px-6 py-3 bg-[var(--charcoal)] text-[var(--on-dark)] text-xs uppercase tracking-wider font-semibold rounded-xs shadow-xs hover:bg-[var(--action-hover)]"
            >
              Discuss Custom Commission
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
