import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  User,
  Phone,
  MessageCircle,
  Eye,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import {
  CustomerRecord,
  AdminOrderRecord,
  CustomOrderRecord,
} from "../../../types";
import { DemoStorage } from "../../../services/storage";
import { CustomerDetailDrawer } from "./CustomerDetailDrawer";

interface CustomersTabProps {
  customers: CustomerRecord[];
  orders: AdminOrderRecord[];
  customOrders: CustomOrderRecord[];
  onCustomersUpdated: () => void;
}

export const CustomersTab: React.FC<CustomersTabProps> = ({
  customers,
  orders,
  customOrders,
  onCustomersUpdated,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBalance, setFilterBalance] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerRecord | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.preferredMetal.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBalance = !filterBalance || c.outstandingBalancePKR > 0;

      return matchesSearch && matchesBalance;
    });
  }, [customers, searchQuery, filterBalance]);

  const handleExportCSV = () => {
    DemoStorage.exportCSV("customers");
  };

  const totalClientsSpend = customers.reduce(
    (sum, c) => sum + c.totalSpendPKR,
    0,
  );
  const totalClientsDues = customers.reduce(
    (sum, c) => sum + c.outstandingBalancePKR,
    0,
  );

  return (
    <div className="space-y-4">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
            Client Directory & Patron Book
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Client profiles, purchase histories, bespoke commissions, and
            outstanding dues
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-md text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export Customers (.CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-stone-200 text-xs">
        <div>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
            Registered Patrons
          </span>
          <span className="text-base font-bold font-mono text-stone-900">
            {customers.length} Clients
          </span>
        </div>
        <div>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
            With Active Balances
          </span>
          <span className="text-base font-bold font-mono text-stone-900">
            {customers.filter((c) => c.outstandingBalancePKR > 0).length}{" "}
            Clients
          </span>
        </div>
        <div>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
            Total Booked Spend
          </span>
          <span className="text-base font-bold font-mono text-stone-900">
            Rs. {totalClientsSpend.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
            Total Receivables
          </span>
          <span className="text-base font-bold font-mono text-[var(--charcoal)]">
            Rs. {totalClientsDues.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-3 rounded-lg border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, city, phone..."
            className="w-full bg-[var(--surface)] border border-stone-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer bg-[var(--surface)] px-2.5 py-1.5 rounded border border-stone-200">
            <input
              type="checkbox"
              checked={filterBalance}
              onChange={(e) => setFilterBalance(e.target.checked)}
              className="rounded text-[var(--charcoal)]"
            />
            <span className="text-stone-700">
              Only Clients with Unpaid Balance
            </span>
          </label>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[var(--surface)] text-stone-500 uppercase tracking-wider text-[10px] font-semibold border-b border-stone-200">
              <tr>
                <th className="py-2.5 px-3">Client Name</th>
                <th className="py-2.5 px-3">Phone & City</th>
                <th className="py-2.5 px-3">Preferred Metal</th>
                <th className="py-2.5 px-3 text-center">Orders</th>
                <th className="py-2.5 px-3 text-center">Bespoke</th>
                <th className="py-2.5 px-3 font-mono">Total Spend (PKR)</th>
                <th className="py-2.5 px-3 font-mono">Outstanding Balance</th>
                <th className="py-2.5 px-3">Last Active</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCustomers.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedCustomer(c)}
                  className="hover:bg-stone-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3">
                    <div className="font-semibold text-stone-900">{c.name}</div>
                    <div className="text-[11px] text-stone-400 truncate max-w-[200px]">
                      {c.notes}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <div className="text-stone-800">{c.phone}</div>
                    <div className="text-[10px] text-stone-400">{c.city}</div>
                  </td>
                  <td className="py-3 px-3 text-stone-700">
                    <span className="bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded text-[10px] font-mono">
                      {c.preferredMetal}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-medium text-stone-800">
                    {c.totalOrders}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-medium text-stone-800">
                    {c.totalCustomOrders}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-stone-900">
                    Rs. {c.totalSpendPKR.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span
                      className={
                        c.outstandingBalancePKR > 0
                          ? "text-[var(--charcoal)] font-semibold"
                          : "text-stone-400"
                      }
                    >
                      Rs. {c.outstandingBalancePKR.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-stone-500">
                    {c.lastActive}
                  </td>
                  <td
                    className="py-3 px-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="inline-flex items-center gap-1 text-xs text-[var(--charcoal)] hover:underline font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Profile</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <CustomerDetailDrawer
          customer={selectedCustomer}
          orders={orders}
          customOrders={customOrders}
          onClose={() => setSelectedCustomer(null)}
          onCustomerUpdated={() => {
            onCustomersUpdated();
            const updated = DemoStorage.getCustomerById(selectedCustomer.id);
            if (updated) setSelectedCustomer(updated);
          }}
        />
      )}
    </div>
  );
};
