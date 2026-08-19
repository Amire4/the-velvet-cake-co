import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Award, Truck, HeartHandshake, ShieldCheck, Star, ChevronRight, CheckCircle2, Cake, Gift, Heart, Calendar } from 'lucide-react';
import ProductCard from '../components/ProductCard.tsx';
import CakeFlavorCard from '../components/CakeFlavorCard.tsx';
import GoogleMapSection from '../components/GoogleMapSection.tsx';
import { Product, CakeFlavor } from '../types.ts';

interface HomeProps {
  products: Product[];
  flavors: CakeFlavor[];
  onNavigate: (path: string) => void;
  onCustomizeProduct?: (product: Product) => void;
}

export default function Home({ products, flavors, onNavigate, onCustomizeProduct }: HomeProps) {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'All' | 'Signature Cakes' | 'Wedding Cakes' | 'Mini Treats' | 'Seasonal Specials'>('All');

  const featuredProducts = products.filter(p => p.featured);
  const displayFlavors = flavors.slice(0, 8);

  const categoryFilteredProducts = activeCategoryFilter === 'All'
    ? products
    : products.filter(p => p.category === activeCategoryFilter);

  const categoryList = [
    { name: 'Signature Cakes', count: products.filter(p => p.category === 'Signature Cakes').length, icon: Cake, desc: 'Luxury multi-layer centerpieces' },
    { name: 'Wedding Cakes', count: products.filter(p => p.category === 'Wedding Cakes').length, icon: Heart, desc: 'Tiered bespoke wedding masterpieces' },
    { name: 'Mini Treats', count: products.filter(p => p.category === 'Mini Treats').length, icon: Gift, desc: 'Macarons, cupcakes & brownies' },
    { name: 'Seasonal Specials', count: products.filter(p => p.category === 'Seasonal Specials').length, icon: Calendar, desc: 'Cheesecakes, tarts & party boxes' },
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#FDFCF0] border-b border-[#E8E1D5]">
        {/* Subtle background ambient blur blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5EFE6] rounded-full filter blur-3xl opacity-60 -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#7D0A0A]/5 rounded-full filter blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5EFE6] border border-[#E8E1D5] text-[#7D0A0A] text-xs font-semibold uppercase tracking-widest shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>Manhattan's Bespoke Patisserie</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2D2926] leading-[1.15]"
              >
                Crafted for Every <span className="italic text-[#7D0A0A]">Celebration</span>.
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-base sm:text-lg text-[#5C554E] leading-relaxed max-w-2xl font-light"
              >
                "Every celebration deserves something extraordinary." From velvet-layered wedding centerpieces to handcrafted daily pastries, we bake memorable centerpieces using pure Madagascar vanilla, French Valrhona cocoa, and European butter.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
              >
                <motion.button
                  id="hero-order-cakes-btn"
                  onClick={() => onNavigate('/cakes')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-full bg-[#7D0A0A] hover:bg-[#5E0707] text-[#FDFCF0] text-xs sm:text-sm font-semibold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Order Signature Cakes</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button
                  id="hero-custom-studio-btn"
                  onClick={() => onNavigate('/custom-cakes')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-full border border-[#7D0A0A] text-[#7D0A0A] hover:bg-[#F5EFE6] text-xs sm:text-sm font-semibold uppercase tracking-widest transition-all text-center"
                >
                  Custom Cake Studio
                </motion.button>
              </motion.div>

              {/* Trust Badges */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="pt-6 border-t border-[#E8E1D5] flex flex-wrap items-center gap-6 text-xs text-[#8E877D]"
              >
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#7D0A0A]" />
                  <span>Same-Day Manhattan Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#B8860B]" />
                  <span>30+ Signature Flavors</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Fresh Scratch Baking Daily</span>
                </div>
              </motion.div>

            </motion.div>

            {/* Right Hero Visual Collage */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Hero Cake Image with subtle floating animation */}
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                  className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#F5EFE6]"
                >
                  <img
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80"
                    alt="The Velvet Cake Co. Signature Centerpiece"
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                </motion.div>

                {/* Floating Rating Pill */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-[#E8E1D5] flex items-center gap-3 cursor-default"
                >
                  <div className="w-10 h-10 rounded-full bg-[#7D0A0A] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    4.9
                  </div>
                  <div>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs font-semibold text-[#2D2926] mt-0.5">Over 2,500+ Celebrations</p>
                    <p className="text-[10px] text-[#8E877D]">Manhattan & NYC Area</p>
                  </div>
                </motion.div>

                {/* Floating Recipe Pill */}
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-[#E8E1D5] hidden sm:flex items-center gap-2 text-xs font-serif font-bold text-[#7D0A0A] cursor-default"
                >
                  <Sparkles className="w-4 h-4 text-[#B8860B]" />
                  <span>Pure Valrhona & Madagascar Vanilla</span>
                </motion.div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORY SPOTLIGHT (Guaranteed 5+ items per category) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-2"
        >
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#B8860B]">
            Browse By Specialization
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2926]">
            Every Category Handcrafted Fresh Daily
          </h2>
          <p className="text-sm text-[#5C554E]">
            Each bakery collection features at least 5-6 chef-crafted artisan recipes.
          </p>
        </motion.div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryList.map((cat, i) => {
            const Icon = cat.icon;
            const isSelected = activeCategoryFilter === cat.name;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                onClick={() => setActiveCategoryFilter(isSelected ? 'All' : cat.name as any)}
                className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-[#7D0A0A] text-white border-[#7D0A0A] shadow-xl'
                    : 'bg-white text-[#2D2926] border-[#E8E1D5] hover:border-[#7D0A0A]/40 shadow-sm hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white/15 text-[#FDFCF0]' : 'bg-[#F5EFE6] text-[#7D0A0A]'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${isSelected ? 'bg-white/20 text-white' : 'bg-[#FAF7F2] text-[#7D0A0A] border border-[#E8E1D5]'}`}>
                    {cat.count} Cakes Available
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold">{cat.name}</h3>
                  <p className={`text-xs mt-1 ${isSelected ? 'text-[#E8E1D5]' : 'text-[#5C554E]'}`}>
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-current/10 flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
                  <span>{isSelected ? 'Showing Category' : 'Explore Category'}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. VALUE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: Award,
              title: 'Artisanal Integrity',
              desc: 'Every sponge is baked fresh from raw scratch ingredients with zero artificial flavorings or preservatives.',
            },
            {
              icon: Sparkles,
              title: '30+ Signature Flavors',
              desc: 'From our legendary Classic Red Velvet to Raspberry Champagne and Pistachio Rosewater infusions.',
            },
            {
              icon: Truck,
              title: 'Temperature-Controlled Delivery',
              desc: 'Chilled white-glove courier service across Manhattan & NYC boroughs. Free delivery on orders $100+.',
            },
            {
              icon: HeartHandshake,
              title: 'Bespoke Event Atelier',
              desc: 'Dedicated consultations for weddings, anniversaries, corporate milestones, and custom sculpted cakes.',
            },
          ].map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-2xl border border-[#E8E1D5] shadow-sm hover:shadow-md transition-shadow space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F5EFE6] text-[#7D0A0A] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#2D2926]">{pillar.title}</h3>
                <p className="text-xs sm:text-sm text-[#5C554E] leading-relaxed font-light">{pillar.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. EXPLORE PRODUCTS GRID (Filtered or Bestsellers) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#B8860B]">
              {activeCategoryFilter === 'All' ? 'Signature Showcase' : activeCategoryFilter}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2926]">
              {activeCategoryFilter === 'All' ? 'Bestsellers & Favorites' : `${activeCategoryFilter} (${categoryFilteredProducts.length} Items)`}
            </h2>
            <p className="text-sm text-[#5C554E]">
              Prepared fresh for same-day delivery or pickup at 245 Lexington Ave.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeCategoryFilter !== 'All' && (
              <button
                onClick={() => setActiveCategoryFilter('All')}
                className="px-4 py-2 rounded-full border border-[#E8E1D5] text-xs font-semibold uppercase tracking-wider text-[#5C554E] hover:bg-[#F5EFE6] transition-colors"
              >
                Show All Collections
              </button>
            )}
            <button
              onClick={() => onNavigate('/cakes')}
              className="inline-flex items-center gap-1.5 text-xs uppercase font-semibold tracking-wider text-[#7D0A0A] hover:text-[#5E0707] transition-colors"
            >
              <span>View Full Menu</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(activeCategoryFilter === 'All' ? featuredProducts : categoryFilteredProducts).map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              index={idx}
              onCustomize={onCustomizeProduct}
            />
          ))}
        </div>
      </section>

      {/* 5. FLAVORS SHOWCASE (30+ FLAVORS SPOTLIGHT) */}
      <section className="bg-[#F5EFE6]/60 py-16 border-y border-[#E8E1D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto space-y-3"
          >
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#B8860B]">
              The Velvet Flavor Library
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2926]">
              30+ Master Crafted Flavors
            </h2>
            <p className="text-sm text-[#5C554E]">
              Every flavor has been perfected through years of artisanal refinement. Mix and match for your custom cake creations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayFlavors.map((flavor, index) => (
              <CakeFlavorCard
                key={flavor.id || index}
                flavor={flavor}
                index={index}
              />
            ))}
          </div>

          <div className="text-center pt-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('/custom-cakes')}
              className="px-8 py-3.5 rounded-full bg-[#7D0A0A] hover:bg-[#5E0707] text-white text-xs font-semibold uppercase tracking-widest shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Explore All 30+ Flavors in Custom Studio</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

        </div>
      </section>

      {/* 6. CUSTOM CAKE ATELIER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-[#1A1615] rounded-3xl overflow-hidden shadow-2xl text-[#FDFCF0] p-8 sm:p-12 lg:p-16 border border-[#2D2926] relative"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#B8860B]">
                Bespoke Design Studio • 24–48hr Notice
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Design Your Dream <br />
                <span className="italic text-[#E8E1D5]">Celebration Cake</span>
              </h2>
              <p className="text-sm sm:text-base text-[#D1C7BD] leading-relaxed font-light">
                Whether you envision a 4-tier floral wedding spectacle or a chic vintage Lambeth birthday cake, our master pastry team brings your creative vision to life.
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-[#E8E1D5]">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B8860B]" />
                  <span>Choose from 30+ sponge recipes, artisan curd fillings, and silk buttercreams</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B8860B]" />
                  <span>Dietary modifications available (Eggless, Vegan, Gluten-Friendly)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B8860B]" />
                  <span>Complimentary price quotation within 24 hours</span>
                </div>
              </div>

              <div className="pt-2">
                <motion.button
                  id="custom-atelier-cta-btn"
                  onClick={() => onNavigate('/custom-cakes')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-full bg-[#7D0A0A] hover:bg-[#5E0707] text-white text-xs uppercase tracking-widest font-semibold shadow-lg transition-all flex items-center gap-2"
                >
                  <span>Launch Custom Cake Builder</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Custom Cake Showcase Image */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#3D3833]">
                <img
                  src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1000&q=80"
                  alt="Custom Wedding Cake Creation"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80';
                  }}
                />
              </div>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* 7. GOOGLE MAPS LOCATION & VISITOR SECTION */}
      <GoogleMapSection />

    </div>
  );
}
