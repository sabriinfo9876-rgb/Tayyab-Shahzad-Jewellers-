import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  ExternalLink,
  MessageCircle,
  RotateCcw,
  ShoppingBag,
  Calculator,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Phone,
  Crown,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  assistantService,
  AssistantMessage,
} from "../../services/assistantService";
import { TsjLogo } from "./TsjLogo";
import { DemoStorage } from "../../services/storage";

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<"concierge" | "calculator">(
    "concierge",
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Calculator state
  const [calcWeight, setCalcWeight] = useState<number>(1);
  const [calcUnit, setCalcUnit] = useState<"tola" | "grams">("tola");
  const [calcKarat, setCalcKarat] = useState<"24K" | "22K" | "21K">("22K");

  const settings = DemoStorage.getSettings();
  const ratesData = DemoStorage.getRates();

  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: "init-1",
      sender: "assistant",
      text: "Assalam-o-Alaikum! Welcome to the Tayyab Shahzad Jewellers Concierge Desk. How may our atelier assist you today with bridal collections, gold rates, Pakistani Chandi, or bespoke wedding orders?",
      timestamp: new Date().toISOString(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && activeMode === "concierge") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, loading, activeMode]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: AssistantMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await assistantService.sendMessage(query);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          sender: "assistant",
          text: `Thank you for your interest. Please contact our master jewellers directly on WhatsApp: ${settings.phone}.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: "init-reset",
        sender: "assistant",
        text: "Consultation cleared. How can we guide your jewellery selection today?",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const suggestedQuestions = [
    "Show Bridal Suite",
    "Gold Kadas & Bangles",
    "Pakistani Chandi Silver",
    "Custom Order Process",
    "Sample Metal Rates",
  ];

  // Gold rate calculation math (1 Tola = 11.6638 grams)
  const rate24K =
    ratesData.rates.find((r) => r.metal.includes("24K"))?.ratePKR || 285000;
  const rate22K =
    ratesData.rates.find((r) => r.metal.includes("22K"))?.ratePKR || 261250;
  const rate21K =
    ratesData.rates.find((r) => r.metal.includes("21K"))?.ratePKR || 249375;

  const currentRatePerTola =
    calcKarat === "24K" ? rate24K : calcKarat === "22K" ? rate22K : rate21K;
  const calculatedPKR =
    calcUnit === "tola"
      ? Math.round(calcWeight * currentRatePerTola)
      : Math.round((calcWeight / 11.6638) * currentRatePerTola);

  const whatsappNum = settings.whatsappNumber || "92312345678";
  const displayPhone = settings.phone || "0312-345678";

  if (!settings.showAssistant) return null;

  return (
    <>
      {/* Floating Concierge Launcher */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-[var(--charcoal)] text-[var(--on-dark)] rounded-full shadow-2xl hover:bg-[var(--action-hover)] border border-[var(--accent)]/40 transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[var(--accent)] group"
          aria-label="Open TSJ Concierge &amp; Demo Desk"
        >
          <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></div>
          <span className="text-xs font-semibold tracking-wider uppercase">
            TSJ Concierge Desk
          </span>
          <span className="hidden sm:inline text-[11px] text-[var(--accent)] font-mono">
            {displayPhone}
          </span>
        </button>
      )}

      {/* Concierge Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[85vh] h-[560px] bg-[var(--surface)] rounded-3xl shadow-2xl border border-[var(--charcoal)]/20 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-[var(--charcoal)] text-[var(--on-dark)] px-4 py-3.5 flex items-center justify-between shrink-0 border-b border-[var(--accent)]/30">
            <div className="flex items-center gap-3">
              <TsjLogo size={36} lightText={true} />
              <div>
                <h4 className="font-serif text-sm font-semibold tracking-wide flex items-center gap-1.5">
                  TSJ Private Concierge
                </h4>
                <div className="text-[10px] text-[var(--accent)] tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Direct Sarafa &amp; Atelier Helpline</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {activeMode === "concierge" && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 text-[var(--on-dark)]/70 hover:text-white rounded-lg transition-colors"
                  title="Clear conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[var(--on-dark)]/70 hover:text-white rounded-lg transition-colors"
                aria-label="Close concierge"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-[var(--surface-secondary)] border-b border-[var(--charcoal)]/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveMode("concierge")}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeMode === "concierge"
                  ? "bg-white text-[var(--charcoal)] shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--charcoal)]"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Atelier Enquiries</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("calculator")}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeMode === "calculator"
                  ? "bg-white text-[var(--charcoal)] shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--charcoal)]"
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Gold Rate Calculator</span>
            </button>
          </div>

          {/* MODE 1: CONCIERGE CHAT & GUIDES */}
          {activeMode === "concierge" && (
            <>
              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-[var(--charcoal)] text-[var(--on-dark)] rounded-br-xs"
                          : "bg-white text-[var(--text-primary)] border border-[var(--charcoal)]/10 shadow-xs rounded-bl-xs"
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>

                    {/* Suggested product cards if available */}
                    {msg.suggestedProducts &&
                      msg.suggestedProducts.length > 0 && (
                        <div className="mt-2.5 w-full space-y-1.5">
                          <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                            Recommended Atelier Masterpieces:
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            {msg.suggestedProducts.map((p) => (
                              <Link
                                key={p.id}
                                to={`/product/${p.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="p-2 bg-white rounded-xl border border-[var(--charcoal)]/10 flex items-center gap-2 hover:border-[var(--accent)] transition-colors group"
                              >
                                <img
                                  src={p.images[0]}
                                  alt={p.name}
                                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <h5 className="font-serif font-bold text-[11px] text-[var(--charcoal)] truncate group-hover:text-[var(--accent)]">
                                    {p.name}
                                  </h5>
                                  <span className="text-[10px] text-[var(--text-secondary)] block font-mono">
                                    {p.samplePricePKR
                                      ? `PKR ${p.samplePricePKR.toLocaleString()}`
                                      : p.code}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] bg-white p-2.5 rounded-2xl w-fit border border-[var(--charcoal)]/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-[11px]">
                      Consulting atelier records...
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="p-2.5 bg-white border-t border-[var(--charcoal)]/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(q)}
                    className="px-2.5 py-1 bg-[var(--surface)] hover:bg-[var(--charcoal)] hover:text-[var(--on-dark)] border border-[var(--charcoal)]/15 rounded-full text-[11px] text-[var(--charcoal)] whitespace-nowrap transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-3 bg-[var(--surface)] border-t border-[var(--charcoal)]/10 flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about bridal, pure gold, or chandi..."
                  className="flex-1 px-3.5 py-2.5 bg-white border border-[var(--charcoal)]/20 rounded-xl text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-[var(--charcoal)]"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2.5 bg-[var(--charcoal)] hover:bg-[var(--action-hover)] disabled:opacity-50 text-[var(--on-dark)] rounded-xl transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          {/* MODE 2: LIVE GOLD RATE CALCULATOR */}
          {activeMode === "calculator" && (
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-[var(--charcoal)]/10 space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--charcoal)]/10 pb-2">
                  <span className="font-serif font-bold text-sm text-[var(--charcoal)] flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
                    Sample Metal Rates
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium">
                    Manually entered
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-[var(--surface)] rounded-xl">
                    <span className="text-[10px] text-[var(--text-secondary)] block">
                      24K Gold
                    </span>
                    <span className="font-bold text-[var(--charcoal)] text-[11px] block mt-0.5">
                      PKR {rate24K.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2 bg-[var(--surface)] rounded-xl border border-[var(--accent)]/40">
                    <span className="text-[10px] text-[var(--accent)] font-bold block">
                      22K Gold
                    </span>
                    <span className="font-bold text-[var(--charcoal)] text-[11px] block mt-0.5">
                      PKR {rate22K.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2 bg-[var(--surface)] rounded-xl">
                    <span className="text-[10px] text-[var(--text-secondary)] block">
                      21K Gold
                    </span>
                    <span className="font-bold text-[var(--charcoal)] text-[11px] block mt-0.5">
                      PKR {rate21K.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Calculator Inputs */}
              <div className="bg-white p-4 rounded-2xl border border-[var(--charcoal)]/10 space-y-4">
                <h5 className="font-serif font-bold text-xs uppercase tracking-wider text-[var(--charcoal)]">
                  Calculate Metal Valuation
                </h5>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                      Select Karat:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["24K", "22K", "21K"] as const).map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setCalcKarat(k)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all ${
                            calcKarat === k
                              ? "bg-[var(--charcoal)] text-white shadow-xs"
                              : "bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"
                          }`}
                        >
                          {k} Gold
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                        Weight:
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={calcWeight}
                        onChange={(e) =>
                          setCalcWeight(parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--charcoal)]/20 rounded-xl text-xs font-bold text-[var(--charcoal)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                        Unit:
                      </label>
                      <select
                        value={calcUnit}
                        onChange={(e) => setCalcUnit(e.target.value as any)}
                        className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--charcoal)]/20 rounded-xl text-xs font-semibold text-[var(--charcoal)] outline-none"
                      >
                        <option value="tola">Tola (11.66g)</option>
                        <option value="grams">Grams</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Calculation Result */}
                <div className="p-3.5 bg-[var(--charcoal)] text-[var(--on-dark)] rounded-2xl text-center space-y-1">
                  <span className="text-[10px] text-[var(--accent)] uppercase tracking-wider block font-semibold">
                    Estimated Pure Gold Value
                  </span>
                  <div className="font-serif font-bold text-2xl text-white">
                    PKR {calculatedPKR.toLocaleString()}
                  </div>
                  <span className="text-[9px] text-[var(--on-dark)]/70 block font-light">
                    *Excludes making charges, gemstone weight &amp; government
                    taxes
                  </span>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Assalam-o-Alaikum Tayyab Shahzad Jewellers, I calculated an estimate for ${calcWeight} ${calcUnit} of ${calcKarat} Gold (approx PKR ${calculatedPKR.toLocaleString()}). Please advise on making charges and custom jewellery design.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[var(--accent)]" />
                <span>Discuss This Quote on WhatsApp (0312-345678)</span>
              </a>
            </div>
          )}

          {/* Footer Contact Strip */}
          <div className="p-3 bg-[var(--surface)] border-t border-[var(--charcoal)]/10 flex items-center justify-between text-[11px] text-[var(--text-secondary)] shrink-0">
            <span className="flex items-center gap-1 font-semibold text-[var(--charcoal)]">
              <Phone className="w-3 h-3 text-[var(--accent)]" />
              {displayPhone}
            </span>
            <a
              href={`https://wa.me/${whatsappNum}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--charcoal)] hover:text-[var(--accent)] font-bold underline flex items-center gap-1"
            >
              Direct WhatsApp <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </>
  );
};
