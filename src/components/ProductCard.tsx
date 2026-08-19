import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Sparkles, Check, Heart } from 'lucide-react';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onCustomize?: (product: Product) => void;
  index?: number;
}

export default function ProductCard({ product, onCustomize, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState('Chef Signature');

  const handleQuickAdd = () => {
    addToCart(product, 1, { flavor: selectedFlavor });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      id={`product-card-${product.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.25, ease: 'easeOut' } }}
      className="group bg-white rounded-2xl overflow-hidden border border-[#E8DFC8]/80 hover:border-[#721C24]/40 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4EBE1]">
        <motion.img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center"
          loading="lazy"
          referrerPolicy="no-referrer"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          onError={(e) => {
            // Fallback to signature cake visual if link ever encounters network interruption
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80';
          }}
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 rounded-full bg-[#21110C]/85 backdrop-blur-md text-[#FDFBF7] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase shadow-sm">
            {product.category}
          </span>
          {product.featured && (
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="px-2.5 py-1 rounded-full bg-[#721C24] text-[#D4AF37] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1 shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Bestseller
            </motion.span>
          )}
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#721C24] font-serif font-bold text-sm sm:text-base shadow-md border border-[#E8DFC8]">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <h3 className="font-serif text-lg font-bold text-[#2C1810] group-hover:text-[#721C24] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-[#6E5A4E] leading-relaxed line-clamp-2 font-light">
            {product.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-[#F4EBE1] flex items-center gap-2">
          {onCustomize ? (
            <motion.button
              id={`product-customize-btn-${product.id}`}
              onClick={() => onCustomize(product)}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-2 px-3 rounded-xl border border-[#721C24] text-[#721C24] hover:bg-[#F4EBE1] text-xs font-semibold uppercase tracking-wider transition-colors text-center"
            >
              Customize
            </motion.button>
          ) : null}

          <motion.button
            id={`product-add-btn-${product.id}`}
            onClick={handleQuickAdd}
            disabled={!product.available}
            whileTap={{ scale: 0.96 }}
            className={`flex-1 py-2 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm ${
              added
                ? 'bg-emerald-700 text-white'
                : product.available
                ? 'bg-[#721C24] hover:bg-[#58141B] text-white'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : product.available ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Order
              </>
            ) : (
              'Sold Out'
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
