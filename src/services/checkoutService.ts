import { DemoStorage } from "./storage";
import { readLedger, writeLedger } from "./demoLedger";
import {
  checkoutLines,
  totals,
  DEFAULT_CHECKOUT,
  normalizePKPhone,
} from "../utils/commerce";
import type { AdminOrderRecord, DeliveryAddress, BagItem } from "../types";

export function placeDemoOrder(input: {
  key: string;
  address: DeliveryAddress;
  method: "cod" | "bank";
  reviewedTotal: number;
  reviewedLines: BagItem[];
}) {
  const ledger = readLedger();
  const previous = ledger.orders.find((o) => o.idempotencyKey === input.key);
  if (previous) {
    DemoStorage.clearBag();
    return previous;
  }
  const items = DemoStorage.getBag();
  if (!items.length) throw new Error("Your bag is empty.");
  const products = DemoStorage.getProducts();
  const config = DemoStorage.getSettings().checkout || DEFAULT_CHECKOUT;
  const lines = checkoutLines(items, products, DemoStorage.getRates());
  const amounts = totals(lines, config);
  if (
    Math.abs(amounts.total - input.reviewedTotal) > 0.01 ||
    JSON.stringify(lines) !== JSON.stringify(input.reviewedLines)
  )
    throw new Error(
      "Prices, selected items or charges changed. Review the updated summary and place your order again.",
    );
  if (
    !input.address.fullName.trim() ||
    !input.address.address.trim() ||
    !input.address.city.trim() ||
    !input.address.province.trim() ||
    !normalizePKPhone(input.address.phone)
  )
    throw new Error(
      "Complete your name, Pakistani phone and delivery address.",
    );
  if (config.postalCodeRequired && !input.address.postalCode?.trim())
    throw new Error("Postal code is required for this delivery option.");
  if (
    input.address.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.address.email)
  )
    throw new Error("Review your email address.");
  if (
    input.method === "bank" &&
    (!config.bankEnabled || !config.bankInstructions.trim())
  )
    throw new Error("Bank transfer is not configured.");
  if (
    input.method === "cod" &&
    (!config.codEnabled ||
      (config.codMaxPKR > 0 && amounts.total > config.codMaxPKR) ||
      (config.codCities.length > 0 &&
        !config.codCities.some(
          (c) => c.toLowerCase() === input.address.city.trim().toLowerCase(),
        )))
  )
    throw new Error(
      "Cash on delivery is not available for this order or city.",
    );
  const required = new Map<string, number>();
  for (const line of lines)
    required.set(
      line.productId,
      (required.get(line.productId) || 0) + line.quantity,
    );
  for (const [id, quantity] of required) {
    const stock = products.find((p) => p.id === id)?.stockQuantity ?? 0;
    if (quantity > stock)
      throw new Error(
        `Insufficient stock for ${products.find((p) => p.id === id)?.name}. Please review your bag.`,
      );
    ledger.stock[id] = stock - quantity;
  }
  let reference: string;
  do {
    reference =
      "TSJ-DEMO-" +
      crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
  } while (ledger.orders.some((o) => o.orderReference === reference));
  const now = new Date().toISOString();
  const order: AdminOrderRecord = {
    demoCheckout: true,
    idempotencyKey: input.key,
    orderReference: reference,
    enquiryReference: "Guest demo checkout",
    customerName: input.address.fullName.trim(),
    customerPhone: normalizePKPhone(input.address.phone)!,
    customerCity: input.address.city.trim(),
    items: lines,
    agreedAmountPKR: amounts.total,
    paidAmountPKR: 0,
    paymentStatus: "Pending",
    fulfilmentStatus: "New",
    confirmedDate: now,
    paymentMethod: input.method,
    paymentState: input.method === "cod" ? "cod_due" : "awaiting_transfer",
    deliveryAddress: {
      ...input.address,
      phone: normalizePKPhone(input.address.phone)!,
    },
    subtotalPKR: amounts.subtotal,
    deliveryPKR: amounts.delivery,
    taxPKR: amounts.tax,
    discountPKR: amounts.discount,
    bankInstructionsSnapshot:
      input.method === "bank" ? config.bankInstructions : undefined,
    deliveryEstimateSnapshot: config.deliveryEstimate || undefined,
    timeline: [
      {
        status: "New",
        date: now,
        description: "Demo order received; no real payment processed.",
      },
    ],
    payments: [],
    internalNotes: [],
  };
  ledger.orders.unshift(order);
  writeLedger(ledger);
  // Clear only after the order and stock transaction commits. A retry returns this same snapshot.
  DemoStorage.clearBag();
  return order;
}
export function submitDemoTransfer(
  reference: string,
  transferReference: string,
) {
  const ledger = readLedger();
  const order = ledger.orders.find((o) => o.orderReference === reference);
  if (!order || order.paymentMethod !== "bank" || order.paymentState === "paid")
    throw new Error("This transfer cannot be changed.");
  if (!transferReference.trim())
    throw new Error("Enter your transfer reference.");
  order.transferReference = transferReference.trim();
  order.paymentState = "awaiting_verification";
  writeLedger(ledger);
}
