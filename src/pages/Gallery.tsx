import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';

interface GalleryProps {
  onNavigate: (path: string) => void;
}

const GALLERY_ITEMS = [
  {
    title: 'The Royal Ivory & 24K Gold Wedding Tier',
    category: 'Wedding Masterpieces',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1000&q=80',
    desc: '3-tier Madagascar vanilla sponge with passionfruit curd and handcrafted sugar florals.',
  },
  {
    title: 'Classic Red Velvet Imperial Tier',
    category: 'Birthday Celebrations',
    image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=1000&q=80',
    desc: 'Signature cocoa sponge with whipped silk cream cheese and red velvet crumb crown.',
  },
  {
    title: 'French Macaron Rainbow Tower',
    category: 'Macarons & Desserts',
    image: 'https://images.unsplash.com/photo-1570476922354-81227cdbb76c?auto=format&fit=crop&w=1000&q=80',
    desc: 'Assorted pistachio, raspberry rose, salted caramel, and lavender macarons.',
  },
  {
    title: 'Modern Victorian Lambeth Cake',
    category: 'Birthday Celebrations',
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=1000&q=80',
    desc: 'Intricate vintage shell borders and edible cherry fondant accents.',
  },
  {
    title: 'Valrhona Truffle Drip Cake',
    category: 'Birthday Celebrations',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80',
    desc: '70% dark chocolate mousse layers, chocolate pearls, and glossy mirror drip.',
  },
  {
    title: 'Botanical Garden Wedding Centerpiece',
    category: 'Wedding Masterpieces',
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1000&q=80',
    desc: 'Semi-naked champagne sponge with fresh organic figs, blackberries, and gold leaf.',
  },
  {
    title: 'Artisan Scratch Whisking & Tempering',
    category: 'Kitchen Craft',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80',
    desc: 'Our pastry chefs hand-whisking fresh Swiss meringue buttercream daily in Manhattan.',
  },
  {
    title: 'Miniature Velvet Cupcake Assortment',
    category: 'Macarons & Desserts',
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=1000&q=80',
    desc: 'Box of 12 artisan cupcakes with edible gold flakes and spun sugar toppers.',
  },
];

const CATEGORIES = ['All', 'Wedding Masterpieces', 'Birthday Celebrations', 'Macarons & Desserts', 'Kitchen Craft'];

export default function Gallery({ onNavigate }: GalleryProps) {
  const [selectedCat, setSelectedCat] = useState('All');

  const filteredItems = selectedCat === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === selectedCat);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12"
    >
      {/* Gallery Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto space-y-3"
      >
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8C6D4F]">
          Visual Portfolio
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C1810]">
          Celebration Gallery
        </h1>
        <p className="text-sm sm:text-base text-[#6E5A4E] font-light">
          Explore custom wedding centerpieces, bespoke anniversary designs, and daily creations crafted inside our Manhattan patisserie.
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map(cat => (
          <motion.button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedCat === cat
                ? 'bg-[#721C24] text-white shadow-md'
                : 'bg-white border border-[#E8DFC8] text-[#4A3B32] hover:bg-[#F4EBE1]'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Gallery Grid */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedCat}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group bg-white rounded-2xl overflow-hidden border border-[#E8DFC8] shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#F4EBE1]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80';
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-[#21110C]/80 backdrop-blur-md text-[#FDFBF7] text-[10px] font-semibold uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2C1810] group-hover:text-[#721C24] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6E5A4E] leading-relaxed mt-1 font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* CTA Box */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-[#21110C] rounded-3xl p-8 sm:p-12 text-center text-[#FDFBF7] space-y-4 border border-[#3D251D]"
      >
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          Inspired by a design you see here?
        </h3>
        <p className="text-xs sm:text-sm text-[#C9BAAF] max-w-lg mx-auto font-light">
          Send us your favorite reference photos or event color palette. We will sculpt a unique customized version for your special day.
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate('/custom-cakes')}
          className="px-8 py-3.5 rounded-full bg-[#721C24] hover:bg-[#8B232D] text-white text-xs font-semibold uppercase tracking-widest shadow-lg transition-all inline-flex items-center gap-2"
        >
          <span>Order Bespoke Custom Cake</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>

    </motion.div>
  );
}
