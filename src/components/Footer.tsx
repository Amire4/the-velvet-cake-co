import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Heart, CheckCircle2, ShieldCheck } from 'lucide-react';
import { subscribeNewsletterApi } from '../services/contactService.ts';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please provide a valid email address.');
      return;
    }

    try {
      setStatus('loading');
      const res = await subscribeNewsletterApi(email);
      setStatus('success');
      setMessage(res.message || 'Thank you for joining The Velvet Circle!');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Subscription failed. Please try again.');
    }
  };

  return (
    <footer className="bg-[#1A1615] text-[#F5EFE6] pt-16 pb-10 border-t border-[#2D2926]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          
          {/* Brand & Manifesto */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#FDFCF0]">
                The Velvet Cake Co.
              </span>
              <span className="text-xs tracking-[0.2em] text-[#B8860B] uppercase font-sans font-semibold mt-0.5">
                Crafted for Every Celebration
              </span>
            </div>
            <p className="text-sm text-[#D1C7BD] leading-relaxed">
              "Every celebration deserves something extraordinary." Manhattan’s premier bespoke bakery crafting artisanal cakes, layered desserts, and wedding centerpieces from the finest ingredients.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D2926] text-[#B8860B] text-xs font-medium border border-[#3D3833]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Licensed Manhattan Artisanal Bakery
              </span>
            </div>
          </div>

          {/* Location & Hours */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#FDFCF0] tracking-wide">
              Manhattan Boutique
            </h3>
            <ul className="space-y-3 text-sm text-[#D1C7BD]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B8860B] shrink-0 mt-1" />
                <span>
                  245 Lexington Avenue<br />
                  Manhattan, New York, NY 10016
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#B8860B] shrink-0" />
                <span>Mon – Sun: 8:00 AM – 9:00 PM</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B8860B] shrink-0" />
                <a href="tel:+12125550187" className="hover:text-white transition-colors">
                  +1 (212) 555-0187
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B8860B] shrink-0" />
                <a href="mailto:orders@thevelvetcakeco.com" className="hover:text-white transition-colors">
                  orders@thevelvetcakeco.com
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#FDFCF0] tracking-wide">
              Explore & Order
            </h3>
            <ul className="space-y-2 text-sm text-[#D1C7BD]">
              <li>
                <button onClick={() => onNavigate('/cakes')} className="hover:text-[#B8860B] transition-colors">
                  Signature Cakes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/custom-cakes')} className="hover:text-[#B8860B] transition-colors">
                  Custom Cake Studio (24-48hr)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/menu')} className="hover:text-[#B8860B] transition-colors">
                  Cheesecakes, Macarons & Cupcakes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/gallery')} className="hover:text-[#B8860B] transition-colors">
                  Celebration & Wedding Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-[#B8860B] transition-colors">
                  Our Baking Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-[#B8860B] transition-colors">
                  Location & Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#FDFCF0] tracking-wide">
              The Velvet Circle
            </h3>
            <p className="text-xs text-[#D1C7BD] leading-relaxed">
              Subscribe for seasonal flavor launches, tasting invitations, and exclusive celebration offers.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-[#241F1E] text-[#FDFCF0] placeholder-[#8E877D] text-xs px-3.5 py-2.5 rounded-md border border-[#3D3833] focus:outline-none focus:border-[#B8860B] transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#7D0A0A] hover:bg-[#5E0707] text-white rounded text-xs font-medium flex items-center justify-center transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {status === 'success' && (
                <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3" /> {message}
                </p>
              )}
              {status === 'error' && (
                <p className="text-xs text-rose-400 mt-1">{message}</p>
              )}
            </form>
            <div className="pt-2">
              <span className="text-[11px] text-[#B8860B]">
                🚚 Free delivery in Manhattan on all orders over $100.
              </span>
            </div>
          </div>

        </div>

        {/* Accepted Payment Methods & Delivery Banner */}
        <div className="border-t border-[#2D2926] pt-6 pb-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8E877D]">
          <div>
            <span>Accepted Payment Methods: </span>
            <span className="font-medium text-[#D1C7BD]">
              Visa • Mastercard • American Express • Apple Pay • Google Pay • PayPal • In-Store Cash
            </span>
          </div>
          <div>
            <span>Delivery: </span>
            <span className="font-medium text-[#D1C7BD]">
              Same-Day Manhattan • Next-Day NYC • In-Store Pickup (Free)
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#2D2926] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8E877D] gap-3">
          <p>© {new Date().getFullYear()} The Velvet Cake Co. All rights reserved. Crafted with care in Manhattan.</p>
          <div className="flex items-center space-x-6">
            <span>245 Lexington Ave, Manhattan, NY 10016</span>
            <span>•</span>
            <span>orders@thevelvetcakeco.com</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
