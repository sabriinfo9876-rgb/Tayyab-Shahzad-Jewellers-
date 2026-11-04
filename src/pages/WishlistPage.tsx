import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { DemoStorage } from "../services/storage";
import { ProductCard } from "../components/product/ProductCard";
import { Product } from "../types";

export const WishlistPage: React.FC = () => {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  const loadWishlist = () => {
    const ids = DemoStorage.getWishlist();
    const all = DemoStorage.getProducts();
    const matched = all.filter((p) => ids.includes(p.id));
    setWishlistProducts(matched);
  };

  useEffect(() => {
    loadWishlist();
    window.addEventListener("tsj-storage-updated", loadWishlist);
    return () =>
      window.removeEventListener("tsj-storage-updated", loadWishlist);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-8 border-b border-[var(--charcoal)]/10 pb-6 flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[var(--accent-ink)] font-semibold block mb-1">
            Personal Saved Selection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[var(--charcoal)]">
            Your Wishlist
          </h1>
        </div>
        <span className="text-xs text-[var(--text-secondary)]">
          {wishlistProducts.length}{" "}
          {wishlistProducts.length === 1 ? "piece" : "pieces"} saved
        </span>
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-[var(--charcoal)]/10 rounded-xs p-8 space-y-4">
          <Heart className="w-10 h-10 text-[var(--accent)] mx-auto opacity-70" />
          <h2 className="font-serif text-2xl text-[var(--charcoal)]">
            Your wishlist is empty
          </h2>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
            Save designs while exploring our bridal suites, gold kadas, and
            Italian collections to review them together.
          </p>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--charcoal)] text-[var(--on-dark)] text-xs uppercase tracking-wider font-semibold rounded-xs shadow-xs hover:bg-[var(--action-hover)]"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
          </Link>
        </div>
      )}
    </div>
  );
};
