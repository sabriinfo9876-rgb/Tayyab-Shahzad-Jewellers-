import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  Menu,
  X,
  Search,
  TrendingUp,
  MessageCircle,
  Phone,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { TsjLogo } from "./TsjLogo";
import { DemoStorage } from "../../services/storage";
import { StoreSettings } from "../../types";

interface HeaderProps {
  onOpenRates: () => void;
  onOpenAssistant?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRates,
  onOpenAssistant,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [bagCount, setBagCount] = useState(0);
  const [settings, setSettings] = useState<StoreSettings>(
    DemoStorage.getSettings(),
  );
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const homeHeaderRef = useRef<HTMLElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen && !searchOpen) return;
    const dialog = document.querySelector<HTMLElement>(
      '[aria-label="Navigation Menu"]',
    );
    const close = dialog?.querySelector<HTMLButtonElement>("button");
    close?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setSearchOpen(false);
        if (mobileMenuOpen) menuTriggerRef.current?.focus();
        else
          homeHeaderRef.current
            ?.querySelector<HTMLButtonElement>(
              '[aria-label="Search collection"]',
            )
            ?.focus();
      }
      if (event.key === "Tab" && dialog) {
        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>("a[href], button, input"),
        ).filter((el) => el.getClientRects().length > 0);
        const first = focusable[0],
          last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileMenuOpen, searchOpen]);

  const syncState = () => {
    setWishlistCount(DemoStorage.getWishlist().length);
    setBagCount(DemoStorage.getBagTotalCount());
    setSettings(DemoStorage.getSettings());
  };

  useEffect(() => {
    syncState();
    window.addEventListener("tsj-storage-updated", syncState);
    return () => window.removeEventListener("tsj-storage-updated", syncState);
  }, []);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close search/drawer on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { label: "Collections", href: "/collections" },
    { label: "Bridal Suite", href: "/bridal" },
    { label: "Pakistani Chandi", href: "/pakistani-chandi" },
    { label: "Italian Designs", href: "/italian-designs" },
    { label: "Custom Atelier", href: "/custom-orders" },
    { label: "Our Story", href: "/our-story" },
    { label: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const whatsappNum = settings.whatsappNumber || "92312345678";
  const displayPhone = settings.phone || "0312-345678";

  // Mobile Drawer Component rendered via Portal to document.body
  const mobileDrawer =
    mobileMenuOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 z-[99999] flex"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            {/* Full-screen dark backdrop */}
            <div
              className="fixed inset-0 bg-black/75  transition-opacity duration-300 animate-fadeIn"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-over panel attached to left, full viewport height */}
            <div className="relative z-10 w-[88vw] max-w-[340px] bg-[var(--surface)] shadow-2xl flex flex-col justify-between h-[100dvh] overflow-y-auto animate-slideInLeft border-r border-[var(--charcoal)]/15">
              {/* Top Header inside Drawer */}
              <div>
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[var(--charcoal)]/10 bg-[var(--on-dark)]">
                  <TsjLogo size={38} showTextLabel={true} />
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      menuTriggerRef.current?.focus();
                    }}
                    className="min-w-11 min-h-11 flex items-center justify-center p-2 text-[var(--charcoal)] hover:text-[var(--accent)] hover:bg-[var(--charcoal)]/10 rounded-full transition-colors"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick Search inside Drawer */}
                <div className="p-3.5 border-b border-[var(--charcoal)]/10 bg-white">
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center gap-2 bg-[var(--on-dark)] px-3 py-2.5 rounded-xl border border-[var(--charcoal)]/15"
                  >
                    <Search className="w-4 h-4 text-[var(--accent-ink)] shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search jewellery"
                      placeholder="Search jewellery by code or design..."
                      className="w-full bg-transparent text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="submit"
                        className="text-[10px] text-[var(--charcoal)] uppercase font-bold tracking-wider px-1"
                      >
                        Go
                      </button>
                    )}
                  </form>
                </div>

                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-7 py-3 text-sm underline"
                >
                  Saved pieces ({wishlistCount})
                </Link>
                {/* Navigation Links */}
                <nav className="p-3.5 space-y-1">
                  {navLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 ${
                          active
                            ? "bg-[var(--charcoal)] text-[var(--on-dark)] font-bold shadow-xs"
                            : "text-[var(--text-primary)] hover:bg-[var(--charcoal)]/5 hover:text-[var(--charcoal)]"
                        }`}
                      >
                        <span className="font-medium">{link.label}</span>
                        <ChevronRight
                          className={`w-4 h-4 ${active ? "text-[var(--accent)]" : "text-[var(--accent)]/70"}`}
                        />
                      </Link>
                    );
                  })}

                  {/* Live Gold Rates Drawer Item */}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenRates();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs uppercase tracking-wider text-[var(--charcoal)] hover:bg-[var(--accent)]/10 transition-colors text-left"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
                      Sample Metal Rates (Gold &amp; Chandi)
                    </span>
                    <ChevronRight className="w-4 h-4 text-[var(--accent)]" />
                  </button>
                </nav>

                {/* Bespoke Atelier Highlight Card */}
                <div className="mx-3.5 mt-2 p-3.5  from-[var(--charcoal)] to-[var(--charcoal)] text-[var(--on-dark)] rounded-2xl shadow-sm border border-[var(--accent)]/30">
                  <div className="flex items-center gap-1.5 text-[var(--accent)] text-[11px] font-semibold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Bespoke Atelier Consultation
                  </div>
                  <p className="text-[11px] text-[var(--on-dark)]/85 leading-snug">
                    Work directly with our master goldsmiths for wedding suites,
                    heirlooms &amp; pure chandi.
                  </p>
                  <Link
                    to="/custom-orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--accent)] hover:underline"
                  >
                    Submit Custom Order Brief →
                  </Link>
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="p-4 border-t border-[var(--charcoal)]/10 bg-[var(--on-dark)] space-y-3">
                <a
                  href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent("Assalam-o-Alaikum Tayyab Shahzad Jewellers, I would like to consult on your jewellery collection.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--charcoal)] hover:bg-[var(--action-hover)] text-[var(--on-dark)] text-xs font-semibold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4 text-[var(--accent)]" />
                  WhatsApp: 0312-345678
                </a>

                <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] px-1 pt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[var(--accent-ink)]" />
                    {displayPhone}
                  </span>
                  <Link
                    to="/admin-demo/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[var(--charcoal)] hover:underline font-semibold"
                  >
                    Admin Portal
                  </Link>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      {isHome ? (
        <header
          ref={homeHeaderRef}
          className={`cinematic-header ${scrolled ? "cinematic-header--solid" : ""}`}
        >
          <div className="cinematic-header__bar">
            <Link
              to="/"
              className="cinematic-header__brand"
              aria-label="Tayyab Shahzad Jewellers Home"
            >
              <TsjLogo size={40} showTextLabel lightText />
            </Link>
            <nav
              className="cinematic-header__nav"
              aria-label="Primary navigation"
            >
              <Link to="/collections">Collections</Link>
              <Link to="/bridal">Bridal</Link>
              <Link to="/custom-orders">Bespoke</Link>
            </nav>
            <div className="cinematic-header__actions">
              <button
                type="button"
                className="cinematic-header__search"
                aria-label="Search collection"
                aria-expanded={searchOpen}
                aria-controls="home-search"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                ref={menuTriggerRef}
                className="cinematic-header__menu"
                aria-label="Open mobile navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-haspopup="dialog"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>
              <Link
                to="/bag"
                aria-label={`Enquiry Bag with ${bagCount} items`}
                className="cinematic-header__bag"
              >
                <ShoppingBag size={21} strokeWidth={1.5} />
                {bagCount > 0 && <span>{bagCount}</span>}
              </Link>
            </div>
          </div>
          {searchOpen && (
            <form
              id="home-search"
              className="cinematic-header__search-form"
              role="search"
              onSubmit={handleSearchSubmit}
            >
              <input
                autoFocus
                type="search"
                aria-label="Search jewellery"
                placeholder="Search jewellery…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">Search</button>
              <button
                type="button"
                aria-label="Close search"
                onClick={() => {
                  setSearchOpen(false);
                  homeHeaderRef.current
                    ?.querySelector<HTMLButtonElement>(
                      '[aria-label="Search collection"]',
                    )
                    ?.focus();
                }}
              >
                <X size={20} />
              </button>
            </form>
          )}
        </header>
      ) : (
        <header ref={homeHeaderRef} className="store-header">
          <div className="store-header__bar">
            <Link
              className="store-header__brand"
              to="/"
              aria-label="Tayyab Shahzad Jewellers Home"
            >
              <TsjLogo size={40} showTextLabel />
            </Link>
            <nav aria-label="Primary navigation" className="store-header__nav">
              <Link to="/collections">Collections</Link>
              <Link to="/bridal">Bridal</Link>
              <Link to="/custom-orders">Bespoke</Link>
            </nav>
            <div className="store-header__actions">
              <button
                className="store-header__search icon-button"
                type="button"
                aria-label="Search collection"
                aria-expanded={searchOpen}
                aria-controls="store-search"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search size={20} />
              </button>
              <Link
                className="store-header__wishlist icon-button"
                to="/wishlist"
                aria-label={`Wishlist with ${wishlistCount} items`}
              >
                <Heart size={20} />
              </Link>
              <button
                ref={menuTriggerRef}
                type="button"
                className="icon-button"
                aria-label="Open mobile navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-haspopup="dialog"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={22} />
              </button>
              <Link
                className="icon-button relative"
                to="/bag"
                aria-label={`Enquiry Bag with ${bagCount} items`}
              >
                <ShoppingBag size={21} />
                {bagCount > 0 && (
                  <span className="store-bag-count">{bagCount}</span>
                )}
              </Link>
            </div>
          </div>
          {searchOpen && (
            <form
              id="store-search"
              className="store-header__search-form"
              role="search"
              onSubmit={handleSearchSubmit}
            >
              <input
                type="search"
                autoFocus
                aria-label="Search jewellery"
                placeholder="Search jewellery…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="button-primary" type="submit">
                Search
              </button>
              <button
                className="icon-button"
                type="button"
                aria-label="Close search"
                onClick={() => {
                  setSearchOpen(false);
                  homeHeaderRef.current
                    ?.querySelector<HTMLButtonElement>(
                      '[aria-label="Search collection"]',
                    )
                    ?.focus();
                }}
              >
                <X size={20} />
              </button>
            </form>
          )}
        </header>
      )}

      {/* Render Mobile Drawer outside header via React Portal */}
      {mobileDrawer}
    </>
  );
};
