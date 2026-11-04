import React from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { ProductCategory, ProductDepartment } from "../../types";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (dept: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  totalCount: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDepartment,
  onDepartmentChange,
  sortBy,
  onSortChange,
  onClearFilters,
  totalCount,
}) => {
  const categories: { label: string; value: string }[] = [
    { label: "All Pieces", value: "all" },
    { label: "Necklaces & Haars", value: "necklaces" },
    { label: "Rings", value: "rings" },
    { label: "Bangles & Kadas", value: "bangles" },
    { label: "Earrings & Jhumkas", value: "earrings" },
  ];

  const departments: { label: string; value: string }[] = [
    { label: "All Categories", value: "all" },
    { label: "Bridal", value: "Bridal" },
    { label: "Gold", value: "Gold" },
    { label: "Pakistani Chandi", value: "Pakistani Chandi" },
    { label: "Italian Designs", value: "Italian Designs" },
    { label: "Custom Orders", value: "Custom Orders" },
  ];

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedDepartment !== "all";

  return (
    <div className="product-filters bg-white border border-[var(--charcoal)]/10 rounded-xs p-4 sm:p-6 mb-8 space-y-4">
      {/* Top search & sorting row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            aria-label="Search collections"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by code (e.g. TSJ-BR-01) or name..."
            className="w-full pl-9 pr-8 py-2 bg-[var(--on-dark)]/70 border border-[var(--charcoal)]/15 rounded-xs text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--charcoal)]"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear collection search"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Department / Material Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
          <select
            aria-label="Filter material"
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="bg-[var(--on-dark)]/70 border border-[var(--charcoal)]/15 rounded-xs px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--charcoal)]"
          >
            {departments.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>

          {/* Sort By Dropdown (no fake price sorting) */}
          <select
            aria-label="Sort products"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-[var(--on-dark)]/70 border border-[var(--charcoal)]/15 rounded-xs px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--charcoal)]"
          >
            <option value="featured">Featured Curations</option>
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
            <option value="newest">Newest Additions</option>
          </select>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="pt-2 border-t border-[var(--charcoal)]/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 max-w-full pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => onCategoryChange(cat.value)}
              className={`px-3 py-1.5 text-xs tracking-wider uppercase rounded-xs transition-colors whitespace-nowrap ${
                selectedCategory === cat.value
                  ? "bg-[var(--charcoal)] text-[var(--on-dark)] font-medium"
                  : "bg-[var(--on-dark)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Count and Clear filter */}
        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
          <span>
            Showing <strong>{totalCount}</strong> pieces
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-[var(--charcoal)] hover:underline font-medium inline-flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
