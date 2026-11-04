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

const DEFAULT_WHATSAPP_NUMBER = "923483498745";

function whatsappUrl(number: string, message: string): string {
  // WhatsApp's phone path accepts digits only. Leave the message encoding to this boundary.
  const digits = number.replace(/\D/g, "");
  const phone = digits || DEFAULT_WHATSAPP_NUMBER;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** Build a WhatsApp enquiry link for an individual product. */
export function buildProductWhatsAppUrl(
  product: { name: string; code: string },
  selectedOptions?: Record<string, string>,
  quantity: number = 1,
  whatsappNumber: string = DEFAULT_WHATSAPP_NUMBER,
  customerNotes?: string,
): string {
  const optionsText =
    selectedOptions && Object.keys(selectedOptions).length > 0
      ? Object.entries(selectedOptions)
          .map(([key, value]) => `• ${key}: ${value}`)
          .join("\n")
      : "Standard specifications";

  const message = [
    "Assalam-o-Alaikum Tayyab Shahzad Jewellers,",
    "",
    "Mujhe is jewellery piece ke bare mein maloomat chahiye:",
    `Product: ${product.name}`,
    `Code: ${product.code}`,
    `Quantity: ${quantity}`,
    `Selected options:\n${optionsText}`,
    customerNotes?.trim() ? `Notes: ${customerNotes.trim()}` : "",
    "",
    "Iski availability aur final price confirm kar dein.",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return whatsappUrl(whatsappNumber, message);
}

/** Build a WhatsApp message for an entire Enquiry Bag. */
export function buildBagWhatsAppUrl(
  items: BagItem[],
  customer: {
    name: string;
    phone: string;
    city?: string;
    occasion?: string;
    targetDate?: string;
    notes?: string;
  },
  referenceCode: string,
  whatsappNumber: string = DEFAULT_WHATSAPP_NUMBER,
): string {
  const itemsText = items
    .map((item, index) => {
      const options = Object.entries(item.selectedOptions || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
      return [
        `${index + 1}. ${item.name}`,
        `Code: ${item.code}`,
        `Quantity: ${item.quantity}`,
        options ? `Selected options: ${options}` : "",
        item.customerNotes ? `Product notes: ${item.customerNotes}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  const message = [
    "Assalam-o-Alaikum Tayyab Shahzad Jewellers,",
    "",
    "I would like a quotation for the following Enquiry Bag:",
    referenceCode ? `Enquiry reference: ${referenceCode}` : "",
    customer.name ? `Customer name: ${customer.name}` : "",
    customer.phone ? `Customer contact: ${customer.phone}` : "",
    customer.city ? `City: ${customer.city}` : "",
    customer.occasion ? `Occasion: ${customer.occasion}` : "",
    customer.targetDate ? `Target date: ${customer.targetDate}` : "",
    "",
    `Requested pieces:\n${itemsText}`,
    customer.notes ? `\nCustomer notes: ${customer.notes}` : "",
    "",
    "Please share the quotation and consultation details.",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return whatsappUrl(whatsappNumber, message);
}

/** Build a WhatsApp message for a Bespoke Custom Order request. */
export function buildCustomOrderWhatsAppUrl(
  data: {
    jewelleryType: string;
    preferredMaterial: string;
    occasion?: string;
    description: string;
    approxBudget?: string;
    targetDate?: string;
    reference?: string;
    name: string;
    phone: string;
  },
  referenceCode: string,
  whatsappNumber: string = DEFAULT_WHATSAPP_NUMBER,
): string {
  const message = [
    "Assalam-o-Alaikum Tayyab Shahzad Jewellers,",
    "",
    "I would like to discuss a Bespoke Custom Jewellery Order:",
    referenceCode ? `Reference: ${referenceCode}` : "",
    data.name ? `Customer Name: ${data.name}` : "",
    data.phone ? `Contact: ${data.phone}` : "",
    data.jewelleryType ? `Jewellery Type: ${data.jewelleryType}` : "",
    data.preferredMaterial ? `Preferred Material / Purity: ${data.preferredMaterial}` : "",
    data.occasion ? `Occasion: ${data.occasion}` : "",
    data.approxBudget ? `Budget: ${data.approxBudget}` : "",
    data.targetDate ? `Target Date: ${data.targetDate}` : "",
    data.description ? `Design Requirements: ${data.description}` : "",
    "",
    "I can share a reference design image in this chat if required.",
    "",
    "Please advise on availability, final price and timeframe.",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return whatsappUrl(whatsappNumber, message);
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
