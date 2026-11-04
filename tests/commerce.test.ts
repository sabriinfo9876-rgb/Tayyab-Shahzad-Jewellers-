import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
class MemoryStorage {
  data = new Map<string, string>();
  fail = false;
  getItem(k: string) {
    return this.data.get(k) || null;
  }
  setItem(k: string, v: string) {
    if (this.fail) throw new Error("Quota");
    this.data.set(k, v);
  }
  removeItem(k: string) {
    this.data.delete(k);
  }
  clear() {
    this.data.clear();
  }
}
const storage = new MemoryStorage(),
  session = new MemoryStorage();
Object.assign(globalThis, {
  localStorage: storage,
  sessionStorage: session,
  window: new EventTarget(),
});
const { DemoStorage: s } = await import("../src/services/storage.ts");
const { DemoAccess: access, safeAdminDestination } =
  await import("../src/services/demoAccess.ts");
const {
  checkoutLines,
  totals,
  DEFAULT_CHECKOUT,
  productPrice,
  normalizePKPhone,
  validateProduct,
} = await import("../src/utils/commerce.ts");
const { placeDemoOrder, submitDemoTransfer } =
  await import("../src/services/checkoutService.ts");
const { readLedger } = await import("../src/services/demoLedger.ts");
function fixture() {
  const p = s.getProducts()[0];
  s.addToBag({
    productId: p.id,
    name: p.name,
    code: p.code,
    image: p.images[0],
    category: p.category,
    quantity: 1,
    selectedOptions: Object.fromEntries(
      (p.options || []).map((o) => [o.name, o.values[0]]),
    ),
  });
  const lines = checkoutLines(s.getBag(), s.getProducts(), s.getRates());
  return {
    p,
    lines,
    request: {
      key: "retry-key",
      address: {
        fullName: "Sample Customer",
        phone: "03001234567",
        address: "Sample 1",
        city: "Karachi",
        province: "Sindh",
      },
      method: "cod" as const,
      reviewedTotal: totals(lines, DEFAULT_CHECKOUT).total,
      reviewedLines: lines,
    },
  };
}
beforeEach(() => {
  storage.fail = false;
  storage.clear();
  session.clear();
});
test("Pakistani phone formats and redirect allowlist", () => {
  assert.equal(normalizePKPhone("0300-1234567"), "+923001234567");
  assert.equal(normalizePKPhone("+92 300 1234567"), "+923001234567");
  assert.equal(normalizePKPhone("123"), null);
  assert.equal(safeAdminDestination("//evil.test"), "/admin");
  assert.equal(safeAdminDestination("/admin/orders"), "/admin/orders");
});
test("owner permissions, expiry and logout are demo-only enforced at mutation boundary", () => {
  const p = s.getProducts()[0];
  assert.throws(() => s.saveProduct(p), /Owner/);
  access.enter("staff");
  assert.throws(() => s.saveProduct(p), /Owner/);
  access.enter("owner");
  s.saveProduct({ ...p, name: "Changed demo name" });
  assert.equal(s.getProducts()[0].name, "Changed demo name");
  session.setItem(
    "tsj_demo_session_v3",
    JSON.stringify({ role: "owner", expiresAt: 1 }),
  );
  assert.equal(access.get(), null);
  access.enter("owner");
  access.logout();
  assert.equal(access.get(), null);
});
test("price, quantity and gross/stone/net relationships are validated", () => {
  const p = s.getProducts()[0];
  assert.throws(() => validateProduct({ ...p, stockQuantity: -1 }));
  assert.throws(() => validateProduct({ ...p, stockQuantity: 1.5 }));
  assert.throws(() =>
    validateProduct({ ...p, grossWeightGrams: 1, stoneWeightGrams: 2 }),
  );
  assert.throws(() => validateProduct({ ...p, netWeightGrams: 99 }));
  assert.throws(() => validateProduct({ ...p, samplePricePKR: NaN }));
});
test("metal rate uses configured units and making/stone charges", () => {
  const p = s.getProducts()[0];
  const q = productPrice(
    {
      ...p,
      pricingMode: "metal_rate",
      karatPurity: "22K",
      netWeightGrams: 11.664,
      makingChargeType: "fixed",
      makingChargePKR: 1000,
      stoneChargePKR: 500,
    },
    s.getRates(),
  );
  const rate = s.getRates().rates.find((r) => r.metal.includes("22K"))!;
  assert.equal(q.total, rate.ratePKR + 1500);
  assert.throws(
    () =>
      productPrice(
        { ...p, pricingMode: "metal_rate", karatPurity: "19K" },
        s.getRates(),
      ),
    /No configured/,
  );
});
test("tax, delivery and discount are calculated consistently", () => {
  assert.deepEqual(
    totals([{ quantity: 2, unitPricePKR: 1000 } as any], {
      ...DEFAULT_CHECKOUT,
      taxPercent: 10,
      discountPKR: 100,
      deliveryFeePKR: 50,
    }),
    { subtotal: 2000, discount: 100, tax: 190, delivery: 50, total: 2140 },
  );
});
test("order commit snapshots prices, decreases stock once, clears bag only once and retries same key", () => {
  const f = fixture();
  const first = placeDemoOrder(f.request);
  const again = placeDemoOrder(f.request);
  assert.equal(first.orderReference, again.orderReference);
  assert.equal(readLedger().orders.length, 1);
  assert.equal(s.getBag().length, 0);
  assert.equal(
    s.getProductById(f.p.id)?.stockQuantity,
    (f.p.stockQuantity || 0) - 1,
  );
  assert.equal(first.paymentState, "cod_due");
  assert.equal(first.paymentStatus, "Pending");
  access.enter("owner");
  s.saveRates({
    ...s.getRates(),
    rates: s.getRates().rates.map((r) => ({ ...r, ratePKR: r.ratePKR + 999 })),
  });
  assert.equal(
    s.getOrderByReference(first.orderReference)?.agreedAmountPKR,
    first.agreedAmountPKR,
  );
});
test("insufficient stock and changed prices preserve the bag and create no order", () => {
  const f = fixture();
  access.enter("owner");
  s.saveProduct({ ...f.p, stockQuantity: 0 });
  assert.throws(() => placeDemoOrder(f.request), /Insufficient stock/);
  assert.equal(readLedger().orders.length, 0);
  assert.equal(s.getBag().length, 1);
  s.saveProduct({ ...f.p, samplePricePKR: 1 });
  assert.throws(() => placeDemoOrder(f.request), /changed/);
});
test("aggregate stock validation covers multiple variants of the same product", () => {
  const f = fixture();
  const item = s.getBag()[0];
  const option = Object.keys(item.selectedOptions)[0];
  const values = f.p.options?.[0].values || [];
  if (values.length > 1) {
    s.addToBag({
      ...item,
      selectedOptions: { ...item.selectedOptions, [option]: values[1] },
      quantity: f.p.stockQuantity || 1,
    });
    const lines = checkoutLines(s.getBag(), s.getProducts(), s.getRates());
    assert.throws(
      () =>
        placeDemoOrder({
          ...f.request,
          reviewedLines: lines,
          reviewedTotal: totals(lines, DEFAULT_CHECKOUT).total,
        }),
      /Insufficient stock/,
    );
  }
});
test("failed storage commit does not clear the bag or reserve stock", () => {
  const f = fixture();
  storage.fail = true;
  assert.throws(() => placeDemoOrder(f.request));
  storage.fail = false;
  assert.equal(s.getBag().length, 1);
  assert.equal(readLedger().orders.length, 0);
  assert.equal(s.getProductById(f.p.id)?.stockQuantity, f.p.stockQuantity);
});
test("bank transfer stays unverified until owner records a verified payment", () => {
  const f = fixture();
  access.enter("owner");
  s.saveSettings({
    ...s.getSettings(),
    checkout: {
      ...DEFAULT_CHECKOUT,
      bankEnabled: true,
      bankInstructions: "Sample reference instructions only",
    },
  });
  const order = placeDemoOrder({ ...f.request, method: "bank" });
  assert.equal(order.paymentState, "awaiting_transfer");
  submitDemoTransfer(order.orderReference, "SAMPLE-REF");
  assert.equal(
    s.getOrderByReference(order.orderReference)?.paymentState,
    "awaiting_verification",
  );
  assert.throws(() =>
    s.recordOrderPayment(order.orderReference, {
      amountPKR: order.agreedAmountPKR! + 1,
      date: new Date().toISOString(),
      method: "Bank Transfer (IBFT)",
    }),
  );
  s.recordOrderPayment(order.orderReference, {
    amountPKR: order.agreedAmountPKR!,
    date: new Date().toISOString(),
    method: "Bank Transfer (IBFT)",
    reference: "SAMPLE-REF",
  });
  assert.equal(
    s.getOrderByReference(order.orderReference)?.paymentStatus,
    "Paid",
  );
  assert.equal(
    s.getOrderByReference(order.orderReference)?.paymentState,
    "paid",
  );
  assert.equal(
    s.getOrderByReference(order.orderReference)?.fulfilmentStatus,
    "New",
  );
});
