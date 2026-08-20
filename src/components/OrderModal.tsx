import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, CheckCircle, Truck, Store, Calendar, CreditCard, Sparkles, ShieldCheck, ArrowRight, Mail, FileText, Printer, Eye, Info, Star, CheckCircle2, Award, Download } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { createOrderApi } from '../services/orderService.ts';
import { Order, Product } from '../types.ts';
import RatingReviewModal from './RatingReviewModal.tsx';
import InvoiceReceiptModal from './InvoiceReceiptModal.tsx';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export default function OrderModal({ isOpen, onClose, onNavigate }: OrderModalProps) {
  const { cartItems, removeFromCart, updateQuantity, incrementQuantity, decrementQuantity, clearCart, subtotal } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState<Product | null>(null);
  const [showPrintableInvoice, setShowPrintableInvoice] = useState(false);

  // Form fields
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+1 (212) 555-0199');
  const [deliveryMethod, setDeliveryMethod] = useState<'SAME_DAY_MANHATTAN' | 'NEXT_DAY_NYC' | 'IN_STORE_PICKUP'>('SAME_DAY_MANHATTAN');
  const [deliveryAddress, setDeliveryAddress] = useState('245 Lexington Ave Apt 4B, Manhattan, NY 10016');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'VISA' | 'MASTERCARD' | 'AMEX' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'PAYPAL' | 'CASH'>('VISA');

  // Dynamic delivery calculation preview (backend computes final)
  const deliveryFee = deliveryMethod === 'IN_STORE_PICKUP' ? 0 : subtotal >= 100 ? 0 : deliveryMethod === 'SAME_DAY_MANHATTAN' ? 15 : 10;
  const estimatedTotal = subtotal + deliveryFee;

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (cartItems.length === 0) {
      setError('Your shopping cart is empty.');
      return;
    }

    if (!customerName || !customerEmail || !customerPhone) {
      setError('Please fill in all required customer contact details.');
      return;
    }

    if (deliveryMethod !== 'IN_STORE_PICKUP' && !deliveryAddress) {
      setError('Please provide a delivery address.');
      return;
    }

    try {
      setLoading(true);

      const itemsPayload = cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        customization: JSON.stringify(item.customization)
      }));

      const placedOrder = await createOrderApi({
        customerName,
        customerEmail,
        customerPhone,
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'IN_STORE_PICKUP' ? 'In-Store Pickup (245 Lexington Ave)' : deliveryAddress,
        preferredDate,
        customerNotes,
        paymentMethod,
        items: itemsPayload
      });

      setConfirmedOrder(placedOrder);
      clearCart();
      setStep('confirmation');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    onClose();
    setStep('cart');
    if (isAuthenticated) {
      onNavigate('/dashboard');
    } else {
      onNavigate('/');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-md flex justify-end">
        {/* Backdrop overlay click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40"
        />

        <motion.div
          initial={{ x: '100%', opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-10 w-full max-w-xl bg-[#FDFBF7] h-full shadow-2xl flex flex-col justify-between border-l border-[#E8DFC8] overflow-y-auto"
        >
          
          {/* Header */}
          <div className="p-5 border-b border-[#E8DFC8] bg-white/95 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold text-[#721C24]">
                {step === 'cart' && 'Your Celebration Bag'}
                {step === 'checkout' && 'Checkout & Delivery Details'}
                {step === 'confirmation' && 'Order Confirmed!'}
              </span>
              {step !== 'confirmation' && (
                <span className="text-xs text-[#8C6D4F] font-mono bg-[#F4EBE1] px-2.5 py-0.5 rounded-full font-semibold">
                  {cartItems.length} items
                </span>
              )}
            </div>
            <motion.button
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              id="order-modal-close-btn"
              onClick={onClose}
              className="p-2 text-[#6E5A4E] hover:text-[#721C24] hover:bg-[#F4EBE1] rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Content Body */}
          <div className="p-6 flex-1 space-y-6">
            
            {/* STEP 1: CART ITEMS */}
            {step === 'cart' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E8DFC8] text-[#8C6D4F] mx-auto flex items-center justify-center">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <p className="font-serif text-xl text-[#2C1810]">Your bag is currently empty</p>
                    <p className="text-xs text-[#6E5A4E] max-w-xs mx-auto">
                      Explore our handcrafted signature cakes and artisan treats to sweeten your special moment.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        onClose();
                        onNavigate('/cakes');
                      }}
                      className="px-6 py-2.5 rounded-full bg-[#721C24] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#58141B] transition-colors shadow-sm"
                    >
                      Browse Cakes
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs text-[#8C6D4F]">
                      <span className="font-bold uppercase tracking-wider">Cart Items ({cartItems.length})</span>
                      <button
                        onClick={clearCart}
                        className="text-red-700 hover:text-red-900 transition-colors underline"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="divide-y divide-[#E8DFC8]/60">
                      {cartItems.map((item, idx) => (
                        <motion.div 
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="py-4 flex gap-4 items-start"
                        >
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-xl border border-[#E8DFC8] shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="font-serif font-bold text-sm text-[#2C1810] truncate">
                                {item.product.name}
                              </h4>
                              <span className="font-semibold text-[#721C24] text-sm">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </span>
                            </div>

                            <p className="text-[11px] text-[#6E5A4E] line-clamp-1 mt-0.5">
                              {item.product.description}
                            </p>

                            {/* Customizations tags */}
                            <div className="mt-1.5 flex flex-wrap gap-1 text-[10px]">
                              <span className="bg-[#FAF7F2] border border-[#E8DFC8] px-2 py-0.5 rounded text-[#4A3B32]">
                                Size: {item.customization.size}
                              </span>
                              <span className="bg-[#FAF7F2] border border-[#E8DFC8] px-2 py-0.5 rounded text-[#4A3B32]">
                                Flavor: {item.customization.flavor}
                              </span>
                              {item.customization.message && (
                                <span className="bg-[#FAF7F2] border border-[#E8DFC8] px-2 py-0.5 rounded text-[#4A3B32] italic">
                                  "{item.customization.message}"
                                </span>
                              )}
                            </div>

                            {/* Star Rating & Review trigger */}
                            <div className="mt-2 flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                type="button"
                                onClick={() => setSelectedProductForReview(item.product)}
                                className="inline-flex items-center gap-1 text-[11px] text-[#8C7A6B] hover:text-[#721C24] bg-[#FDFCF0] px-2.5 py-1 rounded-md border border-[#E8DFC8] transition-colors shadow-2xs"
                              >
                                <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                                <span className="font-bold text-[#2C1810]">
                                  {(item.product.rating || 4.9).toFixed(1)}
                                </span>
                                <span className="underline font-medium text-[#721C24] ml-1">
                                  Give Rating / Review
                                </span>
                              </motion.button>
                            </div>

                            {/* Quantity and Delete */}
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center border border-[#E8DFC8] rounded-xl bg-white shadow-2xs overflow-hidden">
                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  type="button"
                                  id={`cart-decrease-btn-${item.id || idx}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    decrementQuantity(item.id || idx);
                                  }}
                                  className="p-2 text-[#6E5A4E] hover:text-[#721C24] hover:bg-[#FAF7F2] active:bg-[#F4EBE1] transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </motion.button>
                                <input
                                  type="number"
                                  min="1"
                                  max="99"
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    if (!isNaN(val) && val > 0) {
                                      updateQuantity(item.id || idx, val);
                                    }
                                  }}
                                  className="w-10 text-center text-xs font-bold text-[#2C1810] border-x border-[#E8DFC8]/60 bg-transparent py-1.5 focus:outline-none focus:bg-[#FAF7F2]"
                                  aria-label="Item quantity"
                                />
                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  type="button"
                                  id={`cart-increase-btn-${item.id || idx}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    incrementQuantity(item.id || idx);
                                  }}
                                  className="p-2 text-[#6E5A4E] hover:text-[#721C24] hover:bg-[#FAF7F2] active:bg-[#F4EBE1] transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </motion.button>
                              </div>

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                id={`cart-remove-btn-${item.id || idx}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFromCart(item.id || idx);
                                }}
                                className="text-[#8C6D4F] hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove item from bag"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 2: CHECKOUT FORM */}
            {step === 'checkout' && (
              <motion.form 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmitOrder} 
                className="space-y-6"
              >
                {error && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Customer Contact */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-[#8C6D4F] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#721C24]" />
                    1. Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#6E5A4E] mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E8DFC8] rounded-xl text-xs text-[#2C1810] focus:border-[#721C24] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#6E5A4E] mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E8DFC8] rounded-xl text-xs text-[#2C1810] focus:border-[#721C24] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#6E5A4E] mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E8DFC8] rounded-xl text-xs text-[#2C1810] focus:border-[#721C24] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Delivery Options */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-[#8C6D4F] flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#721C24]" />
                    2. Delivery & Fulfillment
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('SAME_DAY_MANHATTAN')}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        deliveryMethod === 'SAME_DAY_MANHATTAN'
                          ? 'border-[#721C24] bg-[#FAF7F2] ring-1 ring-[#721C24]'
                          : 'border-[#E8DFC8] bg-white hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <Truck className="w-4 h-4 text-[#721C24] mb-2" />
                      <div>
                        <p className="text-xs font-bold text-[#2C1810]">Same-Day Manhattan</p>
                        <p className="text-[10px] text-[#6E5A4E]">$15.00 (Free over $100)</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('NEXT_DAY_NYC')}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        deliveryMethod === 'NEXT_DAY_NYC'
                          ? 'border-[#721C24] bg-[#FAF7F2] ring-1 ring-[#721C24]'
                          : 'border-[#E8DFC8] bg-white hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <Calendar className="w-4 h-4 text-[#721C24] mb-2" />
                      <div>
                        <p className="text-xs font-bold text-[#2C1810]">Next-Day NYC Metro</p>
                        <p className="text-[10px] text-[#6E5A4E]">$10.00 (Free over $100)</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('IN_STORE_PICKUP')}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        deliveryMethod === 'IN_STORE_PICKUP'
                          ? 'border-[#721C24] bg-[#FAF7F2] ring-1 ring-[#721C24]'
                          : 'border-[#E8DFC8] bg-white hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <Store className="w-4 h-4 text-[#721C24] mb-2" />
                      <div>
                        <p className="text-xs font-bold text-[#2C1810]">In-Store Pickup</p>
                        <p className="text-[10px] text-emerald-700 font-semibold">Free Always</p>
                      </div>
                    </button>
                  </div>

                  {deliveryMethod !== 'IN_STORE_PICKUP' ? (
                    <div>
                      <label className="block text-[11px] text-[#6E5A4E] mb-1">Delivery Address *</label>
                      <input
                        type="text"
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Street Address, Apt / Suite, City, Zip"
                        className="w-full px-3 py-2 bg-white border border-[#E8DFC8] rounded-xl text-xs text-[#2C1810] focus:border-[#721C24] focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFC8] text-xs text-[#6E5A4E]">
                      <p className="font-bold text-[#2C1810]">Patisserie Pickup Location:</p>
                      <p>The Velvet Cake Co., 245 Lexington Ave, New York, NY 10016</p>
                      <p className="text-[10px] text-[#8C6D4F] mt-1">Ready in 2 hours for standard orders.</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] text-[#6E5A4E] mb-1">Preferred Celebration Date *</label>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E8DFC8] rounded-xl text-xs text-[#2C1810] focus:border-[#721C24] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-[#8C6D4F] flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#721C24]" />
                    3. Secure Payment
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'VISA', label: 'Visa / MC' },
                      { id: 'AMEX', label: 'Amex' },
                      { id: 'APPLE_PAY', label: 'Apple Pay' },
                      { id: 'CASH', label: 'Pay at Door' }
                    ].map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPaymentMethod(p.id as any)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                          paymentMethod === p.id
                            ? 'border-[#721C24] bg-[#FAF7F2] text-[#721C24] font-bold'
                            : 'border-[#E8DFC8] bg-white text-[#4A3B32]'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFC8] flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#721C24] shrink-0" />
                    <p className="text-[11px] text-[#6E5A4E]">
                      256-bit encrypted checkout. You will not be charged until your pastry chef reviews the order.
                    </p>
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-[11px] text-[#6E5A4E] mb-1">Baker Delivery Notes / Allergies</label>
                  <textarea
                    rows={2}
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Gate code, dietary allergy alerts, or hand-delivery instructions..."
                    className="w-full px-3 py-2 bg-white border border-[#E8DFC8] rounded-xl text-xs text-[#2C1810] focus:border-[#721C24] focus:outline-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="px-5 py-3 border border-[#E8DFC8] rounded-xl text-xs font-semibold text-[#4A3B32] hover:bg-white transition-colors"
                  >
                    Back to Bag
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-[#721C24] hover:bg-[#58141B] text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="animate-pulse">Placing Your Order...</span>
                    ) : (
                      <>
                        <span>Place Order • ${estimatedTotal.toFixed(2)}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}

            {/* STEP 3: CONFIRMATION */}
            {step === 'confirmation' && confirmedOrder && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="text-center py-6 space-y-6"
              >
                
                {/* Luxury Celebration Badge */}
                <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37]/30 to-[#721C24]/20 blur-md"
                  />
                  <div className="w-20 h-20 rounded-full bg-[#721C24] text-white flex items-center justify-center shadow-lg relative z-10">
                    <CheckCircle className="w-10 h-10 text-[#FDFCF0]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-[#8C6D4F] font-bold">
                    Order Successfully Placed
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#2C1810]">
                    Thank You, {confirmedOrder.customerName}!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6E5A4E] max-w-sm mx-auto">
                    Your artisanal order is being scheduled with our master bakers at 245 Lexington Ave.
                  </p>
                </div>

                {/* Order Receipt Box */}
                <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] text-left space-y-3 text-xs shadow-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-[#F4EBE1]">
                    <span className="text-[#8C6D4F]">Order Number:</span>
                    <span className="font-mono font-bold text-[#721C24] text-sm">
                      {confirmedOrder.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#8C6D4F]">Confirmation Sent To:</span>
                    <span className="font-semibold text-[#2C1810] flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#721C24]" />
                      {confirmedOrder.customerEmail}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#8C6D4F]">Delivery Type:</span>
                    <span className="font-medium text-[#2C1810]">
                      {confirmedOrder.deliveryMethod.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#8C6D4F]">Preferred Date:</span>
                    <span className="font-medium text-[#2C1810]">
                      {new Date(confirmedOrder.preferredDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#8C6D4F]">Status:</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      {confirmedOrder.orderStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#F4EBE1] text-sm font-bold text-[#2C1810]">
                    <span>Total Amount Paid:</span>
                    <span className="text-[#721C24]">${confirmedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Email Receipt & Official Invoice Banner */}
                <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8DFC8] text-left space-y-3 shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#721C24]/10 text-[#721C24] flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <p className="text-xs font-bold text-[#2C1810]">Official Tax Invoice & Receipt</p>
                      <p className="text-[11px] text-[#6E5A4E] leading-relaxed">
                        An official invoice has been recorded for <strong>{confirmedOrder.customerEmail}</strong>. You can open and print your high-res bakery tax receipt directly.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowPrintableInvoice(true)}
                      className="py-2.5 px-4 bg-[#721C24] hover:bg-[#58141B] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Official Invoice</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowEmailPreview(!showEmailPreview)}
                      className="py-2.5 px-3 bg-white border border-[#E8DFC8] hover:bg-[#F4EBE1] text-[#4A3B32] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#721C24]" />
                      <span>{showEmailPreview ? 'Hide Email Copy' : 'View Email Copy'}</span>
                    </motion.button>
                  </div>

                  {/* Email Preview Drawer */}
                  {showEmailPreview && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-4 bg-white rounded-xl border border-[#E8DFC8] space-y-3 text-xs overflow-hidden"
                    >
                      <div className="flex justify-between items-center border-b border-[#F4EBE1] pb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6D4F]">
                          Live Email Confirmation
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                          Delivered to Inbox
                        </span>
                      </div>

                      <div className="text-[11px] space-y-1 text-[#4A3B32] bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E8DFC8]/60 font-mono">
                        <p><strong>From:</strong> "The Velvet Cake Co." &lt;orders@thevelvetcakeco.com&gt;</p>
                        <p><strong>To:</strong> {confirmedOrder.customerEmail}</p>
                        <p><strong>Subject:</strong> Order Confirmed: #{confirmedOrder.orderNumber} - The Velvet Cake Co.</p>
                      </div>

                      <div className="space-y-2 pt-1">
                        <p className="font-bold text-[#2C1810]">Order Items Summary:</p>
                        <div className="space-y-1.5 border-t border-b border-[#F4EBE1] py-2">
                          {confirmedOrder.orderItems?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[11px]">
                              <span>{item.quantity}x {item.product?.name || 'Artisan Cake'}</span>
                              <span className="font-bold text-[#721C24]">${((item.unitPrice || 0) * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-[11px] text-[#6E5A4E]">
                          <span>Subtotal:</span>
                          <span>${confirmedOrder.subtotal?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-[#6E5A4E]">
                          <span>Delivery:</span>
                          <span>{confirmedOrder.deliveryFee === 0 ? 'FREE' : `$${confirmedOrder.deliveryFee?.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-[#2C1810] pt-1 border-t border-[#F4EBE1]">
                          <span>Total Paid:</span>
                          <span className="text-[#721C24]">${confirmedOrder.total?.toFixed(2)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  id="order-finish-btn"
                  onClick={handleFinish}
                  className="w-full py-3.5 rounded-xl bg-[#721C24] hover:bg-[#58141B] text-white text-xs uppercase tracking-widest font-semibold shadow-md flex items-center justify-center gap-2"
                >
                  <span>{isAuthenticated ? 'View In Customer Dashboard' : 'Back to Home'}</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

          </div>

          {/* Footer Summary in Cart Mode */}
          {step === 'cart' && cartItems.length > 0 && (
            <div className="p-6 bg-white border-t border-[#E8DFC8] space-y-4">
              <div className="space-y-1.5 text-xs text-[#6E5A4E]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2C1810]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-semibold text-[#2C1810]">
                    {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-[#2C1810] pt-2 border-t border-[#F4EBE1]">
                  <span>Total</span>
                  <span className="text-[#721C24]">${estimatedTotal.toFixed(2)}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                id="cart-checkout-proceed-btn"
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 rounded-xl bg-[#721C24] hover:bg-[#58141B] text-white text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Proceed to Delivery & Payment</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          )}

        </motion.div>

        {/* Product Rating & Review Modal */}
        <RatingReviewModal
          product={selectedProductForReview}
          isOpen={!!selectedProductForReview}
          onClose={() => setSelectedProductForReview(null)}
        />

        {/* Official Printable Invoice Modal */}
        <InvoiceReceiptModal
          order={confirmedOrder}
          isOpen={showPrintableInvoice}
          onClose={() => setShowPrintableInvoice(false)}
        />
      </div>
    </AnimatePresence>
  );
}
