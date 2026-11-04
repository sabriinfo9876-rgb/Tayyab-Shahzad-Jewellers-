import { DemoAccess } from "./demoAccess";
import { readLedger, writeLedger } from "./demoLedger";
import { validateProduct, exportRows } from "../utils/commerce";
import {
  Product,
  CollectionMeta,
  MetalRatesData,
  StoreSettings,
  Enquiry,
  OrderConfirmationData,
  SEOMetadataConfig,
  ActivityLogItem,
  BagItem,
  AdminOrderRecord,
  CustomOrderRecord,
  CustomerRecord,
  CustomOrderStage,
  FulfilmentStatus,
  OrderPayment,
} from "../types";
import {
  INITIAL_SETTINGS,
  INITIAL_COLLECTIONS,
  INITIAL_PRODUCTS,
  INITIAL_RATES_DATA,
  INITIAL_ENQUIRIES,
  INITIAL_ORDERS,
  INITIAL_CUSTOM_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_SEO,
} from "../data/seedData";

const STORAGE_KEYS = {
  SETTINGS: "tsj_demo_v2_settings",
  COLLECTIONS: "tsj_demo_v2_collections",
  PRODUCTS: "tsj_demo_v2_products",
  RATES: "tsj_demo_v2_rates",
  ENQUIRIES: "tsj_demo_v2_enquiries",
  ORDERS: "tsj_demo_v2_orders",
  CUSTOM_ORDERS: "tsj_demo_v2_custom_orders",
  CUSTOMERS: "tsj_demo_v2_customers",
  SEO: "tsj_demo_v2_seo",
  WISHLIST: "tsj_demo_v2_wishlist",
  BAG: "tsj_demo_v2_bag",
  ACTIVITY: "tsj_demo_v2_activity",
  ADMIN_AUTH: "tsj_demo_v2_admin_auth",
};

function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return structuredClone(defaultValue);
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Error reading key ${key} from storage:`, err);
    return structuredClone(defaultValue);
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("tsj-storage-updated"));
  } catch (err) {
    throw new Error(
      "Could not save demo records. Free browser storage or export a backup and try again.",
    );
  }
}

function persistOrders(orders: AdminOrderRecord[]) {
  const ledger = readLedger();
  ledger.orders = orders.filter((o) => o.demoCheckout);
  writeLedger(ledger);
  safeSet(
    STORAGE_KEYS.ORDERS,
    orders.filter((o) => !o.demoCheckout),
  );
}

export const DemoStorage = {
  // Settings
  getSettings(): StoreSettings {
    const settings = safeGet<StoreSettings>(
      STORAGE_KEYS.SETTINGS,
      INITIAL_SETTINGS,
    );
    // Auto-migrate to requested dummy number if still on previous number
    if (!settings.whatsappNumber) {
  settings.whatsappNumber = "923483498745";
  settings.phone = "0348-3498745";
  settings.internationalPhone = "+92 348 3498745";
  safeSet(STORAGE_KEYS.SETTINGS, settings);
    }
    return settings;
  },
  saveSettings(settings: StoreSettings): void {
    DemoAccess.requireOwner();
    const c = settings.checkout;
    if (
      c &&
      ([c.deliveryFeePKR, c.taxPercent, c.discountPKR, c.codMaxPKR].some(
        (v) => !Number.isFinite(v) || v < 0,
      ) ||
        c.taxPercent > 100 ||
        (c.bankEnabled && !c.bankInstructions.trim()))
    )
      throw new Error("Review delivery, tax and payment settings.");
    safeSet(STORAGE_KEYS.SETTINGS, settings);
    this.logActivity(
      "Settings updated",
      "Homepage copy or store parameters modified",
    );
  },

  // Collections
  getCollections(): CollectionMeta[] {
    return safeGet<CollectionMeta[]>(
      STORAGE_KEYS.COLLECTIONS,
      INITIAL_COLLECTIONS,
    );
  },
  saveCollections(collections: CollectionMeta[]): void {
    DemoAccess.requireOwner();
    safeSet(STORAGE_KEYS.COLLECTIONS, collections);
  },

  // Products
  getProducts(): Product[] {
    const defaultPrices: Record<
      string,
      {
        price: number;
        weight: string;
        gross: number;
        stone: number;
        karat: string;
        stock: number;
      }
    > = {
      "prod-01": {
        price: 215000,
        weight: "~4.2g",
        gross: 4.6,
        stone: 0.4,
        karat: "21K",
        stock: 5,
      },
      "prod-02": {
        price: 165000,
        weight: "~3.8g",
        gross: 4.2,
        stone: 0.4,
        karat: "18K",
        stock: 3,
      },
      "prod-03": {
        price: 185000,
        weight: "~4.5g",
        gross: 5.1,
        stone: 0.6,
        karat: "21K",
        stock: 4,
      },
      "prod-04": {
        price: 245000,
        weight: "~5.6g",
        gross: 6.2,
        stone: 0.6,
        karat: "21K",
        stock: 1,
      },
      "prod-05": {
        price: 340000,
        weight: "~8.2g",
        gross: 8.9,
        stone: 0.7,
        karat: "22K",
        stock: 3,
      },
      "prod-06": {
        price: 420000,
        weight: "~11.4g",
        gross: 12.0,
        stone: 0.6,
        karat: "925 Silver",
        stock: 6,
      },
      "prod-07": {
        price: 295000,
        weight: "~7.1g",
        gross: 7.8,
        stone: 0.7,
        karat: "18K",
        stock: 2,
      },
      "prod-08": {
        price: 195000,
        weight: "~3.9g",
        gross: 4.3,
        stone: 0.4,
        karat: "21K",
        stock: 2,
      },
      "prod-09": {
        price: 275000,
        weight: "~6.5g",
        gross: 7.2,
        stone: 0.7,
        karat: "22K",
        stock: 4,
      },
      "prod-10": {
        price: 890000,
        weight: "~28.4g",
        gross: 30.1,
        stone: 1.7,
        karat: "21K",
        stock: 3,
      },
      "prod-11": {
        price: 380000,
        weight: "~9.5g",
        gross: 10.3,
        stone: 0.8,
        karat: "22K",
        stock: 2,
      },
      "prod-12": {
        price: 1250000,
        weight: "~34.0g",
        gross: 36.5,
        stone: 2.5,
        karat: "22K",
        stock: 2,
      },
      "prod-13": {
        price: 1650000,
        weight: "~46.0g",
        gross: 49.2,
        stone: 3.2,
        karat: "22K",
        stock: 1,
      },
      "prod-14": {
        price: 185000,
        weight: "~14.2g",
        gross: 14.8,
        stone: 0.6,
        karat: "925 Silver",
        stock: 5,
      },
      "prod-15": {
        price: 2450000,
        weight: "~68.5g",
        gross: 76.0,
        stone: 7.5,
        karat: "22K",
        stock: 0,
      },
    };
    const list = safeGet<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    let changed = false;
    const enriched = list.map((p) => {
      const def = defaultPrices[p.id];
      if (
        def &&
        (p.samplePricePKR === undefined ||
          !p.specifications?.estimatedWeight ||
          p.stockQuantity === undefined)
      ) {
        changed = true;
        const gross = p.grossWeightGrams || def.gross;
        const stone =
          p.stoneWeightGrams !== undefined ? p.stoneWeightGrams : def.stone;
        const net = Number((gross - stone).toFixed(2));
        return {
          ...p,
          samplePricePKR: p.samplePricePKR ?? def.price,
          stockQuantity:
            p.stockQuantity !== undefined ? p.stockQuantity : def.stock,
          grossWeightGrams: gross,
          stoneWeightGrams: stone,
          netWeightGrams: p.netWeightGrams || net,
          karatPurity: p.karatPurity || def.karat,
          makingChargeType: p.makingChargeType || "per_tola",
          makingChargePKR: p.makingChargePKR || 18000,
          specifications: {
            ...p.specifications,
            estimatedWeight: p.specifications?.estimatedWeight || def.weight,
          },
        };
      }
      return p;
    });
    if (changed) {
      safeSet(STORAGE_KEYS.PRODUCTS, enriched);
    }
    const stock = readLedger().stock;
    return enriched.map((p) => ({
      ...p,
      ...(stock[p.id] !== undefined ? { stockQuantity: stock[p.id] } : {}),
    }));
  },
  getProductBySlug(slug: string): Product | undefined {
    return this.getProducts().find(
      (p) => p.slug === slug && p.published && p.lifecycle !== "archived",
    );
  },
  getProductById(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  },
  saveProduct(product: Product): void {
    DemoAccess.requireOwner();
    validateProduct(product);
    if (
      this.getProducts().some(
        (p) =>
          p.id !== product.id &&
          p.code.toLowerCase() === product.code.toLowerCase(),
      )
    )
      throw new Error("This SKU already exists.");
    const ledger = readLedger();
    if (ledger.stock[product.id] !== undefined) {
      ledger.stock[product.id] = product.stockQuantity ?? 0;
      writeLedger(ledger);
    }
    const products = this.getProducts();
    const idx = products.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      products[idx] = product;
      this.logActivity(
        "Product updated",
        `Updated ${product.name} (${product.code})`,
      );
    } else {
      products.unshift(product);
      this.logActivity(
        "Product created",
        `Created ${product.name} (${product.code})`,
      );
    }
    safeSet(STORAGE_KEYS.PRODUCTS, products);
  },
  archiveProduct(id: string): void {
    DemoAccess.requireOwner();
    const products = this.getProducts();
    const target = products.find((p) => p.id === id);
    if (target) {
      target.published = false;
      target.lifecycle = "archived";
      safeSet(STORAGE_KEYS.PRODUCTS, products);
      this.logActivity(
        "Product archived",
        `Archived ${target.name} (${target.code})`,
      );
    }
  },

  // Metal Rates
  getRates(): MetalRatesData {
    return safeGet<MetalRatesData>(STORAGE_KEYS.RATES, INITIAL_RATES_DATA);
  },
  saveRates(ratesData: MetalRatesData): void {
    DemoAccess.requireOwner();
    if (
      ratesData.rates.some((r) => !Number.isFinite(r.ratePKR) || r.ratePKR <= 0)
    )
      throw new Error("Rates must be positive values.");
    ratesData.rates = ratesData.rates.map((r) => ({
      ...r,
      source: "Manually entered demo rate",
      isSampleDemoRate: true,
    }));
    safeSet(STORAGE_KEYS.RATES, ratesData);
    this.logActivity(
      "Rates updated",
      `Metal rates modified (Effective: ${ratesData.lastUpdatedKarachi})`,
    );
  },

  // Enquiries
  getEnquiries(): Enquiry[] {
    return safeGet<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
  },
  getEnquiryByReference(ref: string): Enquiry | undefined {
    return this.getEnquiries().find(
      (e) => e.reference.toUpperCase() === ref.toUpperCase(),
    );
  },
  saveEnquiry(enquiry: Enquiry): void {
    const enquiries = this.getEnquiries();
    const idx = enquiries.findIndex((e) => e.id === enquiry.id);
    if (idx >= 0) {
      enquiries[idx] = enquiry;
    } else {
      enquiries.unshift(enquiry);
    }
    safeSet(STORAGE_KEYS.ENQUIRIES, enquiries);
    if (enquiry.id.startsWith("enq-bespoke-")) {
      const list = this.getCustomOrders();
      if (!list.some((c) => c.reference === enquiry.reference)) {
        const options = enquiry.items[0]?.selectedOptions || {};
        const metal = options["Metal Purity"] || "To be confirmed";
        list.unshift({
          id: "custom-" + enquiry.id,
          reference: enquiry.reference,
          customerName: enquiry.customerName,
          customerPhone: enquiry.customerPhone,
          customerCity: enquiry.customerCity,
          jewelleryType: enquiry.items[0]?.name || "Custom jewellery request",
          metalPurity: metal,
          karatCode: metal.includes("925")
            ? "925 Silver"
            : metal.includes("18K")
              ? "18K"
              : metal.includes("21K")
                ? "21K"
                : "22K",
          estimatedWeightGrams: 0,
          estimatedWeightTolas: 0,
          quotedAmountPKR: 0,
          depositPaidPKR: 0,
          stage: "New Request",
          assignedKarigar: "Unassigned",
          promisedDeliveryDate: enquiry.targetDate || "",
          notes: enquiry.notes || "",
          sampleSketchUrl: enquiry.items[0]?.image,
          stoneRequirements: options["Stone Work"],
          history: [
            {
              stage: "New Request",
              date: enquiry.createdAt,
              note: "Sample storefront request received",
            },
          ],
          createdAt: enquiry.createdAt,
          updatedAt: enquiry.updatedAt,
        });
        safeSet(STORAGE_KEYS.CUSTOM_ORDERS, list);
      }
    }
    this.logActivity(
      "Enquiry recorded",
      `Reference ${enquiry.reference} by ${enquiry.customerName}`,
    );
  },

  // Orders
  getOrders(): AdminOrderRecord[] {
    const list = safeGet<AdminOrderRecord[]>(
      STORAGE_KEYS.ORDERS,
      INITIAL_ORDERS,
    );
    return [...readLedger().orders, ...list];
  },
  getOrderByReference(ref: string): AdminOrderRecord | undefined {
    return this.getOrders().find(
      (o) => o.orderReference.toUpperCase() === ref.toUpperCase(),
    );
  },
  saveOrder(order: AdminOrderRecord): void {
    DemoAccess.requireOwner();
    if (
      !Number.isFinite(order.agreedAmountPKR ?? 0) ||
      (order.agreedAmountPKR ?? 0) < 0 ||
      !Number.isFinite(order.paidAmountPKR ?? 0) ||
      (order.paidAmountPKR ?? 0) < 0 ||
      (order.paidAmountPKR ?? 0) > (order.agreedAmountPKR ?? 0)
    )
      throw new Error("Review order totals and payments.");
    const orders = this.getOrders();
    const idx = orders.findIndex(
      (o) => o.orderReference === order.orderReference,
    );
    if (idx >= 0) {
      orders[idx] = order;
    } else {
      orders.unshift(order);
    }
    persistOrders(orders);
    this.logActivity(
      "Order updated",
      `Ref: ${order.orderReference} for ${order.customerName}`,
    );
  },
  updateOrderStatus(orderRef: string, status: FulfilmentStatus): void {
    DemoAccess.requireOwner();
    const orders = this.getOrders();
    const target = orders.find((o) => o.orderReference === orderRef);
    if (target) {
      target.fulfilmentStatus = status;
      target.timeline = target.timeline || [];
      target.timeline.push({
        status: `Status: ${status}`,
        date: new Date().toISOString().split("T")[0],
        description: `Fulfilment status updated to ${status}`,
      });
      persistOrders(orders);
      this.logActivity(
        "Order status updated",
        `${orderRef} marked as ${status}`,
      );
    }
  },
  recordOrderPayment(
    orderRef: string,
    payment: Omit<OrderPayment, "id">,
  ): void {
    DemoAccess.requireOwner();
    const orders = this.getOrders();
    const target = orders.find((o) => o.orderReference === orderRef);
    if (target) {
      const balance =
        (target.agreedAmountPKR || 0) - (target.paidAmountPKR || 0);
      if (
        !Number.isFinite(payment.amountPKR) ||
        payment.amountPKR <= 0 ||
        payment.amountPKR > balance
      )
        throw new Error(
          "Payment must be positive and cannot exceed the outstanding balance.",
        );
      if (target.fulfilmentStatus === "Cancelled")
        throw new Error("Cannot record a payment against a cancelled order.");
      const fullPayment: OrderPayment = {
        id: "pay-" + Date.now().toString(36),
        ...payment,
      };
      target.payments = target.payments || [];
      target.payments.push(fullPayment);
      const totalPaid =
        Math.round(((target.paidAmountPKR || 0) + payment.amountPKR) * 100) /
        100;
      target.paidAmountPKR = totalPaid;
      const totalAmount = target.agreedAmountPKR || 0;
      if (totalPaid >= totalAmount) {
        target.paymentStatus = "Paid";
        if (target.demoCheckout) target.paymentState = "paid";
      } else if (totalPaid > 0) {
        target.paymentStatus = "Partial";
      } else {
        target.paymentStatus = "Pending";
      }
      persistOrders(orders);
      this.logActivity(
        "Payment recorded",
        `PKR ${payment.amountPKR.toLocaleString()} recorded for ${orderRef}`,
      );
    }
  },
  addOrderNote(
    orderRef: string,
    text: string,
    author: string = "Tayyab Shahzad",
  ): void {
    DemoAccess.requireOwner();
    const orders = this.getOrders();
    const target = orders.find((o) => o.orderReference === orderRef);
    if (target) {
      target.internalNotes = target.internalNotes || [];
      target.internalNotes.push({
        id: "nt-" + Date.now().toString(36),
        author,
        text,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      });
      persistOrders(orders);
      this.logActivity(
        "Note added",
        `Internal note added to order ${orderRef}`,
      );
    }
  },
  updateOrderKarigar(orderRef: string, karigar: string): void {
    DemoAccess.requireOwner();
    const orders = this.getOrders();
    const target = orders.find((o) => o.orderReference === orderRef);
    if (target) {
      target.assignedKarigar = karigar;
      persistOrders(orders);
      this.logActivity(
        "Karigar reassigned",
        `${orderRef} assigned to ${karigar}`,
      );
    }
  },

  // Custom Orders
  getCustomOrders(): CustomOrderRecord[] {
    return safeGet<CustomOrderRecord[]>(
      STORAGE_KEYS.CUSTOM_ORDERS,
      INITIAL_CUSTOM_ORDERS,
    );
  },
  getCustomOrderById(id: string): CustomOrderRecord | undefined {
    return this.getCustomOrders().find(
      (o) => o.id === id || o.reference === id,
    );
  },
  saveCustomOrder(order: CustomOrderRecord): void {
    DemoAccess.requireOwner();
    if (
      !Number.isFinite(order.quotedAmountPKR) ||
      order.quotedAmountPKR < 0 ||
      !Number.isFinite(order.depositPaidPKR) ||
      order.depositPaidPKR < 0 ||
      order.depositPaidPKR > order.quotedAmountPKR ||
      order.estimatedWeightGrams < 0 ||
      (order.actualWeightGrams ?? 0) < 0
    )
      throw new Error("Review quotation, deposit and weight values.");
    const orders = this.getCustomOrders();
    const idx = orders.findIndex((o) => o.id === order.id);
    if (idx >= 0) {
      orders[idx] = { ...order, updatedAt: new Date().toISOString() };
    } else {
      orders.unshift({
        ...order,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    safeSet(STORAGE_KEYS.CUSTOM_ORDERS, orders);
    this.logActivity(
      "Custom commission updated",
      `${order.reference} (${order.customerName})`,
    );
  },
  updateCustomOrderStage(idOrRef: string, stage: CustomOrderStage): void {
    DemoAccess.requireOwner();
    const orders = this.getCustomOrders();
    const target = orders.find(
      (o) => o.id === idOrRef || o.reference === idOrRef,
    );
    if (target) {
      target.history = [
        ...(target.history || []),
        {
          stage,
          date: new Date().toISOString(),
          note: "Stage updated in owner demo",
        },
      ];
      target.stage = stage;
      target.updatedAt = new Date().toISOString();
      safeSet(STORAGE_KEYS.CUSTOM_ORDERS, orders);
      this.logActivity(
        "Custom stage updated",
        `${target.reference} advanced to ${stage}`,
      );
    }
  },

  // Customers
  getCustomers(): CustomerRecord[] {
    const customers = safeGet<CustomerRecord[]>(
      STORAGE_KEYS.CUSTOMERS,
      INITIAL_CUSTOMERS,
    );
    const orders = this.getOrders();
    const custom = this.getCustomOrders();
    for (const o of orders) {
      if (
        !customers.some(
          (c) =>
            c.phone.replace(/\D/g, "").slice(-10) ===
            o.customerPhone.replace(/\D/g, "").slice(-10),
        )
      )
        customers.push({
          id: "customer-" + o.customerPhone.replace(/\D/g, ""),
          name: o.customerName,
          phone: o.customerPhone,
          city: o.customerCity || "",
          preferredMetal: "",
          totalOrders: 0,
          totalCustomOrders: 0,
          totalSpendPKR: 0,
          outstandingBalancePKR: 0,
          notes: "Demo checkout customer",
          lastActive: o.confirmedDate,
          createdAt: o.confirmedDate,
        });
    }
    return customers.map((c) => {
      const phone = c.phone.replace(/\D/g, "").slice(-10);
      const os = orders.filter(
        (o) => o.customerPhone.replace(/\D/g, "").slice(-10) === phone,
      );
      const cs = custom.filter(
        (o) => o.customerPhone.replace(/\D/g, "").slice(-10) === phone,
      );
      return {
        ...c,
        totalOrders: os.length,
        totalCustomOrders: cs.length,
        totalSpendPKR: os
          .filter((o) => o.fulfilmentStatus !== "Cancelled")
          .reduce((s, o) => s + (o.agreedAmountPKR || 0), 0),
        outstandingBalancePKR:
          os
            .filter((o) => o.fulfilmentStatus !== "Cancelled")
            .reduce(
              (s, o) =>
                s +
                Math.max(0, (o.agreedAmountPKR || 0) - (o.paidAmountPKR || 0)),
              0,
            ) +
          cs.reduce(
            (s, o) => s + Math.max(0, o.quotedAmountPKR - o.depositPaidPKR),
            0,
          ),
      };
    });
  },
  getCustomerById(id: string): CustomerRecord | undefined {
    return this.getCustomers().find((c) => c.id === id);
  },
  saveCustomer(customer: CustomerRecord): void {
    DemoAccess.requireOwner();
    const list = this.getCustomers();
    const idx = list.findIndex((c) => c.id === customer.id);
    if (idx >= 0) {
      list[idx] = customer;
    } else {
      list.unshift(customer);
    }
    safeSet(STORAGE_KEYS.CUSTOMERS, list);
    this.logActivity("Customer saved", `${customer.name} profile updated`);
  },

  // CSV Export utility
  exportCSV(
    type: "orders" | "inventory" | "customers" | "custom_orders",
  ): void {
    DemoAccess.requireOwner();
    let rows: Record<string, any>[] = [];
    const filename = `TSJ-${type}-${new Date().toISOString().split("T")[0]}.csv`;

    if (type === "orders") {
      const orders = this.getOrders();
      rows = orders.map((o) => ({
        "Order Reference": o.orderReference,
        "Customer Name": o.customerName,
        Phone: o.customerPhone,
        City: o.customerCity || "",
        "Confirmed Date": o.confirmedDate,
        "Promised Delivery": o.promisedDate || "",
        "Total Amount PKR": o.agreedAmountPKR || 0,
        "Paid Amount PKR": o.paidAmountPKR || 0,
        "Outstanding Balance PKR":
          (o.agreedAmountPKR || 0) - (o.paidAmountPKR || 0),
        "Payment Status": o.paymentStatus || "Pending",
        "Fulfilment Status": o.fulfilmentStatus || "New",
        "Assigned Karigar": o.assignedKarigar || "Unassigned",
        "Item Count": o.items.length,
      }));
    } else if (type === "inventory") {
      const products = this.getProducts();
      rows = products.map((p) => ({
        "Code / SKU": p.code,
        "Product Name": p.name,
        Category: p.category,
        Department: p.department,
        "Metal & Purity":
          p.karatPurity || p.specifications?.metalPurity || "21K",
        "Gross Weight (g)": p.grossWeightGrams || 0,
        "Net Gold Weight (g)": p.netWeightGrams || 0,
        "Net Weight (Tolas)": p.netWeightGrams
          ? (p.netWeightGrams / 11.664).toFixed(3)
          : 0,
        "Sample Price PKR": p.samplePricePKR || 0,
        "Stock Quantity": p.stockQuantity ?? 0,
        Status: (p.stockQuantity ?? 0) > 0 ? "In Stock" : "Made to Order",
        Published: p.published ? "Yes" : "No",
      }));
    } else if (type === "custom_orders") {
      const custom = this.getCustomOrders();
      rows = custom.map((c) => ({
        Reference: c.reference,
        "Customer Name": c.customerName,
        Phone: c.customerPhone,
        City: c.customerCity || "",
        "Jewellery Type": c.jewelleryType,
        "Metal Purity": c.metalPurity,
        Karat: c.karatCode,
        "Est Weight (g)": c.estimatedWeightGrams,
        "Est Weight (Tolas)": c.estimatedWeightTolas,
        "Quoted Amount PKR": c.quotedAmountPKR,
        "Deposit Paid PKR": c.depositPaidPKR,
        "Remaining Balance PKR": c.quotedAmountPKR - c.depositPaidPKR,
        Stage: c.stage,
        "Assigned Karigar": c.assignedKarigar,
        "Promised Delivery Date": c.promisedDeliveryDate,
      }));
    } else if (type === "customers") {
      const customers = this.getCustomers();
      rows = customers.map((c) => ({
        "Customer ID": c.id,
        Name: c.name,
        Phone: c.phone,
        City: c.city,
        "Preferred Metal": c.preferredMetal,
        "Total Orders": c.totalOrders,
        "Total Custom Commissions": c.totalCustomOrders,
        "Total Spend PKR": c.totalSpendPKR,
        "Outstanding Balance PKR": c.outstandingBalancePKR,
        "Client Notes": c.notes,
        "Last Active": c.lastActive,
      }));
    }

    exportRows(filename, rows, rows.length ? undefined : ["No records"]);
  },

  // Wishlist
  getWishlist(): string[] {
    return safeGet<string[]>(STORAGE_KEYS.WISHLIST, ["prod-01", "prod-03"]);
  },
  toggleWishlist(productId: string): boolean {
    const list = this.getWishlist();
    const exists = list.includes(productId);
    let updated: string[];
    if (exists) {
      updated = list.filter((id) => id !== productId);
    } else {
      updated = [...list, productId];
    }
    safeSet(STORAGE_KEYS.WISHLIST, updated);
    return !exists;
  },

  // Enquiry Bag
  getBag(): BagItem[] {
    return safeGet<BagItem[]>(STORAGE_KEYS.BAG, []);
  },
  getBagTotalCount(): number {
    return this.getBag().reduce((sum, item) => sum + item.quantity, 0);
  },
  addToBag(item: BagItem): void {
    const bag = this.getBag();
    // match on productId + stringified options
    const matchIndex = bag.findIndex(
      (b) =>
        b.productId === item.productId &&
        JSON.stringify(b.selectedOptions) ===
          JSON.stringify(item.selectedOptions),
    );
    if (matchIndex >= 0) {
      bag[matchIndex].quantity += item.quantity;
      if (item.customerNotes) {
        bag[matchIndex].customerNotes = item.customerNotes;
      }
    } else {
      bag.push(item);
    }
    safeSet(STORAGE_KEYS.BAG, bag);
  },
  updateBagQuantity(index: number, quantity: number): void {
    const bag = this.getBag();
    if (quantity <= 0) {
      bag.splice(index, 1);
    } else if (bag[index]) {
      bag[index].quantity = quantity;
    }
    safeSet(STORAGE_KEYS.BAG, bag);
  },
  removeFromBag(index: number): void {
    const bag = this.getBag();
    bag.splice(index, 1);
    safeSet(STORAGE_KEYS.BAG, bag);
  },
  clearBag(): void {
    safeSet(STORAGE_KEYS.BAG, []);
  },

  // SEO Config
  getSEO(): SEOMetadataConfig {
    return safeGet<SEOMetadataConfig>(STORAGE_KEYS.SEO, INITIAL_SEO);
  },
  saveSEO(seoConfig: SEOMetadataConfig): void {
    DemoAccess.requireOwner();
    safeSet(STORAGE_KEYS.SEO, seoConfig);
    this.logActivity(
      "SEO configuration updated",
      "Route metadata modified in admin preview",
    );
  },

  // Admin Auth Flag (Demo presentation access flag, explicitly documented as demo preview)
  isAdminLoggedIn(): boolean {
    return !!DemoAccess.get();
  },
  setAdminLoggedIn(status: boolean): void {
    if (!status) DemoAccess.logout();
  },

  // Activity Log
  getActivityLog(): ActivityLogItem[] {
    return safeGet<ActivityLogItem[]>(STORAGE_KEYS.ACTIVITY, [
      {
        id: "act-init",
        action: "Demo initialized",
        details:
          "Loaded authentic Tayyab Shahzad Jewellers catalogue and settings",
        timestamp: new Date().toISOString(),
      },
    ]);
  },
  logActivity(action: string, details: string): void {
    const logs = this.getActivityLog();
    logs.unshift({
      id: "act-" + Date.now().toString(36),
      action,
      details,
      timestamp: new Date().toISOString(),
    });
    // keep max 50 items
    safeSet(STORAGE_KEYS.ACTIVITY, logs.slice(0, 50));
  },

  // Export & Import & Reset
  exportAllData(): string {
    DemoAccess.requireOwner();
    const data = {
      version: "2.0",
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      collections: this.getCollections(),
      products: this.getProducts(),
      rates: this.getRates(),
      enquiries: this.getEnquiries(),
      orders: this.getOrders(),
      customOrders: this.getCustomOrders(),
      customers: this.getCustomers(),
      seo: this.getSEO(),
      activity: this.getActivityLog(),
      checkoutLedger: readLedger(),
    };
    return JSON.stringify(data, null, 2);
  },

  importData(jsonString: string): { success: boolean; message: string } {
    DemoAccess.requireOwner();
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== "object") {
        return { success: false, message: "Invalid JSON payload format." };
      }
      if (parsed.settings) safeSet(STORAGE_KEYS.SETTINGS, parsed.settings);
      if (Array.isArray(parsed.products))
        safeSet(STORAGE_KEYS.PRODUCTS, parsed.products);
      if (Array.isArray(parsed.collections))
        safeSet(STORAGE_KEYS.COLLECTIONS, parsed.collections);
      if (parsed.rates) safeSet(STORAGE_KEYS.RATES, parsed.rates);
      if (Array.isArray(parsed.enquiries))
        safeSet(STORAGE_KEYS.ENQUIRIES, parsed.enquiries);
      if (Array.isArray(parsed.orders)) {
        safeSet(
          STORAGE_KEYS.ORDERS,
          parsed.orders.filter((o: AdminOrderRecord) => !o.demoCheckout),
        );
        if (parsed.checkoutLedger) writeLedger(parsed.checkoutLedger);
      }
      if (Array.isArray(parsed.customOrders))
        safeSet(STORAGE_KEYS.CUSTOM_ORDERS, parsed.customOrders);
      if (Array.isArray(parsed.customers))
        safeSet(STORAGE_KEYS.CUSTOMERS, parsed.customers);
      if (parsed.seo) safeSet(STORAGE_KEYS.SEO, parsed.seo);

      this.logActivity("Data imported", "Imported validated demo records");
      return {
        success: true,
        message: "Demo data imported successfully into this browser.",
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Import error: ${err.message || "Unrecognized JSON"}`,
      };
    }
  },

  resetAll(): void {
    DemoAccess.requireOwner();
    localStorage.removeItem("tsj_demo_checkout_v1");
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    safeSet(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    safeSet(STORAGE_KEYS.COLLECTIONS, INITIAL_COLLECTIONS);
    safeSet(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    safeSet(STORAGE_KEYS.RATES, INITIAL_RATES_DATA);
    safeSet(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
    safeSet(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    safeSet(STORAGE_KEYS.CUSTOM_ORDERS, INITIAL_CUSTOM_ORDERS);
    safeSet(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    safeSet(STORAGE_KEYS.SEO, INITIAL_SEO);
    this.logActivity(
      "Demo reset",
      "Re-initialized all default catalogue records",
    );
  },
};
