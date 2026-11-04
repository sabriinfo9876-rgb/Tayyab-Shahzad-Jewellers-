import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  ShoppingBag,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  AdminOrderRecord,
  FulfilmentStatus,
  PaymentStatus,
} from "../../../types";
import { DemoStorage } from "../../../services/storage";
import { OrderDetailDrawer } from "./OrderDetailDrawer";

interface OrdersTabProps {
  orders: AdminOrderRecord[];
  onOrderUpdated: () => void;
  selectedOrderFromHeader?: AdminOrderRecord | null;
  onClearSelectedOrder?: () => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  onOrderUpdated,
  selectedOrderFromHeader,
  onClearSelectedOrder,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fulfilmentFilter, setFulfilmentFilter] = useState<string>("All");
  const [paymentFilter, setPaymentFilter] = useState<string>("All");
  const [sortField, setSortField] = useState<"date" | "total">("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Active drawer order
  const [drawerOrder, setDrawerOrder] = useState<AdminOrderRecord | null>(
    selectedOrderFromHeader || null,
  );

  // Sync when header passed an order
  React.useEffect(() => {
    if (selectedOrderFromHeader) {
      setDrawerOrder(selectedOrderFromHeader);
    }
  }, [selectedOrderFromHeader]);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        const matchesQuery =
          o.orderReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.customerPhone.includes(searchQuery) ||
          (o.customerCity &&
            o.customerCity.toLowerCase().includes(searchQuery.toLowerCase())) ||
          o.items.some((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()),
          );

        const matchesFulfilment =
          fulfilmentFilter === "All" || o.fulfilmentStatus === fulfilmentFilter;

        const matchesPayment =
          paymentFilter === "All" || o.paymentStatus === paymentFilter;

        return matchesQuery && matchesFulfilment && matchesPayment;
      })
      .sort((a, b) => {
        if (sortField === "date") {
          const valA = new Date(a.confirmedDate).getTime();
          const valB = new Date(b.confirmedDate).getTime();
          return sortAsc ? valA - valB : valB - valA;
        } else {
          const valA = a.agreedAmountPKR || 0;
          const valB = b.agreedAmountPKR || 0;
          return sortAsc ? valA - valB : valB - valA;
        }
      });
  }, [
    orders,
    searchQuery,
    fulfilmentFilter,
    paymentFilter,
    sortField,
    sortAsc,
  ]);

  React.useEffect(
    () => setCurrentPage(1),
    [searchQuery, fulfilmentFilter, paymentFilter, sortField, sortAsc],
  );

  // Paginated chunk
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleExportCSV = () => {
    DemoStorage.exportCSV("orders");
  };

  const totalRevenue = filteredOrders.reduce(
    (sum, o) => sum + (o.agreedAmountPKR || 0),
    0,
  );
  const totalOutstanding = filteredOrders.reduce(
    (sum, o) =>
      sum + Math.max(0, (o.agreedAmountPKR || 0) - (o.paidAmountPKR || 0)),
    0,
  );

  return (
    <div className="space-y-4">
      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
            Orders & Client Book
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Complete showroom order register, status tracking, payments and
            invoices
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-md text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export Orders (.CSV)</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-stone-200 text-xs">
        <div>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
            Filtered Orders
          </span>
          <span className="text-base font-bold font-mono text-stone-900">
            {filteredOrders.length}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
            Total Book Value
          </span>
          <span className="text-base font-bold font-mono text-stone-900">
            Rs. {totalRevenue.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
            Pending Receivables
          </span>
          <span className="text-base font-bold font-mono text-[var(--charcoal)]">
            Rs. {totalOutstanding.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
            Workshop Load
          </span>
          <span className="text-base font-bold font-mono text-stone-900">
            {
              orders.filter((o) => o.fulfilmentStatus === "In Production")
                .length
            }{" "}
            Active
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by order #, client, phone, item..."
            className="w-full bg-[var(--surface)] border border-stone-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Fulfilment Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 text-[11px]">Fulfilment:</span>
            <select
              value={fulfilmentFilter}
              onChange={(e) => {
                setFulfilmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[var(--surface)] border border-stone-200 rounded px-2 py-1 text-xs text-stone-800 font-medium focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="In Production">In Production</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 text-[11px]">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[var(--surface)] border border-stone-200 rounded px-2 py-1 text-xs text-stone-800 font-medium focus:outline-none"
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid in Full</option>
              <option value="Partial">Partial / Advance</option>
              <option value="Pending">Pending / Unpaid</option>
            </select>
          </div>

          {/* Sort Button */}
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="p-1 border border-stone-200 hover:bg-stone-50 rounded text-stone-600"
            title="Toggle sort direction"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Orders Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[var(--surface)] text-stone-500 uppercase tracking-wider text-[10px] font-semibold border-b border-stone-200">
              <tr>
                <th className="py-2.5 px-3">Order Ref</th>
                <th className="py-2.5 px-3">Customer & Contact</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-3">Booking Date</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3 font-mono">Total (PKR)</th>
                <th className="py-2.5 px-3 font-mono">Balance (PKR)</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3">Fulfilment</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-stone-400">
                    No orders matching selected search and filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const total = order.agreedAmountPKR || 0;
                  const paid = order.paidAmountPKR || 0;
                  const balance = Math.max(0, total - paid);
                  const isPaid = order.paymentStatus === "Paid";
                  const isPartial = order.paymentStatus === "Partial";

                  return (
                    <tr
                      key={order.orderReference}
                      className="hover:bg-stone-50/80 transition-colors cursor-pointer"
                      onClick={() => setDrawerOrder(order)}
                    >
                      {/* Order Ref */}
                      <td className="py-3 px-3 font-mono font-medium text-stone-900">
                        {order.orderReference}
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-3">
                        <div className="font-medium text-stone-900">
                          {order.customerName}
                        </div>
                        <div className="text-[11px] text-stone-400 font-mono">
                          {order.customerPhone}{" "}
                          {order.customerCity && `• ${order.customerCity}`}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          {order.items[0]?.image && (
                            <img
                              src={order.items[0].image}
                              alt=""
                              className="w-7 h-7 rounded object-cover border border-stone-200 shrink-0"
                            />
                          )}
                          <div className="truncate max-w-[140px]">
                            <span className="truncate block font-medium text-stone-800">
                              {order.items[0]?.name}
                            </span>
                            {order.items.length > 1 && (
                              <span className="text-[10px] text-stone-400">
                                +{order.items.length - 1} more
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Booking Date */}
                      <td className="py-3 px-3 font-mono text-stone-600">
                        {order.confirmedDate}
                      </td>

                      {/* Promised Delivery Date */}
                      <td className="py-3 px-3 font-mono text-stone-600">
                        {order.promisedDate || "Standard"}
                      </td>

                      {/* Total Value */}
                      <td className="py-3 px-3 font-mono font-semibold text-stone-900">
                        Rs. {total.toLocaleString()}
                      </td>

                      {/* Balance */}
                      <td className="py-3 px-3 font-mono">
                        <span
                          className={
                            balance > 0
                              ? "text-[var(--charcoal)] font-semibold"
                              : "text-stone-400"
                          }
                        >
                          Rs. {balance.toLocaleString()}
                        </span>
                      </td>

                      {/* Payment Status Badge */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium font-mono ${
                            isPaid
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : isPartial
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-rose-50 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {order.paymentStatus || "Pending"}
                        </span>
                      </td>

                      {/* Fulfilment Status Badge */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium font-mono bg-stone-100 text-stone-700">
                          {order.fulfilmentStatus || "New"}
                        </span>
                      </td>

                      {/* Action */}
                      <td
                        className="py-3 px-3 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setDrawerOrder(order)}
                          className="inline-flex items-center gap-1 text-xs text-[var(--charcoal)] hover:text-[var(--action-hover)] font-medium hover:underline"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-t border-stone-200 bg-[var(--surface)] flex items-center justify-between text-xs text-stone-500">
          <div>
            Showing{" "}
            {filteredOrders.length ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
            {Math.min(currentPage * pageSize, filteredOrders.length)} of{" "}
            {filteredOrders.length} orders
          </div>

          <div className="flex items-center gap-1">
            <button
              aria-label="Previous orders page"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-stone-200 hover:bg-white disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-medium text-stone-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              aria-label="Next orders page"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-stone-200 hover:bg-white disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Drawer */}
      {drawerOrder && (
        <OrderDetailDrawer
          order={
            orders.find(
              (o) => o.orderReference === drawerOrder?.orderReference,
            ) || null
          }
          onClose={() => {
            setDrawerOrder(null);
            if (onClearSelectedOrder) onClearSelectedOrder();
          }}
          onOrderUpdated={() => {
            onOrderUpdated();
            // Refresh currently viewed order from storage
            const updated = DemoStorage.getOrderByReference(
              drawerOrder.orderReference,
            );
            if (updated) setDrawerOrder(updated);
          }}
        />
      )}
    </div>
  );
};
