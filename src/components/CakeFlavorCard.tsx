import React from 'react';
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
    <div
      id={`flavor-card-${flavor.id || index}`}
      onClick={() => onSelect && onSelect(flavor)}
      className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
        isSelected
          ? 'bg-[#F4EBE1] border-[#721C24] shadow-md ring-2 ring-[#721C24]/20'
          : 'bg-white border-[#E8DFC8] hover:border-[#721C24]/40 hover:shadow-md'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-mono text-[#8C6D4F] font-bold">
            #{String(index + 1).padStart(2, '0')}
          </span>
          {flavor.available ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Available
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 text-[10px] font-semibold">
              Seasonal
            </span>
          )}
        </div>

        <h4 className="font-serif text-base sm:text-lg font-bold text-[#2C1810] tracking-tight mb-1.5">
          {flavor.name}
        </h4>
        <p className="text-xs sm:text-sm text-[#6E5A4E] leading-relaxed">
          {flavor.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#F4EBE1] flex items-center justify-between text-xs">
        <span className="text-[11px] uppercase tracking-wider text-[#8C6D4F] font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Artisanal Recipe
        </span>
        {isSelected && (
          <span className="text-xs font-semibold text-[#721C24] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Selected
          </span>
        )}
      </div>
    </div>
  );
}
