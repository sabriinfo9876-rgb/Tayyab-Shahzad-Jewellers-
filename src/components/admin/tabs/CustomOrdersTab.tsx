import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Kanban,
  Table as TableIcon,
  Search,
  Download,
  Plus,
  Clock,
  Calendar,
  User,
  ArrowRight,
  Eye,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { CustomOrderRecord, CustomOrderStage } from "../../../types";
import { DemoStorage } from "../../../services/storage";
import { CustomOrderDetailModal } from "./CustomOrderDetailModal";

interface CustomOrdersTabProps {
  customOrders: CustomOrderRecord[];
  onOrdersUpdated: () => void;
}

const STAGES: CustomOrderStage[] = [
  "New Request",
  "Quoted",
  "Approved",
  "In Production",
  "Quality Check",
  "Ready",
  "Delivered",
];

export const CustomOrdersTab: React.FC<CustomOrdersTabProps> = ({
  customOrders,
  onOrdersUpdated,
}) => {
  const [viewMode, setViewMode] = useState<"board" | "table">("table");
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("All");

  // Selected modal order
  const [selectedOrder, setSelectedOrder] = useState<CustomOrderRecord | null>(
    null,
  );

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return customOrders.filter((c) => {
      const matchesSearch =
        c.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.customerPhone.includes(searchQuery) ||
        c.jewelleryType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.assignedKarigar.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStage = stageFilter === "All" || c.stage === stageFilter;

      return matchesSearch && matchesStage;
    });
  }, [customOrders, searchQuery, stageFilter]);

  const handleAdvanceStage = (
    e: React.MouseEvent,
    order: CustomOrderRecord,
  ) => {
    e.stopPropagation();
    const currentIndex = STAGES.indexOf(order.stage);
    if (currentIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentIndex + 1];
      DemoStorage.updateCustomOrderStage(order.id, nextStage);
      onOrdersUpdated();
    }
  };

  const handleExportCSV = () => {
    DemoStorage.exportCSV("custom_orders");
  };

  // Group by stage for Board view
  const stageGroups = useMemo(() => {
    const groups: Record<CustomOrderStage, CustomOrderRecord[]> = {
      "New Request": [],
      Quoted: [],
      Approved: [],
      "In Production": [],
      "Quality Check": [],
      Ready: [],
      Delivered: [],
    };
    filteredOrders.forEach((o) => {
      if (groups[o.stage]) {
        groups[o.stage].push(o);
      }
    });
    return groups;
  }, [filteredOrders]);

  const totalCommissionsValue = customOrders.reduce(
    (sum, c) => sum + c.quotedAmountPKR,
    0,
  );
  const totalGoldTolas = customOrders
    .reduce((sum, c) => sum + c.estimatedWeightTolas, 0)
    .toFixed(2);
  const totalInProduction = customOrders.filter(
    (c) => c.stage === "In Production" || c.stage === "Quality Check",
  ).length;

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
            Bespoke Jewellery Commissions
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Stage pipeline tracker from bridal sketch consultation to hallmark
            casting and delivery
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="button-primary" onClick={() => setCreating(true)}>
            New custom order
          </button>
          {/* View mode toggle */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-md text-xs font-medium border border-stone-200">
            <button
              onClick={() => setViewMode("board")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors text-xs ${
                viewMode === "board"
                  ? "bg-white text-stone-900 font-semibold shadow-2xs"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Stage Board</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors text-xs ${
                viewMode === "table"
                  ? "bg-white text-stone-900 font-semibold shadow-2xs"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-md text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-stone-200 text-xs">
        <div>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
            Total Commissions
          </span>
          <span className="text-base font-bold font-mono text-stone-900">
            {customOrders.length} Pieces
          </span>
        </div>
        <div>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
            In Workshop
          </span>
          <span className="text-base font-bold font-mono text-stone-900">
            {totalInProduction} Active Jobs
          </span>
        </div>
        <div>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
            Committed Gold
          </span>
          <span className="text-base font-bold font-mono text-amber-900">
            {totalGoldTolas} Tolas
          </span>
        </div>
        <div>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
            Total Pipeline Value
          </span>
          <span className="text-base font-bold font-mono text-[var(--charcoal)]">
            Rs. {totalCommissionsValue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search custom ref, client, karigar or item..."
            className="w-full bg-[var(--surface)] border border-stone-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        {viewMode === "table" && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 text-[11px]">Filter Stage:</span>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-[var(--surface)] border border-stone-200 rounded px-2 py-1 text-xs text-stone-800 font-medium focus:outline-none"
            >
              <option value="All">All Stages</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Stage Board (Kanban View) */}
      {viewMode === "board" ? (
        <div className="flex gap-3 overflow-x-auto pb-4 pt-1 items-start min-h-[500px]">
          {STAGES.map((stage, sIdx) => {
            const list = stageGroups[stage] || [];
            const stageTotalPKR = list.reduce(
              (sum, item) => sum + item.quotedAmountPKR,
              0,
            );

            return (
              <div
                key={stage}
                className="w-[280px] shrink-0 bg-[var(--background)] rounded-lg border border-stone-200 flex flex-col max-h-[75vh]"
              >
                {/* Column Header */}
                <div className="p-3 border-b border-stone-200 bg-white/60 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-900 truncate">
                      {stage}
                    </span>
                    <span className="text-[10px] bg-stone-100 text-stone-600 font-mono px-1.5 py-0.2 rounded font-bold">
                      {list.length}
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                    Rs. {stageTotalPKR.toLocaleString()}
                  </div>
                </div>

                {/* Cards Container */}
                <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                  {list.length === 0 ? (
                    <div className="py-8 text-center text-stone-400 text-[11px] italic">
                      No jobs in this stage
                    </div>
                  ) : (
                    list.map((order) => {
                      const balance = Math.max(
                        0,
                        order.quotedAmountPKR - order.depositPaidPKR,
                      );
                      const isDelivered = order.stage === "Delivered";

                      return (
                        <div
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className="p-3 bg-white rounded-md border border-stone-200 shadow-2xs hover:border-[var(--accent)] transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-mono font-bold text-stone-900 group-hover:text-[var(--charcoal)]">
                              {order.reference}
                            </span>
                            <span className="text-[10px] font-mono text-[var(--charcoal)] font-semibold bg-[var(--charcoal)]/5 px-1.5 py-0.2 rounded">
                              Due {order.promisedDeliveryDate.slice(5)}
                            </span>
                          </div>

                          <div className="font-medium text-stone-800 text-xs truncate">
                            {order.jewelleryType}
                          </div>

                          <div className="text-[11px] text-stone-500 mt-0.5 truncate">
                            {order.customerName} ({order.customerPhone})
                          </div>

                          {/* Karat and Weight */}
                          <div className="flex items-center gap-2 mt-2 text-[10px] text-stone-500 font-mono">
                            <span className="bg-stone-50 border border-stone-150 px-1.5 py-0.2 rounded">
                              {order.karatCode}
                            </span>
                            <span>
                              {order.estimatedWeightGrams}g (
                              {order.estimatedWeightTolas} tol)
                            </span>
                          </div>

                          {/* Valuation Strip */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px]">
                            <span className="font-mono font-semibold text-stone-900">
                              Rs. {order.quotedAmountPKR.toLocaleString()}
                            </span>
                            {balance > 0 ? (
                              <span className="text-[10px] font-mono text-amber-700">
                                Bal: {balance.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-emerald-700">
                                Paid
                              </span>
                            )}
                          </div>

                          {/* Artisan & Advance Button */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[10px]">
                            <span className="text-stone-400 truncate max-w-[140px]">
                              {order.assignedKarigar.split(" ")[0]}{" "}
                              {order.assignedKarigar.split(" ")[1] || ""}
                            </span>

                            {!isDelivered && (
                              <button
                                onClick={(e) => handleAdvanceStage(e, order)}
                                className="inline-flex items-center gap-0.5 text-[var(--charcoal)] hover:text-[var(--action-hover)] font-semibold hover:underline"
                                title="Advance to next atelier stage"
                              >
                                <span>Advance</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-lg border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-[var(--surface)] text-stone-500 uppercase tracking-wider text-[10px] font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Commission Type</th>
                  <th className="py-2.5 px-3">Purity & Wt</th>
                  <th className="py-2.5 px-3 font-mono">Quoted Amount</th>
                  <th className="py-2.5 px-3 font-mono">Balance Due</th>
                  <th className="py-2.5 px-3">Current Stage</th>
                  <th className="py-2.5 px-3">Assigned Karigar</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((order) => {
                  const balance = Math.max(
                    0,
                    order.quotedAmountPKR - order.depositPaidPKR,
                  );
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-stone-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-3 font-mono font-medium text-stone-900">
                        {order.reference}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-stone-900">
                          {order.customerName}
                        </div>
                        <div className="text-[11px] text-stone-400 font-mono">
                          {order.customerPhone}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-stone-800">
                        {order.jewelleryType}
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <div>{order.metalPurity}</div>
                        <div className="text-[10px] text-stone-400">
                          {order.estimatedWeightGrams}g (
                          {order.estimatedWeightTolas} tol)
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-stone-900">
                        Rs. {order.quotedAmountPKR.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span
                          className={
                            balance > 0
                              ? "text-amber-800 font-semibold"
                              : "text-emerald-700"
                          }
                        >
                          Rs. {balance.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium font-mono bg-amber-50 text-amber-800 border border-amber-200">
                          {order.stage}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-stone-600">
                        {order.assignedKarigar}
                      </td>
                      <td className="py-3 px-3 font-mono text-stone-600">
                        {order.promisedDeliveryDate}
                      </td>
                      <td
                        className="py-3 px-3 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 text-xs text-[var(--charcoal)] hover:underline font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Manage</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {(selectedOrder || creating) && (
        <CustomOrderDetailModal
          customOrder={selectedOrder}
          isOpen={Boolean(selectedOrder) || creating}
          onClose={() => {
            setSelectedOrder(null);
            setCreating(false);
          }}
          onOrderUpdated={onOrdersUpdated}
        />
      )}
    </div>
  );
};
