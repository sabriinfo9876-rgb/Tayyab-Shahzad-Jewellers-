import { productPriceLabel } from "../../utils/commerce";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Product } from "../../types";
import { DemoStorage } from "../../services/storage";
import { buildProductWhatsAppUrl } from "../../utils/rules";

interface ProductCardProps {
  product: Product;
  onEnquire?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEnquire,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const settings = DemoStorage.getSettings();

  const syncWishlist = () => {
    const list = DemoStorage.getWishlist();
    setIsWishlisted(list.includes(product.id));
  };

  useEffect(() => {
    syncWishlist();
    window.addEventListener("tsj-storage-updated", syncWishlist);
    return () =>
      window.removeEventListener("tsj-storage-updated", syncWishlist);
  }, [product.id]);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    DemoStorage.toggleWishlist(product.id);
  };

  const whatsappUrl = buildProductWhatsAppUrl(
    product,
    undefined,
    1,
    settings.whatsappNumber || "92312345678",
  );

  // Formatted PKR price or estimated range
  const priceDisplay = productPriceLabel(product, DemoStorage.getRates());

  return (
    <article className="product-card group relative flex flex-col bg-white border border-[var(--charcoal)]/12 rounded-md overflow-hidden transition-colors duration-200 hover:border-[var(--accent)]/60">
      {/* Product Image Frame with Shimmer & Subtle Zoom */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block aspect-[4/5] bg-[var(--surface)] overflow-hidden shimmer-hover"
        aria-label={`View details for ${product.name}`}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />

        {/* Purity / Hallmark Badge */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          <span className="text-[10px] tracking-wider uppercase px-2.5 py-1 bg-[var(--action-hover)]/90  text-[var(--on-dark)] font-medium rounded-full shadow-xs border border-[var(--accent)]/30">
            {product.specifications?.metalPurity || product.department}
          </span>
        </div>

        {/* Wishlist Button with Heart Animation */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/95 text-[var(--charcoal)] hover:bg-white hover:text-[var(--accent)] transition-all duration-200 shadow-md hover:scale-115 active:scale-95 focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 ${
              isWishlisted
                ? "fill-[var(--charcoal)] text-[var(--charcoal)] scale-110"
                : "text-[var(--charcoal)]"
            }`}
          />
        </button>

        {/* Bottom hover quick-action bar */}
        <div className="absolute inset-x-0 bottom-0 p-3  from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between text-white text-xs">
          <span className="tracking-wider text-[11px] font-medium flex items-center gap-1.5 uppercase text-[var(--accent)]">
            <Sparkles className="w-3.5 h-3.5" />
            Explore Details
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-[var(--accent)] transform group-hover:translate-x-1.5 transition-transform" />
        </div>
      </Link>

      {/* Product Details & Pricing */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 bg-white">
        <div>
          {/* Code & Hallmark indicator */}
          <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
            <span className="px-2 py-0.5 bg-[var(--surface)] rounded-md font-mono text-[10px] border border-[var(--charcoal)]/10 text-[var(--charcoal)]">
              {product.code}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="mt-2 font-serif text-base font-semibold text-[var(--charcoal)] group-hover:text-[var(--action-hover)] transition-colors line-clamp-1">
            <Link to={`/product/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Indicative PKR Price & Gold Weight */}
          <div className="product-card__price mt-2 flex items-baseline justify-between gap-2">
            <div>
              <span className="text-sm font-bold text-[var(--charcoal)] font-sans tracking-tight">
                {priceDisplay}
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] block font-light">
                {product.pricingMode === "metal_rate"
                  ? "Sample metal-rate calculation"
                  : "Fixed demo price"}
              </span>
            </div>
            {product.specifications?.estimatedWeight && (
              <span className="text-[10px] text-[var(--text-secondary)] bg-[var(--surface)] px-2 py-0.5 rounded-md font-mono">
                {product.specifications.estimatedWeight}
              </span>
            )}
          </div>
        </div>

        {/* Dual Actions Row */}
        <div className="product-card__actions pt-3 border-t border-[var(--charcoal)]/10 flex items-center justify-between gap-2">
          <Link
            to={`/product/${product.slug}`}
            className="text-xs uppercase tracking-wider font-semibold text-[var(--charcoal)] hover:text-[var(--accent)] transition-colors py-1 px-1"
          >
            Specifications
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--surface)] hover:bg-[var(--charcoal)] hover:text-[var(--on-dark)] border border-[var(--charcoal)]/20 rounded-xl text-[11px] font-semibold text-[var(--charcoal)] transition-all duration-200 shadow-2xs hover:shadow-xs group/wa"
            title="Enquire on WhatsApp (0312-345678)"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[var(--accent)] group-hover/wa:text-[var(--accent)]" />
            <span>Enquire</span>
          </a>
        </div>
      </div>
    </article>
  );
};
