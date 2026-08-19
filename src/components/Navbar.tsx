import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, Menu as MenuIcon, X, Sparkles, Shield, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function Navbar({ currentPath, onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Cakes', path: '/cakes' },
    { name: 'Menu', path: '/menu' },
    { name: 'Custom Cakes', path: '/custom-cakes' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFCF0]/95 backdrop-blur-md border-b border-[#E8E1D5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <button
            id="nav-brand-logo"
            onClick={() => handleNav('/')}
            className="flex flex-col text-left group focus:outline-none"
          >
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#7D0A0A] group-hover:text-[#5E0707] transition-colors">
              The Velvet Cake Co.
            </span>
            <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#B8860B] uppercase font-sans font-medium">
              Crafted for Every Celebration
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const active = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleNav(link.path)}
                  className={`text-sm font-medium transition-colors tracking-wide relative py-1 ${
                    active
                      ? 'text-[#7D0A0A] font-semibold'
                      : 'text-[#2D2926] hover:text-[#7D0A0A]'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#7D0A0A] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center space-x-4">
            
            {/* Cart Button */}
            <button
              id="nav-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-[#2D2926] hover:text-[#7D0A0A] hover:bg-[#F5EFE6] rounded-full transition-all flex items-center"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#7D0A0A] text-white text-[11px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-[#FDFCF0]">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Auth / Account Controls */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center space-x-2">
                {isAdmin ? (
                  <button
                    id="nav-admin-link"
                    onClick={() => handleNav('/admin')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                      currentPath === '/admin'
                        ? 'bg-[#7D0A0A] text-white'
                        : 'bg-[#F5EFE6] text-[#7D0A0A] hover:bg-[#E8E1D5]'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-[#B8860B]" />
                    Admin
                  </button>
                ) : (
                  <button
                    id="nav-dashboard-link"
                    onClick={() => handleNav('/dashboard')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                      currentPath === '/dashboard'
                        ? 'bg-[#7D0A0A] text-white'
                        : 'bg-[#F5EFE6] text-[#2D2926] hover:bg-[#E8E1D5]'
                    }`}
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    Dashboard
                  </button>
                )}
                <button
                  id="nav-logout-btn"
                  onClick={logout}
                  className="text-xs text-[#8E877D] hover:text-[#7D0A0A] px-2 py-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                id="nav-login-btn"
                onClick={() => handleNav('/login')}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#2D2926] hover:text-[#7D0A0A] px-3.5 py-1.5 rounded-full hover:bg-[#F5EFE6] transition-all"
              >
                <UserIcon className="w-4 h-4" />
                Sign In
              </button>
            )}

            {/* Order Now CTA Button */}
            <button
              id="nav-order-now-btn"
              onClick={() => handleNav('/order')}
              className="hidden md:inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#7D0A0A] hover:bg-[#5E0707] text-[#FDFCF0] text-xs uppercase tracking-widest font-semibold shadow-sm transition-all hover:shadow-md"
            >
              Order Online
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="nav-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#2D2926] hover:text-[#7D0A0A] rounded-md focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FDFCF0] border-b border-[#E8E1D5] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                id={`nav-mobile-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleNav(link.path)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-left text-base font-medium ${
                  currentPath === link.path
                    ? 'bg-[#F5EFE6] text-[#7D0A0A] font-semibold'
                    : 'text-[#2D2926] hover:bg-[#F5EFE6]'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E8E1D5] flex flex-col space-y-2.5">
            {isAuthenticated ? (
              <>
                <button
                  id="nav-mobile-account-link"
                  onClick={() => handleNav(isAdmin ? '/admin' : '/dashboard')}
                  className="w-full text-center py-2.5 px-4 rounded-lg bg-[#F5EFE6] text-[#7D0A0A] font-semibold text-sm"
                >
                  {isAdmin ? 'Admin Dashboard' : `My Account (${user?.name?.split(' ')[0]})`}
                </button>
                <button
                  id="nav-mobile-logout-btn"
                  onClick={logout}
                  className="w-full text-center py-2 text-sm text-[#8E877D] hover:text-[#7D0A0A]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                id="nav-mobile-signin-btn"
                onClick={() => handleNav('/login')}
                className="w-full text-center py-2.5 px-4 rounded-lg border border-[#7D0A0A] text-[#7D0A0A] font-semibold text-sm"
              >
                Sign In / Register
              </button>
            )}

            <button
              id="nav-mobile-order-btn"
              onClick={() => handleNav('/order')}
              className="w-full py-3 px-4 rounded-full bg-[#7D0A0A] text-white text-center font-semibold text-sm uppercase tracking-wider"
            >
              Order Online Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
