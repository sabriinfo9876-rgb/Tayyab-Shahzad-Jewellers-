import { DemoAccess } from "../../services/demoAccess";
import { AccessibleDialog } from "../common/AccessibleDialog";
import React from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Sparkles,
  Users,
  Coins,
  BarChart3,
  Sliders,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LogOut,
  X,
} from "lucide-react";
import { TsjLogo } from "../common/TsjLogo";

export type AdminTab =
  | "overview"
  | "orders"
  | "inventory"
  | "custom_orders"
  | "customers"
  | "rates"
  | "reports"
  | "settings";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  pendingOrdersCount: number;
  activeCustomCount: number;
  onSignOut: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  pendingOrdersCount,
  activeCustomCount,
  onSignOut,
}) => {
  const navItems: {
    id: AdminTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingBag,
      badge: pendingOrdersCount,
    },
    { id: "inventory", label: "Products & Inventory", icon: Package },
    {
      id: "custom_orders",
      label: "Custom Orders",
      icon: Sparkles,
      badge: activeCustomCount,
    },
    { id: "customers", label: "Customers", icon: Users },
    { id: "rates", label: "Gold Rates", icon: Coins },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Sliders },
  ];

  const handleItemClick = (id: AdminTab) => {
    onSelectTab(id);
    if (mobileOpen) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[var(--charcoal)] text-stone-200 border-r border-[var(--charcoal)] select-none">
      {/* Brand & Logo Header */}
      <div
        className={`flex items-center px-4 py-4 border-b border-[var(--charcoal)] ${collapsed ? "justify-center" : "justify-between"}`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-[var(--dark-surface)] flex items-center justify-center p-1 border border-[var(--accent)]/40 shrink-0">
            <TsjLogo size={32} />
          </div>
          {!collapsed && (
            <div className="leading-tight truncate">
              <span className="block font-serif tracking-wider text-sm font-medium text-[var(--on-dark)] uppercase truncate">
                Tayyab Shahzad
              </span>
              <span className="text-[10px] tracking-widest text-[var(--accent)] font-medium uppercase">
                Jewellers
              </span>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden text-stone-400 hover:text-white p-1 rounded-md"
          title="Close Navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <nav
        aria-label="Admin navigation"
        className="flex-1 py-4 px-2 space-y-1 overflow-y-auto"
      >
        <div className={`px-2 mb-2 ${collapsed ? "text-center" : ""}`}>
          {!collapsed && (
            <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-500">
              Management
            </span>
          )}
        </div>

        {navItems
          .filter(
            (item) =>
              DemoAccess.get()?.role === "owner" || item.id === "overview",
          )
          .map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                title={item.label}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-colors relative group ${
                  isActive
                    ? "bg-[var(--dark-surface)] text-[var(--on-dark)] font-semibold border-l-2 border-[var(--accent)]"
                    : "text-stone-300 hover:bg-[var(--dark-surface)] hover:text-[var(--on-dark)]"
                } ${collapsed ? "justify-center px-0" : ""}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 stroke-[1.75] ${isActive ? "text-[var(--accent)]" : "text-stone-400 group-hover:text-stone-200"}`}
                />

                {!collapsed && (
                  <span className="flex-1 text-left truncate">
                    {item.label}
                  </span>
                )}

                {/* Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`inline-flex items-center justify-center text-[10px] font-bold rounded-full px-1.5 py-0.2 shrink-0 ${
                      isActive
                        ? "bg-[var(--accent)] text-[var(--charcoal)]"
                        : "bg-[var(--charcoal)] text-stone-200 border border-[var(--accent)]/30"
                    } ${collapsed ? "absolute top-1 right-2 w-4 h-4 p-0 text-[9px]" : ""}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-[var(--charcoal)] space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-stone-300 hover:text-white hover:bg-[var(--dark-surface)] transition-colors ${
            collapsed ? "justify-center px-0" : ""
          }`}
          title="Open Public Showroom"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
          {!collapsed && <span>View Storefront</span>}
        </a>

        <button
          onClick={onSignOut}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-stone-400 hover:text-red-300 hover:bg-red-950/30 transition-colors ${
            collapsed ? "justify-center px-0" : ""
          }`}
          title="Sign Out of Demo Admin"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>

        {/* Desktop Collapse Toggle */}
        <div className="hidden lg:block pt-2">
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center py-1.5 rounded-md text-stone-400 hover:text-stone-200 hover:bg-[var(--dark-surface)] text-[11px] font-mono transition-colors"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <span className="flex items-center gap-1.5">
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Collapse Bar</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-200 ease-in-out h-screen sticky top-0 ${
          collapsed ? "w-[72px]" : "w-[230px]"
        }`}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <AccessibleDialog title="Admin navigation" onClose={onCloseMobile}>
          <div className="min-h-[420px]">{sidebarContent}</div>
        </AccessibleDialog>
      )}
    </>
  );
};
