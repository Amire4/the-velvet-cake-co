import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard.tsx';
import { Product } from '../types.ts';

interface CakesProps {
  products: Product[];
  onCustomizeProduct?: (product: Product) => void;
  onNavigate: (path: string) => void;
}

const CATEGORIES = [
  'All Collections',
  'Signature Cakes',
  'Wedding Cakes',
  'Seasonal Specials',
  'Mini Treats',
];

export default function Cakes({ products, onCustomizeProduct, onNavigate }: CakesProps) {
  const [selectedCategory, setSelectedCategory] = useState('All Collections');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All Collections' ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10"
    >
      {/* Page Heading */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto space-y-3"
      >
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8C6D4F]">
          Manhattan Patisserie
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C1810]">
          Signature Cake Collections
        </h1>
        <p className="text-sm sm:text-base text-[#6E5A4E] font-light">
          Baked to order every morning with European butter, pure Madagascar vanilla, and single-origin Valrhona chocolate. Free Manhattan delivery on orders over $100.
        </p>
      </motion.div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E8DFC8] shadow-sm space-y-4">
        
        {/* Category Tabs with Motion */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <motion.button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#721C24] text-white shadow-sm'
                    : 'bg-[#FAF7F2] text-[#4A3B32] hover:bg-[#F4EBE1]'
                }`}
              >
                {cat}
              </motion.button>
            );
          })}
        </div>

        {/* Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-[#F4EBE1]">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#8C6D4F] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cakes by name, flavor notes, or chocolate..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs sm:text-sm text-[#2C1810] focus:outline-none focus:border-[#721C24]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-[#8C6D4F] shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl px-3 py-2.5 text-xs text-[#4A3B32] focus:outline-none focus:border-[#721C24] w-full sm:w-auto"
            >
              <option value="featured">Sort: Featured Bestsellers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Alphabetical: A to Z</option>
            </select>
          </div>
        </div>

      </div>

      {/* Products Grid */}
      <AnimatePresence mode="wait">
        {filteredProducts.length === 0 ? (
          <motion.div 
            key="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 bg-white rounded-3xl border border-[#E8DFC8] space-y-4"
          >
            <Sparkles className="w-10 h-10 text-[#8C6D4F] mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#2C1810]">No Cakes Match Your Filter</h3>
            <p className="text-xs sm:text-sm text-[#6E5A4E] max-w-sm mx-auto font-light">
              Try resetting your search query or category filter, or request a custom bespoke flavor.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All Collections');
                setSearchQuery('');
              }}
              className="px-6 py-2 rounded-full bg-[#721C24] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key={`grid-${selectedCategory}-${sortBy}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                index={idx}
                onCustomize={onCustomizeProduct}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Cake Atelier Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-[#F5EFE6] rounded-3xl p-8 border border-[#E8E1D5] flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs uppercase font-bold tracking-widest text-[#B8860B]">
            Need a Bespoke Masterpiece?
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#2D2926]">
            Custom Cake Studio & Consultation
          </h2>
          <p className="text-sm text-[#5C554E] max-w-xl font-light">
            Design your cake tier by tier with 30+ gourmet sponge recipes, luxury curd fillings, custom plaques, and dietary modifications.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate('/custom-cakes')}
          className="px-8 py-3.5 rounded-full bg-[#7D0A0A] hover:bg-[#5E0707] text-white text-xs font-semibold uppercase tracking-widest shadow-md transition-all shrink-0 inline-flex items-center gap-2"
        >
          <span>Open Custom Studio</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>

    </motion.div>
  );
}
