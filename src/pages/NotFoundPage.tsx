import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { TsjLogo } from "../components/common/TsjLogo";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <TsjLogo size={60} className="mx-auto" />
      <span className="text-[11px] uppercase tracking-widest text-[var(--accent-ink)] font-semibold block">
        404 Page Not Found
      </span>
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[var(--charcoal)]">
        This Jewellery Page Does Not Exist
      </h1>
      <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
        The link you followed may be incorrect, or the jewellery curation may
        have moved.
      </p>
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--charcoal)] text-[var(--on-dark)] text-xs uppercase tracking-wider font-semibold rounded-xs shadow-xs hover:bg-[var(--action-hover)]"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--accent)]" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};
