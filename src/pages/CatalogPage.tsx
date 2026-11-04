import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ProductFilters } from "../components/product/ProductFilters";
import { ProductCard } from "../components/product/ProductCard";
import { DemoStorage } from "../services/storage";
import { filterProducts } from "../utils/rules";
import { Product } from "../types";

interface CatalogPageProps {
  forcedDepartment?: string;
  pageTitle?: string;
  pageSubtitle?: string;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  forcedDepartment,
  pageTitle,
  pageSubtitle,
}) => {
  const { category: paramCategory } = useParams<{ category?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>(
    DemoStorage.getProducts(),
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    paramCategory || searchParams.get("category") || "all",
  );
  const [selectedDepartment, setSelectedDepartment] = useState(
    forcedDepartment || searchParams.get("department") || "all",
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");

  const syncProducts = () => {
    setProducts(DemoStorage.getProducts());
  };

  useEffect(() => {
    syncProducts();
    window.addEventListener("tsj-storage-updated", syncProducts);
    return () =>
      window.removeEventListener("tsj-storage-updated", syncProducts);
  }, []);

  useEffect(() => {
    if (paramCategory) {
      setSelectedCategory(paramCategory);
    }
  }, [paramCategory]);

  useEffect(() => {
    if (forcedDepartment) {
      setSelectedDepartment(forcedDepartment);
    }
  }, [forcedDepartment]);

  // Keep searchParams synced
  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (selectedCategory !== "all") params.category = selectedCategory;
    if (selectedDepartment !== "all" && !forcedDepartment)
      params.department = selectedDepartment;
    if (sortBy !== "featured") params.sort = sortBy;
    setSearchParams(params, { replace: true });
  }, [
    search,
    selectedCategory,
    selectedDepartment,
    sortBy,
    forcedDepartment,
    setSearchParams,
  ]);

  const filtered = filterProducts(products, {
    search,
    category: selectedCategory,
    department: forcedDepartment || selectedDepartment,
    sortBy: sortBy as any,
    onlyPublished: true,
  });

  const handleClearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    if (!forcedDepartment) {
      setSelectedDepartment("all");
    }
    setSortBy("featured");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Page Title & Context */}
      <div className="mb-8 border-b border-[var(--charcoal)]/10 pb-6">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[var(--accent-ink)] font-semibold block mb-1">
          {forcedDepartment
            ? `${forcedDepartment} Curation`
            : "Fine Jewellery Catalogue"}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[var(--charcoal)]">
          {pageTitle || "Explore Our Collections"}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 max-w-2xl leading-relaxed">
          {pageSubtitle ||
            "Discover timeless bridal haars, hand-engraved gold kadas, authentic Pakistani Chandi silver, and modern Italian designs."}
        </p>
      </div>

      {/* Filter Bar */}
      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedDepartment={forcedDepartment || selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onClearFilters={handleClearFilters}
        totalCount={filtered.length}
      />

      {/* Products Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-[var(--charcoal)]/10 rounded-xs p-8 space-y-4">
          <p className="font-serif text-xl text-[var(--charcoal)]">
            No pieces match your current selection.
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            Try adjusting your search terms or clearing the active filters.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-5 py-2.5 bg-[var(--charcoal)] text-[var(--on-dark)] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[var(--action-hover)]"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
