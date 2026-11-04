import React, { useState } from "react";
import type {
  Product,
  ProductCategory,
  ProductDepartment,
  ProductAvailability,
} from "../../../types";
import { FormField } from "../../common/FormField";
import { AccessibleDialog } from "../../common/AccessibleDialog";
import { validateProduct } from "../../../utils/commerce";
interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (p: Product) => void;
}
const ASSETS = [
  "01-classic-solitaire",
  "02-clover-studs",
  "03-sunflower-studs",
  "04-noir-halo-ring",
  "05-swirl-pendant-set",
  "06-filigree-charm-bracelet",
  "07-meander-bangles",
  "08-rose-solitaire-ring",
  "09-lattice-band",
  "10-floral-bangle-trio",
  "11-heart-pendant",
  "12-floral-link-bracelet",
  "13-rosette-bracelet",
  "14-illustrative-jhumkas",
  "15-illustrative-bridal-detail",
];
export function ProductEditModal(props: Props) {
  return props.isOpen ? (
    <ProductEditor key={props.product?.id || "new"} {...props} />
  ) : null;
}
function ProductEditor({ product: p, onClose, onSave }: Props) {
  const [name, setName] = useState(p?.name || ""),
    [code, setCode] = useState(p?.code || ""),
    [category, setCategory] = useState<ProductCategory>(p?.category || "rings"),
    [department, setDepartment] = useState<ProductDepartment>(
      p?.department || "Gold",
    ),
    [description, setDescription] = useState(p?.description || ""),
    [collections, setCollections] = useState(p?.collections.join(", ") || ""),
    [metal, setMetal] = useState(
      p?.metal || (p?.karatPurity?.includes("Silver") ? "Silver" : "Gold"),
    ),
    [purity, setPurity] = useState(
      p?.karatPurity || p?.specifications?.metalPurity || "22K",
    ),
    [gross, setGross] = useState(p?.grossWeightGrams ?? 0),
    [stone, setStone] = useState(p?.stoneWeightGrams ?? 0),
    [price, setPrice] = useState(p?.samplePricePKR ?? 0),
    [mode, setMode] = useState(p?.pricingMode || "fixed"),
    [making, setMaking] = useState(p?.makingChargePKR ?? 0),
    [makingType, setMakingType] = useState(p?.makingChargeType || "fixed"),
    [stoneCharge, setStoneCharge] = useState(p?.stoneChargePKR ?? 0),
    [stock, setStock] = useState(p?.stockQuantity ?? 0),
    [threshold, setThreshold] = useState(p?.lowStockThreshold ?? 2),
    [lifecycle, setLifecycle] = useState(
      p?.lifecycle || (p?.published ? "active" : "draft"),
    ),
    [images, setImages] = useState(
      p?.images || ["/images/01-classic-solitaire.webp"],
    ),
    [imageToAdd, setImageToAdd] = useState("/images/01-classic-solitaire.webp"),
    [variants, setVariants] = useState(
      (p?.options || [])
        .map((o) => o.name + ": " + o.values.join(", "))
        .join("\n"),
    ),
    [featured, setFeatured] = useState(p?.featured || false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const options = variants
        .split("\n")
        .filter((v) => v.trim())
        .map((line) => {
          const at = line.indexOf(":");
          if (at < 1)
            throw new Error("Use Option name: value, value for variants.");
          const values = line
            .slice(at + 1)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          if (!values.length) throw new Error("Each variant needs a value.");
          return { name: line.slice(0, at).trim(), values };
        });
      const next: Product = {
        ...p,
        id: p?.id || "prod-" + crypto.randomUUID(),
        slug:
          p?.slug ||
          name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
        name: name.trim(),
        code: code.trim().toUpperCase(),
        category,
        department,
        description,
        collections: collections
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        images,
        metal,
        karatPurity: purity,
        grossWeightGrams: gross,
        stoneWeightGrams: stone,
        netWeightGrams: Number((gross - stone).toFixed(3)),
        samplePricePKR: price,
        pricingMode: mode,
        stoneChargePKR: stoneCharge,
        makingChargePKR: making,
        makingChargeType: makingType,
        stockQuantity: stock,
        lowStockThreshold: threshold,
        lifecycle,
        published: lifecycle === "active",
        availability: p?.availability || "Available for Viewing",
        isEnquiryOnly: p?.isEnquiryOnly ?? true,
        isIllustrative: p?.isIllustrative ?? true,
        featured,
        options,
        specifications: {
          ...p?.specifications,
          metalPurity: purity,
          estimatedWeight: `${Number((gross - stone).toFixed(3))} g`,
        },
        createdAt: p?.createdAt || new Date().toISOString(),
      };
      validateProduct(next);
      setBusy(true);
      onSave(next);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  };
  const num = (
    label: string,
    value: number,
    set: (n: number) => void,
    integer = false,
  ) => (
    <FormField label={label}>
      <input
        type="number"
        min="0"
        step={integer ? "1" : "0.01"}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
      />
    </FormField>
  );
  return (
    <AccessibleDialog
      title={p ? "Edit product" : "Add product"}
      onClose={onClose}
      wide
    >
      <form className="form-stack" onSubmit={submit}>
        <p className="text-xs text-stone-500">
          Demo catalogue · images, prices and descriptions are preserved when
          editing.
        </p>
        <div className="form-grid">
          <FormField label="Product name">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormField>
          <FormField label="SKU">
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </FormField>
          <FormField label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
            >
              {["rings", "earrings", "necklaces", "bangles"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Department">
            <select
              value={department}
              onChange={(e) =>
                setDepartment(e.target.value as ProductDepartment)
              }
            >
              {[
                "Gold",
                "Pakistani Chandi",
                "Italian Designs",
                "Bridal",
                "Custom Orders",
              ].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </FormField>
          <FormField
            label="Collections (comma separated)"
            className="full-width"
          >
            <input
              value={collections}
              onChange={(e) => setCollections(e.target.value)}
            />
          </FormField>
          <FormField label="Description" className="full-width">
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormField>
        </div>
        <section className="form-section">
          <h3>Metal and weights</h3>
          <div className="form-grid">
            <FormField label="Metal">
              <select value={metal} onChange={(e) => setMetal(e.target.value)}>
                <option>Gold</option>
                <option>Silver</option>
                <option>Other</option>
              </select>
            </FormField>
            <FormField label="Purity">
              <input
                required
                value={purity}
                onChange={(e) => setPurity(e.target.value)}
              />
            </FormField>
            {num("Gross weight (g)", gross, setGross)}
            {num("Stone weight (g)", stone, setStone)}
            <p className="text-sm">
              Net metal weight:{" "}
              <strong>{Number((gross - stone).toFixed(3))} g</strong>
            </p>
          </div>
        </section>
        <section className="form-section">
          <h3>Pricing</h3>
          <div className="form-grid">
            <FormField label="Pricing mode">
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as typeof mode)}
              >
                <option value="fixed">Fixed demo price</option>
                <option value="metal_rate">Metal rate + charges</option>
              </select>
            </FormField>
            {num("Fixed demo price (PKR)", price, setPrice)}
            <FormField label="Making charge basis">
              <select
                value={makingType}
                onChange={(e) =>
                  setMakingType(e.target.value as typeof makingType)
                }
              >
                <option value="fixed">Fixed</option>
                <option value="per_gram">Per gram</option>
                <option value="per_tola">Per tola (11.664 g)</option>
              </select>
            </FormField>
            {num("Making charge (PKR)", making, setMaking)}
            {num("Stone charges (PKR)", stoneCharge, setStoneCharge)}
          </div>
          <p className="text-xs text-stone-500 mt-3">
            Calculated price = net metal value + making charges + stone charges.
            Configured tax and discount apply at checkout. Existing orders
            retain agreed prices.
          </p>
        </section>
        <section className="form-section">
          <h3>Stock and variants</h3>
          <div className="form-grid">
            {num("Stock quantity (pieces)", stock, setStock, true)}
            {num("Low-stock threshold (pieces)", threshold, setThreshold, true)}
            <FormField label="Product status">
              <select
                value={lifecycle}
                onChange={(e) =>
                  setLifecycle(e.target.value as typeof lifecycle)
                }
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </FormField>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
              Featured product
            </label>
            <FormField
              label="Sizes and variants"
              className="full-width"
              hint="One option per line: Size: 14, 16, 18"
            >
              <textarea
                rows={3}
                value={variants}
                onChange={(e) => setVariants(e.target.value)}
              />
            </FormField>
          </div>
        </section>
        <section className="form-section">
          <h3>Product images</h3>
          <p className="text-xs mb-3 text-stone-500">
            The first image is primary. Choose an existing product asset;
            original files are unchanged.
          </p>
          <div className="flex flex-wrap gap-3">
            {images.map((im, i) => (
              <div key={im} className="border border-stone-200 p-2">
                <img
                  src={im}
                  alt={`Product image ${i + 1}`}
                  width={70}
                  height={70}
                  className="object-cover w-16 h-16"
                />
                <button
                  type="button"
                  className="block text-xs"
                  disabled={i === 0}
                  onClick={() =>
                    setImages([im, ...images.filter((v) => v !== im)])
                  }
                >
                  {i === 0 ? "Primary" : "Make primary"}
                </button>
                <button
                  type="button"
                  className="text-xs"
                  disabled={images.length === 1}
                  onClick={() => setImages(images.filter((v) => v !== im))}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3 items-end mt-4">
            <FormField label="Available image">
              <select
                value={imageToAdd}
                onChange={(e) => setImageToAdd(e.target.value)}
              >
                {ASSETS.map((a) => (
                  <option key={a} value={"/images/" + a + ".webp"}>
                    {a}
                  </option>
                ))}
              </select>
            </FormField>
            <button
              type="button"
              className="button-secondary"
              onClick={() => {
                if (!images.includes(imageToAdd))
                  setImages([...images, imageToAdd]);
              }}
            >
              Add image
            </button>
          </div>
        </section>
        {error && (
          <p className="field-error text-sm" role="alert">
            {error}
          </p>
        )}
        <div className="button-row justify-end">
          <button className="button-secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="button-primary" disabled={busy}>
            {busy ? "Saving…" : "Save product"}
          </button>
        </div>
      </form>
    </AccessibleDialog>
  );
}
