import test from "node:test";
import assert from "node:assert/strict";
import {
  generateReferenceCode,
  buildProductWhatsAppUrl,
  buildBagWhatsAppUrl,
  buildCustomOrderWhatsAppUrl,
  filterProducts,
  getNextPossibleStatuses,
} from "./rules";
import { Product, BagItem } from "../types";

test("generateReferenceCode formats ENQ and ORD correctly", () => {
  const enqRef = generateReferenceCode("ENQ", 1234);
  assert.match(enqRef, /^TSJ-ENQ-[0-9A-Z]+-[0-9A-Z]+$/);

  const ordRef = generateReferenceCode("ORD", 5678);
  assert.match(ordRef, /^TSJ-ORD-[0-9A-Z]+-[0-9A-Z]+$/);
});

test("buildProductWhatsAppUrl constructs valid wa.me URI with encoded text", () => {
  const url = buildProductWhatsAppUrl(
    { name: "Kundan Choker", code: "TSJ-NK-01" },
    { "Karat Variant": "22K Gold" },
    1,
    "92312345678",
  );
  assert.ok(url.startsWith("https://wa.me/92312345678?text="));
  assert.ok(url.includes("Kundan%20Choker"));
  assert.ok(url.includes("TSJ-NK-01"));
  assert.ok(url.includes("22K%20Gold"));
});

test("buildBagWhatsAppUrl lists bag items and customer name", () => {
  const items: BagItem[] = [
    {
      productId: "p1",
      code: "TSJ-RG-01",
      name: "Polki Statement Ring",
      image: "/img.jpg",
      category: "rings",
      quantity: 2,
      selectedOptions: { Size: "16" },
    },
  ];
  const url = buildBagWhatsAppUrl(
    items,
    { name: "Amina Khan", phone: "03001234567", city: "Lahore" },
    "TSJ-ENQ-1234",
  );
  assert.ok(url.includes("Amina%20Khan"));
  assert.ok(url.includes("Lahore"));
  assert.ok(url.includes("Polki%20Statement%20Ring"));
  assert.ok(url.includes("TSJ-ENQ-1234"));
});

test("buildCustomOrderWhatsAppUrl formats custom request details", () => {
  const url = buildCustomOrderWhatsAppUrl(
    {
      jewelleryType: "Bridal Set",
      preferredMaterial: "22K Gold & Emeralds",
      occasion: "Barat",
      description: "Traditional Mughal aesthetic with pearls",
      approxBudget: "PKR 800,000 - 1,200,000",
      name: "Zainab Ahmed",
      phone: "03451122334",
    },
    "TSJ-CUST-999",
  );

  assert.ok(url.includes("Zainab%20Ahmed"));
  assert.ok(url.includes("Barat"));
  assert.ok(url.includes("Mughal"));
});

test("filterProducts filters by search query and category", () => {
  const sampleProducts: Product[] = [
    {
      id: "1",
      slug: "gulbahar-necklace",
      code: "TSJ-NK-01",
      name: "Gulbahar Kundan Necklace",
      category: "necklaces",
      department: "Bridal",
      collections: ["bridal"],
      images: ["/img1.jpg"],
      description: "Handcrafted floral kundan necklace with pearl drops",
      availability: "Made to Order",
      isEnquiryOnly: true,
      featured: true,
      published: true,
      isIllustrative: true,
      createdAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "2",
      slug: "chandi-payal",
      code: "TSJ-CH-01",
      name: "Pakistani Chandi Silver Payal",
      category: "bangles",
      department: "Pakistani Chandi",
      collections: ["pakistani-chandi"],
      images: ["/img2.jpg"],
      description: "Pure 925 silver ghungroo payal",
      availability: "Available for Viewing",
      isEnquiryOnly: true,
      featured: false,
      published: true,
      isIllustrative: true,
      createdAt: "2026-01-02T00:00:00Z",
    },
  ];

  const searchResults = filterProducts(sampleProducts, { search: "Gulbahar" });
  assert.equal(searchResults.length, 1);
  assert.equal(searchResults[0].code, "TSJ-NK-01");

  const chandiResults = filterProducts(sampleProducts, {
    department: "Pakistani Chandi",
  });
  assert.equal(chandiResults.length, 1);
  assert.equal(chandiResults[0].slug, "chandi-payal");
});

test("getNextPossibleStatuses returns ordered next status or cancel", () => {
  const nextForNew = getNextPossibleStatuses("new");
  assert.deepEqual(nextForNew, ["contacted", "cancelled"]);

  const nextForQuote = getNextPossibleStatuses("quote_prepared");
  assert.deepEqual(nextForQuote, ["awaiting_approval", "cancelled"]);

  const nextForCompleted = getNextPossibleStatuses("completed");
  assert.deepEqual(nextForCompleted, []);
});
