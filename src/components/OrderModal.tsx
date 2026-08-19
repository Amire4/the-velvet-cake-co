import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CheckCircle, Truck, Store, Calendar, CreditCard, Sparkles, ShieldCheck, ArrowRight, Mail, FileText, Printer, Eye, Info } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { createOrderApi } from '../services/orderService.ts';
import { Order } from '../types.ts';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export default function OrderModal({ isOpen, onClose, onNavigate }: OrderModalProps) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#FDFBF7] h-full shadow-2xl flex flex-col justify-between border-l border-[#E8DFC8] overflow-y-auto">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E8DFC8] bg-white sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold text-[#721C24]">
              {step === 'cart' && 'Your Celebration Bag'}
              {step === 'checkout' && 'Checkout & Delivery Details'}
              {step === 'confirmation' && 'Order Confirmed!'}
            </span>
            {step !== 'confirmation' && (
              <span className="text-xs text-[#8C6D4F] font-mono bg-[#F4EBE1] px-2 py-0.5 rounded-full">
                {cartItems.length} items
              </span>
            )}
          </div>
          <button
            id="order-modal-close-btn"
            onClick={onClose}
            className="p-2 text-[#6E5A4E] hover:text-[#721C24] hover:bg-[#F4EBE1] rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 space-y-6">
          
          {/* STEP 1: CART ITEMS */}
          {step === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#F4EBE1] text-[#721C24] flex items-center justify-center mx-auto">
                    <Store className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#2C1810]">Your bag is currently empty</h3>
                  <p className="text-sm text-[#6E5A4E] max-w-xs mx-auto">
                    Explore our signature cakes, wedding collections, and desserts to begin your order.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigate('/cakes');
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#721C24] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#58141B]"
                  >
                    Browse Cakes
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="divide-y divide-[#E8DFC8]">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="py-4 flex gap-4 items-start">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-18 h-18 object-cover rounded-lg border border-[#E8DFC8] shrink-0"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className="font-serif text-base font-bold text-[#2C1810] truncate">
                              {item.product.name}
                            </h4>
                            <span className="font-semibold text-sm text-[#721C24]">
                              ${item.totalPrice.toFixed(2)}
                            </span>
                          </div>
                          
                          {/* Customization pills */}
                          <div className="mt-1 space-y-0.5 text-xs text-[#6E5A4E]">
                            {item.customization.flavor && (
                              <p>Flavor: <span className="font-medium text-[#2C1810]">{item.customization.flavor}</span></p>
                            )}
                            {item.customization.size && (
                              <p>Size: <span className="font-medium text-[#2C1810]">{item.customization.size}</span></p>
                            )}
                            {item.customization.message && (
                              <p className="italic">Message: "{item.customization.message}"</p>
                            )}
                          </div>

                          {/* Quantity and Delete */}
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center border border-[#E8DFC8] rounded-lg bg-white">
                              <button
                                onClick={() => updateQuantity(idx, item.quantity - 1)}
                                className="p-1 text-[#6E5A4E] hover:text-[#721C24]"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3 text-xs font-semibold text-[#2C1810]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(idx, item.quantity + 1)}
                                className="p-1 text-[#6E5A4E] hover:text-[#721C24]"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(idx)}
                              className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Free Delivery Perk */}
                  <div className="p-3.5 rounded-xl bg-[#F4EBE1] border border-[#E8DFC8] text-xs text-[#6E5A4E] flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#721C24]" />
                      {subtotal >= 100
                        ? '🎉 You qualify for FREE Manhattan & NYC delivery!'
                        : `Add $${(100 - subtotal).toFixed(2)} more for FREE NYC delivery.`}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2: CHECKOUT FORM */}
          {step === 'checkout' && (
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                  {error}
                </div>
              )}

              {/* Delivery Method Choice */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3B32]">
                  Delivery Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('SAME_DAY_MANHATTAN')}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      deliveryMethod === 'SAME_DAY_MANHATTAN'
                        ? 'bg-[#F4EBE1] border-[#721C24] font-semibold text-[#721C24]'
                        : 'bg-white border-[#E8DFC8] text-[#4A3B32]'
                    }`}
                  >
                    <p className="font-bold">Same-Day Manhattan</p>
                    <p className="text-[11px] text-[#8C6D4F] mt-0.5">
                      {subtotal >= 100 ? 'FREE' : '$15.00'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('NEXT_DAY_NYC')}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      deliveryMethod === 'NEXT_DAY_NYC'
                        ? 'bg-[#F4EBE1] border-[#721C24] font-semibold text-[#721C24]'
                        : 'bg-white border-[#E8DFC8] text-[#4A3B32]'
                    }`}
                  >
                    <p className="font-bold">Next-Day NYC</p>
                    <p className="text-[11px] text-[#8C6D4F] mt-0.5">
                      {subtotal >= 100 ? 'FREE' : '$10.00'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('IN_STORE_PICKUP')}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      deliveryMethod === 'IN_STORE_PICKUP'
                        ? 'bg-[#F4EBE1] border-[#721C24] font-semibold text-[#721C24]'
                        : 'bg-white border-[#E8DFC8] text-[#4A3B32]'
                    }`}
                  >
                    <p className="font-bold">In-Store Pickup</p>
                    <p className="text-[11px] text-[#8C6D4F] mt-0.5">FREE (Lexington Ave)</p>
                  </button>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-[#4A3B32] mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-[#E8DFC8] rounded-lg p-2.5 focus:border-[#721C24] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#4A3B32] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-white border border-[#E8DFC8] rounded-lg p-2.5 focus:border-[#721C24] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-[#4A3B32] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-white border border-[#E8DFC8] rounded-lg p-2.5 focus:border-[#721C24] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#4A3B32] mb-1">Preferred Delivery/Pickup Date *</label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-white border border-[#E8DFC8] rounded-lg p-2.5 focus:border-[#721C24] focus:outline-none"
                  />
                </div>
              </div>

              {deliveryMethod !== 'IN_STORE_PICKUP' && (
                <div className="text-xs">
                  <label className="block font-medium text-[#4A3B32] mb-1">Delivery Address (Manhattan / NYC) *</label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Street, Apt/Suite, Borough, NYC, Zip"
                    className="w-full bg-white border border-[#E8DFC8] rounded-lg p-2.5 focus:border-[#721C24] focus:outline-none"
                  />
                </div>
              )}

              {/* Special Instructions */}
              <div className="text-xs">
                <label className="block font-medium text-[#4A3B32] mb-1">Bakery Notes or Delivery Gate Code</label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Special handling instructions, delivery timing preferences, etc."
                  className="w-full bg-white border border-[#E8DFC8] rounded-lg p-2.5 focus:border-[#721C24] focus:outline-none"
                />
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 text-xs">
                <label className="block font-semibold uppercase tracking-wider text-[#4A3B32]">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'VISA', label: 'Visa Card' },
                    { id: 'APPLE_PAY', label: 'Apple Pay' },
                    { id: 'GOOGLE_PAY', label: 'Google Pay' },
                    { id: 'PAYPAL', label: 'PayPal' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id as any)}
                      className={`p-2.5 rounded-lg border text-center font-medium transition-all ${
                        paymentMethod === p.id
                          ? 'bg-[#721C24] text-white border-[#721C24]'
                          : 'bg-white border-[#E8DFC8] text-[#4A3B32]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#8C6D4F] flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Secure sandbox verification. No real charges processed in preview.
                </p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-3 rounded-xl border border-[#E8DFC8] text-xs font-semibold uppercase text-[#4A3B32] hover:bg-[#F4EBE1]"
                >
                  Back to Bag
                </button>
                <button
                  type="submit"
                  id="checkout-confirm-btn"
                  disabled={loading}
                  className="flex-1 py-3 px-6 rounded-xl bg-[#721C24] hover:bg-[#58141B] text-white text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing Order...' : `Confirm & Pay $${estimatedTotal.toFixed(2)}`}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: CONFIRMATION */}
          {step === 'confirmation' && confirmedOrder && (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
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
              <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] text-left space-y-3 text-xs">
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
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                    {confirmedOrder.orderStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#F4EBE1] text-sm font-bold text-[#2C1810]">
                  <span>Total Amount Paid:</span>
                  <span className="text-[#721C24]">${confirmedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Email Receipt & Actions Banner */}
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E8DFC8] text-left space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#721C24]/10 text-[#721C24] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="text-xs font-bold text-[#2C1810]">Digital Email Receipt & Invoice</p>
                    <p className="text-[11px] text-[#6E5A4E] leading-relaxed">
                      Your order confirmation has been generated for <strong>{confirmedOrder.customerEmail}</strong>. You can view your full email invoice receipt right now or print it for your records.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowEmailPreview(!showEmailPreview)}
                    className="flex-1 py-2 px-3 bg-white border border-[#E8DFC8] hover:bg-[#F4EBE1] text-[#721C24] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{showEmailPreview ? 'Hide Email Receipt' : 'View Full Email Receipt'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="py-2 px-3 bg-white border border-[#E8DFC8] hover:bg-[#F4EBE1] text-[#4A3B32] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Invoice</span>
                  </button>
                </div>

                {/* Email Preview Drawer */}
                {showEmailPreview && (
                  <div className="mt-3 p-4 bg-white rounded-xl border border-[#E8DFC8] space-y-3 text-xs">
                    <div className="flex justify-between items-center border-b border-[#F4EBE1] pb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6D4F]">
                        Live Email Confirmation Preview
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                        Ready
                      </span>
                    </div>

                    <div className="text-[11px] space-y-1 text-[#4A3B32] bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E8DFC8]/60 font-mono">
                      <p><strong>From:</strong> "The Velvet Cake Co." &lt;orders@thevelvetcakeco.com&gt;</p>
                      <p><strong>To:</strong> {confirmedOrder.customerEmail}</p>
                      <p><strong>Subject:</strong> Order Confirmed: #{confirmedOrder.orderNumber} - The Velvet Cake Co.</p>
                      <p><strong>Date:</strong> {new Date().toLocaleString()}</p>
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
                  </div>
                )}
              </div>

              <button
                id="order-finish-btn"
                onClick={handleFinish}
                className="w-full py-3.5 rounded-xl bg-[#721C24] hover:bg-[#58141B] text-white text-xs uppercase tracking-widest font-semibold shadow-md flex items-center justify-center gap-2"
              >
                <span>{isAuthenticated ? 'View In Dashboard' : 'Back to Home'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
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

            <button
              id="cart-checkout-proceed-btn"
              onClick={() => setStep('checkout')}
              className="w-full py-3.5 rounded-xl bg-[#721C24] hover:bg-[#58141B] text-white text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Proceed to Delivery & Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
