import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Award, Heart, ShieldCheck, MapPin, Clock, ArrowRight } from 'lucide-react';
import GoogleMapSection from '../components/GoogleMapSection.tsx';

interface AboutProps {
  onNavigate: (path: string) => void;
}

export default function About({ onNavigate }: AboutProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-16 py-12"
    >
      {/* 1. Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8C6D4F]">
            Our Baking Heritage
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2C1810]">
            The Art of the Extraordinary
          </h1>
          <p className="text-base sm:text-lg text-[#6E5A4E] font-light leading-relaxed">
            "Every celebration deserves something extraordinary." Founded in Manhattan, The Velvet Cake Co. was created to elevate traditional bakery craftsmanship into timeless culinary art.
          </p>
        </motion.div>
      </section>

      {/* 2. Story Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-[#4A3B32] text-sm sm:text-base leading-relaxed"
          >
            <h2 className="font-serif text-3xl font-bold text-[#2C1810]">
              Born in Manhattan, Inspired by Classic European Patisseries
            </h2>
            <p className="font-light">
              Located in the historic Murray Hill neighborhood of Manhattan at <strong className="text-[#2C1810] font-semibold">245 Lexington Avenue</strong>, The Velvet Cake Co. is home to a passionate team of classically trained pastry chefs and confection sculptors.
            </p>
            <p className="font-light">
              We believe that cake is never just dessert—it is the ceremonial centerpiece of life’s most meaningful moments: weddings, milestone birthdays, anniversaries, and triumphant achievements.
            </p>
            <p className="font-light">
              That is why we refuse to take shortcuts. We bake every sponge fresh from scratch each morning, whisk our Swiss meringue buttercreams in copper bowls, and hand-temper rich single-origin Valrhona chocolate.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('/cakes')}
                className="px-6 py-3 rounded-full bg-[#721C24] hover:bg-[#58141B] text-white text-xs font-semibold uppercase tracking-wider transition-all"
              >
                Browse Our Cakes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('/custom-cakes')}
                className="px-6 py-3 rounded-full border border-[#721C24] text-[#721C24] hover:bg-[#F4EBE1] text-xs font-semibold uppercase tracking-wider transition-all"
              >
                Custom Design Atelier
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80"
                alt="Master Pastry Chef Decorating Layer Cake"
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80';
                }}
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. Ingredient Integrity Spotlight */}
      <section className="bg-[#FAF7F2] py-16 border-y border-[#E8DFC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto space-y-2"
          >
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8C6D4F]">
              Uncompromising Standards
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#2C1810]">
              The Finest Ingredients on Earth
            </h2>
            <p className="text-sm text-[#6E5A4E] font-light">
              We source strictly from sustainable purveyors who share our obsession with purity and flavor.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'French Valrhona Chocolate',
                desc: 'Single-origin Guanaja 70% dark cocoa and Ivoire white chocolate for unmatched silkiness and complex chocolate notes.',
              },
              {
                num: '02',
                title: 'Pure Madagascar Bourbon Vanilla',
                desc: 'Whole Nielsen-Massey vanilla beans scraped by hand for authentic floral fragrance and deep aromatic warmth.',
              },
              {
                num: '03',
                title: 'Cultured European Butter',
                desc: '83% high-butterfat sweet cream butter for tender crumb structure and decadent, melt-in-your-mouth textures.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white p-6 rounded-2xl border border-[#E8DFC8] space-y-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F4EBE1] text-[#721C24] flex items-center justify-center font-serif font-bold">
                  {item.num}
                </div>
                <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6E5A4E] leading-relaxed font-light">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Google Maps Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <GoogleMapSection />
      </motion.div>

    </motion.div>
  );
}
