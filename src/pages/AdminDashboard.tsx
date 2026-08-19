import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Edit3, 
  Trash2, 
  MessageSquare, 
  DollarSign, 
  Filter,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { getAdminStatsApi, getContactMessagesApi, updateContactStatusApi, getCustomersApi } from '../services/contactService.ts';
import { getOrdersApi, updateOrderStatusApi } from '../services/orderService.ts';
import { getCustomCakeRequestsApi, updateCustomCakeStatusApi } from '../services/customCakeService.ts';
import { getProductsApi, createProductApi, updateProductApi, deleteProductApi, getFlavorsApi, createFlavorApi, updateFlavorApi, deleteFlavorApi } from '../services/productService.ts';
import { AdminStats, Order, CustomCakeRequest, ContactMessage, Product, CakeFlavor } from '../types.ts';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'custom-cakes' | 'products' | 'flavors' | 'messages' | 'customers'>('overview');
  const [loading, setLoading] = useState(true);

  // Admin Data State
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customRequests, setCustomRequests] = useState<CustomCakeRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [flavors, setFlavors] = useState<CakeFlavor[]>([]);

  // Modals & Action States
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [quoteModalReq, setQuoteModalReq] = useState<CustomCakeRequest | null>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteStatus, setQuoteStatus] = useState('QUOTED');

  // Product Add/Edit Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Flavor Add/Edit Modal
  const [isFlavorModalOpen, setIsFlavorModalOpen] = useState(false);
  const [editingFlavor, setEditingFlavor] = useState<Partial<CakeFlavor> | null>(null);

  const [actionSuccess, setActionSuccess] = useState('');

  const refreshAllData = async () => {
    try {
      setLoading(true);
      const [statsData, ordersData, customData, msgData, custData, prodData, flavData] = await Promise.all([
        getAdminStatsApi(),
        getOrdersApi(),
        getCustomCakeRequestsApi(),
        getContactMessagesApi(),
        getCustomersApi(),
        getProductsApi(),
        getFlavorsApi()
      ]);

      setStats(statsData);
      setOrders(ordersData);
      setCustomRequests(customData);
      setMessages(msgData);
      setCustomers(custData);
      setProducts(prodData);
      setFlavors(flavData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const showNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 3500);
  };

  // Order Status Handler
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatusApi(orderId, status);
      showNotification(`Order status updated to ${status}`);
      refreshAllData();
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  // Custom Cake Quote Handler
  const handleSaveCustomQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteModalReq) return;

    try {
      await updateCustomCakeStatusApi(
        quoteModalReq.id,
        quoteStatus,
        quotePrice ? parseFloat(quotePrice) : undefined
      );
      showNotification(`Custom cake inquiry updated to ${quoteStatus}`);
      setQuoteModalReq(null);
      setQuotePrice('');
      refreshAllData();
    } catch (err) {
      console.error('Error updating custom quote:', err);
    }
  };

  // Message Status Handler
  const handleUpdateMessageStatus = async (msgId: string, status: string) => {
    try {
      await updateContactStatusApi(msgId, status);
      showNotification(`Message marked as ${status}`);
      refreshAllData();
    } catch (err) {
      console.error('Error updating message:', err);
    }
  };

  // Product Save Handler
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.description || editingProduct.price === undefined) return;

    try {
      if (editingProduct.id) {
        await updateProductApi(editingProduct.id, editingProduct);
        showNotification(`Product "${editingProduct.name}" updated successfully.`);
      } else {
        await createProductApi(editingProduct);
        showNotification(`Product "${editingProduct.name}" added to catalog.`);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      refreshAllData();
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProductApi(id);
      showNotification('Product removed from catalog.');
      refreshAllData();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Flavor Save Handler
  const handleSaveFlavor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFlavor?.name || !editingFlavor?.description) return;

    try {
      if (editingFlavor.id) {
        await updateFlavorApi(editingFlavor.id, editingFlavor);
        showNotification(`Flavor "${editingFlavor.name}" updated.`);
      } else {
        await createFlavorApi(editingFlavor);
        showNotification(`Flavor "${editingFlavor.name}" added to library.`);
      }
      setIsFlavorModalOpen(false);
      setEditingFlavor(null);
      refreshAllData();
    } catch (err) {
      console.error('Error saving flavor:', err);
    }
  };

  const handleDeleteFlavor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this flavor?')) return;
    try {
      await deleteFlavorApi(id);
      showNotification('Flavor removed.');
      refreshAllData();
    } catch (err) {
      console.error('Error deleting flavor:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Admin Header */}
      <div className="bg-[#2D2926] text-[#FDFCF0] p-8 rounded-sm border border-[#3D352E] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] uppercase font-bold tracking-[0.25em] text-[#B8860B]">
              Master Management Portal
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">
            The Velvet Cake Co. Operations Console
          </h1>
          <p className="text-xs text-[#8E877D]">
            245 Lexington Ave, Manhattan, New York • Live Production & Order Management
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="px-5 py-2.5 rounded-sm bg-[#3D352E] hover:bg-[#4D453E] text-white text-xs uppercase tracking-wider font-semibold transition-all"
          >
            Live Storefront
          </button>
          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-sm bg-[#7D0A0A] hover:bg-[#960C0C] text-white text-xs uppercase tracking-wider font-semibold transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Global Success Notification Banner */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-900/20 border border-emerald-700/50 text-emerald-900 rounded-sm text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          {actionSuccess}
        </div>
      )}

      {/* Tab Navigation Controls */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#E8E1D5]">
        {[
          { id: 'overview', label: 'Executive Metrics' },
          { id: 'orders', label: `Orders (${orders.length})` },
          { id: 'custom-cakes', label: `Custom Cakes (${customRequests.length})` },
          { id: 'products', label: `Menu Catalog (${products.length})` },
          { id: 'flavors', label: `30+ Flavors (${flavors.length})` },
          { id: 'messages', label: `Inquiries (${messages.length})` },
          { id: 'customers', label: `Customers (${customers.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-sm text-xs uppercase tracking-widest font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#7D0A0A] text-white shadow-sm'
                : 'bg-white border border-[#E8E1D5] text-[#5C554E] hover:bg-[#F5EFE6]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-sm border border-[#E8E1D5] shadow-sm space-y-2">
              <div className="flex justify-between items-center text-[#8E877D]">
                <span className="text-xs uppercase font-bold tracking-wider">Total Revenue</span>
                <DollarSign className="w-4 h-4 text-[#B8860B]" />
              </div>
              <p className="font-serif text-3xl font-bold text-[#1A1A1A]">
                ${stats?.totalSales.toFixed(2) || '0.00'}
              </p>
              <p className="text-[11px] text-emerald-700 font-medium">From all online & custom orders</p>
            </div>

            <div className="bg-white p-6 rounded-sm border border-[#E8E1D5] shadow-sm space-y-2">
              <div className="flex justify-between items-center text-[#8E877D]">
                <span className="text-xs uppercase font-bold tracking-wider">Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-[#7D0A0A]" />
              </div>
              <p className="font-serif text-3xl font-bold text-[#1A1A1A]">
                {stats?.totalOrders || 0}
              </p>
              <p className="text-[11px] text-[#5C554E]">
                {stats?.pendingOrders || 0} currently pending/preparing
              </p>
            </div>

            <div className="bg-white p-6 rounded-sm border border-[#E8E1D5] shadow-sm space-y-2">
              <div className="flex justify-between items-center text-[#8E877D]">
                <span className="text-xs uppercase font-bold tracking-wider">Custom Cake Quotes</span>
                <Sparkles className="w-4 h-4 text-[#B8860B]" />
              </div>
              <p className="font-serif text-3xl font-bold text-[#1A1A1A]">
                {stats?.customCakeRequests || 0}
              </p>
              <p className="text-[11px] text-amber-700 font-medium">
                {stats?.pendingCustomCakes || 0} awaiting chef review
              </p>
            </div>

            <div className="bg-white p-6 rounded-sm border border-[#E8E1D5] shadow-sm space-y-2">
              <div className="flex justify-between items-center text-[#8E877D]">
                <span className="text-xs uppercase font-bold tracking-wider">Registered Clients</span>
                <Users className="w-4 h-4 text-[#2D2926]" />
              </div>
              <p className="font-serif text-3xl font-bold text-[#1A1A1A]">
                {stats?.totalCustomers || 0}
              </p>
              <p className="text-[11px] text-[#5C554E]">The Velvet Circle members</p>
            </div>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Urgent Orders List */}
            <div className="bg-white p-6 rounded-sm border border-[#E8E1D5] shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-[#E8E1D5] pb-3">
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                  Active Kitchen Queue
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#7D0A0A] hover:underline"
                >
                  View All Orders
                </button>
              </div>

              <div className="space-y-3">
                {orders.slice(0, 5).map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3 bg-[#FDFCF0] rounded-sm border border-[#E8E1D5] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-[#7D0A0A]">{ord.orderNumber}</span>
                      <p className="font-medium text-[#1A1A1A]">{ord.customerName}</p>
                      <p className="text-[11px] text-[#8E877D]">Date: {new Date(ord.preferredDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="px-2 py-0.5 rounded-sm bg-[#7D0A0A] text-white text-[10px] font-bold">
                        {ord.orderStatus}
                      </span>
                      <p className="font-bold text-[#1A1A1A]">${ord.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Cake Inquiries Awaiting Review */}
            <div className="bg-white p-6 rounded-sm border border-[#E8E1D5] shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-[#E8E1D5] pb-3">
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                  Custom Cake Commissions Awaiting Quote
                </h3>
                <button
                  onClick={() => setActiveTab('custom-cakes')}
                  className="text-xs font-bold text-[#7D0A0A] hover:underline"
                >
                  Manage Studio
                </button>
              </div>

              <div className="space-y-3">
                {customRequests.slice(0, 5).map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-[#FDFCF0] rounded-sm border border-[#E8E1D5] flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#1A1A1A]">{req.cakeType}</p>
                      <p className="text-[#5C554E]">{req.customerName} • {req.flavor}</p>
                      <p className="text-[11px] text-[#8E877D]">Event: {new Date(req.eventDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="px-2 py-0.5 rounded-sm bg-amber-100 text-amber-900 text-[10px] font-bold">
                        {req.status}
                      </span>
                      <button
                        onClick={() => {
                          setQuoteModalReq(req);
                          setQuotePrice(req.quotedPrice ? String(req.quotedPrice) : '');
                          setQuoteStatus(req.status);
                        }}
                        className="block text-[11px] font-bold text-[#7D0A0A] hover:underline"
                      >
                        Set Price Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. ORDERS MANAGEMENT TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-sm border border-[#E8E1D5] shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex justify-between items-center border-b border-[#E8E1D5] pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">Order Fulfillment & Delivery</h2>
              <p className="text-xs text-[#8E877D]">Manage status transitions, customer notes, and order details.</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#7D0A0A]">{orders.length} total orders</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5EFE6] text-[#2D2926] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-3">Order #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Method & Date</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E1D5]">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FDFCF0] transition-colors">
                    <td className="p-3 font-mono font-bold text-[#7D0A0A]">
                      {ord.orderNumber}
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-[#1A1A1A]">{ord.customerName}</p>
                      <p className="text-[11px] text-[#8E877D]">{ord.customerEmail}</p>
                      <p className="text-[11px] text-[#8E877D]">{ord.customerPhone}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-[#1A1A1A]">{ord.deliveryMethod.replace(/_/g, ' ')}</p>
                      <p className="text-[11px] text-[#8E877D]">{new Date(ord.preferredDate).toLocaleDateString()}</p>
                      {ord.deliveryAddress && (
                        <p className="text-[10px] text-[#5C554E] max-w-xs truncate">{ord.deliveryAddress}</p>
                      )}
                    </td>
                    <td className="p-3 space-y-0.5">
                      {ord.orderItems.map((item, i) => (
                        <p key={i} className="text-[11px] text-[#5C554E]">
                          <strong>{item.quantity}x</strong> {item.product?.name || 'Cake'}
                        </p>
                      ))}
                    </td>
                    <td className="p-3 font-serif font-bold text-sm text-[#1A1A1A]">
                      ${ord.total.toFixed(2)}
                    </td>
                    <td className="p-3">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className="bg-white border border-[#E8E1D5] rounded-sm p-1.5 font-semibold text-[11px] text-[#1A1A1A]"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="READY">READY</option>
                        <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 text-[#7D0A0A] hover:bg-[#F5EFE6] rounded-sm"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CUSTOM CAKES TAB */}
      {activeTab === 'custom-cakes' && (
        <div className="bg-white rounded-sm border border-[#E8E1D5] shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-[#E8E1D5] pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">Custom Cake Atelier Commissions</h2>
              <p className="text-xs text-[#8E877D]">Review design specifications, set price quotes, and manage client approvals.</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#7D0A0A]">{customRequests.length} total commissions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5EFE6] text-[#2D2926] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-3">Client</th>
                  <th className="p-3">Concept & Type</th>
                  <th className="p-3">Structure & Flavor</th>
                  <th className="p-3">Event Date</th>
                  <th className="p-3">Quote ($)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E1D5]">
                {customRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-[#FDFCF0] transition-colors">
                    <td className="p-3">
                      <p className="font-bold text-[#1A1A1A]">{req.customerName}</p>
                      <p className="text-[11px] text-[#8E877D]">{req.customerEmail}</p>
                      <p className="text-[11px] text-[#8E877D]">{req.customerPhone}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-[#7D0A0A]">{req.cakeType}</p>
                      <p className="text-[11px] text-[#5C554E]">Colors: {req.colors}</p>
                      {req.message && <p className="text-[10px] italic">"{req.message}"</p>}
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-[#1A1A1A]">{req.flavor} + {req.filling}</p>
                      <p className="text-[11px] text-[#8E877D]">{req.size} ({req.tiers} tier{req.tiers > 1 ? 's' : ''})</p>
                      <p className="text-[10px] text-emerald-800">{req.dietaryRequirement}</p>
                    </td>
                    <td className="p-3 font-semibold text-[#1A1A1A]">
                      {new Date(req.eventDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-serif font-bold text-sm text-[#1A1A1A]">
                      {req.quotedPrice ? `$${req.quotedPrice.toFixed(2)}` : '—'}
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase bg-amber-100 text-amber-900">
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          setQuoteModalReq(req);
                          setQuotePrice(req.quotedPrice ? String(req.quotedPrice) : '');
                          setQuoteStatus(req.status);
                        }}
                        className="px-3 py-1 bg-[#7D0A0A] hover:bg-[#960C0C] text-white rounded-sm font-semibold text-[11px]"
                      >
                        Quote / Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. PRODUCTS CATALOG TAB */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-sm border border-[#E8E1D5] shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-[#E8E1D5] pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">Menu Catalog & Inventory</h2>
              <p className="text-xs text-[#8E877D]">Add, edit, or toggle availability of ready-to-order cakes and pastries.</p>
            </div>
            <button
              onClick={() => {
                setEditingProduct({
                  name: '',
                  description: '',
                  category: 'Signature Cakes',
                  price: 68.00,
                  imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80',
                  featured: false,
                  available: true
                });
                setIsProductModalOpen(true);
              }}
              className="px-4 py-2 bg-[#7D0A0A] hover:bg-[#960C0C] text-white rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-[#FDFCF0] p-4 rounded-sm border border-[#E8E1D5] flex flex-col justify-between space-y-3"
              >
                <div className="flex gap-3">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-16 h-16 object-cover rounded-sm border border-[#E8E1D5] shrink-0"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm text-[#1A1A1A] truncate">{prod.name}</h4>
                    <p className="text-[11px] text-[#B8860B] font-semibold">{prod.category}</p>
                    <p className="font-serif font-bold text-sm text-[#7D0A0A]">${prod.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E8E1D5] text-xs">
                  <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${prod.available ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                    {prod.available ? 'Available' : 'Sold Out'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(prod);
                        setIsProductModalOpen(true);
                      }}
                      className="p-1.5 text-[#5C554E] hover:text-[#7D0A0A]"
                      title="Edit Product"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-1.5 text-rose-600 hover:text-rose-800"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. FLAVORS TAB */}
      {activeTab === 'flavors' && (
        <div className="bg-white rounded-sm border border-[#E8E1D5] shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-[#E8E1D5] pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">30+ Artisanal Flavor Library</h2>
              <p className="text-xs text-[#8E877D]">Manage cake sponge flavor recipes available for custom cakes.</p>
            </div>
            <button
              onClick={() => {
                setEditingFlavor({
                  name: '',
                  description: '',
                  available: true
                });
                setIsFlavorModalOpen(true);
              }}
              className="px-4 py-2 bg-[#7D0A0A] hover:bg-[#960C0C] text-white rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Flavor
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {flavors.map((fl, idx) => (
              <div
                key={fl.id || idx}
                className="bg-[#FDFCF0] p-4 rounded-sm border border-[#E8E1D5] flex flex-col justify-between space-y-2 text-xs"
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[#8E877D] text-[10px]">#{idx + 1}</span>
                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${fl.available ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                      {fl.available ? 'Available' : 'Seasonal'}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">{fl.name}</h4>
                  <p className="text-[#5C554E] mt-1 line-clamp-2">{fl.description}</p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E1D5]">
                  <button
                    onClick={() => {
                      setEditingFlavor(fl);
                      setIsFlavorModalOpen(true);
                    }}
                    className="text-xs text-[#5C554E] hover:text-[#7D0A0A]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteFlavor(fl.id)}
                    className="text-xs text-rose-600 hover:text-rose-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. MESSAGES & INQUIRIES TAB */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-sm border border-[#E8E1D5] shadow-sm p-6 space-y-4">
          <div className="border-b border-[#E8E1D5] pb-4">
            <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">Customer Contact Messages</h2>
            <p className="text-xs text-[#8E877D]">Inquiries submitted via the online contact concierge form.</p>
          </div>

          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-[#FDFCF0] p-5 rounded-sm border border-[#E8E1D5] space-y-3 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">{msg.subject}</h4>
                    <p className="text-[#5C554E]">From: {msg.name} ({msg.email}) {msg.phone ? `• ${msg.phone}` : ''}</p>
                    <p className="text-[11px] text-[#8E877D]">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>

                  <select
                    value={msg.status}
                    onChange={(e) => handleUpdateMessageStatus(msg.id, e.target.value)}
                    className="bg-white border border-[#E8E1D5] rounded-sm p-1 text-xs font-semibold"
                  >
                    <option value="NEW">NEW</option>
                    <option value="READ">READ</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>

                <p className="bg-white p-3 rounded-sm border border-[#E8E1D5] text-[#2D2926] leading-relaxed">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. CUSTOMERS TAB */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-sm border border-[#E8E1D5] shadow-sm p-6 space-y-4">
          <div className="border-b border-[#E8E1D5] pb-4">
            <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">Registered Clients Directory</h2>
            <p className="text-xs text-[#8E877D]">The Velvet Circle registered client profiles.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5EFE6] text-[#2D2926] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E1D5]">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FDFCF0]">
                    <td className="p-3 font-bold text-[#1A1A1A]">{c.name}</td>
                    <td className="p-3 text-[#5C554E]">{c.email}</td>
                    <td className="p-3 text-[#5C554E]">{c.phone || '—'}</td>
                    <td className="p-3 text-[#8E877D]">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '2026'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Quote Custom Cake */}
      {quoteModalReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-[#E8E1D5] shadow-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">Set Custom Cake Quote</h3>
            <p className="text-xs text-[#5C554E]">
              Client: <strong>{quoteModalReq.customerName}</strong> ({quoteModalReq.customerEmail})
            </p>

            <form onSubmit={handleSaveCustomQuote} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#2D2926] mb-1">Quote Price ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  placeholder="250.00"
                  className="w-full bg-[#FDFCF0] border border-[#E8E1D5] rounded-sm p-2.5 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2D2926] mb-1">Status</label>
                <select
                  value={quoteStatus}
                  onChange={(e) => setQuoteStatus(e.target.value)}
                  className="w-full bg-[#FDFCF0] border border-[#E8E1D5] rounded-sm p-2.5"
                >
                  <option value="REVIEWING">REVIEWING</option>
                  <option value="QUOTED">QUOTED (Quote Sent)</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E1D5]">
                <button
                  type="button"
                  onClick={() => setQuoteModalReq(null)}
                  className="px-4 py-2 border border-[#E8E1D5] rounded-sm uppercase tracking-wider font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7D0A0A] hover:bg-[#960C0C] text-white rounded-sm uppercase tracking-wider font-semibold"
                >
                  Save Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add/Edit Product */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-[#E8E1D5] shadow-2xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
              {editingProduct.id ? 'Edit Product' : 'Add New Cake / Pastry'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#2D2926] mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-[#FDFCF0] border border-[#E8E1D5] rounded-sm p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2D2926] mb-1">Category *</label>
                <select
                  value={editingProduct.category || 'Signature Cakes'}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full bg-[#FDFCF0] border border-[#E8E1D5] rounded-sm p-2.5"
                >
                  <option value="Signature Cakes">Signature Cakes</option>
                  <option value="Wedding Cakes">Wedding Cakes</option>
                  <option value="Seasonal Specials">Seasonal Specials</option>
                  <option value="Mini Treats">Mini Treats</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#2D2926] mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price !== undefined ? editingProduct.price : ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#FDFCF0] border border-[#E8E1D5] rounded-sm p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2D2926] mb-1">Image URL</label>
                  <input
                    type="url"
                    value={editingProduct.imageUrl || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#FDFCF0] border border-[#E8E1D5] rounded-sm p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2D2926] mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-[#FDFCF0] border border-[#E8E1D5] rounded-sm p-2.5"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.featured)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="rounded text-[#7D0A0A]"
                  />
                  <span>Featured Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={editingProduct.available !== undefined ? editingProduct.available : true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, available: e.target.checked })}
                    className="rounded text-[#7D0A0A]"
                  />
                  <span>In Stock / Available</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E1D5]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E1D5] rounded-sm uppercase tracking-wider font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7D0A0A] hover:bg-[#960C0C] text-white rounded-sm uppercase tracking-wider font-semibold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add/Edit Flavor */}
      {isFlavorModalOpen && editingFlavor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-[#E8E1D5] shadow-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
              {editingFlavor.id ? 'Edit Flavor Recipe' : 'Add Sponge Flavor'}
            </h3>

            <form onSubmit={handleSaveFlavor} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#2D2926] mb-1">Flavor Name *</label>
                <input
                  type="text"
                  required
                  value={editingFlavor.name || ''}
                  onChange={(e) => setEditingFlavor({ ...editingFlavor, name: e.target.value })}
                  placeholder="e.g. Pistachio Cardamom Rosewater"
                  className="w-full bg-[#FDFCF0] border border-[#E8E1D5] rounded-sm p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2D2926] mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingFlavor.description || ''}
                  onChange={(e) => setEditingFlavor({ ...editingFlavor, description: e.target.value })}
                  placeholder="Tasting notes, ingredient origins..."
                  className="w-full bg-[#FDFCF0] border border-[#E8E1D5] rounded-sm p-2.5"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={editingFlavor.available !== undefined ? editingFlavor.available : true}
                    onChange={(e) => setEditingFlavor({ ...editingFlavor, available: e.target.checked })}
                    className="rounded text-[#7D0A0A]"
                  />
                  <span>Available for Custom Cake Baking</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E1D5]">
                <button
                  type="button"
                  onClick={() => setIsFlavorModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E1D5] rounded-sm uppercase tracking-wider font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7D0A0A] hover:bg-[#960C0C] text-white rounded-sm uppercase tracking-wider font-semibold"
                >
                  Save Flavor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
