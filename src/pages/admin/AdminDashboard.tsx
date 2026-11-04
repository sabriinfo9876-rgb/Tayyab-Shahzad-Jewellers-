import { DemoAccess } from "../../services/demoAccess";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminSidebar, AdminTab } from "../../components/admin/AdminSidebar";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { OverviewTab } from "../../components/admin/tabs/OverviewTab";
import { OrdersTab } from "../../components/admin/tabs/OrdersTab";
import { InventoryTab } from "../../components/admin/tabs/InventoryTab";
import { CustomOrdersTab } from "../../components/admin/tabs/CustomOrdersTab";
import { CustomersTab } from "../../components/admin/tabs/CustomersTab";
import { GoldRatesTab } from "../../components/admin/tabs/GoldRatesTab";
import { ReportsTab } from "../../components/admin/tabs/ReportsTab";
import { SettingsTab } from "../../components/admin/tabs/SettingsTab";
import { DemoStorage } from "../../services/storage";
import {
  Product,
  AdminOrderRecord,
  CustomOrderRecord,
  CustomerRecord,
  MetalRatesData,
  StoreSettings,
} from "../../types";

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = DemoAccess.get()?.role;
  const tabRoutes: Record<string, AdminTab> = {
    orders: "orders",
    inventory: "inventory",
    "custom-orders": "custom_orders",
    customers: "customers",
    rates: "rates",
    reports: "reports",
    settings: "settings",
  };
  const [accessNotice, setAccessNotice] = useState("");
  const chooseTab = (tab: AdminTab) => {
    if (role !== "owner" && tab !== "overview") {
      setAccessNotice(
        "Staff demo has overview access only. Owner demo is required for record access.",
      );
      return;
    }
    const slug = Object.keys(tabRoutes).find((k) => tabRoutes[k] === tab);
    navigate("/admin" + (slug ? "/" + slug : ""));
  };

  // Navigation & Layout state
  const activeTab: AdminTab =
    role === "staff"
      ? "overview"
      : tabRoutes[location.pathname.split("/")[2]] || "overview";
  const setActiveTab = chooseTab;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Stored state
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<AdminOrderRecord[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrderRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [ratesData, setRatesData] = useState<MetalRatesData>(
    DemoStorage.getRates(),
  );
  const [settings, setSettings] = useState<StoreSettings>(
    DemoStorage.getSettings(),
  );

  // Cross-component triggers
  const [selectedOrderForDrawer, setSelectedOrderForDrawer] =
    useState<AdminOrderRecord | null>(null);
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] =
    useState(false);

  // Synchronize state from DemoStorage
  const syncAll = () => {
    setProducts(DemoStorage.getProducts());
    setOrders(DemoStorage.getOrders());
    setCustomOrders(DemoStorage.getCustomOrders());
    setCustomers(DemoStorage.getCustomers());
    setRatesData(DemoStorage.getRates());
    setSettings(DemoStorage.getSettings());
  };

  useEffect(() => {
    syncAll();
    window.addEventListener("tsj-storage-updated", syncAll);
    return () => window.removeEventListener("tsj-storage-updated", syncAll);
  }, []);

  const handleSignOut = () => {
    DemoAccess.logout();
    navigate("/admin/login", { replace: true });
  };

  // Badge counts
  const pendingOrdersCount = orders.filter(
    (o) =>
      o.fulfilmentStatus === "New" || o.fulfilmentStatus === "In Production",
  ).length;

  const activeCustomCount = customOrders.filter(
    (c) =>
      c.stage === "In Production" ||
      c.stage === "Quality Check" ||
      c.stage === "New Request",
  ).length;

  return (
    <div className="admin-shell min-h-screen bg-[var(--background)] flex text-stone-800 antialiased font-sans">
      {/* 1. Collapsible Left Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== "orders") {
            setSelectedOrderForDrawer(null);
          }
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        pendingOrdersCount={pendingOrdersCount}
        activeCustomCount={activeCustomCount}
        onSignOut={handleSignOut}
      />

      {/* 2. Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Slim Header with search, live gold ticker, alerts */}
        <AdminHeader
          context={activeTab.replace("_", " ")}
          onSignOut={handleSignOut}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          ratesData={ratesData}
          orders={orders}
          customOrders={customOrders}
          products={products}
          onSelectTab={(tab) => setActiveTab(tab)}
          onOpenNewProduct={() => {
            setActiveTab("inventory");
            setIsCreateProductModalOpen(true);
          }}
          onSelectOrder={(order) => {
            setActiveTab("orders");
            setSelectedOrderForDrawer(order);
          }}
        />

        <div className="admin-demo-notice">
          Demo workspace · sample data stored in this browser · no real payments
          or secure owner authentication.
          {role === "staff" && " Staff permission: overview only."}
        </div>
        {accessNotice && (
          <p role="status" className="admin-demo-notice">
            {accessNotice}
          </p>
        )}
        {/* Tab Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-7xl w-full mx-auto">
          {activeTab === "overview" && (
            <OverviewTab
              orders={orders}
              customOrders={customOrders}
              products={products}
              onSelectTab={(tab) => setActiveTab(tab)}
              onSelectOrder={(order) => {
                setActiveTab("orders");
                setSelectedOrderForDrawer(order);
              }}
              onOpenNewProduct={() => {
                setActiveTab("inventory");
                setIsCreateProductModalOpen(true);
              }}
            />
          )}

          {activeTab === "orders" && (
            <OrdersTab
              orders={orders}
              onOrderUpdated={syncAll}
              selectedOrderFromHeader={selectedOrderForDrawer}
              onClearSelectedOrder={() => setSelectedOrderForDrawer(null)}
            />
          )}

          {activeTab === "inventory" && (
            <InventoryTab
              products={products}
              onProductsUpdated={syncAll}
              isCreateModalOpen={isCreateProductModalOpen}
              onCloseCreateModal={() => setIsCreateProductModalOpen(false)}
            />
          )}

          {activeTab === "custom_orders" && (
            <CustomOrdersTab
              customOrders={customOrders}
              onOrdersUpdated={syncAll}
            />
          )}

          {activeTab === "customers" && (
            <CustomersTab
              customers={customers}
              orders={orders}
              customOrders={customOrders}
              onCustomersUpdated={syncAll}
            />
          )}

          {activeTab === "rates" && (
            <GoldRatesTab ratesData={ratesData} onRatesUpdated={syncAll} />
          )}

          {activeTab === "reports" && (
            <ReportsTab
              orders={orders}
              customOrders={customOrders}
              products={products}
              customers={customers}
            />
          )}

          {activeTab === "settings" && (
            <SettingsTab settings={settings} onSettingsUpdated={syncAll} />
          )}
        </main>
      </div>
    </div>
  );
};
