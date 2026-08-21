import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ShoppingBag, Coffee, Award, Check, Star, MessageSquare } from 'lucide-react';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import RatingReviewModal from '../components/RatingReviewModal.tsx';

interface MenuProps {
  products: Product[];
  onNavigate: (path: string) => void;
  onProductUpdated?: (updatedProduct: Product) => void;
}

const MENU_SECTIONS = [
  {
    id: 'layer-cakes',
    title: 'Signature Layer Cakes',
    subtitle: 'Classic 8-inch double and triple layer centerpieces',
    category: 'Signature Cakes',
  },
  {
    id: 'wedding-cakes',
    title: 'Wedding & Grand Celebrations',
    subtitle: 'Sculpted tiers, sugar flora & champagne reductions',
    category: 'Wedding Cakes',
  },
  {
    id: 'seasonal',
    title: 'Seasonal Pastry Collections',
    subtitle: 'Limited-edition creations celebrating seasonal harvests',
    category: 'Seasonal Specials',
  },
  {
    id: 'mini-treats',
    title: 'Macarons, Cupcakes & Confections',
    subtitle: 'French macarons, velvet cupcakes & petit fours',
    category: 'Mini Treats',
  },
];

const BEVERAGES = [
  { name: 'Double Origin Espresso', price: '$4.50', desc: 'Custom dark roast pulled on our Italian Synesso machine.' },
  { name: 'Velvet Madagascar Latte', price: '$6.50', desc: 'Espresso, steamed oat milk, and real vanilla bean syrup.' },
  { name: 'Valrhona Hot Chocolate', price: '$7.00', desc: 'Rich 70% dark chocolate melted with whole milk and sea salt.' },
  { name: 'Ceremonial Uji Matcha Latte', price: '$6.75', desc: 'Single-estate Japanese green tea whisked with steamed almond milk.' },
  { name: 'Earl Grey Lavender Tea', price: '$5.00', desc: 'Bergamot-infused whole leaf black tea with dried French lavender.' },
];

export default function Menu({ products, onNavigate, onProductUpdated }: MenuProps) {
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selectedProductForReview, setSelectedProductForReview] = useState<Product | null>(null);

  const handleAdd = (product: Product) => {
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Menu Header */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto space-y-3"
      >
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8C6D4F]">
          The Velvet Patisserie Menu
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C1810]">
          Artisanal Bakery & Cafe Menu
        </h1>
        <p className="text-sm sm:text-base text-[#6E5A4E] font-light">
          Every item is handcrafted daily at our 245 Lexington Ave kitchen using French Valrhona cocoa, European cultured butter, and fresh seasonal fruits.
        </p>
      </motion.div>

      {/* Categorized Menu Sections */}
      <div className="space-y-16">
        {MENU_SECTIONS.map((section, sIdx) => {
          const sectionProducts = products.filter(
            (p) => p.category.toLowerCase() === section.category.toLowerCase()
          );

          if (sectionProducts.length === 0) return null;

          return (
            <motion.div 
              key={section.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.5, delay: sIdx * 0.08 }}
              className="space-y-6"
            >
              <div className="border-b border-[#E8DFC8] pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
                    {section.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#8C6D4F]">{section.subtitle}</p>
                </div>
                <span className="text-xs text-[#8C6D4F] font-mono">
                  {sectionProducts.length} Selections Available
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sectionProducts.map((product, pIdx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.4, delay: (pIdx % 2) * 0.06 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="bg-white p-5 rounded-2xl border border-[#E8DFC8] hover:border-[#721C24]/30 shadow-xs hover:shadow-lg transition-all flex gap-4 items-center justify-between"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-[#E8DFC8] shrink-0"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80';
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-base sm:text-lg font-bold text-[#2C1810] truncate">
                          {product.name}
                        </h3>
                        <span className="font-serif text-base font-bold text-[#721C24] shrink-0">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Interactive Rating Badge */}
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setSelectedProductForReview(product)}
                          className="flex items-center gap-1 text-[11px] text-[#8C7A6B] hover:text-[#721C24] transition-colors"
                        >
                          <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                          <span className="font-bold text-[#2C1810]">
                            {(product.rating || 4.9).toFixed(1)}
                          </span>
                          <span>({product.reviewCount || 24} ratings)</span>
                          <span className="underline font-semibold text-[#721C24] ml-1">Rate</span>
                        </button>
                      </div>

                      <p className="text-xs text-[#6E5A4E] mt-1 line-clamp-2 leading-relaxed font-light">
                        {product.description}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Fresh Daily
                        </span>

                        <motion.button
                          id={`menu-add-btn-${product.id}`}
                          onClick={() => handleAdd(product)}
                          whileTap={{ scale: 0.95 }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1 ${
                            addedId === product.id
                              ? 'bg-emerald-700 text-white'
                              : 'bg-[#F4EBE1] text-[#721C24] hover:bg-[#721C24] hover:text-white'
                          }`}
                        >
                          {addedId === product.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Added
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" /> Order
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Beverage & Cafe Pairings */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="bg-[#FAF7F2] p-8 sm:p-12 rounded-3xl border border-[#E8DFC8] space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#721C24] text-white flex items-center justify-center">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
              Boutique Espresso & Tea Bar
            </h2>
            <p className="text-xs sm:text-sm text-[#8C6D4F]">
              Available exclusively for in-store pickup and dining at 245 Lexington Ave.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BEVERAGES.map((bev, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3 }}
              className="bg-white p-4 rounded-xl border border-[#E8DFC8] flex flex-col justify-between space-y-2 shadow-xs"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-serif font-bold text-sm text-[#2C1810]">{bev.name}</h4>
                <span className="font-serif font-bold text-sm text-[#721C24]">{bev.price}</span>
              </div>
              <p className="text-xs text-[#6E5A4E] leading-relaxed font-light">{bev.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Dietary & Allergen Commitment */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-3xl border border-[#E8DFC8] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs sm:text-sm text-[#6E5A4E]"
      >
        <div className="space-y-1">
          <h4 className="font-serif font-bold text-base text-[#2C1810]">
            Allergen & Custom Dietary Baking
          </h4>
          <p className="font-light">
            We accommodate eggless, vegan, nut-sensitive, and gluten-friendly preparations upon request in our Custom Cake Studio.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate('/custom-cakes')}
          className="px-6 py-3 rounded-full bg-[#7D0A0A] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#58141B] shrink-0 shadow-xs"
        >
          Custom Cake Inquiry
        </motion.button>
      </motion.div>

      {/* Review Modal */}
      <RatingReviewModal
        product={selectedProductForReview}
        isOpen={!!selectedProductForReview}
        onClose={() => setSelectedProductForReview(null)}
        onReviewSubmitted={onProductUpdated}
      />
    </div>
  );
}
