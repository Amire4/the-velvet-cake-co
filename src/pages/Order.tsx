import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Sparkles, Filter, Check, ArrowRight, Truck, Search, Mail, Receipt, Clock, CheckCircle2, Printer } from 'lucide-react';
import { Product, Order as OrderType } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import { lookupOrdersApi } from '../services/orderService.ts';
import ProductCard from '../components/ProductCard.tsx';
import InvoiceReceiptModal from '../components/InvoiceReceiptModal.tsx';
import { formatCustomization } from '../utils/customizationFormatter.ts';

interface OrderProps {
  products: Product[];
  onNavigate: (path: string) => void;
}

const CATEGORIES = ['All', 'Signature Cakes', 'Wedding Cakes', 'Seasonal Specials', 'Mini Treats'];

export default function Order({ products, onNavigate }: OrderProps) {
  const { setIsCartOpen, itemCount, subtotal } = useCart();
  const [selectedCat, setSelectedCat] = useState('All');

  // Order & Receipt Lookup state
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResults, setLookupResults] = useState<OrderType[] | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<OrderType | null>(null);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Order Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
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
        <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-xs flex items-center justify-between gap-6 shrink-0">
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
            className="px-5 py-2.5 rounded-full bg-[#721C24] hover:bg-[#58141B] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
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
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shrink-0 ${
              selectedCat === cat
                ? 'bg-[#721C24] text-white shadow-xs'
                : 'bg-white text-[#6E5A4E] border border-[#E8DFC8] hover:bg-[#FAF7F2]'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Lookup Past Order & Official Print Invoice Section */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-3xl border border-[#E8DFC8] shadow-xs space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F4EBE1] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#721C24]/10 text-[#721C24] flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#2C1810]">
                Find & Print Existing Order Invoice
              </h2>
              <p className="text-xs text-[#6E5A4E]">
                Enter your order number or customer email to view status and print official tax invoices.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={lookupQuery}
            onChange={(e) => setLookupQuery(e.target.value)}
            placeholder="Enter Order # (e.g. ORD-2026...) or your Email address"
            className="flex-1 px-4 py-3 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-xs text-[#2C1810] focus:border-[#721C24] focus:outline-none"
          />
          <button
            type="submit"
            disabled={lookupLoading}
            className="px-6 py-3 bg-[#721C24] hover:bg-[#58141B] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs shrink-0"
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

                  <div className="border-t border-[#E8DFC8] pt-2 space-y-1.5">
                    <p className="font-bold text-[#2C1810] text-[11px] uppercase tracking-wider">Order Items:</p>
                    {ord.orderItems?.map((item, idx) => {
                      const customDesc = formatCustomization(item.customization);
                      return (
                        <div key={idx} className="bg-white p-2 rounded-lg border border-[#E8DFC8]/60 space-y-0.5">
                          <div className="flex justify-between text-[11px] text-[#4A3B32]">
                            <span className="font-semibold text-[#2C1810]">
                              {item.quantity}x {item.product?.name || 'Artisan Cake'}
                            </span>
                            <span className="font-bold text-[#721C24]">
                              ${((item.unitPrice || 0) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          {customDesc && (
                            <p className="text-[10px] text-[#8C6D4F] font-medium pl-2">
                              • {customDesc}
                            </p>
                          )}
                        </div>
                      );
                    })}
                    <div className="flex justify-between font-bold text-[#2C1810] pt-1 text-xs border-t border-[#E8DFC8]/50">
                      <span>Total Paid:</span>
                      <span className="text-[#721C24] font-serif text-sm">${ord.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedOrderForInvoice(ord)}
                      className="w-full py-2 bg-white border border-[#E8DFC8] hover:bg-[#F4EBE1] text-[#721C24] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Official Invoice</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Invoice Receipt Modal */}
      <InvoiceReceiptModal
        order={selectedOrderForInvoice}
        isOpen={!!selectedOrderForInvoice}
        onClose={() => setSelectedOrderForInvoice(null)}
      />
    </div>
  );
}
