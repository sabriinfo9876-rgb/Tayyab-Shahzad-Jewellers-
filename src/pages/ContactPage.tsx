import React, { useState } from "react";
import {
  Phone,
  MessageCircle,
  Video,
  ExternalLink,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { DemoStorage } from "../services/storage";

export const ContactPage: React.FC = () => {
  const settings = DemoStorage.getSettings();

  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderMessage, setSenderMessage] = useState("");
  const [sentFeedback, setSentFeedback] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderPhone.trim()) return;

    // Record activity locally
    DemoStorage.logActivity(
      "Contact inquiry submitted",
      `From ${senderName} (${senderPhone})`,
    );
    setSentFeedback(true);
    setSenderName("");
    setSenderPhone("");
    setSenderMessage("");
  };

  const whatsappDirectUrl = `https://wa.me/${settings.whatsappNumber || "92312345678"}?text=${encodeURIComponent(
    "Assalam-o-Alaikum Tayyab Shahzad Jewellers, I would like to enquire about your jewellery collections.",
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-10 border-b border-[var(--charcoal)]/10 pb-6">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[var(--accent-ink)] font-semibold block mb-1">
          Direct Communications
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[var(--charcoal)]">
          Contact Tayyab Shahzad Jewellers
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 max-w-xl leading-relaxed">
          For appointments, bridal viewings, custom quotes, or inquiries
          regarding prevailing rates, connect with our dedicated team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Verified Official Brand Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[var(--charcoal)]/15 rounded-xs p-6 space-y-5">
            <h3 className="font-serif text-base font-semibold text-[var(--charcoal)] border-b border-[var(--charcoal)]/10 pb-2">
              Official Contact Channels
            </h3>

            <div className="space-y-4 text-xs">
              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[var(--on-dark)] rounded-xs text-[var(--charcoal)] shrink-0">
                  <Phone className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <div>
                  <span className="text-[var(--text-secondary)] block">
                    Direct Telephone:
                  </span>
                  <a
                    href={`tel:${settings.phone}`}
                    className="font-semibold text-sm text-[var(--text-primary)] hover:text-[var(--charcoal)]"
                  >
                    {settings.phone}
                  </a>
                  <span className="text-[11px] text-[var(--text-secondary)] block">
                    International: {settings.internationalPhone}
                  </span>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[var(--on-dark)] rounded-xs text-[var(--charcoal)] shrink-0">
                  <MessageCircle className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <div>
                  <span className="text-[var(--text-secondary)] block">
                    WhatsApp Business:
                  </span>
                  <a
                    href={whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-sm text-[var(--charcoal)] hover:underline inline-flex items-center gap-1"
                  >
                    +{settings.whatsappNumber || "92312345678"}
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--accent)]" />
                  </a>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    Fastest channel for design photos, custom sketches, and
                    quotes.
                  </p>
                </div>
              </div>

              {/* TikTok */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[var(--on-dark)] rounded-xs text-[var(--charcoal)] shrink-0">
                  <Video className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <div>
                  <span className="text-[var(--text-secondary)] block">
                    Official TikTok:
                  </span>
                  <a
                    href={
                      settings.tiktokUrl ||
                      "https://www.tiktok.com/@tayyab.shahzad.jewellers"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-xs text-[var(--charcoal)] hover:underline inline-flex items-center gap-1"
                  >
                    @tayyab.shahzad.jewellers
                    <ExternalLink className="w-3 h-3 text-[var(--accent)]" />
                  </a>
                </div>
              </div>

              {/* Optional Configured Details (Only rendered if configured) */}
              {settings.address && (
                <div className="flex items-start gap-3 pt-2 border-t border-[var(--charcoal)]/10">
                  <div className="p-2 bg-[var(--on-dark)] rounded-xs text-[var(--charcoal)] shrink-0">
                    <MapPin className="w-4 h-4 text-[var(--accent)]" />
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)] block">
                      Atelier Address:
                    </span>
                    <span className="font-medium text-[var(--text-primary)]">
                      {settings.address}
                    </span>
                  </div>
                </div>
              )}

              {settings.openingHours && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[var(--on-dark)] rounded-xs text-[var(--charcoal)] shrink-0">
                    <Clock className="w-4 h-4 text-[var(--accent)]" />
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)] block">
                      Consultation Hours:
                    </span>
                    <span className="font-medium text-[var(--text-primary)]">
                      {settings.openingHours}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-[var(--charcoal)]/15 rounded-xs p-6 sm:p-8 shadow-sm space-y-5">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[var(--charcoal)]">
                Send an Inquiry
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Leave your details and enquiry piece name. Our team responds
                promptly via WhatsApp or call.
              </p>
            </div>

            {sentFeedback && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Thank you! Your demo message has been recorded. For instant
                  response, click WhatsApp.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="contactpage-required-1"
                  className="block text-xs font-medium text-[var(--text-primary)] mb-1"
                >
                  Your Name <span className="text-red-700">*</span>
                </label>
                <input
                  id="contactpage-required-1"
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Zainab Ahmed"
                  className="w-full text-xs px-3 py-2 bg-[var(--on-dark)]/60 border border-[var(--charcoal)]/20 rounded-xs focus:outline-none focus:border-[var(--charcoal)]"
                />
              </div>

              <div>
                <label
                  htmlFor="contactpage-required-2"
                  className="block text-xs font-medium text-[var(--text-primary)] mb-1"
                >
                  Phone / WhatsApp Number{" "}
                  <span className="text-red-700">*</span>
                </label>
                <input
                  id="contactpage-required-2"
                  type="text"
                  required
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="e.g. 0348-1234567"
                  className="w-full text-xs px-3 py-2 bg-[var(--on-dark)]/60 border border-[var(--charcoal)]/20 rounded-xs focus:outline-none focus:border-[var(--charcoal)]"
                />
              </div>

              <div>
                <label
                  htmlFor="contactpage-nested-1"
                  className="block text-xs font-medium text-[var(--text-primary)] mb-1"
                >
                  Message or Piece Code
                </label>
                <textarea
                  id="contactpage-nested-1"
                  rows={4}
                  value={senderMessage}
                  onChange={(e) => setSenderMessage(e.target.value)}
                  placeholder="Let us know which piece you would like to view or discuss..."
                  className="w-full text-xs px-3 py-2 bg-[var(--on-dark)]/60 border border-[var(--charcoal)]/20 rounded-xs focus:outline-none focus:border-[var(--charcoal)]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[var(--charcoal)] hover:bg-[var(--action-hover)] text-[var(--on-dark)] text-xs uppercase tracking-widest font-semibold rounded-xs shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Send Demo Inquiry</span>
                </button>

                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[var(--on-dark)] hover:bg-[var(--surface-secondary)] border border-[var(--charcoal)]/20 text-[var(--charcoal)] text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 text-center"
                >
                  <MessageCircle className="w-4 h-4 text-[var(--accent)]" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
