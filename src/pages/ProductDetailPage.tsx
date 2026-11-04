import { productPriceLabel } from "../utils/commerce";
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  ChevronRight,
  Check,
  AlertCircle,
  ZoomIn,
  X,
  Share2,
} from "lucide-react";
import { DemoStorage } from "../services/storage";
import { ProductCard } from "../components/product/ProductCard";
import { buildProductWhatsAppUrl } from "../utils/rules";
import { Product } from "../types";

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [customerNotes, setCustomerNotes] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const settings = DemoStorage.getSettings();

  const loadProduct = () => {
    if (!slug) return;
    const found = DemoStorage.getProductBySlug(slug);
    setProduct(found);
    if (found) {
      setSelectedImageIndex(0);
      setIsWishlisted(DemoStorage.getWishlist().includes(found.id));
      // pre-select first option value if available
      const initialOpts: Record<string, string> = {};
      found.options?.forEach((opt) => {
        if (opt.values.length > 0) {
          initialOpts[opt.name] = opt.values[0];
        }
      });
      setSelectedOptions(initialOpts);
      setValidationError(null);

      // Related products in same category or department
      const related = DemoStorage.getProducts()
        .filter(
          (p) =>
            p.id !== found.id &&
            (p.category === found.category ||
              p.department === found.department),
        )
        .slice(0, 4);
      setRelatedProducts(related);
    }
  };

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const handleStorageUpdate = () => {
      if (product) {
        setIsWishlisted(DemoStorage.getWishlist().includes(product.id));
        setProduct(DemoStorage.getProductBySlug(product.slug));
      }
    };
    window.addEventListener("tsj-storage-updated", handleStorageUpdate);
    return () =>
      window.removeEventListener("tsj-storage-updated", handleStorageUpdate);
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-[var(--charcoal)]">
          Piece Not Found
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-2">
          The requested jewellery item does not exist or has been archived.
        </p>
        <Link
          to="/collections"
          className="mt-6 inline-block px-6 py-2.5 bg-[var(--charcoal)] text-[var(--on-dark)] text-xs uppercase tracking-wider rounded-xs font-semibold"
        >
          Return to Collections
        </Link>
      </div>
    );
  }

  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
    setValidationError(null);
  };

  const handleToggleWishlist = () => {
    DemoStorage.toggleWishlist(product.id);
  };

  const handleAddToBag = () => {
    // Validate required options
    if (product.options && product.options.length > 0) {
      for (const opt of product.options) {
        if (!selectedOptions[opt.name]) {
          setValidationError(`Please select a preferred ${opt.name}.`);
          return;
        }
      }
    }

    DemoStorage.addToBag({
      productId: product.id,
      code: product.code,
      name: product.name,
      image: product.images[selectedImageIndex] || product.images[0],
      category: product.category,
      quantity,
      selectedOptions,
      customerNotes: customerNotes.trim() || undefined,
    });

    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 3000);
  };

  const whatsappUrl = buildProductWhatsAppUrl(
    product,
    selectedOptions,
    quantity,
    settings.whatsappNumber || "92312345678",
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 text-xs text-[var(--text-secondary)]"
      >
        <Link to="/" className="hover:text-[var(--charcoal)]">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/collections" className="hover:text-[var(--charcoal)]">
          Collections
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          to={`/collections/${product.category}`}
          className="capitalize hover:text-[var(--charcoal)]"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[var(--charcoal)] font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Gallery & Thumbnails */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Selected Image */}
          <div className="relative aspect-[4/3] bg-white border border-[var(--charcoal)]/15 rounded-xs overflow-hidden group">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={`${product.name} showcase view`}
              className="w-full h-full object-cover"
            />
            {/* Zoom Action */}
            <button
              type="button"
              onClick={() => setZoomOpen(true)}
              className="absolute bottom-4 right-4 p-2 bg-white/90 hover:bg-white text-[var(--charcoal)] rounded-full shadow-md transition-all focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              aria-label="Enlarge jewellery image"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="absolute top-4 left-4">
              <span className="text-[10px] tracking-wider uppercase px-2.5 py-1 bg-[var(--charcoal)] text-[var(--on-dark)] rounded-xs font-medium">
                {product.availability}
              </span>
            </div>
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 aspect-square rounded-xs overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? "border-[var(--charcoal)] ring-2 ring-[var(--accent)]/50"
                      : "border-[var(--charcoal)]/10 opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Select image thumbnail ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Specifications Panel */}
          {product.specifications && (
            <div className="mt-8 bg-white border border-[var(--charcoal)]/10 rounded-xs p-6 space-y-4">
              <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-[var(--charcoal)] border-b border-[var(--charcoal)]/10 pb-2">
                Craftsmanship &amp; Details
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-xs">
                {product.specifications.metalPurity && (
                  <div>
                    <dt className="text-[var(--text-secondary)]">
                      Metal Purity / Alloy:
                    </dt>
                    <dd className="font-medium text-[var(--text-primary)] mt-0.5">
                      {product.specifications.metalPurity}
                    </dd>
                  </div>
                )}
                {product.specifications.gemstones && (
                  <div>
                    <dt className="text-[var(--text-secondary)]">
                      Gemstones &amp; Pearls:
                    </dt>
                    <dd className="font-medium text-[var(--text-primary)] mt-0.5">
                      {product.specifications.gemstones}
                    </dd>
                  </div>
                )}
                {product.specifications.craftsmanship && (
                  <div>
                    <dt className="text-[var(--text-secondary)]">
                      Artisanal Setting:
                    </dt>
                    <dd className="font-medium text-[var(--text-primary)] mt-0.5">
                      {product.specifications.craftsmanship}
                    </dd>
                  </div>
                )}
                {product.specifications.finish && (
                  <div>
                    <dt className="text-[var(--text-secondary)]">
                      Finish / Tone:
                    </dt>
                    <dd className="font-medium text-[var(--text-primary)] mt-0.5">
                      {product.specifications.finish}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase / Enquiry Module */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-mono">
              <span>{product.code}</span>
              <span className="uppercase text-[var(--accent)] font-sans font-semibold">
                {product.department}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--charcoal)] mt-1.5 leading-snug">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">
              {product.description}
            </p>

            {/* Indicative Price & Weight Card */}
            <div className="mt-4 p-4 bg-[var(--surface)] rounded-2xl border border-[var(--charcoal)]/15 flex items-baseline justify-between gap-4 shadow-xs">
              <div>
                <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider block font-semibold">
                  Indicative Atelier Valuation
                </span>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[var(--charcoal)] mt-1 tabular-nums">
                  {productPriceLabel(product, DemoStorage.getRates())}
                </div>
                <span className="text-[10px] text-[var(--text-secondary)] block font-light mt-0.5">
                  *Based on daily Sarafa market bullion rates &amp; exact metal
                  weight
                </span>
              </div>
              {product.specifications?.estimatedWeight && (
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider block font-semibold">
                    Weight
                  </span>
                  <span className="font-mono text-xs font-bold text-[var(--charcoal)] bg-white px-3 py-1.5 rounded-xl border border-[var(--charcoal)]/10 inline-block mt-1 shadow-2xs">
                    {product.specifications.estimatedWeight}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Configured Required Options */}
          {product.options && product.options.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-[var(--charcoal)]/10">
              {product.options.map((opt) => (
                <div key={opt.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[var(--text-primary)]">
                      {opt.name}:
                    </span>
                    <span className="text-[var(--text-secondary)] italic">
                      {selectedOptions[opt.name] || "Select option"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {opt.values.map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleOptionSelect(opt.name, val)}
                        className={`px-3 py-1.5 text-xs rounded-xs border transition-all ${
                          selectedOptions[opt.name] === val
                            ? "bg-[var(--charcoal)] text-[var(--on-dark)] border-[var(--charcoal)] font-medium shadow-xs"
                            : "bg-white text-[var(--text-primary)] border-[var(--charcoal)]/20 hover:border-[var(--charcoal)]"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity & Notes */}
          <div className="pt-4 border-t border-[var(--charcoal)]/10 space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium text-[var(--text-primary)]">
                Quantity:
              </span>
              <div className="flex items-center border border-[var(--charcoal)]/20 rounded-xs bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-sm text-[var(--charcoal)] hover:bg-[var(--on-dark)]"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold text-[var(--text-primary)] tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-sm text-[var(--charcoal)] hover:bg-[var(--on-dark)]"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="customerNotes"
                className="block text-[11px] text-[var(--text-secondary)] mb-1"
              >
                Customisation or occasion notes (optional):
              </label>
              <input
                id="customerNotes"
                type="text"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="e.g. Wedding date, preferred gold karat, gift message"
                className="w-full text-xs px-3 py-2 bg-white border border-[var(--charcoal)]/20 rounded-xs focus:outline-none focus:border-[var(--charcoal)]"
              />
            </div>
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Success Added Feedback Banner */}
          {addedFeedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Added to your Enquiry Bag.</span>
              </div>
              <Link to="/enquiry-bag" className="font-semibold underline">
                View Bag
              </Link>
            </div>
          )}

          {/* Action CTAs: Add to Enquiry Bag & Direct WhatsApp */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleAddToBag}
              className="w-full py-3.5 px-4 bg-[var(--charcoal)] hover:bg-[var(--action-hover)] text-[var(--on-dark)] text-xs uppercase tracking-widest font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-[var(--accent)]" />
              <span>Add to Enquiry Bag</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[var(--on-dark)] hover:bg-[var(--surface-secondary)] border border-[var(--charcoal)]/25 text-[var(--charcoal)] text-xs uppercase tracking-widest font-semibold rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 text-[var(--accent)]" />
              <span>Enquire Directly on WhatsApp (0312-345678)</span>
            </a>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleToggleWishlist}
                className="inline-flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[var(--charcoal)]"
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? "fill-[var(--charcoal)] text-[var(--charcoal)]" : ""}`}
                />
                <span>
                  {isWishlisted ? "Saved in Wishlist" : "Add to Wishlist"}
                </span>
              </button>
              <span className="text-[11px] text-[var(--text-secondary)]">
                Ref: {product.code}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Full-Image Zoom Modal */}
      {zoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/90  flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            className="absolute top-6 right-6 p-2 text-white/80 hover:text-white"
            aria-label="Close enlarged view"
          >
            <X className="w-7 h-7" />
          </button>
          <div className="max-w-4xl max-h-[90vh] overflow-hidden">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-auto max-h-[85vh] object-contain rounded-xs"
            />
            <p className="text-center text-white/80 font-serif text-sm mt-3">
              {product.name} — Detailed Craftsmanship View
            </p>
          </div>
        </div>
      )}

      {/* Related Pieces */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-10 border-t border-[var(--charcoal)]/15">
          <div className="mb-6">
            <span className="text-[11px] uppercase tracking-widest text-[var(--accent-ink)] font-semibold block">
              Complementary Masterpieces
            </span>
            <h2 className="font-serif text-2xl font-semibold text-[var(--charcoal)] mt-1">
              Related Creations
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
