import React, { useState } from "react";

interface TsjLogoProps {
  size?: number;
  className?: string;
  showTextLabel?: boolean;
  lightText?: boolean;
}

/**
 * Tayyab Shahzad Jewellers Original Circular Gold Crest Logo.
 * Uses the genuine original circular gold TSJ crest asset (/images/tsj-original-logo.png)
 * preserving complete design, proportions, lettering and colors, mounted on a restrained
 * luxury plaque with subtle gold trim.
 */
export const TsjLogo: React.FC<TsjLogoProps> = ({
  size = 48,
  className = "",
  showTextLabel = false,
  lightText = false,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div
        style={{ width: size, height: size }}
        className="relative shrink-0 rounded-full bg-[var(--charcoal)] p-[2px] shadow-md border border-[var(--accent)]/40 overflow-hidden flex items-center justify-center transition-transform duration-300 hover:scale-[1.03]"
        aria-label="Tayyab Shahzad Jewellers Crest"
      >
        {!imgError ? (
          <img
            src="/images/tsj-original-logo.png"
            alt="Tayyab Shahzad Jewellers Crest"
            className="w-full h-full object-contain rounded-full"
            onError={() => setImgError(true)}
            loading="eager"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-[var(--dark-surface)] flex items-center justify-center border border-[var(--accent)]">
            <span className="font-serif text-[var(--accent)] font-bold text-xs tracking-wider">
              TSJ
            </span>
          </div>
        )}
      </div>

      {showTextLabel && (
        <div className="flex flex-col text-left">
          <span
            className={`font-serif tracking-wider font-semibold uppercase leading-tight ${lightText ? "text-[var(--on-dark)]" : "text-[var(--charcoal)]"}`}
            style={{ fontSize: size > 44 ? "1.1rem" : "0.92rem" }}
          >
            Tayyab Shahzad
          </span>
          <span
            className={`text-[10px] tracking-[0.24em] uppercase font-medium ${lightText ? "text-[var(--accent)]" : "text-[var(--accent-ink)]"}`}
          >
            Jewellers
          </span>
        </div>
      )}
    </div>
  );
};
