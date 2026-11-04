import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Download,
  Edit3,
  Eye,
  Archive,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Package,
  Layers,
  ArrowUpDown,
} from "lucide-react";
import { Product, ProductCategory, ProductDepartment } from "../../../types";
import { DemoStorage } from "../../../services/storage";
import { ProductEditModal } from "./ProductEditModal";

interface InventoryTabProps {
  products: Product[];
  onProductsUpdated: () => void;
  isCreateModalOpen?: boolean;
  onCloseCreateModal?: () => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  products,
  onProductsUpdated,
  isCreateModalOpen,
  onCloseCreateModal,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [stockFilter, setStockFilter] = useState<string>("All");

  // Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync with prop from Header
  React.useEffect(() => {
    if (isCreateModalOpen) {
      setEditingProduct(null);
      setIsModalOpen(true);
    }
  }, [isCreateModalOpen]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    if (onCloseCreateModal) onCloseCreateModal();
  };

  const handleSaveProduct = (updated: Product) => {
    DemoStorage.saveProduct(updated);
    handleCloseModal();
    onProductsUpdated();
  };

  const handleTogglePublished = (product: Product) => {
    const toggled: Product = {
      ...product,
      published: !product.published,
      lifecycle: product.published ? "draft" : "active",
    };
    DemoStorage.saveProduct(toggled);
    onProductsUpdated();
  };

  const handleExportCSV = () => {
    DemoStorage.exportCSV("inventory");
  };

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.karatPurity &&
          p.karatPurity.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        categoryFilter === "All" || p.category === categoryFilter;

      const matchesDepartment =
        departmentFilter === "All" || p.department === departmentFilter;

      const stock = p.stockQuantity ?? 0;
      let matchesStock = true;
      if (stockFilter === "In Stock")
        matchesStock = stock > (p.lowStockThreshold ?? 2);
      else if (stockFilter === "Low Stock")
        matchesStock = stock > 0 && stock <= (p.lowStockThreshold ?? 2);
      else if (stockFilter === "Made to Order") matchesStock = stock === 0;

      return (
        matchesSearch && matchesCategory && matchesDepartment && matchesStock
      );
    });
  }, [products, searchQuery, categoryFilter, departmentFilter, stockFilter]);

  // Aggregate stats
  const totalStockPieces = products.reduce(
    (sum, p) => sum + (p.stockQuantity ?? 0),
    0,
  );
  const totalNetGrams = products.reduce(
    (sum, p) => sum + (p.netWeightGrams ?? 0) * (p.stockQuantity ?? 0),
    0,
  );
  const totalTolas = (totalNetGrams / 11.664).toFixed(2);
  const totalInventoryValuationPKR = products.reduce(
    (sum, p) => sum + (p.samplePricePKR || 0) * (p.stockQuantity ?? 1),
    0,
  );

  return (
    <div className="space-y-4">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
            Inventory & Showroom Catalogue
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage jewellery specifications, gold weights, stock quantities and
            making charges
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-md text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export Inventory (.CSV)</span>
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="px-3.5 py-1.5 bg-[var(--charcoal)] text-white hover:bg-[var(--charcoal)] rounded-md text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Add Jewellery Item</span>
          </button>
        </div>
      </div>

      {/* Valuation Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-stone-200 text-xs">
        <div>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
            Catalogue SKUs
          </span>
          <span className="text-base font-bold font-mono text-stone-900">
            {products.length} Designs
          </span>
        </div>
        <div>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
            Total Pieces in Hand
          </span>
          <span className="text-base font-bold font-mono text-stone-900">
            {totalStockPieces} Pieces
          </span>
        </div>
        <div>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
            Recorded Net Metal Weight
          </span>
          <span className="text-base font-bold font-mono text-amber-900">
            {totalTolas} Tolas ({totalNetGrams.toFixed(1)}g)
          </span>
        </div>
        <div>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
            Demo Retail Stock Value
          </span>
          <span className="text-base font-bold font-mono text-[var(--charcoal)]">
            Rs. {totalInventoryValuationPKR.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-3 rounded-lg border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, SKU or karat purity..."
            className="w-full bg-[var(--surface)] border border-stone-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-[var(--surface)] border border-stone-200 rounded px-2 py-1 text-xs text-stone-800 font-medium focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Gold">Gold</option>
            <option value="Pakistani Chandi">Pakistani Chandi</option>
            <option value="Italian Designs">Italian Designs</option>
            <option value="Bridal">Bridal</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[var(--surface)] border border-stone-200 rounded px-2 py-1 text-xs text-stone-800 font-medium focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="necklaces">Necklaces</option>
            <option value="earrings">Earrings</option>
            <option value="bangles">Bangles</option>
            <option value="rings">Rings</option>
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-[var(--surface)] border border-stone-200 rounded px-2 py-1 text-xs text-stone-800 font-medium focus:outline-none"
          >
            <option value="All">All Stock Levels</option>
            <option value="In Stock">In Stock (&gt;2)</option>
            <option value="Low Stock">Low stock (per threshold)</option>
            <option value="Made to Order">Made to Order (0)</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[var(--surface)] text-stone-500 uppercase tracking-wider text-[10px] font-semibold border-b border-stone-200">
              <tr>
                <th className="py-2.5 px-3">Item</th>
                <th className="py-2.5 px-3">SKU / Code</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Purity</th>
                <th className="py-2.5 px-3 font-mono">Net Wt (g / Tolas)</th>
                <th className="py-2.5 px-3 font-mono">Sample Price</th>
                <th className="py-2.5 px-3">Stock Level</th>
                <th className="py-2.5 px-3 text-center">Store Display</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => {
                const stock = p.stockQuantity ?? 0;
                const netG = p.netWeightGrams || 5.0;
                const netT = (netG / 11.664).toFixed(3);

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-stone-50/80 transition-colors"
                  >
                    {/* Item */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-10 h-10 rounded object-cover border border-stone-200 shrink-0"
                        />
                        <div className="truncate max-w-[170px]">
                          <span className="font-medium text-stone-900 block truncate">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-stone-400 capitalize">
                            {p.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* SKU Code */}
                    <td className="py-2.5 px-3 font-mono font-medium text-stone-800">
                      {p.code}
                    </td>

                    {/* Department */}
                    <td className="py-2.5 px-3 text-stone-600">
                      {p.department}
                    </td>

                    {/* Karat */}
                    <td className="py-2.5 px-3">
                      <span className="inline-block bg-stone-100 text-stone-700 font-mono text-[10px] px-1.5 py-0.5 rounded">
                        {p.karatPurity ||
                          p.specifications?.metalPurity ||
                          "21K"}
                      </span>
                    </td>

                    {/* Net Weight */}
                    <td className="py-2.5 px-3 font-mono">
                      <div className="text-stone-900 font-medium">{netG} g</div>
                      <div className="text-[10px] text-stone-400">
                        ~{netT} Tolas
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-2.5 px-3 font-mono font-semibold text-stone-900">
                      Rs. {(p.samplePricePKR || 0).toLocaleString()}
                    </td>

                    {/* Stock Level */}
                    <td className="py-2.5 px-3">
                      {stock > (p.lowStockThreshold ?? 2) ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          <span>{stock} in stock</span>
                        </span>
                      ) : stock > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                          <span>{stock} left</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                          <span>Made to Order</span>
                        </span>
                      )}
                    </td>

                    {/* Published Toggle */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => handleTogglePublished(p)}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded transition-colors ${
                          p.published
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-stone-100 text-stone-400 hover:bg-stone-200"
                        }`}
                        title="Click to toggle store visibility"
                      >
                        {p.published ? "Live" : "Hidden"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setIsModalOpen(true);
                        }}
                        className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                        title="Edit Specifications & Pricing"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Edit / Add Modal */}
      {isModalOpen && (
        <ProductEditModal
          product={editingProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};
