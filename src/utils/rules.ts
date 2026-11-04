import { BagItem, EnquiryStatus, Product } from "../types";

/**
 * Generate a distinct reference code for an enquiry or order.
 */
export function generateReferenceCode(
  type: "ENQ" | "ORD",
  seed?: number,
): string {
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  const randomPart =
    seed !== undefined
      ? Math.abs(seed).toString(16).toUpperCase().padStart(4, "0")
      : Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TSJ-${type}-${timestamp}-${randomPart}`;
}

/**
 * Build a WhatsApp enquiry link for an individual product.
 */
export function buildProductWhatsAppUrl(
  product: { name: string; code: string },
  selectedOptions?: Record<string, string>,
  quantity: number = 1,
  whatsappNumber: string = "92312345678",
): string {
  const optionsText =
    selectedOptions && Object.keys(selectedOptions).length > 0
      ? Object.entries(selectedOptions)
          .map(([k, v]) => `• ${k}: ${v}`)
          .join("\n")
      : "Standard specifications";

  const text = [
    `Assalam-o-Alaikum Tayyab Shahzad Jewellers,`,
    ``,
    `I would like to enquire about this piece:`,
    `Piece: *${product.name}*`,
    `Product Code: *${product.code}*`,
    `Quantity: ${quantity}`,
    `Selected Details:\n${optionsText}`,
    ``,
    `Please advise on viewing availability, crafting timeframe, and quotation.`,
    `Thank you.`,
  ].join("\n");

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Build a WhatsApp message for an entire Enquiry Bag.
 */
export function buildBagWhatsAppUrl(
  items: BagItem[],
  customer: { name: string; phone: string; city?: string },
  referenceCode: string,
  whatsappNumber: string = "923483498745",
): string {
  const itemsText = items
    .map((item, idx) => {
      const opts = Object.entries(item.selectedOptions || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      return `${idx + 1}. *${item.name}* (${item.code}) × ${item.quantity}${opts ? ` [${opts}]` : ""}`;
    })
    .join("\n");

  const text = [
    `Assalam-o-Alaikum Tayyab Shahzad Jewellers,`,
    ``,
    `I have saved an Enquiry Bag on your demo showcase:`,
    `Reference: *${referenceCode}*`,
    `Name: *${customer.name}*`,
    `Contact: ${customer.phone}`,
    customer.city ? `City: ${customer.city}` : "",
    ``,
    `Requested Pieces:\n${itemsText}`,
    ``,
    `Please share the quotation and consultation details.`,
    `Thank you.`,
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Build a WhatsApp message for a Bespoke Custom Order request.
 */
export function buildCustomOrderWhatsAppUrl(
  data: {
    jewelleryType: string;
    preferredMaterial: string;
    occasion?: string;
    description: string;
    approxBudget?: string;
    name: string;
    phone: string;
  },
  referenceCode: string,
  whatsappNumber: string = "923483498745",
): string {
  const text = [
    `Assalam-o-Alaikum Tayyab Shahzad Jewellers,`,
    ``,
    `I would like to discuss a Bespoke Custom Jewellery Order:`,
    `Reference: *${referenceCode}*`,
    `Customer Name: *${data.name}*`,
    `Contact: ${data.phone}`,
    `Jewellery Type: *${data.jewelleryType}*`,
    `Preferred Material: *${data.preferredMaterial}*`,
    data.occasion ? `Occasion: ${data.occasion}` : "",
    data.approxBudget ? `Budget Range: ${data.approxBudget}` : "",
    `Design Details: ${data.description}`,
    ``,
    `(Note: I have a reference design image ready to share directly in this chat.)`,
    ``,
    `Looking forward to your guidance.`,
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Filter and sort products deterministically.
 */
export function filterProducts(
  products: Product[],
  options: {
    search?: string;
    category?: string;
    department?: string;
    sortBy?: "featured" | "name-asc" | "name-desc" | "newest";
    onlyPublished?: boolean;
  },
): Product[] {
  let list = [...products];

  if (options.onlyPublished !== false) {
    list = list.filter((p) => p.published);
  }

  if (options.department && options.department !== "all") {
    list = list.filter(
      (p) => p.department.toLowerCase() === options.department?.toLowerCase(),
    );
  }

  if (options.category && options.category !== "all") {
    list = list.filter(
      (p) => p.category.toLowerCase() === options.category?.toLowerCase(),
    );
  }

  if (options.search && options.search.trim().length > 0) {
    const q = options.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }

  if (options.sortBy === "name-asc") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else if (options.sortBy === "name-desc") {
    list.sort((a, b) => b.name.localeCompare(a.name));
  } else if (options.sortBy === "newest") {
    list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } else {
    // featured first
    list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  return list;
}

/**
 * Validate next status in the order lifecycle:
 * new -> contacted -> quote_prepared -> awaiting_approval -> confirmed -> completed / cancelled
 */
export const STATUS_SEQUENCE: EnquiryStatus[] = [
  "new",
  "contacted",
  "quote_prepared",
  "awaiting_approval",
  "confirmed",
  "completed",
];

export function getNextPossibleStatuses(
  current: EnquiryStatus,
): EnquiryStatus[] {
  if (current === "completed" || current === "cancelled") {
    return [];
  }
  const currentIndex = STATUS_SEQUENCE.indexOf(current);
  const possible: EnquiryStatus[] = [];
  if (currentIndex >= 0 && currentIndex < STATUS_SEQUENCE.length - 1) {
    possible.push(STATUS_SEQUENCE[currentIndex + 1]);
  }
  possible.push("cancelled");
  return possible;
}
