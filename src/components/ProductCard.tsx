import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Sparkles, Check, Star, MessageSquare, Plus, Minus } from 'lucide-react';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import RatingReviewModal from './RatingReviewModal.tsx';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onCustomize?: (product: Product) => void;
  index?: number;
  onProductUpdated?: (updatedProduct: Product) => void;
}

export default function ProductCard({
  product: initialProduct,
  onCustomize,
  index = 0,
  onProductUpdated
}: ProductCardProps) {
  const { cartItems, addToCart, incrementQuantity, decrementQuantity } = useCart();
  const [product, setProduct] = useState<Product>(initialProduct);
  const [added, setAdded] = useState(false);
  const [cardQuantity, setCardQuantity] = useState(1);
  const [selectedFlavor] = useState('Chef Signature');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Check if this product is already in the cart
  const cartItem = cartItems.find(item => item.product.id === product.id);
  const inCartQuantity = cartItem ? cartItem.quantity : 0;

  // Sync if prop changes
  React.useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);

  const handleQuickAdd = () => {
    addToCart(product, cardQuantity, { flavor: selectedFlavor });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setCardQuantity(1);
    }, 1500);
  };

  const handleReviewSubmitted = (updated: Product) => {
    setProduct(updated);
    if (onProductUpdated) {
      onProductUpdated(updated);
    }
  };

  const displayRating = product.rating ?? 4.9;
  const displayReviewCount = product.reviewCount ?? 32;

  return (
    <>
      <motion.div
        id={`product-card-${product.id}`}
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{
          duration: 0.5,
          delay: Math.min((index % 4) * 0.08, 0.25),
          ease: [0.22, 1, 0.36, 1]
        }}
        whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
        className="group bg-white rounded-3xl overflow-hidden border border-[#E8DFC8]/80 hover:border-[#7D0A0A]/40 shadow-xs hover:shadow-2xl transition-all duration-300 flex flex-col justify-between luxury-card-glow"
      >
        {/* Top Image Container with zoom & shimmer */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4EBE1]">
          <motion.img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center"
            loading="lazy"
            referrerPolicy="no-referrer"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80';
            }}
          />

          {/* Category Badge & Bestseller */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span className="px-2.5 py-1 rounded-full bg-[#21110C]/85 backdrop-blur-md text-[#FDFBF7] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase shadow-sm">
              {product.category}
            </span>
            {product.featured && (
              <motion.span
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="px-2.5 py-1 rounded-full bg-[#7D0A0A] text-[#D4AF37] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1 shadow-md border border-[#D4AF37]/30"
              >
                <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Bestseller
              </motion.span>
            )}
          </div>

          {/* Price Tag */}
          <div className="absolute bottom-3 right-3 z-10">
            <span className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#7D0A0A] font-serif font-bold text-sm sm:text-base shadow-md border border-[#E8DFC8]">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Content Info */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
          <div className="space-y-2">
            {/* Title */}
            <h3 className="font-serif text-lg font-bold text-[#2C1810] group-hover:text-[#7D0A0A] transition-colors line-clamp-1">
              {product.name}
            </h3>

            {/* Interactive Rating & Review Pill */}
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                id={`rate-cake-btn-${product.id}`}
                onClick={() => setIsReviewModalOpen(true)}
                title="Click to view ratings or give your review"
                className="group/rate flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF5EE] hover:bg-[#F4EBE1] border border-[#E8DFC8] text-xs transition-colors cursor-pointer shadow-2xs"
              >
                <div className="flex items-center text-[#D4AF37]">
                  <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                </div>
                <span className="font-bold text-[#2C1810] text-xs">
                  {displayRating.toFixed(1)}
                </span>
                <span className="text-[#8C7A6B] text-[11px] group-hover/rate:text-[#7D0A0A] transition-colors">
                  ({displayReviewCount} reviews)
                </span>
                <span className="text-[10px] text-[#7D0A0A] font-semibold underline ml-1 hidden sm:inline">
                  Rate
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                type="button"
                onClick={() => setIsReviewModalOpen(true)}
                className="text-[11px] text-[#7D0A0A] hover:text-[#58141B] font-medium flex items-center gap-1"
              >
                <MessageSquare className="w-3 h-3 text-[#7D0A0A]" /> Review
              </motion.button>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#6E5A4E] leading-relaxed line-clamp-2 font-light">
              {product.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-[#F4EBE1] flex flex-col gap-2">
            {/* In-Bag status indicator if already added */}
            {inCartQuantity > 0 && (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#FAF5EE] border border-[#E8DFC8]/70 text-xs">
                <span className="text-[#8C7A6B] flex items-center gap-1.5 font-medium">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#7D0A0A]" /> In Bag:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      decrementQuantity(cartItem!.id);
                    }}
                    className="w-5 h-5 rounded-md bg-white border border-[#E8DFC8] text-[#7D0A0A] hover:bg-[#F5EFE6] flex items-center justify-center font-bold"
                    title="Decrease quantity in bag"
                    aria-label="Decrease quantity in bag"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-extrabold text-[#7D0A0A] text-xs min-w-4 text-center">
                    {inCartQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      incrementQuantity(cartItem!.id);
                    }}
                    className="w-5 h-5 rounded-md bg-white border border-[#E8DFC8] text-[#7D0A0A] hover:bg-[#F5EFE6] flex items-center justify-center font-bold"
                    title="Increase quantity in bag"
                    aria-label="Increase quantity in bag"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              {/* Card Quick Quantity Stepper */}
              {product.available && (
                <div className="flex items-center border border-[#E8DFC8] rounded-xl bg-[#FAF7F2] overflow-hidden shrink-0 shadow-2xs">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCardQuantity(Math.max(1, cardQuantity - 1));
                    }}
                    className="p-2 text-[#7D0A0A] hover:bg-[#E8DFC8] active:bg-[#D4AF37]/20 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-2 text-xs font-bold text-[#2C1810]">
                    {cardQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCardQuantity(cardQuantity + 1);
                    }}
                    className="p-2 text-[#7D0A0A] hover:bg-[#E8DFC8] active:bg-[#D4AF37]/20 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}

              <motion.button
                id={`product-add-btn-${product.id}`}
                onClick={handleQuickAdd}
                disabled={!product.available}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                  added
                    ? 'bg-emerald-700 text-white'
                    : product.available
                    ? 'bg-[#7D0A0A] hover:bg-[#58141B] text-white'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Added ({cardQuantity})
                  </>
                ) : product.available ? (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" /> {inCartQuantity > 0 ? `Add More (${cardQuantity})` : `Order ${cardQuantity > 1 ? `(${cardQuantity})` : ''}`}
                  </>
                ) : (
                  'Sold Out'
                )}
              </motion.button>
            </div>

            {onCustomize && (
              <motion.button
                id={`product-customize-btn-${product.id}`}
                onClick={() => onCustomize(product)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 px-3 rounded-xl border border-[#7D0A0A]/70 text-[#7D0A0A] hover:bg-[#F4EBE1] text-xs font-semibold uppercase tracking-wider transition-colors text-center"
              >
                Customize Size & Inscription
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Interactive Rating & Review Modal */}
      <RatingReviewModal
        product={product}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </>
  );
}
