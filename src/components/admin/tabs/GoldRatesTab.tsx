import React, { useState } from "react";
import {
  Coins,
  TrendingUp,
  Save,
  RotateCcw,
  Calculator,
  Clock,
  Scale,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { MetalRatesData, MetalRateItem } from "../../../types";
import { DemoStorage } from "../../../services/storage";

interface GoldRatesTabProps {
  ratesData: MetalRatesData;
  onRatesUpdated: () => void;
}

export const GoldRatesTab: React.FC<GoldRatesTabProps> = ({
  ratesData,
  onRatesUpdated,
}) => {
  // Extract initial rates
  const initial24K =
    ratesData.rates.find(
      (r) => r.purity.includes("99.9%") || r.metal.includes("24K"),
    )?.ratePKR ?? 0;
  const initial22K =
    ratesData.rates.find(
      (r) => r.purity.includes("91.6%") || r.metal.includes("22K"),
    )?.ratePKR ?? 0;
  const initialSilver =
    ratesData.rates.find((r) => r.metal.includes("Silver"))?.ratePKR ?? 0;

  const [rate24K, setRate24K] = useState<number>(initial24K);
  const [rate22K, setRate22K] = useState<number>(initial22K);
  const [rate21K, setRate21K] = useState<number>(
    ratesData.rates.find((r) => r.metal.includes("21K"))?.ratePKR ??
      Math.round(initial24K * (21 / 24)),
  );
  const [rate18K, setRate18K] = useState<number>(
    ratesData.rates.find((r) => r.metal.includes("18K"))?.ratePKR ??
      Math.round(initial24K * (18 / 24)),
  );
  const [rateSilver, setRateSilver] = useState<number>(initialSilver);
  const [effectiveTime, setEffectiveTime] = useState<string>(
    ratesData.lastUpdatedKarachi ||
      new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" }) + " PKT",
  );
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Price Estimator state
  const [calcKarat, setCalcKarat] = useState<
    "24K" | "22K" | "21K" | "18K" | "Silver"
  >("22K");
  const [calcUnit, setCalcUnit] = useState<"grams" | "tolas">("grams");
  const [calcWeight, setCalcWeight] = useState<number>(10.0);
  const [calcMakingType, setCalcMakingType] = useState<
    "per_tola" | "per_gram" | "fixed"
  >("per_tola");
  const [calcMakingRate, setCalcMakingRate] = useState<number>(18000);

  // Auto-calculate 22K, 21K, 18K based on 24K input
  const handleAutoCalculate = () => {
    setRate22K(Math.round(rate24K * (22 / 24)));
    setRate21K(Math.round(rate24K * (21 / 24)));
    setRate18K(Math.round(rate24K * (18 / 24)));
  };

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      [rate24K, rate22K, rate21K, rate18K, rateSilver].some(
        (v) => !Number.isFinite(v) || v <= 0,
      )
    ) {
      alert("Enter positive rates.");
      return;
    }

    const updatedAt =
      new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" }) + " PKT";
    setEffectiveTime(updatedAt);
    const newRates: MetalRateItem[] = [
      {
        metal: "24K Fine Gold (Bullion)",
        purity: "99.9% Pure Gold",
        ratePKR: rate24K,
        unit: "per Tola",
        source: "Manually entered demo rate",
        effectiveDateTime: updatedAt,
        isSampleDemoRate: true,
      },
      {
        metal: "22K Standard Gold",
        purity: "91.6% Fine Gold",
        ratePKR: rate22K,
        unit: "per Tola",
        source: "Manually entered demo rate",
        effectiveDateTime: updatedAt,
        isSampleDemoRate: true,
      },
      {
        metal: "21K Jewellery Gold",
        purity: "87.5% Jewellery Gold",
        ratePKR: rate21K,
        unit: "per Tola",
        source: "Manually entered demo rate",
        effectiveDateTime: updatedAt,
        isSampleDemoRate: true,
      },
      {
        metal: "18K Fine Gold",
        purity: "75.0% Modern Gold",
        ratePKR: rate18K,
        unit: "per Tola",
        source: "Manually entered demo rate",
        effectiveDateTime: updatedAt,
        isSampleDemoRate: true,
      },
      {
        metal: "Silver / Chandi 925",
        purity: "92.5% Fine Silver",
        ratePKR: rateSilver,
        unit: "per Tola",
        source: "Manually entered demo rate",
        effectiveDateTime: updatedAt,
        isSampleDemoRate: true,
      },
    ];

    DemoStorage.saveRates({
      rates: newRates,
      lastUpdatedKarachi: updatedAt,
      disclaimer:
        "Manually entered sample rates. Not a live market feed. Existing agreed order prices remain unchanged.",
    });

    onRatesUpdated();
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  // Estimator Math
  const activeRatePerTola =
    calcKarat === "24K"
      ? rate24K
      : calcKarat === "22K"
        ? rate22K
        : calcKarat === "21K"
          ? rate21K
          : calcKarat === "18K"
            ? rate18K
            : rateSilver;

  const ratePerGram = activeRatePerTola / 11.664;
  const weightInGrams = calcUnit === "grams" ? calcWeight : calcWeight * 11.664;
  const weightInTolas = calcUnit === "tolas" ? calcWeight : calcWeight / 11.664;

  const pureMetalCost = Math.round(weightInGrams * ratePerGram);

  let totalMakingCost = 0;
  if (calcMakingType === "per_tola") {
    totalMakingCost = Math.round(weightInTolas * calcMakingRate);
  } else if (calcMakingType === "per_gram") {
    totalMakingCost = Math.round(weightInGrams * calcMakingRate);
  } else {
    totalMakingCost = calcMakingRate;
  }

  const estimatedTotalPKR = pureMetalCost + totalMakingCost;

  return (
    <div className="space-y-6">
      {/* Title & Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
            Sarafa Bullion & Metal Rates Management
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manually enter sample PKR rates per tola. Auto-calculate karats and
            simulate retail jewellery quotes.
          </p>
        </div>

        {savedFeedback && (
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-md text-xs font-medium animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Manual demo rates saved. Existing orders are unchanged.</span>
          </div>
        )}
      </div>

      <p className="notice">
        Manually entered sample rates · PKR per tola (11.664 g) · not a live
        feed. Source and last-updated time are saved with each rate.
      </p>
      {/* Main Grid: Rate Modifier Form + Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Rates Entry & Auto-calculator */}
        <form
          onSubmit={handleSaveRates}
          className="bg-white p-5 rounded-lg border border-stone-200 shadow-2xs space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-[var(--charcoal)]" />
              <h2 className="text-sm font-semibold text-stone-900">
                Sarafa Rate per Tola (11.664 g)
              </h2>
            </div>
            <button
              type="button"
              onClick={handleAutoCalculate}
              className="text-[11px] text-[var(--charcoal)] hover:text-[var(--action-hover)] font-semibold hover:underline"
            >
              Auto-calculate Karats (22K/21K/18K)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 24K Rate */}
            <div>
              <label
                htmlFor="goldratestab-nested-1"
                className="block text-[11px] font-medium text-stone-700 mb-1"
              >
                24K Pure Gold (Bullion) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-xs">
                  Rs.
                </span>
                <input
                  id="goldratestab-nested-1"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={rate24K}
                  onChange={(e) => setRate24K(Number(e.target.value))}
                  className="w-full bg-[var(--surface)] border border-stone-200 rounded pl-10 pr-3 py-1.5 text-xs font-mono font-bold text-stone-900 focus:bg-white focus:border-[var(--accent)] focus:outline-none"
                  required
                />
              </div>
              <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">
                ~Rs. {Math.round(rate24K / 11.664).toLocaleString()} / gram
              </span>
            </div>

            {/* 22K Rate */}
            <div>
              <label
                htmlFor="goldratestab-nested-2"
                className="block text-[11px] font-medium text-stone-700 mb-1"
              >
                22K Fine Jewellery Gold *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-xs">
                  Rs.
                </span>
                <input
                  id="goldratestab-nested-2"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={rate22K}
                  onChange={(e) => setRate22K(Number(e.target.value))}
                  className="w-full bg-[var(--surface)] border border-stone-200 rounded pl-10 pr-3 py-1.5 text-xs font-mono font-bold text-stone-900 focus:bg-white focus:border-[var(--accent)] focus:outline-none"
                  required
                />
              </div>
              <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">
                ~Rs. {Math.round(rate22K / 11.664).toLocaleString()} / gram
              </span>
            </div>

            {/* 21K Rate */}
            <div>
              <label
                htmlFor="goldratestab-nested-3"
                className="block text-[11px] font-medium text-stone-700 mb-1"
              >
                21K Standard Gold
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-xs">
                  Rs.
                </span>
                <input
                  id="goldratestab-nested-3"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={rate21K}
                  onChange={(e) => setRate21K(Number(e.target.value))}
                  className="w-full bg-[var(--surface)] border border-stone-200 rounded pl-10 pr-3 py-1.5 text-xs font-mono font-bold text-stone-900 focus:bg-white focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
              <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">
                ~Rs. {Math.round(rate21K / 11.664).toLocaleString()} / gram
              </span>
            </div>

            {/* 18K Rate */}
            <div>
              <label
                htmlFor="goldratestab-nested-4"
                className="block text-[11px] font-medium text-stone-700 mb-1"
              >
                18K Contemporary Gold
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-xs">
                  Rs.
                </span>
                <input
                  id="goldratestab-nested-4"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={rate18K}
                  onChange={(e) => setRate18K(Number(e.target.value))}
                  className="w-full bg-[var(--surface)] border border-stone-200 rounded pl-10 pr-3 py-1.5 text-xs font-mono font-bold text-stone-900 focus:bg-white focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
              <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">
                ~Rs. {Math.round(rate18K / 11.664).toLocaleString()} / gram
              </span>
            </div>

            {/* Silver Rate */}
            <div>
              <label
                htmlFor="goldratestab-nested-5"
                className="block text-[11px] font-medium text-stone-700 mb-1"
              >
                925 Pakistani Chandi (Silver)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-xs">
                  Rs.
                </span>
                <input
                  id="goldratestab-nested-5"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={rateSilver}
                  onChange={(e) => setRateSilver(Number(e.target.value))}
                  className="w-full bg-[var(--surface)] border border-stone-200 rounded pl-10 pr-3 py-1.5 text-xs font-mono font-bold text-stone-900 focus:bg-white focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
              <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">
                ~Rs. {Math.round(rateSilver / 11.664).toLocaleString()} / gram
              </span>
            </div>

            {/* Effective Time */}
            <div>
              <label
                htmlFor="goldratestab-field-1"
                className="block text-[11px] font-medium text-stone-700 mb-1"
              >
                Effective Timestamp
              </label>
              <input
                id="goldratestab-field-1"
                type="text"
                value={effectiveTime}
                onChange={(e) => setEffectiveTime(e.target.value)}
                className="w-full bg-[var(--surface)] border border-stone-200 rounded px-3 py-1.5 text-xs font-mono text-stone-800 focus:bg-white focus:outline-none"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Displayed on top ticker & customer concierge
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-[var(--charcoal)] hover:bg-[var(--charcoal)] text-white rounded text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Save manual demo rates</span>
            </button>
          </div>
        </form>

        {/* Right: Live Jewellery Price Estimator */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
            <Calculator className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="text-sm font-semibold text-stone-900">
              Live Jewellery Price Simulator
            </h2>
          </div>

          <p className="text-xs text-stone-500">
            Calculate instant showroom counter estimations based on manually
            entered sample rates and mazdoori.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="goldratestab-field-2"
                className="block text-[11px] font-medium text-stone-600 mb-1"
              >
                Karat Variant
              </label>
              <select
                id="goldratestab-field-2"
                value={calcKarat}
                onChange={(e) => setCalcKarat(e.target.value as any)}
                className="w-full bg-[var(--surface)] border border-stone-200 rounded px-2.5 py-1.5 text-xs font-medium focus:outline-none"
              >
                <option value="24K">24K Pure Gold (Bullion)</option>
                <option value="22K">22K Fine Jewellery Gold</option>
                <option value="21K">21K Standard Gold</option>
                <option value="18K">18K Contemporary Gold</option>
                <option value="Silver">925 Pakistani Chandi</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">
                Weight Unit
              </label>
              <div className="flex bg-stone-100 p-0.5 rounded text-xs">
                <button
                  type="button"
                  onClick={() => setCalcUnit("grams")}
                  className={`flex-1 py-1 rounded text-center font-medium ${
                    calcUnit === "grams"
                      ? "bg-white text-stone-900 shadow-2xs font-semibold"
                      : "text-stone-500"
                  }`}
                >
                  Grams (g)
                </button>
                <button
                  type="button"
                  onClick={() => setCalcUnit("tolas")}
                  className={`flex-1 py-1 rounded text-center font-medium ${
                    calcUnit === "tolas"
                      ? "bg-white text-stone-900 shadow-2xs font-semibold"
                      : "text-stone-500"
                  }`}
                >
                  Tolas
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="goldratestab-field-3"
                className="block text-[11px] font-medium text-stone-600 mb-1"
              >
                Weight ({calcUnit})
              </label>
              <input
                id="goldratestab-field-3"
                type="number"
                step="0.01"
                min="0.1"
                value={calcWeight}
                onChange={(e) => setCalcWeight(Number(e.target.value))}
                className="w-full bg-[var(--surface)] border border-stone-200 rounded px-2.5 py-1.5 text-xs font-mono font-bold focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="goldratestab-field-4"
                className="block text-[11px] font-medium text-stone-600 mb-1"
              >
                Making Charges (Mazdoori)
              </label>
              <input
                id="goldratestab-field-4"
                type="number"
                min="0"
                step="0.01"
                value={calcMakingRate}
                onChange={(e) => setCalcMakingRate(Number(e.target.value))}
                className="w-full bg-[var(--surface)] border border-stone-200 rounded px-2.5 py-1.5 text-xs font-mono focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Result Card */}
          <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-2 mt-2">
            <div className="flex justify-between text-xs text-stone-600">
              <span>
                Pure Gold Valuation ({weightInGrams.toFixed(2)}g /{" "}
                {weightInTolas.toFixed(3)} tol):
              </span>
              <span className="font-mono font-medium text-stone-900">
                Rs. {pureMetalCost.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-xs text-stone-600">
              <span>Craftsmanship / Mazdoori:</span>
              <span className="font-mono font-medium text-stone-900">
                Rs. {totalMakingCost.toLocaleString()}
              </span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
              <span className="text-xs font-bold text-stone-900">
                Estimated Retail Quote:
              </span>
              <span className="text-lg font-bold font-mono text-[var(--charcoal)]">
                Rs. {estimatedTotalPKR.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
