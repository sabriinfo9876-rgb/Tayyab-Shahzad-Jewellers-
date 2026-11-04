export type ProductCategory = "necklaces" | "earrings" | "bangles" | "rings";

export type ProductDepartment =
  "Gold" | "Pakistani Chandi" | "Italian Designs" | "Bridal" | "Custom Orders";

export type ProductAvailability =
  "Made to Order" | "Available for Viewing" | "Design Consultation";

export interface Product {
  id: string;
  slug: string;
  code: string;
  name: string;
  category: ProductCategory;
  department: ProductDepartment;
  collections: string[];
  images: string[];
  description: string;
  specifications?: {
    metalPurity?: string; // Optional confirmed purity e.g. "22K Yellow Gold" or "925 Fine Silver"
    gemstones?: string; // e.g. "Polki stones & natural fresh water pearls"
    craftsmanship?: string; // e.g. "Traditional hand-meenakari and kundan setting"
    estimatedWeight?: string; // only if confirmed, otherwise empty
    finish?: string;
    [key: string]: string | undefined;
  };
  options?: {
    name: string; // e.g., "Size", "Karat Variant", "Finish Tone"
    values: string[];
  }[];
  availability: ProductAvailability;
  isEnquiryOnly: boolean;
  samplePricePKR?: number; // Optional demo illustrative rate/price
  stockQuantity?: number; // In-stock piece count (0 = Made to Order)
  grossWeightGrams?: number;
  stoneWeightGrams?: number;
  netWeightGrams?: number;
  makingChargeType?: "per_tola" | "per_gram" | "fixed";
  makingChargePKR?: number;
  karatPurity?: string;
  featured: boolean;
  published: boolean;
  isIllustrative: boolean;
  lowStockThreshold?: number;
  lifecycle?: "draft" | "active" | "archived";
  pricingMode?: "fixed" | "metal_rate";
  metal?: string;
  stoneChargePKR?: number;
  createdAt: string;
}

export interface CollectionMeta {
  id: string;
  name: string;
  slug: string;
  coverImage: string;
  description: string;
  productCount?: number;
  featured: boolean;
  displayOrder: number;
}

export interface BagItem {
  productId: string;
  code: string;
  name: string;
  image: string;
  category: string;
  quantity: number;
  selectedOptions: Record<string, string>;
  customerNotes?: string;
  unitPricePKR?: number;
  purity?: string;
  weightGrams?: number;
  metalValuePKR?: number;
  makingValuePKR?: number;
  stoneValuePKR?: number;
}

export type EnquiryStatus =
  | "new"
  | "contacted"
  | "quote_prepared"
  | "awaiting_approval"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface Enquiry {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  customerCity?: string;
  occasion?: string;
  targetDate?: string;
  notes?: string;
  items: BagItem[];
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
  sampleQuote?: {
    quotedAmountPKR: number;
    quoteValidityDays: number;
    quoteNotes?: string;
    preparedAt: string;
  };
}

export interface OrderConfirmationData {
  orderReference: string;
  enquiryReference: string;
  customerName: string;
  customerPhone: string;
  customerCity?: string;
  items: BagItem[];
  agreedAmountPKR?: number;
  confirmedDate: string;
  timeline: {
    status: string;
    date: string;
    description: string;
  }[];
  notes?: string;
}

export interface MetalRateItem {
  metal: string;
  purity: string;
  ratePKR: number;
  unit: string; // e.g. "per Tola", "per 10 Grams"
  source: string;
  effectiveDateTime: string; // Asia/Karachi time string
  isSampleDemoRate: boolean;
}

export interface MetalRatesData {
  rates: MetalRateItem[];
  lastUpdatedKarachi: string;
  disclaimer: string;
}

export interface StoreSettings {
  brandName: string;
  phone: string;
  internationalPhone: string;
  whatsappNumber: string;
  tiktokUrl: string;
  address?: string; // Optional - hidden if empty
  openingHours?: string; // Optional - hidden if empty
  announcementText: string;
  heroHeading: string;
  heroSubheading: string;
  heroDescription: string;
  heroImage: string;
  bridalEditorialHeading: string;
  bridalEditorialText: string;
  bridalEditorialImage: string;
  showAssistant: boolean;
  showMetalRates: boolean;
  currencySymbol?: string;
  goldPurityDefault?: string;
  checkout?: CheckoutConfiguration;
}

export interface ActivityLogItem {
  id: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface SEOMetadataConfig {
  [route: string]: {
    title: string;
    description: string;
    ogTitle?: string;
    ogDescription?: string;
  };
}

// ----------------------------------------------------
// Admin & Jewellery Management Extensions
// ----------------------------------------------------

export type PaymentStatus = "Paid" | "Partial" | "Pending";
export type FulfilmentStatus =
  | "New"
  | "In Production"
  | "Ready for Pickup"
  | "Dispatched"
  | "Delivered"
  | "Cancelled";

export interface OrderPayment {
  id: string;
  amountPKR: number;
  date: string;
  method:
    | "Cash / Sarafa Counter"
    | "Bank Transfer (IBFT)"
    | "Cheque"
    | "Advance Gold Deposit";
  reference?: string;
  note?: string;
}

export interface InternalOrderNote {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface AdminOrderRecord extends OrderConfirmationData {
  demoCheckout?: boolean;
  idempotencyKey?: string;
  deliveryAddress?: DeliveryAddress;
  paymentMethod?: "cod" | "bank";
  paymentState?: DemoPaymentState;
  transferReference?: string;
  bankInstructionsSnapshot?: string;
  deliveryEstimateSnapshot?: string;
  subtotalPKR?: number;
  deliveryPKR?: number;
  taxPKR?: number;
  discountPKR?: number;
  paidAmountPKR?: number;
  paymentStatus?: PaymentStatus;
  fulfilmentStatus?: FulfilmentStatus;
  promisedDate?: string;
  assignedKarigar?: string;
  payments?: OrderPayment[];
  internalNotes?: InternalOrderNote[];
}

export type CustomOrderStage =
  | "New Request"
  | "Quoted"
  | "Approved"
  | "In Production"
  | "Quality Check"
  | "Ready"
  | "Delivered";

export interface CustomOrderRecord {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  customerCity?: string;
  jewelleryType: string;
  metalPurity: string;
  karatCode: "24K" | "22K" | "21K" | "18K" | "925 Silver";
  estimatedWeightGrams: number;
  estimatedWeightTolas: number;
  quotedAmountPKR: number;
  depositPaidPKR: number;
  stage: CustomOrderStage;
  assignedKarigar: string;
  promisedDeliveryDate: string;
  notes: string;
  sampleSketchUrl?: string;
  size?: string;
  actualWeightGrams?: number;
  history?: { stage: CustomOrderStage; date: string; note: string }[];
  paymentHistory?: { amountPKR: number; date: string; note: string }[];
  stoneRequirements?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  city: string;
  preferredMetal: string;
  totalOrders: number;
  totalCustomOrders: number;
  totalSpendPKR: number;
  outstandingBalancePKR: number;
  notes: string;
  lastActive: string;
  createdAt: string;
}

export interface DeliveryAddress {
  fullName: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  instructions?: string;
}
export interface CheckoutConfiguration {
  deliveryFeePKR: number;
  taxPercent: number;
  discountPKR: number;
  codEnabled: boolean;
  codCities: string[];
  codMaxPKR: number;
  bankEnabled: boolean;
  bankInstructions: string;
  deliveryEstimate: string;
  postalCodeRequired: boolean;
}
export type DemoPaymentState =
  "cod_due" | "awaiting_transfer" | "awaiting_verification" | "paid" | "failed";
