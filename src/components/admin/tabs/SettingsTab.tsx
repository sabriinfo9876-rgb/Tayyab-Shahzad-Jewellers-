import { StoreOperationsSettings } from "./StoreOperationsSettings";
import React, { useState } from "react";
import {
  Sliders,
  Save,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Building,
  Phone,
  Shield,
  Users,
} from "lucide-react";
import { StoreSettings } from "../../../types";
import { DemoStorage } from "../../../services/storage";

interface SettingsTabProps {
  settings: StoreSettings;
  onSettingsUpdated: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  onSettingsUpdated,
}) => {
  const [brandName, setBrandName] = useState(
    settings.brandName || "Tayyab Shahzad Jewellers",
  );
  const [phone, setPhone] = useState(settings.phone || "0312-345678");
  const [internationalPhone, setInternationalPhone] = useState(
    settings.internationalPhone || "+92 312 345678",
  );
  const [whatsappNumber, setWhatsappNumber] = useState(
    settings.whatsappNumber || "92312345678",
  );
  const [tiktokUrl, setTiktokUrl] = useState(
    settings.tiktokUrl || "https://www.tiktok.com/@tayyab.shahzad.jewellers",
  );
  const [announcementText, setAnnouncementText] = useState(
    settings.announcementText || "Discover the latest collection",
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StoreSettings = {
      ...settings,
      brandName,
      phone,
      internationalPhone,
      whatsappNumber,
      tiktokUrl,
      announcementText,
    };
    DemoStorage.saveSettings(updated);
    onSettingsUpdated();
    showFeedback("Brand & communication settings saved successfully!");
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const jsonString = DemoStorage.exportAllData();
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TSJ-ERP-Backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showFeedback("Full database snapshot exported.");
  };

  // Import JSON backup
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = DemoStorage.importData(content);
        if (res.success) {
          onSettingsUpdated();
          showFeedback("Demo data restored from backup successfully.");
        } else {
          alert(res.message);
        }
      }
    };
    reader.readAsText(file);
  };

  // Factory reset
  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset all demo records to factory defaults? Any custom added items will be re-seeded.",
      )
    ) {
      DemoStorage.resetAll();
      onSettingsUpdated();
      showFeedback("Demo re-initialized to default jeweller data.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
            ERP Settings & Data Management
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Brand configuration, showroom communication channels, backup and
            recovery controls
          </p>
        </div>

        {feedback && (
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-md text-xs font-medium animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      <StoreOperationsSettings onSaved={onSettingsUpdated} />
      {/* Main Settings Form */}
      <form
        onSubmit={handleSaveSettings}
        className="bg-white p-5 rounded-lg border border-stone-200 shadow-2xs space-y-4"
      >
        <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
          <Building className="w-4 h-4 text-[var(--charcoal)]" />
          <h2 className="text-sm font-semibold text-stone-900">
            Brand Identity & Channels
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label
              htmlFor="settingstab-field-1"
              className="block text-[11px] font-medium text-stone-700 mb-1"
            >
              Registered Brand Name
            </label>
            <input
              id="settingstab-field-1"
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full bg-[var(--surface)] border border-stone-200 rounded px-3 py-1.5 text-xs focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="settingstab-field-2"
              className="block text-[11px] font-medium text-stone-700 mb-1"
            >
              Announcement Ticker Text
            </label>
            <input
              id="settingstab-field-2"
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full bg-[var(--surface)] border border-stone-200 rounded px-3 py-1.5 text-xs focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="settingstab-field-3"
              className="block text-[11px] font-medium text-stone-700 mb-1"
            >
              Primary Phone Number
            </label>
            <input
              id="settingstab-field-3"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[var(--surface)] border border-stone-200 rounded px-3 py-1.5 text-xs font-mono focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="settingstab-field-4"
              className="block text-[11px] font-medium text-stone-700 mb-1"
            >
              International Phone
            </label>
            <input
              id="settingstab-field-4"
              type="text"
              value={internationalPhone}
              onChange={(e) => setInternationalPhone(e.target.value)}
              className="w-full bg-[var(--surface)] border border-stone-200 rounded px-3 py-1.5 text-xs font-mono focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="settingstab-field-5"
              className="block text-[11px] font-medium text-stone-700 mb-1"
            >
              WhatsApp Integration Number (Clean digits)
            </label>
            <input
              id="settingstab-field-5"
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full bg-[var(--surface)] border border-stone-200 rounded px-3 py-1.5 text-xs font-mono focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="settingstab-field-6"
              className="block text-[11px] font-medium text-stone-700 mb-1"
            >
              TikTok Profile URL
            </label>
            <input
              id="settingstab-field-6"
              type="text"
              value={tiktokUrl}
              onChange={(e) => setTiktokUrl(e.target.value)}
              className="w-full bg-[var(--surface)] border border-stone-200 rounded px-3 py-1.5 text-xs font-mono focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-stone-200 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-[var(--charcoal)] hover:bg-[var(--charcoal)] text-white rounded text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Save Store Configuration</span>
          </button>
        </div>
      </form>

      {/* Workshop Roster Summary */}
      <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
          <Users className="w-4 h-4 text-[var(--charcoal)]" />
          <h2 className="text-sm font-semibold text-stone-900">
            Registered Atelier Goldsmiths & Roles
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[var(--surface)] rounded border border-stone-200">
            <div className="font-semibold text-stone-900">
              Ustad Rafiq (Kundan Master)
            </div>
            <div className="text-[11px] text-stone-500">
              Imperial bridal choker jadau setting, royal haars, 22K pure gold.
            </div>
          </div>
          <div className="p-3 bg-[var(--surface)] rounded border border-stone-200">
            <div className="font-semibold text-stone-900">Karigar Arshad</div>
            <div className="text-[11px] text-stone-500">
              Bangles die-making, diamond-cut CNC faceting, Italian flexible
              cuffs.
            </div>
          </div>
          <div className="p-3 bg-[var(--surface)] rounded border border-stone-200">
            <div className="font-semibold text-stone-900">Karigar Noman</div>
            <div className="text-[11px] text-stone-500">
              Micro-claw solitaire prong setting, halo rings, and ultrasonic
              finishing.
            </div>
          </div>
          <div className="p-3 bg-[var(--surface)] rounded border border-stone-200">
            <div className="font-semibold text-stone-900">
              Chandi Section - Aslam
            </div>
            <div className="text-[11px] text-stone-500">
              Pakistani Chandi (925 fine silver), traditional payals, polki
              silver suites.
            </div>
          </div>
        </div>
      </div>

      {/* Data Backup & Factory Reset Card */}
      <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
          <Shield className="w-4 h-4 text-[var(--charcoal)]" />
          <h2 className="text-sm font-semibold text-stone-900">
            Database Snapshot & Recovery
          </h2>
        </div>

        <p className="text-xs text-stone-500">
          Export your entire current state (products, orders, custom
          commissions, customers, and rates) as a standalone JSON backup file or
          restore previously saved data.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleExportBackup}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>Download Backup (.JSON)</span>
          </button>

          <label className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-stone-600" />
            <span>Restore Backup (.JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <button
            onClick={handleReset}
            className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-700 rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-600" />
            <span>Reset Demo to Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
