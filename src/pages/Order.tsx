import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Sparkles, Filter, Check, ArrowRight, Truck, Search, Mail, Receipt, Clock, CheckCircle2 } from 'lucide-react';
import { Product, Order as OrderType } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import { lookupOrdersApi } from '../services/orderService.ts';

interface OrderProps {
  products: Product[];
  onNavigate: (path: string) => void;
}

const CATEGORIES = ['All', 'Signature Cakes', 'Wedding Cakes', 'Seasonal Specials', 'Mini Treats'];

export default function Order({ products, onNavigate }: OrderProps) {
  const { addToCart, setIsCartOpen, itemCount, subtotal } = useCart();
  const [selectedCat, setSelectedCat] = useState('All');
  const [addedId, setAddedId] = useState<string | null>(null);

  // Order & Receipt Lookup state
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResults, setLookupResults] = useState<OrderType[] | null>(null);
  const [lookupError, setLookupError] = useState('');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;

    setLookupLoading(true);
    setLookupError('');
    setLookupResults(null);

    try {
      const results = await lookupOrdersApi(lookupQuery.trim());
      setLookupResults(results);
      if (results.length === 0) {
        setLookupError(`No orders found matching "${lookupQuery}". Please check your email or order number.`);
      }
    } catch (err: any) {
      setLookupError(err.response?.data?.message || 'Unable to search orders. Please try again.');
    } finally {
      setLookupLoading(false);
    }
  };

  const filteredProducts = selectedCat === 'All'
    ? products
    : products.filter(p => p.category.toLowerCase() === selectedCat.toLowerCase());

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1, { flavor: 'Chef Signature' });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10"
    >
      {/* Order Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#FAF7F2] p-8 rounded-3xl border border-[#E8DFC8]"
      >
        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8C6D4F]">
            Direct Patisserie Ordering
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810]">
            Order Online for Delivery & Pickup
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5A4E] font-light">
            Same-day delivery available across Manhattan for orders placed before 3:00 PM. In-store pickup always complimentary.
          </p>
        </div>

        {/* Live Cart Snapshot CTA */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-sm flex items-center justify-between gap-6 shrink-0">
          <div>
            <p className="text-xs text-[#8C6D4F]">Bag Summary</p>
            <p className="font-serif font-bold text-lg text-[#721C24]">
              {itemCount} item{itemCount !== 1 ? 's' : ''} • ${subtotal.toFixed(2)}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsCartOpen(true)}
            className="px-5 py-2.5 rounded-full bg-[#721C24] hover:bg-[#58141B] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>View Bag & Checkout</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
              selectedCat === cat
                ? 'bg-[#721C24] text-white shadow-sm'
                : 'bg-white border border-[#E8DFC8] text-[#4A3B32] hover:bg-[#F4EBE1]'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Product List */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedCat}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl border border-[#E8DFC8] overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] bg-[#F4EBE1] overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80';
                  }}
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#21110C]/80 text-[#FDFBF7] text-[10px] font-semibold uppercase">
                  {product.category}
                </span>
                <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-white/95 text-[#721C24] font-serif font-bold text-sm shadow">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#6E5A4E] mt-1 line-clamp-2 leading-relaxed font-light">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F4EBE1] flex items-center justify-between gap-2">
                  <button
                    onClick={() => onNavigate('/custom-cakes')}
                    className="text-xs text-[#8C6D4F] hover:text-[#721C24] font-medium"
                  >
                    Custom Request
                  </button>

                  <motion.button
                    id={`order-page-add-btn-${product.id}`}
                    onClick={() => handleAddToCart(product)}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      addedId === product.id
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#721C24] hover:bg-[#58141B] text-white shadow-sm'
                    }`}
                  >
                    {addedId === product.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Added
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Delivery Guarantee Notice */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E8DFC8] flex items-center gap-4"
      >
        <div className="w-10 h-10 rounded-full bg-[#721C24] text-white flex items-center justify-center shrink-0">
          <Truck className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-[#6E5A4E]">
          <span className="font-bold text-[#2C1810]">Climate-Controlled Courier Transit: </span>
          All artisan cakes and delicate confections are transported in refrigerated temperature-calibrated vehicles to ensure pristine structure on arrival.
        </div>
      </motion.div>

      {/* Track Placed Order & View Digital Receipt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-3xl border border-[#E8DFC8] shadow-sm space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F4EBE1] pb-6">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#8C6D4F] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#721C24]" />
              Order & Email Receipt Tracking
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#2C1810]">
              Look Up Your Order & Digital Invoice
            </h2>
            <p className="text-xs sm:text-sm text-[#6E5A4E]">
              Enter the email address you used when placing your order (e.g. <strong>ranaamirshahzad630@gmail.com</strong>) or your Order Number to view your confirmation invoice and preparation status.
            </p>
          </div>
        </div>

        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <input
            type="text"
            value={lookupQuery}
            onChange={(e) => setLookupQuery(e.target.value)}
            placeholder="Enter your email or order number (e.g. VLT-...)"
            className="flex-1 px-4 py-3 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs sm:text-sm focus:border-[#721C24] focus:outline-none"
          />
          <button
            type="submit"
            disabled={lookupLoading}
            className="px-6 py-3 bg-[#721C24] hover:bg-[#58141B] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm shrink-0"
          >
            {lookupLoading ? (
              <span>Searching...</span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Find Order</span>
              </>
            )}
          </button>
        </form>

        {lookupError && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs">
            {lookupError}
          </div>
        )}

        {lookupResults && lookupResults.length > 0 && (
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C6D4F]">
              Found {lookupResults.length} Order{lookupResults.length > 1 ? 's' : ''}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lookupResults.map((ord) => (
                <div key={ord.id} className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8DFC8] space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E8DFC8]">
                    <span className="font-mono font-bold text-[#721C24] text-sm">
                      {ord.orderNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {ord.orderStatus}
                    </span>
                  </div>

                  <div className="space-y-1 text-[#6E5A4E]">
                    <p><strong className="text-[#2C1810]">Customer:</strong> {ord.customerName} ({ord.customerEmail})</p>
                    <p><strong className="text-[#2C1810]">Delivery Method:</strong> {ord.deliveryMethod.replace(/_/g, ' ')}</p>
                    <p><strong className="text-[#2C1810]">Date:</strong> {new Date(ord.preferredDate).toLocaleDateString()}</p>
                    {ord.deliveryAddress && (
                      <p><strong className="text-[#2C1810]">Address:</strong> {ord.deliveryAddress}</p>
                    )}
                  </div>

                  <div className="border-t border-[#E8DFC8] pt-2 space-y-1">
                    <p className="font-bold text-[#2C1810] text-[11px]">Items:</p>
                    {ord.orderItems?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] text-[#4A3B32]">
                        <span>{item.quantity}x {item.product?.name || 'Artisan Cake'}</span>
                        <span>${((item.unitPrice || 0) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-[#2C1810] pt-1 text-xs border-t border-[#E8DFC8]/50">
                      <span>Total Paid:</span>
                      <span className="text-[#721C24]">${ord.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

    </motion.div>
  );
}
