import { CheckoutPage } from "./pages/CheckoutPage";
import { DemoAccess, safeAdminDestination } from "./services/demoAccess";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

// Layout & Common Components
import { Header } from "./components/common/Header";
import { Footer } from "./components/common/Footer";
import { RatesModal } from "./components/common/RatesModal";
import { DemoGuideModal } from "./components/common/DemoGuideModal";
import { ChatAssistant } from "./components/common/ChatAssistant";

// Storefront Pages
import { HomePage } from "./pages/HomePage";
import { CatalogPage } from "./pages/CatalogPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { BridalPage } from "./pages/BridalPage";
import { ChandiPage } from "./pages/ChandiPage";
import { ItalianDesignsPage } from "./pages/ItalianDesignsPage";
import { CustomOrderPage } from "./pages/CustomOrderPage";
import { WishlistPage } from "./pages/WishlistPage";
import { EnquiryBagPage } from "./pages/EnquiryBagPage";
import { EnquiryReceiptPage } from "./pages/EnquiryReceiptPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import { OurStoryPage } from "./pages/OurStoryPage";
import { ContactPage } from "./pages/ContactPage";
import { FaqPage } from "./pages/FaqPage";
import { DemoGuidePage } from "./pages/DemoGuidePage";
import { NotFoundPage } from "./pages/NotFoundPage";

// Admin Pages
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";

// Helper component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function DemoAdminRoute() {
  const location = useLocation();
  const [session, setSession] = useState(DemoAccess.get());
  useEffect(() => {
    const sync = () => setSession(DemoAccess.get());
    const timer = window.setInterval(sync, 1000);
    window.addEventListener("tsj-demo-session", sync);
    return () => {
      clearInterval(timer);
      window.removeEventListener("tsj-demo-session", sync);
    };
  }, []);
  if (!session)
    return (
      <Navigate
        to={
          "/admin/login?next=" +
          encodeURIComponent(safeAdminDestination(location.pathname))
        }
        replace
      />
    );
  return <AdminDashboard />;
}

// App Content with route-aware header/footer rendering
function AppContent() {
  const location = useLocation();
  const [ratesModalOpen, setRatesModalOpen] = useState(false);
  const [demoGuideModalOpen, setDemoGuideModalOpen] = useState(false);

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isOrderFlow = [
    "/checkout",
    "/order-confirmation",
    "/order-status",
  ].some((path) => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)] font-sans">
      <ScrollToTop />

      {/* Storefront Header */}
      {!isAdminRoute && <Header onOpenRates={() => setRatesModalOpen(true)} />}

      {/* Main Routed Content */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<CatalogPage />} />
          <Route path="/collections/:category" element={<CatalogPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/bridal" element={<BridalPage />} />
          <Route path="/pakistani-chandi" element={<ChandiPage />} />
          <Route path="/italian-designs" element={<ItalianDesignsPage />} />
          <Route path="/custom-orders" element={<CustomOrderPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route
            path="/order-status/:reference"
            element={<OrderConfirmationPage statusView />}
          />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/bag" element={<EnquiryBagPage />} />
          <Route path="/enquiry-bag" element={<EnquiryBagPage />} />
          <Route
            path="/enquiry-receipt/:reference"
            element={<EnquiryReceiptPage />}
          />
          <Route
            path="/order-confirmation/:reference"
            element={<OrderConfirmationPage />}
          />
          <Route
            path="/order-confirmation"
            element={<OrderConfirmationPage />}
          />
          <Route
            path="/rates"
            element={
              <div className="py-12">
                <RatesModal
                  isOpen={true}
                  onClose={() => window.history.back()}
                />
              </div>
            }
          />
          <Route path="/our-story" element={<OurStoryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/demo-guide" element={<DemoGuidePage />} />

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin-demo/login"
            element={<Navigate to="/admin/login" replace />}
          />
          <Route
            path="/admin-demo/*"
            element={<Navigate to="/admin" replace />}
          />
          <Route path="/admin/*" element={<DemoAdminRoute />} />

          {/* 404 handler */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {/* Storefront Footer */}
      {!isAdminRoute && (
        <Footer
          onOpenDemoGuide={() => setDemoGuideModalOpen(true)}
          onOpenRates={() => setRatesModalOpen(true)}
        />
      )}

      {/* Global Interactive Scripted Assistant */}
      {!isAdminRoute && !isOrderFlow && <ChatAssistant />}

      {/* Rates Drawer Modal */}
      <RatesModal
        isOpen={ratesModalOpen}
        onClose={() => setRatesModalOpen(false)}
      />

      {/* Demo Guide Presentation Modal */}
      <DemoGuideModal
        isOpen={demoGuideModalOpen}
        onClose={() => setDemoGuideModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
