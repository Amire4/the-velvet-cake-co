import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Heart, ShieldCheck, Clock, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import CustomCakeForm from '../components/CustomCakeForm.tsx';
import { CakeFlavor } from '../types.ts';

interface CustomCakesProps {
  flavors: CakeFlavor[];
  onNavigate: (path: string) => void;
}

export default function CustomCakes({ flavors, onNavigate }: CustomCakesProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16"
    >
      {/* Studio Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto space-y-3"
      >
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8C6D4F]">
          The Velvet Atelier
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C1810]">
          Bespoke Custom Cake Studio
        </h1>
        <p className="text-sm sm:text-base text-[#6E5A4E] font-light">
          Sculpted for weddings, milestone birthdays, corporate galas, and intimate celebrations. Our master bakers handcraft every tier from scratch at 245 Lexington Ave.
        </p>
      </motion.div>

      {/* 4-Step Process Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            step: '01',
            title: 'Design Submission',
            desc: 'Select your preferred sponge flavors, fillings, tier architecture, color palette, and event date.',
          },
          {
            step: '02',
            title: 'Chef Consultation & Quote',
            desc: 'Our pastry team reviews structural requirements, confirms pricing, and provides design sketches within 24 hours.',
          },
          {
            step: '03',
            title: 'Scratch Baking & Sculpting',
            desc: 'We bake your cake fresh using French Valrhona cocoa, European butter, and handcrafted sugar flora.',
          },
          {
            step: '04',
            title: 'Chilled White-Glove Delivery',
            desc: 'Temperature-controlled courier delivery across Manhattan and NYC with on-site setup assistance if required.',
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white p-6 rounded-2xl border border-[#E8DFC8] space-y-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <span className="font-serif text-3xl font-bold text-[#D4AF37]/50 block">
              {item.step}
            </span>
            <h3 className="font-serif text-lg font-bold text-[#2C1810]">{item.title}</h3>
            <p className="text-xs sm:text-sm text-[#6E5A4E] leading-relaxed font-light">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Interactive Form */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-wider text-[#721C24]">
            Start Your Commission
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
            Custom Cake Request & Tasting Form
          </h2>
        </div>

        <CustomCakeForm flavors={flavors} onNavigate={onNavigate} />
      </motion.div>

      {/* Custom Cake FAQs */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-[#FAF7F2] p-8 sm:p-12 rounded-3xl border border-[#E8DFC8] space-y-8"
      >
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
            Custom Cake Inquiries & FAQ
          </h3>
          <p className="text-xs sm:text-sm text-[#6E5A4E] font-light">
            Common questions regarding cake lead times, tastings, and delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <motion.div whileHover={{ y: -2 }} className="bg-white p-5 rounded-xl border border-[#E8DFC8] space-y-2 shadow-xs">
            <h4 className="font-serif font-bold text-base text-[#2C1810]">
              How much advance notice is required?
            </h4>
            <p className="text-[#6E5A4E] leading-relaxed font-light">
              We request a minimum of 24–48 hours for standard single-tier custom cakes. For multi-tier wedding cakes and sculpted artistic commissions, we recommend booking 1–3 weeks in advance.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="bg-white p-5 rounded-xl border border-[#E8DFC8] space-y-2 shadow-xs">
            <h4 className="font-serif font-bold text-base text-[#2C1810]">
              Do you offer in-person cake tasting consultations?
            </h4>
            <p className="text-[#6E5A4E] leading-relaxed font-light">
              Yes! We offer wedding tasting boxes and private 30-minute tasting sessions at our Lexington Avenue patisserie for parties planning multi-tier celebration cakes.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="bg-white p-5 rounded-xl border border-[#E8DFC8] space-y-2 shadow-xs">
            <h4 className="font-serif font-bold text-base text-[#2C1810]">
              Can you accommodate vegan and gluten-friendly diets?
            </h4>
            <p className="text-[#6E5A4E] leading-relaxed font-light">
              Absolutely. We have dedicated scratch recipes for Vegan Dark Chocolate Ganache, Eggless Madagascar Vanilla, and Gluten-Friendly Almond Raspberry sponges.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="bg-white p-5 rounded-xl border border-[#E8DFC8] space-y-2 shadow-xs">
            <h4 className="font-serif font-bold text-base text-[#2C1810]">
              How does delivery and venue setup work?
            </h4>
            <p className="text-[#6E5A4E] leading-relaxed font-light">
              All multi-tier cakes are transported in our custom refrigerated delivery vans. Our courier team coordinates directly with your Manhattan venue captain or catering director.
            </p>
          </motion.div>
        </div>
      </motion.div>

    </motion.div>
  );
}
