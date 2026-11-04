import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle,
  Printer,
  MessageCircle,
  ArrowLeft,
  AlertCircle,
  Lock,
  ChevronRight,
} from "lucide-react";
import { DemoStorage } from "../services/storage";
import { buildBagWhatsAppUrl } from "../utils/rules";
import { TsjLogo } from "../components/common/TsjLogo";

export const EnquiryReceiptPage: React.FC = () => {
  const { reference } = useParams<{ reference: string }>();
  const enquiry = reference
    ? DemoStorage.getEnquiryByReference(reference)
    : undefined;
  const settings = DemoStorage.getSettings();

  if (!enquiry) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[var(--charcoal)]">
          Enquiry Reference Not Found
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">
          No local enquiry found matching "{reference}".
        </p>
        <Link
          to="/collections"
          className="inline-block px-6 py-2.5 bg-[var(--charcoal)] text-[var(--on-dark)] text-xs uppercase tracking-wider font-semibold rounded-xs"
        >
          Return to Collections
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const whatsappUrl = buildBagWhatsAppUrl(
    enquiry.items,
    {
      name: enquiry.customerName,
      phone: enquiry.customerPhone,
      city: enquiry.customerCity,
    },
    enquiry.reference,
    settings.whatsappNumber || "92312345678",
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Top Banner Notice */}
      <div className="mb-8 p-4 bg-[var(--surface-secondary)] border border-[var(--accent)]/40 rounded-xs flex items-start gap-3 text-xs text-[var(--text-secondary)]">
        <AlertCircle className="w-5 h-5 text-[var(--accent-ink)] shrink-0 mt-0.5" />
        <div>
          <h4 className="font-serif font-bold text-[var(--charcoal)] text-sm">
            Demo Enquiry Saved Locally
          </h4>
          <p className="mt-0.5 leading-relaxed">
            This demonstration saves enquiries in this browser. The business has
            not automatically received this request. You can simulate the
            merchant quotation and approval workflow in the Demo Admin, or send
            these details directly via WhatsApp.
          </p>
        </div>
      </div>

      {/* Printable Receipt Card */}
      <div className="bg-white border border-[var(--charcoal)]/15 rounded-xs p-6 sm:p-10 shadow-sm space-y-8 print:shadow-none print:border-none">
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[var(--charcoal)]/15 gap-4">
          <div className="flex items-center gap-3">
            <TsjLogo size={52} showTextLabel={true} />
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase tracking-widest text-[var(--accent-ink)] font-semibold block">
              Enquiry Reference
            </span>
            <span className="font-mono text-base font-bold text-[var(--charcoal)]">
              {enquiry.reference}
            </span>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              Recorded: {new Date(enquiry.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Customer Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[var(--on-dark)]/60 p-4 rounded-xs border border-[var(--charcoal)]/10">
          <div>
            <span className="text-[var(--text-secondary)] block">
              Customer Name:
            </span>
            <span className="font-medium text-[var(--text-primary)]">
              {enquiry.customerName}
            </span>
          </div>
          <div>
            <span className="text-[var(--text-secondary)] block">
              Contact Number:
            </span>
            <span className="font-medium text-[var(--text-primary)]">
              {enquiry.customerPhone}
            </span>
          </div>
          {enquiry.customerCity && (
            <div>
              <span className="text-[var(--text-secondary)] block">City:</span>
              <span className="font-medium text-[var(--text-primary)]">
                {enquiry.customerCity}
              </span>
            </div>
          )}
          {enquiry.occasion && (
            <div>
              <span className="text-[var(--text-secondary)] block">
                Occasion:
              </span>
              <span className="font-medium text-[var(--text-primary)]">
                {enquiry.occasion}
              </span>
            </div>
          )}
          {enquiry.notes && (
            <div className="sm:col-span-2 pt-1 border-t border-[var(--charcoal)]/10">
              <span className="text-[var(--text-secondary)] block">
                Client Notes:
              </span>
              <span className="font-medium text-[var(--text-primary)] italic">
                {enquiry.notes}
              </span>
            </div>
          )}
        </div>

        {/* Requested Items Table */}
        <div className="space-y-3">
          <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-[var(--charcoal)]">
            Requested Jewellery Pieces
          </h3>

          <div className="border border-[var(--charcoal)]/10 rounded-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface-secondary)] text-[var(--charcoal)] uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Piece</th>
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Selected Specifications</th>
                  <th className="py-2.5 px-4 text-center">Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--charcoal)]/10 bg-white">
                {enquiry.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-4 font-medium text-[var(--text-primary)] flex items-center gap-3">
                      <img
                        src={item.image}
                        alt=""
                        className="w-10 h-10 object-cover rounded-xs border border-[var(--charcoal)]/10 shrink-0"
                      />
                      <span>{item.name}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[var(--text-secondary)]">
                      {item.code}
                    </td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">
                      {Object.entries(item.selectedOptions || {}).map(
                        ([k, v]) => (
                          <div key={k}>
                            {k}: <strong>{v}</strong>
                          </div>
                        ),
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-bold tabular-nums">
                      {item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons Row (Hidden when printing) */}
        <div className="print:hidden pt-4 border-t border-[var(--charcoal)]/15 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[var(--charcoal)]/30 text-[var(--charcoal)] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[var(--charcoal)]/5 transition-colors"
            >
              <Printer className="w-4 h-4 text-[var(--accent)]" />
              <span>Print Summary</span>
            </button>

            <Link
              to="/admin-demo"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[var(--charcoal)]/10 text-[var(--charcoal)] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[var(--charcoal)]/20 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Open in Demo Admin</span>
            </Link>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--charcoal)] hover:bg-[var(--action-hover)] text-[var(--on-dark)] text-xs uppercase tracking-widest font-semibold rounded-xs shadow-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[var(--accent)]" />
            <span>Continue on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
