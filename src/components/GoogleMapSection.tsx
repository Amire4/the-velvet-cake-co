import React from 'react';
import { MapPin, Navigation, Clock, Phone, Mail, ExternalLink, Sparkles } from 'lucide-react';

export default function GoogleMapSection() {
  const address = '245 Lexington Avenue, Manhattan, New York, NY 10016';
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <section className="bg-white py-16 border-y border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8C6D4F]">
            Visit Our Manhattan Bakery
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810]">
            Experience The Aroma of Fresh Baking
          </h2>
          <p className="text-sm sm:text-base text-[#6E5A4E]">
            Step into our warm boutique bakery on Lexington Avenue for complimentary cake tasting consultations, freshly roasted espresso, and same-day pick-ups.
          </p>
        </div>

        {/* Map & Info Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Interactive Map Iframe */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-[#E8DFC8] shadow-md min-h-[380px] relative bg-[#F4EBE1]">
            <iframe
              title="The Velvet Cake Co. Location Map"
              width="100%"
              height="100%"
              style={{ minHeight: '380px', border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent('245 Lexington Ave, New York, NY 10016')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            />
            
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-[#E8DFC8] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#721C24] animate-pulse"></span>
              <span className="text-xs font-serif font-bold text-[#2C1810]">
                The Velvet Cake Co. • Manhattan Boutique
              </span>
            </div>
          </div>

          {/* Location & Directions Details Card */}
          <div className="bg-[#FAF7F2] rounded-2xl p-6 sm:p-8 border border-[#E8DFC8] shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6D4F]">
                  Flagship Storefront
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#2C1810]">
                  Lexington Avenue
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#4A3B32]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F4EBE1] text-[#721C24] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#2C1810]">Address</p>
                    <p className="text-[#6E5A4E]">
                      245 Lexington Avenue<br />
                      Manhattan, New York, NY 10016
                    </p>
                    <p className="text-[11px] text-[#8C6D4F] mt-0.5 font-medium">
                      (Between 34th & 35th Streets • Murray Hill)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F4EBE1] text-[#721C24] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#2C1810]">Bakery & Cafe Hours</p>
                    <p className="text-[#6E5A4E]">Monday – Sunday: 8:00 AM – 9:00 PM</p>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                      Open 7 Days a Week • Fresh Batches Hourly
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F4EBE1] text-[#721C24] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#2C1810]">Contact Direct</p>
                    <p className="text-[#6E5A4E]">+1 (212) 555-0187</p>
                    <p className="text-[11px] text-[#8C6D4F]">orders@thevelvetcakeco.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-[#E8DFC8]">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#721C24] hover:bg-[#58141B] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Walking / Driving Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <p className="text-[11px] text-center text-[#8C6D4F]">
                Subway: 6 Train at 33rd St (2 blocks away) • B, D, F, M, N, Q, R at Herald Square
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
