import type {
  Product,
  MetalRatesData,
  CheckoutConfiguration,
  BagItem,
} from "../types";
export const pkr = (v: number) =>
  "PKR " +
  v.toLocaleString("en-PK", {
    minimumFractionDigits: Number.isInteger(v) ? 0 : 2,
    maximumFractionDigits: 2,
  });
export const money = (v: number) =>
  Math.round((v + Number.EPSILON) * 100) / 100;
export const DEFAULT_CHECKOUT: CheckoutConfiguration = {
  deliveryFeePKR: 0,
  taxPercent: 0,
  discountPKR: 0,
  codEnabled: true,
  codCities: [],
  codMaxPKR: 0,
  bankEnabled: false,
  bankInstructions: "",
  deliveryEstimate: "",
  postalCodeRequired: false,
};
export function validateProduct(p: Product) {
  if (!p.name.trim() || !p.code.trim() || !p.images.length)
    throw new Error("Name, SKU and at least one image are required.");
  for (const n of [
    p.samplePricePKR ?? 0,
    p.stockQuantity ?? 0,
    p.lowStockThreshold ?? 2,
    p.grossWeightGrams ?? 0,
    p.stoneWeightGrams ?? 0,
    p.makingChargePKR ?? 0,
    p.stoneChargePKR ?? 0,
  ])
    if (!Number.isFinite(n) || n < 0)
      throw new Error(
        "Prices, weights and stock must be non-negative numbers.",
      );
  if (
    !Number.isInteger(p.stockQuantity ?? 0) ||
    !Number.isInteger(p.lowStockThreshold ?? 2)
  )
    throw new Error("Stock and thresholds must be whole numbers.");
  if ((p.stoneWeightGrams ?? 0) > (p.grossWeightGrams ?? 0))
    throw new Error("Stone weight cannot exceed gross weight.");
  if (
    p.netWeightGrams !== undefined &&
    Math.abs(
      p.netWeightGrams -
        ((p.grossWeightGrams ?? 0) - (p.stoneWeightGrams ?? 0)),
    ) > 0.011
  )
    throw new Error("Net weight must equal gross weight minus stone weight.");
  if (p.pricingMode === "metal_rate" && !(p.netWeightGrams! > 0))
    throw new Error("Metal-rate pricing requires a positive net metal weight.");
}
export function productPrice(p: Product, rates: MetalRatesData) {
  if (p.pricingMode !== "metal_rate")
    return {
      total: money(p.samplePricePKR ?? 0),
      metal: 0,
      making: 0,
      stone: 0,
    };
  const purity = p.karatPurity || "";
  const rate = rates.rates.find((r) =>
    purity.includes("Silver")
      ? r.metal.includes("Silver")
      : (r.metal + " " + r.purity).includes(
          purity.match(/\d+K/)?.[0] || "__missing__",
        ),
  );
  if (!rate)
    throw new Error(
      `No configured metal rate for ${p.name}. Please request a quotation.`,
    );
  const unit = rate.unit.toLowerCase();
  const divisor = unit.includes("tola")
    ? 11.664
    : unit.includes("10")
      ? 10
      : unit.includes("gram")
        ? 1
        : 0;
  if (!divisor || rate.ratePKR <= 0)
    throw new Error("The configured rate has an unsupported unit or value.");
  const grams = p.netWeightGrams ?? 0;
  const metal = money((grams * rate.ratePKR) / divisor);
  const making = money(
    (p.makingChargePKR ?? 0) *
      (p.makingChargeType === "per_gram"
        ? grams
        : p.makingChargeType === "per_tola"
          ? grams / 11.664
          : 1),
  );
  const stone = p.stoneChargePKR ?? 0;
  return { total: money(metal + making + stone), metal, making, stone };
}
export function checkoutLines(
  items: BagItem[],
  products: Product[],
  rates: MetalRatesData,
): BagItem[] {
  return items.map((i) => {
    const p = products.find(
      (p) => p.id === i.productId && p.published && p.lifecycle !== "archived",
    );
    if (!p) throw new Error(`${i.name} is no longer available.`);
    if (!Number.isInteger(i.quantity) || i.quantity < 1)
      throw new Error("Choose a valid quantity.");
    for (const [name, value] of Object.entries(i.selectedOptions || {})) {
      if (!p.options?.some((o) => o.name === name && o.values.includes(value)))
        throw new Error(`Review the selected variant for ${p.name}.`);
    }
    for (const option of p.options || []) {
      if (!i.selectedOptions[option.name])
        throw new Error(`Select ${option.name} for ${p.name}.`);
    }
    const price = productPrice(p, rates);
    if (price.total <= 0)
      throw new Error(`A quotation is required for ${p.name}.`);
    return {
      ...i,
      name: p.name,
      code: p.code,
      image: p.images[0],
      unitPricePKR: price.total,
      purity: p.karatPurity || p.specifications?.metalPurity,
      weightGrams: p.netWeightGrams,
      metalValuePKR: price.metal,
      makingValuePKR: price.making,
      stoneValuePKR: price.stone,
    };
  });
}
export function totals(lines: BagItem[], config: CheckoutConfiguration) {
  const subtotal = money(
    lines.reduce((s, i) => s + (i.unitPricePKR ?? 0) * i.quantity, 0),
  );
  const discount = Math.min(subtotal, config.discountPKR);
  const tax = money(((subtotal - discount) * config.taxPercent) / 100);
  return {
    subtotal,
    discount,
    tax,
    delivery: config.deliveryFeePKR,
    total: money(subtotal - discount + tax + config.deliveryFeePKR),
  };
}
export function normalizePKPhone(phone: string) {
  const s = phone.replace(/[\s()-]/g, "");
  if (/^03\d{9}$/.test(s)) return "+92" + s.slice(1);
  if (/^\+923\d{9}$/.test(s)) return s;
  if (/^923\d{9}$/.test(s)) return "+" + s;
  return null;
}
export function exportRows(
  filename: string,
  rows: Record<string, unknown>[],
  headers?: string[],
) {
  const keys = headers || Object.keys(rows[0] || {});
  const cell = (v: unknown) => {
    let s = String(v ?? "");
    if (/^[=+@\-\t\r]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  };
  const blob = new Blob(
    [
      "\uFEFF" +
        [
          keys.map(cell).join(","),
          ...rows.map((r) => keys.map((k) => cell(r[k])).join(",")),
        ].join("\r\n"),
    ],
    { type: "text/csv;charset=utf-8" },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function productPriceLabel(product: Product, rates: MetalRatesData) {
  try {
    const price = productPrice(product, rates).total;
    return price > 0 ? pkr(price) : "Rate upon request";
  } catch {
    return "Rate upon request";
  }
}
