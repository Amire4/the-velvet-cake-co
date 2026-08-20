import React from 'react';
import { motion } from 'motion/react';
import { CakeFlavor } from '../types.ts';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface CakeFlavorCardProps {
  key?: React.Key;
  flavor: CakeFlavor;
  index: number;
  onSelect?: (flavor: CakeFlavor) => void;
  isSelected?: boolean;
}

export default function CakeFlavorCard({ flavor, index, onSelect, isSelected }: CakeFlavorCardProps) {
  return (
    <motion.div
      id={`flavor-card-${flavor.id || index}`}
      initial={{ opacity: 0, y: 25, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{
        duration: 0.45,
        delay: Math.min((index % 4) * 0.07, 0.25),
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect && onSelect(flavor)}
      className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer luxury-card-glow ${
        isSelected
          ? 'bg-[#FAF7F2] border-[#7D0A0A] shadow-lg ring-2 ring-[#7D0A0A]/20'
          : 'bg-white border-[#E8DFC8] hover:border-[#7D0A0A]/40 shadow-xs hover:shadow-xl'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] font-mono text-[#8C6D4F] font-bold px-2 py-0.5 bg-[#FAF7F2] rounded-md border border-[#E8DFC8]/60">
            Flavor #{String(index + 1).padStart(2, '0')}
          </span>
          {flavor.available ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Available Fresh
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-500 text-[10px] font-semibold">
              Seasonal Recipe
            </span>
          )}
        </div>

        <h4 className="font-serif text-base sm:text-lg font-bold text-[#2D2926] tracking-tight mb-1.5 group-hover:text-[#7D0A0A] transition-colors">
          {flavor.name}
        </h4>
        <p className="text-xs sm:text-sm text-[#5C554E] leading-relaxed font-light">
          {flavor.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#F4EBE1] flex items-center justify-between text-xs">
        <span className="text-[11px] uppercase tracking-wider text-[#8C6D4F] font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" /> Master Recipe
        </span>
        {isSelected && (
          <motion.span 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-xs font-semibold text-[#7D0A0A] flex items-center gap-1"
          >
            <CheckCircle2 className="w-4 h-4" /> Selected
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
