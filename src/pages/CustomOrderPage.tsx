import { normalizePKPhone } from "../utils/commerce";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Upload,
  MessageCircle,
  Check,
  FileText,
  Image as ImageIcon,
  X,
  ShieldCheck,
  Award,
  Layers,
  Crown,
  Gem,
  Calendar,
  Phone,
  ArrowRight,
  Clock,
  CheckCircle2,
  Share2,
  Printer,
} from "lucide-react";
import { DemoStorage } from "../services/storage";
import {
  generateReferenceCode,
  buildCustomOrderWhatsAppUrl,
} from "../utils/rules";
import { TsjLogo } from "../components/common/TsjLogo";

export const CustomOrderPage: React.FC = () => {
  const settings = DemoStorage.getSettings();

  const [jewelleryType, setJewelleryType] = useState(
    "Imperial Bridal Suite (Haar, Choker & Jhumkas)",
  );
  const [preferredMaterial, setPreferredMaterial] = useState(
    "22K Fine Bridal Gold (91.6% Purity)",
  );
  const [gemstonePreference, setGemstonePreference] = useState(
    "Mughal Kundan Jadau with Natural Basra Pearls",
  );
  const [approxBudget, setApproxBudget] = useState(
    "PKR 1,000,000 – 2,500,000 (Complete Bridal Set)",
  );
  const [occasion, setOccasion] = useState("Barat Wedding Celebration");
  const [targetDate, setTargetDate] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  // Local image preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submittedReference, setSubmittedReference] = useState<string | null>(
    null,
  );

  const jewelleryCategories = [
    {
      id: "bridal-suite",
      label: "Imperial Bridal Suite",
      desc: "Haar, Choker, Jhumkas, Matha Patti & Nath",
      image: "/images/hero-bridal.webp",
      badge: "Bridal Heirloom",
    },
    {
      id: "choker-set",
      label: "Royal Kundan Choker",
      desc: "Fitted neckline masterpiece with pearls",
      image: "/images/15-illustrative-bridal-detail.webp",
      badge: "Heritage Setting",
    },
    {
      id: "nakshi-bangles",
      label: "Nakshi Bangles / Kada Pair",
      desc: "Handcrafted floral filigree & screw locks",
      image: "/images/10-floral-bangle-trio.webp",
      badge: "Solid Goldwork",
    },
    {
      id: "solitaire-ring",
      label: "Solitaire & Polki Ring",
      desc: "Custom cut stone, micro-prongs & ornate gallery",
      image: "/images/08-rose-solitaire-ring.webp",
      badge: "Custom Sized",
    },
    {
      id: "italian-designs",
      label: "Italian Mesh / Chain Suite",
      desc: "Contemporary flexible links & modern luxury",
      image: "/images/05-swirl-pendant-set.webp",
      badge: "18K/21K European",
    },
    {
      id: "pakistani-chandi",
      label: "Pakistani Chandi Suite (925)",
      desc: "Pure silver bridal sets with 24K gold vermeil",
      image: "/images/14-illustrative-jhumkas.webp",
      badge: "Pure Silver",
    },
  ];

  const metalOptions = [
    {
      label: "22K Fine Bridal Gold (91.6% Purity)",
      desc: "The traditional standard for Pakistani bridal jewellery; rich imperial luster and supreme heirloom value.",
    },
    {
      label: "21K Hallmarked Gold (87.5% Purity)",
      desc: "The benchmark standard for durable bridal sets, daily jewellery, bangles, and Italian design chains.",
    },
    {
      label: "Pakistani Chandi (Pure 925 Solid Silver)",
      desc: "Pure hallmarked silver with durable 24K real gold vermeil wash. Affordable royal splendour.",
    },
    {
      label: "18K Italian Alloy (75.0% Purity)",
      desc: "Modern European alloy available in high-polish yellow, rose, or rhodium white finish.",
    },
  ];

  const gemstoneOptions = [
    {
      title: "Mughal Kundan Jadau with Natural Basra Pearls",
      desc: "Handset 24K gold foil backed stones with seed pearl drops.",
    },
    {
      title: "Heritage Uncut Polki with Royal Meenakari",
      desc: "Natural polki facets with vibrant Persian enamel artwork on reverse.",
    },
    {
      title: "Swat Emerald & Burmese Ruby Accents",
      desc: "Precious green emeralds and pigeon-blood rubies set in custom bezels.",
    },
    {
      title: "Diamond-Grade Moissanite & Solitaires",
      desc: "VVS clarity brilliant-cut stones with supreme fire and brilliance.",
    },
    {
      title: "Solid Goldwork Only (Nakshi / Chased Filigree)",
      desc: "Pure metal craft with traditional die-punching and hand chasing without stones.",
    },
  ];

  const budgetRanges = [
    {
      range: "PKR 250,000 – 500,000",
      tag: "Pakistani Chandi Suites or Lightweight Gold Kadas & Rings",
    },
    {
      range: "PKR 500,000 – 1,000,000",
      tag: "Fine Gold Necklaces, Bangle Pairs, or Choker Sets",
    },
    {
      range: "PKR 1,000,000 – 2,500,000",
      tag: "Complete Traditional Bridal Haar, Choker & Earring Sets",
    },
    {
      range: "PKR 2,500,000 – 5,000,000+",
      tag: "Imperial High-Jewellery Heirlooms with Heavy Tola Gold Weights",
    },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Please choose an image under 5MB for preview.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const whatsappNum = settings.whatsappNumber || "92312345678";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !normalizePKPhone(phone) || !description.trim()) {
      alert(
        "Please fill out your name, contact phone number, and brief description.",
      );
      return;
    }

    const ref = generateReferenceCode("ENQ");

    DemoStorage.saveEnquiry({
      id: "enq-bespoke-" + Date.now().toString(36),
      reference: ref,
      customerName: name.trim(),
      customerPhone: phone.trim(),
      customerCity: city.trim() || undefined,
      occasion: occasion.trim() || undefined,
      targetDate: targetDate || undefined,
      notes: `[TSJ Bespoke Consultation Dossier]\nType: ${jewelleryType}\nMetal: ${preferredMaterial}\nGemstones: ${gemstonePreference}\nBudget: ${approxBudget}\nClient Brief: ${description}`,
      items: [
        {
          productId: "prod-12",
          code: "TSJ-BESPOKE",
          name: `Bespoke Creation: ${jewelleryType}`,
          image: imagePreview || "/images/hero-bridal.webp",
          category: "necklaces",
          quantity: 1,
          selectedOptions: {
            "Metal Purity": preferredMaterial,
            "Stone Work": gemstonePreference,
            Occasion: occasion,
            "Target Budget": approxBudget,
          },
          customerNotes: description,
        },
      ],
      status: "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setSubmittedReference(ref);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const whatsappUrl = submittedReference
    ? buildCustomOrderWhatsAppUrl(
        {
          jewelleryType,
          preferredMaterial: `${preferredMaterial} (${gemstonePreference})`,
          occasion,
          description,
          approxBudget,
          name: name.trim(),
          phone: phone.trim(),
        },
        submittedReference,
        whatsappNum,
      )
    : "";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--charcoal)]/10 text-[var(--charcoal)] text-[11px] font-semibold uppercase tracking-widest">
          <Crown className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Atelier Consultation</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[var(--charcoal)] tracking-tight">
          Bespoke Jewellery &amp; Bridal Commissions
        </h1>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto">
          From family heirloom redesigns to royal bridal suites, collaborate
          directly with our master goldsmiths to craft jewellery in 21K/22K
          gold, Mughal Kundan, and pure Pakistani Chandi.
        </p>
      </div>

      {/* Submission Success State */}
      {submittedReference ? (
        <div className="bg-white border border-[var(--charcoal)]/15 rounded-3xl p-6 sm:p-12 shadow-2xl space-y-8 animate-fadeIn">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--charcoal)]">
              Bespoke Dossier Created Successfully
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
              Your custom commission brief has been recorded in the Tayyab
              Shahzad Jewellers atelier registry.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--charcoal)]/20 rounded-xl font-mono text-sm font-bold text-[var(--charcoal)]">
              <span>Dossier Reference:</span>
              <span className="text-[var(--accent)]">{submittedReference}</span>
            </div>
          </div>

          {/* Dossier Summary Card */}
          <div className="bg-[var(--surface)] border border-[var(--charcoal)]/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--charcoal)]/10 pb-4">
              <TsjLogo size={40} showTextLabel={true} />
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-[var(--accent-ink)] font-semibold block">
                  Commission Type
                </span>
                <span className="font-serif font-bold text-sm text-[var(--charcoal)]">
                  {jewelleryType}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider block">
                  Metal Standard
                </span>
                <span className="font-medium text-[var(--text-primary)] block mt-0.5">
                  {preferredMaterial}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider block">
                  Stone Setting
                </span>
                <span className="font-medium text-[var(--text-primary)] block mt-0.5">
                  {gemstonePreference}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider block">
                  Target Budget
                </span>
                <span className="font-medium text-[var(--text-primary)] block mt-0.5">
                  {approxBudget}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider block">
                  Client Contact
                </span>
                <span className="font-medium text-[var(--text-primary)] block mt-0.5">
                  {name} ({phone})
                </span>
              </div>
            </div>

            {description && (
              <div className="pt-2 border-t border-[var(--charcoal)]/10 text-xs text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--charcoal)] block mb-1">
                  Design Brief:
                </span>
                <p className="bg-white p-3 rounded-xl border border-[var(--charcoal)]/10 italic">
                  "{description}"
                </p>
              </div>
            )}
          </div>

          {/* WhatsApp Direct Handoff */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[var(--charcoal)] hover:bg-[var(--action-hover)] text-[var(--on-dark)] text-xs uppercase tracking-widest font-semibold rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-[var(--accent)]" />
              <span>Send Dossier to WhatsApp (0312-345678)</span>
            </a>
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-white border border-[var(--charcoal)]/20 hover:border-[var(--charcoal)] text-[var(--charcoal)] text-xs uppercase tracking-wider font-semibold rounded-xl shadow-2xs transition-all"
            >
              <Printer className="w-4 h-4 text-[var(--accent-ink)]" />
              <span>Print Dossier Summary</span>
            </button>
            <button
              onClick={() => {
                setSubmittedReference(null);
                setDescription("");
                setImagePreview(null);
              }}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--charcoal)] underline font-medium"
            >
              Submit Another Commission
            </button>
          </div>
        </div>
      ) : (
        /* Bespoke Consultation Form */
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* STEP 1: JEWELLERY CATEGORY */}
          <div className="bg-white border border-[var(--charcoal)]/12 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--charcoal)]/10 pb-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--accent-ink)]">
                  Step 1 of 6
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[var(--charcoal)] mt-0.5">
                  Choose Jewellery Classification
                </h2>
              </div>
              <span className="text-xs text-[var(--text-secondary)] hidden sm:inline">
                Select your foundation piece
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {jewelleryCategories.map((cat) => {
                const isSelected = jewelleryType.startsWith(cat.label);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      setJewelleryType(`${cat.label} (${cat.desc})`)
                    }
                    className={`relative p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between gap-3 group ${
                      isSelected
                        ? "border-[var(--charcoal)] bg-[var(--surface)] shadow-md ring-2 ring-[var(--charcoal)]/20"
                        : "border-[var(--charcoal)]/15 bg-white hover:border-[var(--accent)] hover:bg-[var(--surface)]/50"
                    }`}
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--charcoal)]">
                      <img
                        src={cat.image}
                        alt={cat.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/75  text-white text-[9px] uppercase tracking-wider rounded-md font-medium">
                        {cat.badge}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--charcoal)] text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3 text-[var(--accent)]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sm text-[var(--charcoal)]">
                        {cat.label}
                      </h3>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug">
                        {cat.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: METAL & PURITY */}
          <div className="bg-white border border-[var(--charcoal)]/12 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[var(--charcoal)]/10 pb-4">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--accent-ink)]">
                Step 2 of 6
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[var(--charcoal)] mt-0.5">
                Metal Alloy &amp; Karat Purity Standard
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {metalOptions.map((metal, idx) => {
                const isSelected = preferredMaterial === metal.label;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPreferredMaterial(metal.label)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-start justify-between gap-3 ${
                      isSelected
                        ? "border-[var(--charcoal)] bg-[var(--surface)] shadow-sm ring-1 ring-[var(--charcoal)]"
                        : "border-[var(--charcoal)]/15 bg-white hover:border-[var(--accent)]"
                    }`}
                  >
                    <div>
                      <h3 className="font-serif font-bold text-sm text-[var(--charcoal)] flex items-center gap-2">
                        <span>{metal.label}</span>
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                        {metal.desc}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? "border-[var(--charcoal)] bg-[var(--charcoal)] text-white"
                          : "border-[var(--charcoal)]/30"
                      }`}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 text-[var(--accent)]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: GEMSTONES & TECHNIQUES */}
          <div className="bg-white border border-[var(--charcoal)]/12 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[var(--charcoal)]/10 pb-4">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--accent-ink)]">
                Step 3 of 6
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[var(--charcoal)] mt-0.5">
                Stones &amp; Goldsmithing Technique
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {gemstoneOptions.map((opt, idx) => {
                const isSelected = gemstonePreference === opt.title;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setGemstonePreference(opt.title)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-start justify-between gap-3 ${
                      isSelected
                        ? "border-[var(--charcoal)] bg-[var(--surface)] shadow-sm ring-1 ring-[var(--charcoal)]"
                        : "border-[var(--charcoal)]/15 bg-white hover:border-[var(--accent)]"
                    }`}
                  >
                    <div>
                      <h3 className="font-serif font-bold text-xs sm:text-sm text-[var(--charcoal)]">
                        {opt.title}
                      </h3>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug">
                        {opt.desc}
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? "border-[var(--charcoal)] bg-[var(--charcoal)] text-white"
                          : "border-[var(--charcoal)]/30"
                      }`}
                    >
                      {isSelected && (
                        <Check className="w-2.5 h-2.5 text-[var(--accent)]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4: BUDGET & TARGET DATE */}
          <div className="bg-white border border-[var(--charcoal)]/12 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[var(--charcoal)]/10 pb-4">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--accent-ink)]">
                Step 4 of 6
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[var(--charcoal)] mt-0.5">
                Target Budget &amp; Event Occasion
              </h2>
            </div>

            {/* Budget Brackets */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[var(--charcoal)] uppercase tracking-wider">
                Select Approximate Budget Allocation (PKR):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {budgetRanges.map((b, idx) => {
                  const isSelected = approxBudget.startsWith(b.range);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setApproxBudget(`${b.range} (${b.tag})`)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "border-[var(--charcoal)] bg-[var(--surface)] shadow-xs ring-1 ring-[var(--charcoal)]"
                          : "border-[var(--charcoal)]/15 bg-white hover:border-[var(--accent)]"
                      }`}
                    >
                      <div className="font-serif font-bold text-sm text-[var(--charcoal)]">
                        {b.range}
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        {b.tag}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Occasion & Target Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label
                  htmlFor="customorderpage-nested-1"
                  className="block text-xs font-semibold text-[var(--charcoal)] uppercase tracking-wider mb-1.5"
                >
                  Wedding Occasion / Event:
                </label>
                <select
                  id="customorderpage-nested-1"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--charcoal)]/20 rounded-xl text-xs text-[var(--text-primary)] outline-none focus:border-[var(--charcoal)]"
                >
                  <option value="Barat Wedding Celebration">
                    Barat Wedding Celebration
                  </option>
                  <option value="Walima Reception">Walima Reception</option>
                  <option value="Mehndi / Sangeet Ceremony">
                    Mehndi / Sangeet Ceremony
                  </option>
                  <option value="Engagement / Ring Ceremony">
                    Engagement / Ring Ceremony
                  </option>
                  <option value="Family Heirloom Restoration">
                    Family Heirloom Restoration
                  </option>
                  <option value="Anniversary / Gift Commission">
                    Anniversary / Gift Commission
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="customorderpage-nested-2"
                  className="block text-xs font-semibold text-[var(--charcoal)] uppercase tracking-wider mb-1.5"
                >
                  Target Required Date (Optional):
                </label>
                <div className="relative">
                  <input
                    id="customorderpage-nested-2"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--charcoal)]/20 rounded-xl text-xs text-[var(--text-primary)] outline-none focus:border-[var(--charcoal)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* STEP 5: REFERENCE PHOTO & DESIGN BRIEF */}
          <div className="bg-white border border-[var(--charcoal)]/12 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[var(--charcoal)]/10 pb-4">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--accent-ink)]">
                Step 5 of 6
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[var(--charcoal)] mt-0.5">
                Reference Sketch &amp; Custom Specifications
              </h2>
            </div>

            {/* Photo / Sketch Uploader */}
            <div>
              <label className="block text-xs font-semibold text-[var(--charcoal)] uppercase tracking-wider mb-2">
                Attach Design Photo, Sketch or Jewellery Inspiration:
              </label>

              {imagePreview ? (
                <div className="relative w-full sm:w-64 aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--charcoal)]/20 shadow-md">
                  <img
                    src={imagePreview}
                    alt="Reference Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 p-1.5 bg-black/75 hover:bg-black text-white rounded-full transition-colors"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--charcoal)]/20 hover:border-[var(--charcoal)] rounded-2xl p-8 bg-[var(--surface)]/50 hover:bg-[var(--surface)] transition-colors cursor-pointer text-center">
                  <Upload className="w-8 h-8 text-[var(--accent)] mb-2" />
                  <span className="text-xs font-semibold text-[var(--charcoal)]">
                    Click to upload jewellery photo or sketch
                  </span>
                  <span className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    Supports PNG, JPG, WEBP (Max 5MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Detailed Description */}
            <div>
              <label
                htmlFor="customorderpage-nested-3"
                className="block text-xs font-semibold text-[var(--charcoal)] uppercase tracking-wider mb-2"
              >
                Detailed Goldsmith Notes / Custom Dimensions:
              </label>
              <textarea
                id="customorderpage-nested-3"
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your design vision: e.g., 'Looking for a royal green emerald center with 22K Kundan work, heavy pearl drops, and matching double-chandbali earrings...'"
                className="w-full p-4 bg-[var(--surface)] border border-[var(--charcoal)]/20 rounded-2xl text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-[var(--charcoal)]"
              />
            </div>
          </div>

          {/* STEP 6: CLIENT CONTACT & SUBMISSION */}
          <div className="bg-white border border-[var(--charcoal)]/12 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[var(--charcoal)]/10 pb-4">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--accent-ink)]">
                Step 6 of 6
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[var(--charcoal)] mt-0.5">
                Client Contact Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="customorderpage-nested-4"
                  className="block text-xs font-semibold text-[var(--charcoal)] uppercase tracking-wider mb-1.5"
                >
                  Your Full Name: *
                </label>
                <input
                  id="customorderpage-nested-4"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fatima Tariq"
                  className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--charcoal)]/20 rounded-xl text-xs text-[var(--text-primary)] outline-none focus:border-[var(--charcoal)]"
                />
              </div>

              <div>
                <label
                  htmlFor="customorderpage-nested-5"
                  className="block text-xs font-semibold text-[var(--charcoal)] uppercase tracking-wider mb-1.5"
                >
                  WhatsApp Contact Phone: *
                </label>
                <input
                  id="customorderpage-nested-5"
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0312-345678"
                  className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--charcoal)]/20 rounded-xl text-xs text-[var(--text-primary)] outline-none focus:border-[var(--charcoal)]"
                />
              </div>

              <div>
                <label
                  htmlFor="customorderpage-nested-6"
                  className="block text-xs font-semibold text-[var(--charcoal)] uppercase tracking-wider mb-1.5"
                >
                  City (e.g. Lahore / Karachi / Islamabad):
                </label>
                <input
                  id="customorderpage-nested-6"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lahore"
                  className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--charcoal)]/20 rounded-xl text-xs text-[var(--text-primary)] outline-none focus:border-[var(--charcoal)]"
                />
              </div>
            </div>

            {/* Submission CTA */}
            <div className="pt-6 border-t border-[var(--charcoal)]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5 font-medium text-[var(--charcoal)]">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Direct Consultation with Master Goldsmiths
                </span>
                <span>
                  Submitting creates an official TSJ dossier and connects you
                  via WhatsApp.
                </span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[var(--charcoal)] hover:bg-[var(--action-hover)] text-[var(--on-dark)] text-xs uppercase tracking-widest font-semibold rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Submit Bespoke Brief</span>
                <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Atelier Trust Guarantee Strip */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-[var(--charcoal)]/10 text-center sm:text-left">
        <div className="p-5 bg-white border border-[var(--charcoal)]/10 rounded-2xl space-y-2">
          <div className="w-9 h-9 rounded-full bg-[var(--surface)] text-[var(--charcoal)] flex items-center justify-center mx-auto sm:mx-0">
            <ShieldCheck className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <h3 className="font-serif font-bold text-sm text-[var(--charcoal)]">
            Sarafa Verified Gold Purity
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Every commissioned piece is tested for exact gold weight (in tolas
            &amp; grams) with official hallmarking.
          </p>
        </div>

        <div className="p-5 bg-white border border-[var(--charcoal)]/10 rounded-2xl space-y-2">
          <div className="w-9 h-9 rounded-full bg-[var(--surface)] text-[var(--charcoal)] flex items-center justify-center mx-auto sm:mx-0">
            <Award className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <h3 className="font-serif font-bold text-sm text-[var(--charcoal)]">
            Mughal Jadau &amp; Hand Meenakari
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Handcrafted by generational artisans specialising in intricate
            Mughal bridal kundan and fine Pakistani chandi.
          </p>
        </div>

        <div className="p-5 bg-white border border-[var(--charcoal)]/10 rounded-2xl space-y-2">
          <div className="w-9 h-9 rounded-full bg-[var(--surface)] text-[var(--charcoal)] flex items-center justify-center mx-auto sm:mx-0">
            <Clock className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <h3 className="font-serif font-bold text-sm text-[var(--charcoal)]">
            Transparent Timeline &amp; Updates
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Direct WhatsApp progress photos (`0312-345678`) throughout gold
            casting, gemstone setting, and final buffing.
          </p>
        </div>
      </div>
    </div>
  );
};
