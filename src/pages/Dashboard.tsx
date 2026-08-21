import React, { useState, useEffect } from 'react';
import { User, Package, Calendar, Clock, Sparkles, MapPin, Phone, Mail, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { getOrdersApi } from '../services/orderService.ts';
import { getCustomCakeRequestsApi } from '../services/customCakeService.ts';
import { Order, CustomCakeRequest } from '../types.ts';
import { formatCustomization } from '../utils/customizationFormatter.ts';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user, updateProfile, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'custom' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [customRequests, setCustomRequests] = useState<CustomCakeRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile edit state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [ordersData, customData] = await Promise.all([
          getOrdersApi(),
          getCustomCakeRequestsApi()
        ]);
        setOrders(ordersData);
        setCustomRequests(customData);
      } catch (err) {
        console.error('Failed to load user dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ name, phone });
      setProfileMsg('Profile details updated successfully.');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      setProfileMsg('Failed to update profile.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#21110C] to-[#3D1E16] text-[#FDFBF7] p-8 sm:p-10 rounded-3xl border border-[#4D2E24] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#D4AF37]">
            The Velvet Circle • Customer Atelier
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Welcome, {user?.name || 'Valued Guest'}
          </h1>
          <p className="text-xs sm:text-sm text-[#C9BAAF]">
            Track your artisanal bakery orders, delivery timelines, and bespoke cake quotes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/order')}
            className="px-6 py-3 rounded-full bg-[#721C24] hover:bg-[#8B232D] text-white text-xs uppercase font-semibold tracking-wider shadow-md transition-all"
          >
            Order Again
          </button>
          <button
            onClick={logout}
            className="px-4 py-3 rounded-full bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 text-white text-xs uppercase font-semibold tracking-wider transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-[#E8DFC8] pb-4">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === 'orders'
              ? 'bg-[#721C24] text-white shadow-sm'
              : 'bg-white border border-[#E8DFC8] text-[#4A3B32] hover:bg-[#F4EBE1]'
          }`}
        >
          My Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === 'custom'
              ? 'bg-[#721C24] text-white shadow-sm'
              : 'bg-white border border-[#E8DFC8] text-[#4A3B32] hover:bg-[#F4EBE1]'
          }`}
        >
          Custom Cake Inquiries ({customRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === 'profile'
              ? 'bg-[#721C24] text-white shadow-sm'
              : 'bg-white border border-[#E8DFC8] text-[#4A3B32] hover:bg-[#F4EBE1]'
          }`}
        >
          Profile Settings
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-16 text-xs text-[#8C6D4F]">Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E8DFC8] space-y-4">
              <Package className="w-12 h-12 text-[#8C6D4F] mx-auto" />
              <h3 className="font-serif text-xl font-bold text-[#2C1810]">No orders found yet</h3>
              <p className="text-xs sm:text-sm text-[#6E5A4E] max-w-sm mx-auto">
                You have not placed any cake orders with us yet. Explore our signature collection today.
              </p>
              <button
                onClick={() => onNavigate('/cakes')}
                className="px-6 py-2.5 rounded-full bg-[#721C24] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#58141B]"
              >
                Browse Cakes
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F4EBE1] gap-2">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-[#721C24]">
                        {order.orderNumber}
                      </span>
                      <p className="text-xs text-[#8C6D4F]">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        {order.orderStatus}
                      </span>
                      <span className="font-serif font-bold text-lg text-[#2C1810]">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2.5">
                    {order.orderItems.map((item, i) => {
                      const formattedCustom = formatCustomization(item.customization);
                      return (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#4A3B32] bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DFC8]/60 gap-1.5">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#721C24]">{item.quantity}x</span>
                              <span className="font-semibold text-[#2C1810]">
                                {item.product?.name || 'Signature Cake'}
                              </span>
                            </div>
                            {formattedCustom && (
                              <p className="text-[11px] text-[#8C6D4F] font-medium pl-6">
                                ✦ {formattedCustom}
                              </p>
                            )}
                          </div>
                          <span className="font-bold text-[#2C1810] sm:text-right shrink-0">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Delivery details */}
                  <div className="pt-3 border-t border-[#F4EBE1] flex flex-col sm:flex-row justify-between text-xs text-[#6E5A4E] gap-2">
                    <div>
                      <p><strong>Delivery Method:</strong> {order.deliveryMethod.replace(/_/g, ' ')}</p>
                      <p><strong>Scheduled Date:</strong> {new Date(order.preferredDate).toLocaleDateString()}</p>
                    </div>
                    {order.deliveryAddress && (
                      <div>
                        <p><strong>Address:</strong> {order.deliveryAddress}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Custom Cake Inquiries */}
      {activeTab === 'custom' && (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-16 text-xs text-[#8C6D4F]">Loading custom cake inquiries...</div>
          ) : customRequests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E8DFC8] space-y-4">
              <Sparkles className="w-12 h-12 text-[#8C6D4F] mx-auto" />
              <h3 className="font-serif text-xl font-bold text-[#2C1810]">No custom cake inquiries</h3>
              <p className="text-xs sm:text-sm text-[#6E5A4E] max-w-sm mx-auto">
                Ready to create a multi-tier wedding centerpiece or bespoke birthday cake?
              </p>
              <button
                onClick={() => onNavigate('/custom-cakes')}
                className="px-6 py-2.5 rounded-full bg-[#721C24] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#58141B]"
              >
                Launch Custom Studio
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-lg font-bold text-[#2C1810]">
                        {req.cakeType}
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                        {req.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#8C6D4F]">
                      Event Date: <strong>{new Date(req.eventDate).toLocaleDateString()}</strong>
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#4A3B32] bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E8DFC8]">
                    <p><strong>Flavor:</strong> {req.flavor} + {req.filling}</p>
                    <p><strong>Structure:</strong> {req.size} ({req.tiers} tier{req.tiers > 1 ? 's' : ''})</p>
                    <p><strong>Palette:</strong> {req.colors}</p>
                    {req.message && <p><strong>Inscription:</strong> "{req.message}"</p>}
                    {req.quotedPrice && (
                      <p className="text-[#721C24] font-bold text-sm pt-1">
                        Quoted Price: ${req.quotedPrice.toFixed(2)}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 text-[11px] text-[#8C6D4F]">
                    Submitted on {new Date(req.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white p-8 rounded-3xl border border-[#E8DFC8] max-w-xl space-y-6 shadow-sm">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#2C1810]">
              Account Profile
            </h3>
            <p className="text-xs text-[#6E5A4E] mt-0.5">
              Update your customer contact information for streamlined orders.
            </p>
          </div>

          {profileMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
              {profileMsg}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-medium text-[#4A3B32] mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#4A3B32] mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-stone-100 border border-[#E8DFC8] rounded-xl p-3 text-stone-500 cursor-not-allowed"
              />
              <p className="text-[10px] text-[#8C6D4F] mt-1">Email cannot be changed.</p>
            </div>

            <div>
              <label className="block font-medium text-[#4A3B32] mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (212) 555-0199"
                className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-[#721C24] hover:bg-[#58141B] text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-all"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
