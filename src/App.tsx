import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider, useCart } from './context/CartContext.tsx';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import Chatbot from './components/Chatbot.tsx';
import OrderModal from './components/OrderModal.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import AdminRoute from './components/AdminRoute.tsx';

import Home from './pages/Home.tsx';
import Cakes from './pages/Cakes.tsx';
import Menu from './pages/Menu.tsx';
import CustomCakes from './pages/CustomCakes.tsx';
import About from './pages/About.tsx';
import Gallery from './pages/Gallery.tsx';
import Contact from './pages/Contact.tsx';
import Order from './pages/Order.tsx';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';

import { getProductsApi, getFlavorsApi } from './services/productService.ts';
import { Product, CakeFlavor } from './types.ts';
import { X, Sparkles, ShoppingBag, Plus, Minus } from 'lucide-react';

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const { isCartOpen, setIsCartOpen, addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [flavors, setFlavors] = useState<CakeFlavor[]>([]);
  const [loading, setLoading] = useState(true);

  // Customize Product Modal State
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string>('Chef Signature');
  const [selectedSize, setSelectedSize] = useState<string>('8-inch (14-18 Servings)');
  const [customPlaqueMessage, setCustomPlaqueMessage] = useState<string>('');
  const [customQuantity, setCustomQuantity] = useState<number>(1);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prodList, flavList] = await Promise.all([
          getProductsApi(),
          getFlavorsApi(false)
        ]);
        setProducts(prodList);
        setFlavors(flavList);
        if (flavList.length > 0) {
          setSelectedFlavor(flavList[0].name);
        }
      } catch (err) {
        console.error('Failed to load initial bakery catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOpenCustomize = (product: Product) => {
    setCustomizingProduct(product);
    setSelectedSize('8-inch (14-18 Servings)');
    setCustomPlaqueMessage('');
    setCustomQuantity(1);
  };

  const handleConfirmCustomize = () => {
    if (!customizingProduct) return;
    addToCart(customizingProduct, customQuantity, {
      flavor: selectedFlavor,
      size: selectedSize,
      message: customPlaqueMessage || undefined
    });
    setCustomizingProduct(null);
  };

  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] text-[#2D2926] flex flex-col font-sans selection:bg-[#7D0A0A] selection:text-white">
      {/* Navigation Header */}
      <Navbar currentPath={currentPath} onNavigate={navigate} />

      {/* Main Page Routing */}
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 18, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.995 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {currentPath === '/' && (
              <Home
                products={products}
                flavors={flavors}
                onNavigate={navigate}
                onCustomizeProduct={handleOpenCustomize}
                onProductUpdated={handleProductUpdated}
              />
            )}

            {currentPath === '/cakes' && (
              <Cakes
                products={products}
                onCustomizeProduct={handleOpenCustomize}
                onNavigate={navigate}
                onProductUpdated={handleProductUpdated}
              />
            )}

            {currentPath === '/menu' && (
              <Menu
                products={products}
                onNavigate={navigate}
                onProductUpdated={handleProductUpdated}
              />
            )}

            {currentPath === '/custom-cakes' && (
              <CustomCakes
                flavors={flavors}
                onNavigate={navigate}
              />
            )}

            {currentPath === '/about' && (
              <About onNavigate={navigate} />
            )}

            {currentPath === '/gallery' && (
              <Gallery onNavigate={navigate} />
            )}

            {currentPath === '/contact' && (
              <Contact />
            )}

            {currentPath === '/order' && (
              <Order
                products={products}
                onNavigate={navigate}
              />
            )}

            {currentPath === '/login' && (
              <Login onNavigate={navigate} initialMode="login" />
            )}

            {currentPath === '/register' && (
              <Login onNavigate={navigate} initialMode="register" />
            )}

            {currentPath === '/dashboard' && (
              <ProtectedRoute onRedirectToLogin={() => navigate('/login')}>
                <Dashboard onNavigate={navigate} />
              </ProtectedRoute>
            )}

            {currentPath === '/admin' && (
              <AdminRoute
                onRedirectToLogin={() => navigate('/login')}
                onNavigateHome={() => navigate('/')}
              >
                <AdminDashboard onNavigate={navigate} />
              </AdminRoute>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer onNavigate={navigate} />

      {/* AI Customer Concierge Chatbot */}
      <Chatbot />

      {/* Shopping Bag & Checkout Drawer */}
      <OrderModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onNavigate={navigate}
      />

      {/* Product Customization Modal */}
      {customizingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E8DFC8] shadow-2xl space-y-5 relative">
            <button
              onClick={() => setCustomizingProduct(null)}
              className="absolute top-4 right-4 p-2 text-[#8C6D4F] hover:text-[#721C24] hover:bg-[#F4EBE1] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-4 items-center">
              <img
                src={customizingProduct.imageUrl}
                alt={customizingProduct.name}
                className="w-20 h-20 rounded-xl object-cover border border-[#E8E1D5]"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80';
                }}
              />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#B8860B]">
                  Customize Cake
                </span>
                <h3 className="font-serif text-xl font-bold text-[#2D2926]">
                  {customizingProduct.name}
                </h3>
                <p className="font-serif font-bold text-[#7D0A0A] text-base">
                  ${(customizingProduct.price * customQuantity).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-[#2D2926] mb-1">
                  Choose Sponge Flavor (30+ Recipes)
                </label>
                <select
                  value={selectedFlavor}
                  onChange={(e) => setSelectedFlavor(e.target.value)}
                  className="w-full bg-[#FDFCF0] border border-[#E8E1D5] rounded-xl p-3 focus:outline-none focus:border-[#7D0A0A]"
                >
                  {flavors.map((f) => (
                    <option key={f.id || f.name} value={f.name}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#2D2926] mb-1">
                  Size & Serving Quantity
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full bg-[#FDFCF0] border border-[#E8E1D5] rounded-xl p-3 focus:outline-none focus:border-[#7D0A0A]"
                >
                  <option value="6-inch (8-10 Servings)">6-inch Petite (8–10 Servings)</option>
                  <option value="8-inch (14-18 Servings)">8-inch Classic (14–18 Servings)</option>
                  <option value="10-inch (22-28 Servings)">10-inch Grand (22–28 Servings)</option>
                  <option value="2-Tier (35-45 Servings)">2-Tier Celebration (35–45 Servings)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#2D2926] mb-1">
                  Custom Chocolate Plaque Inscription (Complimentary)
                </label>
                <input
                  type="text"
                  value={customPlaqueMessage}
                  onChange={(e) => setCustomPlaqueMessage(e.target.value)}
                  placeholder="e.g. Happy 30th Birthday Victoria!"
                  className="w-full bg-[#FDFCF0] border border-[#E8E1D5] rounded-xl p-3 focus:outline-none focus:border-[#7D0A0A]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-medium text-[#2D2926] text-sm">Order Quantity</span>
                <div className="flex items-center border border-[#E8E1D5] rounded-xl bg-[#F5EFE6] shadow-2xs overflow-hidden">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    id="customize-quantity-minus-btn"
                    onClick={() => setCustomQuantity(Math.max(1, customQuantity - 1))}
                    className="p-2 text-[#7D0A0A] hover:bg-[#E8DFC8] active:bg-[#D4AF37]/20 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </motion.button>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={customQuantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val > 0) {
                        setCustomQuantity(val);
                      }
                    }}
                    className="w-12 text-center text-xs font-bold text-[#2D2926] border-x border-[#E8E1D5] bg-white py-1.5 focus:outline-none"
                    aria-label="Quantity"
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    id="customize-quantity-plus-btn"
                    onClick={() => setCustomQuantity(customQuantity + 1)}
                    className="p-2 text-[#7D0A0A] hover:bg-[#E8DFC8] active:bg-[#D4AF37]/20 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E1D5]">
              <button
                onClick={handleConfirmCustomize}
                className="w-full py-3.5 rounded-full bg-[#7D0A0A] hover:bg-[#5E0707] text-white text-xs uppercase tracking-widest font-semibold shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Customized Cake to Bag</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
