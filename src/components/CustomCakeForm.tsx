import React, { useState } from 'react';
import { Sparkles, Calendar, Heart, ShieldCheck, CheckCircle2, Image as ImageIcon, Send, ArrowRight } from 'lucide-react';
import { createCustomCakeRequestApi } from '../services/customCakeService.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { CakeFlavor, CustomCakeRequest } from '../types.ts';

interface CustomCakeFormProps {
  flavors: CakeFlavor[];
  onNavigate?: (path: string) => void;
}

const CAKE_TYPES = [
  'Wedding Centerpiece',
  'Birthday Celebration',
  'Anniversary & Romance',
  'Baby Shower & Gender Reveal',
  'Corporate & Gala Event',
  'Artisanal Sculpted & Floral',
  'Graduation & Milestone',
];

const SIZES = [
  '6-inch Round (8–10 servings)',
  '8-inch Round (14–18 servings)',
  '10-inch Round (22–28 servings)',
  '2-Tier Petite Grand (35–45 servings)',
  '3-Tier Royal Grand (75–95 servings)',
  '4-Tier Imperial Celebration (120+ servings)',
];

const SHAPES = ['Classic Round', 'Modern Square', 'Romantic Heart', 'Geometric Hexagon', 'Sculpted Custom'];

const FILLINGS = [
  'Madagascar Vanilla Bean Custard',
  'Valrhona Dark Chocolate Silk Ganache',
  'Fresh Raspberry Reduction & Compote',
  'Salted Fleur de Sel Caramel Butter',
  'Passionfruit & Mango Curd',
  'Espresso Mascarpone Cream',
  'Pistachio Praline Mousse',
];

const FROSTINGS = [
  'Silk Swiss Meringue Buttercream',
  'Velvet Cream Cheese Frosting',
  'Whipped Belgian White Chocolate Ganache',
  'Dark Chocolate Mirror Glaze',
  'Artisanal Satin Fondant Overlay',
];

const DIETARY_OPTIONS = [
  'Standard Artisanal',
  'Eggless Recipe',
  'Vegan / Dairy-Free',
  'Gluten-Friendly',
  'Refined Sugar-Free',
];

export default function CustomCakeForm({ flavors, onNavigate }: CustomCakeFormProps) {
  const { user, isAuthenticated } = useAuth();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [cakeType, setCakeType] = useState('Birthday Celebration');
  const [size, setSize] = useState(SIZES[1]);
  const [shape, setShape] = useState(SHAPES[0]);
  const [tiers, setTiers] = useState(1);
  const [flavor, setFlavor] = useState(flavors[0]?.name || 'Classic Red Velvet');
  const [filling, setFilling] = useState(FILLINGS[0]);
  const [frosting, setFrosting] = useState(FROSTINGS[0]);
  const [colors, setColors] = useState('Ivory, Burgundy Velvet & Gold Leaf');
  const [theme, setTheme] = useState('Modern Romantic with edible gold and sugar florals');
  const [message, setMessage] = useState('Happy Celebration!');
  const [dietaryRequirement, setDietaryRequirement] = useState(DIETARY_OPTIONS[0]);
  const [eventDate, setEventDate] = useState(() => {
    const minDate = new Date(Date.now() + 2 * 86400000);
    return minDate.toISOString().split('T')[0];
  });
  const [referenceImageUrl, setReferenceImageUrl] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<CustomCakeRequest | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName || !customerEmail || !customerPhone || !eventDate) {
      setError('Please provide your name, email, phone number, and celebration date.');
      return;
    }

    try {
      setLoading(true);
      const res = await createCustomCakeRequestApi({
        customerName,
        customerEmail,
        customerPhone,
        cakeType,
        size,
        shape,
        tiers,
        flavor,
        filling,
        frosting,
        colors,
        theme,
        message,
        dietaryRequirement,
        eventDate,
        referenceImageUrl: referenceImageUrl || undefined,
        additionalNotes: additionalNotes || undefined
      });

      setSubmittedRequest(res);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit custom cake inquiry.');
    } finally {
      setLoading(false);
    }
  };

  if (submittedRequest) {
    return (
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E8DFC8] shadow-xl text-center space-y-6 max-w-2xl mx-auto">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#8C6D4F]">
            Custom Cake Request Received
          </span>
          <h3 className="font-serif text-3xl font-bold text-[#2C1810]">
            Thank You, {submittedRequest.customerName}!
          </h3>
          <p className="text-sm sm:text-base text-[#6E5A4E] leading-relaxed">
            Our master pastry chef will review your design specifications and event date (<span className="font-semibold text-[#2C1810]">{new Date(submittedRequest.eventDate).toLocaleDateString()}</span>). We will prepare a customized quote and reach out within 24 hours.
          </p>
        </div>

        <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E8DFC8] text-left space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-[#8C6D4F]">Cake Concept:</span>
            <span className="font-semibold text-[#2C1810]">{submittedRequest.cakeType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8C6D4F]">Flavor & Filling:</span>
            <span className="font-semibold text-[#2C1810]">{submittedRequest.flavor} + {submittedRequest.filling}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8C6D4F]">Size & Structure:</span>
            <span className="font-semibold text-[#2C1810]">{submittedRequest.size} ({submittedRequest.tiers} tier{submittedRequest.tiers > 1 ? 's' : ''})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8C6D4F]">Palette:</span>
            <span className="font-semibold text-[#2C1810]">{submittedRequest.colors}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#E8DFC8]">
            <span className="text-[#8C6D4F]">Inquiry Status:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold text-xs">
              {submittedRequest.status}
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setSubmittedRequest(null)}
            className="px-6 py-3 rounded-full border border-[#721C24] text-[#721C24] text-xs font-semibold uppercase tracking-wider hover:bg-[#F4EBE1]"
          >
            Submit Another Design
          </button>
          {onNavigate && (
            <button
              onClick={() => onNavigate(isAuthenticated ? '/dashboard' : '/cakes')}
              className="px-8 py-3 rounded-full bg-[#721C24] hover:bg-[#58141B] text-white text-xs font-semibold uppercase tracking-wider shadow-md"
            >
              {isAuthenticated ? 'View In Dashboard' : 'Explore Ready Cakes'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form
      id="custom-cake-builder-form"
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DFC8] shadow-lg space-y-8"
    >
      {/* Notice Banner */}
      <div className="bg-[#F4EBE1] border border-[#E8DFC8] rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-[#4A3B32]">
        <Calendar className="w-5 h-5 text-[#721C24] shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-[#2C1810]">
            Artisanal Lead Time Notice: 24–48 Hours Minimum
          </p>
          <p className="text-xs text-[#6E5A4E] mt-0.5">
            Every custom creation is hand-baked from scratch and sculpted by our Manhattan pastry team. For multi-tier wedding cakes, we recommend 1–3 weeks advance notice.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-xl">
          {error}
        </div>
      )}

      {/* SECTION 1: Contact Details */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#2C1810] pb-2 border-b border-[#F4EBE1] flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#721C24] text-white text-xs flex items-center justify-center font-sans">
            1
          </span>
          Celebration & Host Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div>
            <label className="block font-medium text-[#4A3B32] mb-1">Your Full Name *</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Victoria Harrison"
              className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
            />
          </div>
          <div>
            <label className="block font-medium text-[#4A3B32] mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="victoria@example.com"
              className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
            />
          </div>
          <div>
            <label className="block font-medium text-[#4A3B32] mb-1">Phone Number *</label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+1 (212) 555-0199"
              className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pt-2">
          <div>
            <label className="block font-medium text-[#4A3B32] mb-1">Celebration Date *</label>
            <input
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
            />
          </div>
          <div>
            <label className="block font-medium text-[#4A3B32] mb-1">Cake Occasion / Type *</label>
            <select
              value={cakeType}
              onChange={(e) => setCakeType(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
            >
              {CAKE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 2: Architecture & Structure */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#2C1810] pb-2 border-b border-[#F4EBE1] flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#721C24] text-white text-xs flex items-center justify-center font-sans">
            2
          </span>
          Structure, Size & Tiers
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div>
            <label className="block font-medium text-[#4A3B32] mb-1">Size & Servings</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
            >
              {SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#4A3B32] mb-1">Shape</label>
            <select
              value={shape}
              onChange={(e) => setShape(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
            >
              {SHAPES.map((sh) => (
                <option key={sh} value={sh}>{sh}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#4A3B32] mb-1">Number of Tiers</label>
            <select
              value={tiers}
              onChange={(e) => setTiers(parseInt(e.target.value, 10))}
              className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
            >
              <option value={1}>1 Tier (Single tier centerpiece)</option>
              <option value={2}>2 Tiers (Grand celebration)</option>
              <option value={3}>3 Tiers (Luxury wedding scale)</option>
              <option value={4}>4 Tiers (Imperial gala scale)</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 3: Flavor & Ingredients */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#2C1810] pb-2 border-b border-[#F4EBE1] flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#721C24] text-white text-xs flex items-center justify-center font-sans">
            3
          </span>
          Flavor, Filling & Dietary Choice
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <label className="block font-medium text-[#4A3B32] mb-1">
              Sponge Cake Flavor (Select from 30+ Recipes) *
            </label>
            <select
              value={flavor}
              onChange={(e) => setFlavor(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
            >
              {flavors.map((f) => (
                <option key={f.id || f.name} value={f.name}>{f.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#4A3B32] mb-1">Inner Filling *</label>
            <select
              value={filling}
              onChange={(e) => setFilling(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
            >
              {FILLINGS.map((fill) => (
                <option key={fill} value={fill}>{fill}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <label className="block font-medium text-[#4A3B32] mb-1">Exterior Frosting Finish *</label>
            <select
              value={frosting}
              onChange={(e) => setFrosting(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
            >
              {FROSTINGS.map((fr) => (
                <option key={fr} value={fr}>{fr}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#4A3B32] mb-1">Dietary Requirement</label>
            <select
              value={dietaryRequirement}
              onChange={(e) => setDietaryRequirement(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
            >
              {DIETARY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 4: Styling & Custom Inscriptions */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#2C1810] pb-2 border-b border-[#F4EBE1] flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#721C24] text-white text-xs flex items-center justify-center font-sans">
            4
          </span>
          Artisanal Aesthetics & Plaque Inscription
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <label className="block font-medium text-[#4A3B32] mb-1">Color Palette</label>
            <input
              type="text"
              value={colors}
              onChange={(e) => setColors(e.target.value)}
              placeholder="e.g. Soft Blush, Cream, Burgundy accents, 24k Gold leaf"
              className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#4A3B32] mb-1">Theme / Styling Concept</label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g. Vintage Victorian Lambeth piping with fresh roses"
              className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <label className="block font-medium text-[#4A3B32] mb-1">Custom Piped Message / Plaque</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Happy 30th Birthday Alexandra!"
              className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#4A3B32] mb-1">Inspiration Reference Image URL (Optional)</label>
            <input
              type="url"
              value={referenceImageUrl}
              onChange={(e) => setReferenceImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... or Pinterest link"
              className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
            />
          </div>
        </div>

        <div className="text-xs sm:text-sm">
          <label className="block font-medium text-[#4A3B32] mb-1">
            Additional Notes, Special Requests or Delivery Instructions
          </label>
          <textarea
            rows={3}
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Tell us about flower preferences, cake stand rentals, delivery times, or any subtle design nuances..."
            className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-[#E8DFC8] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-[#8C6D4F]">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Complimentary quote & pastry consultation within 24 hours.</span>
        </div>

        <button
          type="submit"
          id="custom-cake-submit-btn"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#721C24] hover:bg-[#58141B] text-white text-xs uppercase tracking-widest font-semibold shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Submitting Design Inquiry...' : 'Submit Custom Cake Inquiry'}
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
