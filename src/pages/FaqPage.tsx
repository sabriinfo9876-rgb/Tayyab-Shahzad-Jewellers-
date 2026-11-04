import React from "react";
import { Link } from "react-router-dom";
import { HelpCircle, MessageCircle } from "lucide-react";
import { DemoStorage } from "../services/storage";

export const FaqPage: React.FC = () => {
  const settings = DemoStorage.getSettings();

  const faqs = [
    {
      q: "How are bridal quotations and prices calculated?",
      a: "Jewellery quotations depend on prevailing gold bullion rates on the date of confirmation, net metal weight (with gemstone and pearl deductions accurately made), and the intricate making charges (ujrat) required for master kundan jadau setting.",
    },
    {
      q: "Can I request a custom design based on an outfit or picture?",
      a: "Yes. Custom commissions are a hallmark specialty at Tayyab Shahzad Jewellers. You can share your bridal outfit embroidery photos or personal design sketches with our master goldsmiths via the Custom Order form or directly on WhatsApp.",
    },
    {
      q: "What is authentic Pakistani Chandi?",
      a: "Pakistani Chandi refers to 925 fine sterling silver handcrafted using traditional subcontinent techniques including antique oxidation, polki jadau stone setting, and basra-style pearl beadwork, offering imperial heritage elegance.",
    },
    {
      q: "What distinguishes your Italian Designs?",
      a: "Our Italian collection features contemporary 18K yellow gold engineering, including flexible woven mesh cuffs, hollow geometric links, and modern collars that deliver exceptional luster with everyday wearability.",
    },
    {
      q: "How does this digital demonstration store work?",
      a: "This website is a complete frontend demonstration developed to present the proposed digital brand experience. It saves demo bags and quotation requests locally in your browser so you can test the complete merchant and customer lifecycle without real transactions.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-10 border-b border-[var(--charcoal)]/10 pb-6">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[var(--accent-ink)] font-semibold block mb-1">
          Client Inquiries &amp; Guidance
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[var(--charcoal)]">
          Frequently Asked Questions
        </h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white border border-[var(--charcoal)]/15 rounded-xs p-5 sm:p-6 space-y-2 shadow-xs"
          >
            <h3 className="font-serif text-base font-semibold text-[var(--charcoal)]">
              {faq.q}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      {/* WhatsApp Help CTA */}
      <div className="mt-12 p-6 bg-[var(--surface-secondary)] border border-[var(--accent)]/40 rounded-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="font-serif text-lg font-semibold text-[var(--charcoal)]">
            Have a specific question about a piece?
          </h4>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Our team is available on WhatsApp at {settings.phone}.
          </p>
        </div>
        <a
          href={`https://wa.me/${settings.whatsappNumber || "92312345678"}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2.5 bg-[var(--charcoal)] hover:bg-[var(--action-hover)] text-[var(--on-dark)] text-xs uppercase tracking-wider font-semibold rounded-xs shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4 text-[var(--accent)]" />
          <span>Ask on WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
