import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  MessageCircle, 
  Video, 
  ExternalLink, 
  ChevronRight
} from 'lucide-react';
import { DemoStorage } from '../services/storage';
import { ProductCard } from '../components/product/ProductCard';
import { Product, StoreSettings } from '../types';

export const HomePage: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>(DemoStorage.getSettings());
  const [products, setProducts] = useState<Product[]>(DemoStorage.getProducts());

  const syncData = () => {
    setSettings(DemoStorage.getSettings());
    setProducts(DemoStorage.getProducts());
  };

  useEffect(() => {
    syncData();
    window.addEventListener('tsj-storage-updated', syncData);
    return () => window.removeEventListener('tsj-storage-updated', syncData);
  }, []);

  // Selected Pieces: 4 exact showcase pieces from prompt section 6:
  // 1. Floral Bangle Trio (prod-10)
  // 2. Heart Pendant (prod-11)
  // 3. Rose Solitaire Ring (prod-08)
  // 4. Filigree Charm Bracelet (prod-06)
  const targetIds = ['prod-10', 'prod-11', 'prod-08', 'prod-06'];
  const selectedPieces = targetIds
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => p !== undefined && p.published);
  
  // Fallback if needed
  const displayPieces = selectedPieces.length === 4 
    ? selectedPieces 
    : products.filter(p => p.published && p.featured).slice(0, 4);

  // 4 Categories for "Explore the Collections" matching Section 6
  const categoryTiles = [
    {
      title: 'Rings',
      slug: 'rings',
      image: '/images/08-rose-solitaire-ring.webp',
      countLabel: 'Solitaires & Fine Bands'
    },
    {
      title: 'Bangles',
      slug: 'bangles',
      image: '/images/10-floral-bangle-trio.webp',
      countLabel: 'Kadas, Cuffs & Charms'
    },
    {
      title: 'Earrings',
      slug: 'earrings',
      image: '/images/14-illustrative-jhumkas.webp',
      countLabel: 'Heritage Jhumkas & Studs'
    },
    {
      title: 'Necklaces',
      slug: 'necklaces',
      image: '/images/11-heart-pendant.webp',
      countLabel: 'Pendants & Imperial Sets'
    }
  ];

  // 3 TikTok Video Showcases for "Jewellery in Motion"
  const motionVideos = [
    {
      title: 'Imperial Bridal Haar in 22K Gold & Basra Pearls',
      tag: '#BridalJewellery',
      thumbnail: '/images/hero-bridal.webp',
      tiktokUrl: settings.tiktokUrl || 'https://www.tiktok.com/@tayyab.shahzad.jewellers'
    },
    {
      title: 'Handcrafted Floral Gold Bangles Trio in Motion',
      tag: '#GoldKadas',
      thumbnail: '/images/10-floral-bangle-trio.webp',
      tiktokUrl: settings.tiktokUrl || 'https://www.tiktok.com/@tayyab.shahzad.jewellers'
    },
    {
      title: 'Pakistani Chandi Pure Silver Polki Jhumkas',
      tag: '#PakistaniChandi',
      thumbnail: '/images/14-illustrative-jhumkas.webp',
      tiktokUrl: settings.tiktokUrl || 'https://www.tiktok.com/@tayyab.shahzad.jewellers'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Editorial adaptation of supplied demo imagery; not tied to an individual purchasable SKU.
          Replace hero-stone-* with an approved product photograph before a production launch. */}
      <section className="cinematic-hero" aria-labelledby="hero-heading">
        <picture className="cinematic-hero__media">
          <source media="(max-width: 767px)" srcSet="/images/hero-stone-640.webp 640w, /images/hero-stone-960.webp 960w" sizes="100vw" />
          <img
            src="/images/hero-stone-1600.webp"
            srcSet="/images/hero-stone-960.webp 960w, /images/hero-stone-1600.webp 1600w"
            sizes="(min-width: 768px) 65vw, 100vw"
            width="1536" height="1024"
            alt="Gold bridal necklace with a central pendant and matching jhumka earrings on dark stone"
            fetchPriority="high" loading="eager" decoding="async"
          />
        </picture>
        <div className="cinematic-hero__copy">
          <h1 id="hero-heading">Gold.<br />With presence.</h1>
          <p>Discover the bridal collection.</p>
          <Link to="/bridal" className="cinematic-hero__cta">Explore Bridal <span aria-hidden="true">→</span></Link>
        </div>
        <p className="cinematic-hero__caption">THE BRIDAL COLLECTION</p>
      </section>

      {/* Brand Introduction Strip - naturally places longer description & metadata beneath hero */}
      <section className="bg-[var(--surface)] border-y border-[var(--charcoal)]/10 py-5 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-sm sm:text-base text-[var(--charcoal)]/85 font-serif italic max-w-2xl">
            {settings.heroDescription || 'Explore gold jewellery, Pakistani chandi, Italian designs, and custom bridal heirlooms at Tayyab Shahzad Jewellers.'}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2.5 sm:gap-4 text-[11px] uppercase tracking-wider text-[var(--accent-ink)] font-medium">
            <span>Pure 21K/22K Gold</span>
            <span className="text-[var(--accent)]/40">•</span>
            <span>Pakistani Chandi</span>
            <span className="text-[var(--accent)]/40">•</span>
            <span>Italian Designs</span>
            <span className="text-[var(--accent)]/40">•</span>
            <span>Custom Orders</span>
          </div>
        </div>
      </section>

      {/* 2. SECTION A: EXPLORE THE COLLECTIONS (4 Portrait Tiles) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[var(--charcoal)]/10 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--accent-ink)] font-semibold block mb-1">
              Curated Categories
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--charcoal)]">
              Explore the Collections
            </h2>
          </div>
          <Link
            to="/collections"
            className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-[var(--charcoal)] hover:text-[var(--accent)] transition-colors"
          >
            <span>View All Pieces</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Portrait Tiles with Rounded Cards & Hover Lift Animation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categoryTiles.map(tile => (
            <Link
              key={tile.slug}
              to={`/collections/${tile.slug}`}
              className="group relative block aspect-[3/4] bg-[var(--surface-secondary)] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 ease-out border border-[var(--charcoal)]/10"
            >
              <img
                src={tile.image}
                alt={tile.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0  from-black/85 via-black/30 to-transparent transition-opacity group-hover:opacity-90"></div>
              
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-semibold block mb-0.5">
                  {tile.countLabel}
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg sm:text-xl font-medium tracking-wide">
                    {tile.title}
                  </h3>
                  <div className="w-7 h-7 rounded-full bg-white/20  flex items-center justify-center transform group-hover:translate-x-1 group-hover:bg-[var(--accent)] group-hover:text-[var(--charcoal)] transition-all duration-300">
                    <ChevronRight className="w-4 h-4 text-white group-hover:text-[var(--charcoal)]" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. SECTION B: SELECTED PIECES (4 products across desktop, 2 on mobile) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[var(--charcoal)]/10 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--accent-ink)] font-semibold block mb-1">
              Handpicked Masterpieces
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--charcoal)]">
              Selected Pieces
            </h2>
          </div>
          <p className="text-xs text-[var(--text-secondary)] max-w-md">
            Each creation is an original realization of heritage metalwork, handcrafted with verified gemstones and fine gold alloys.
          </p>
        </div>

        {/* 4 products across on desktop, 2 across on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayPieces.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. SECTION C: BRIDAL EDITORIAL (Split image & text, using 15-illustrative-bridal-detail.webp) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--surface-secondary)]/60 border border-[var(--charcoal)]/15 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Editorial Image */}
            <div className="lg:col-span-7 aspect-[4/3] lg:aspect-auto lg:h-[480px] bg-[var(--charcoal)] overflow-hidden">
              <img
                src={settings.bridalEditorialImage || '/images/15-illustrative-bridal-detail.webp'}
                alt="Pakistani Bridal Celebration Suite Detail"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Editorial Copy */}
            <div className="lg:col-span-5 p-8 sm:p-12 space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="w-5 h-[1px] bg-[var(--accent-ink)]"></span>
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent-ink)] font-semibold">
                  Bridal Editorial
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-[var(--charcoal)] leading-snug">
                {settings.bridalEditorialHeading || 'Chosen for your celebration.'}
              </h2>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {settings.bridalEditorialText || 'Each bespoke bridal piece is conceived as a future heirloom, uniting imperial Pakistani kundan tradition with balanced contemporary delicacy.'}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={`https://wa.me/${settings.whatsappNumber || '92312345678'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--charcoal)] hover:bg-[var(--action-hover)] text-[var(--on-dark)] text-xs uppercase tracking-widest font-semibold rounded-xl shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4 text-[var(--accent)]" />
                  <span>Discuss Your Bridal Requirements</span>
                </a>
                <Link
                  to="/bridal"
                  className="inline-flex items-center justify-center px-6 py-3.5 border border-[var(--charcoal)]/30 hover:border-[var(--charcoal)] hover:bg-white/50 text-[var(--charcoal)] text-xs uppercase tracking-widest font-medium rounded-xl transition-all"
                >
                  View Bridal Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION D: JEWELLERY IN MOTION (3 portrait previews with honest TikTok links) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[var(--charcoal)]/10 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--accent-ink)] font-semibold block mb-1">
              Living Craft &amp; Luster
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--charcoal)]">
              Jewellery in Motion
            </h2>
          </div>
          <a
            href={settings.tiktokUrl || 'https://www.tiktok.com/@tayyab.shahzad.jewellers'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--charcoal)] hover:text-[var(--accent)] transition-colors"
          >
            <span>Follow on TikTok (@tayyab.shahzad.jewellers)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3 Portrait Previews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {motionVideos.map((video, idx) => (
            <div
              key={idx}
              className="bg-white border border-[var(--charcoal)]/10 rounded-2xl overflow-hidden flex flex-col group shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out"
            >
              <div className="relative aspect-[9/14] bg-[var(--charcoal)] overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0  from-black/85 via-black/25 to-transparent"></div>

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-black/60  text-[10px] text-white rounded-full font-mono">
                    {video.tag}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <p className="text-white text-xs font-serif font-medium mb-3 line-clamp-2">
                    {video.title}
                  </p>
                  <a
                    href={video.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-white/95 hover:bg-white text-[var(--text-primary)] text-xs font-semibold rounded-xl shadow-sm transition-all hover:scale-[1.02]"
                  >
                    <Video className="w-3.5 h-3.5 text-[var(--charcoal)]" />
                    <span>View on TikTok</span>
                    <ExternalLink className="w-3 h-3 text-[var(--text-secondary)]" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SECTION E: CUSTOM ORDERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--charcoal)] text-[var(--on-dark)] rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-[var(--accent)]/30 shadow-md">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[var(--accent)] font-semibold block">
              Bespoke Atelier Service
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal tracking-wide">
              Custom Orders &amp; Heirloom Commissions
            </h2>
            <p className="text-xs sm:text-sm text-[var(--on-dark)]/85 leading-relaxed font-light">
              Bring your family heirloom redesign, custom bridal vision, or personal sketch to life. Our generational goldsmiths work with you step-by-step from initial concept to master setting.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                to="/custom-orders"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-[var(--accent)] hover:bg-[var(--accent)] text-[var(--text-primary)] text-xs uppercase tracking-widest font-semibold rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
              >
                Request Custom Order
              </Link>
              <Link
                to="/our-story"
                className="text-xs uppercase tracking-wider text-[var(--on-dark)] hover:text-[var(--accent)] underline underline-offset-4 font-medium"
              >
                Learn About Our Atelier
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECTION F: CONTACT STRIP */}
      <section className="bg-[var(--surface-secondary)] py-12 border-y border-[var(--charcoal)]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="text-xs uppercase tracking-widest text-[var(--accent-ink)] font-semibold block mb-1">
              Personalized Consultation
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--charcoal)]">
              Let us help you find your piece.
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Direct line: {settings.phone} ({settings.internationalPhone})
            </p>
          </div>

          <a
            href={`https://wa.me/${settings.whatsappNumber || '92312345678'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[var(--charcoal)] hover:bg-[var(--action-hover)] text-[var(--on-dark)] text-xs uppercase tracking-widest font-semibold rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 text-[var(--accent)]" />
            <span>Enquire on WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
};
