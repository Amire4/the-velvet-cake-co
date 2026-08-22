// Smart Multilingual Conversational Engine for The Velvet Cake Co.
// Provides instantaneous, context-rich responses in English, Roman Urdu, Urdu, and Hindi.

export function getSmartBakeryResponse(userInput: string, chatHistory: Array<{ role: 'USER' | 'ASSISTANT'; message: string }> = []): string {
  const q = (userInput || '').toLowerCase().trim();

  // 1. GREETINGS & SALUTATIONS (Roman Urdu / Urdu / Hindi / English)
  if (q.match(/^(salam|salaam|asalam|assalam|aoa|aslaam)/i) || q.includes('kese ho') || q.includes('kaise ho') || q.includes('kya haal') || q.includes('kaisay')) {
    return `Walaikum Assalam! ✨ Main The Velvet Cake Co. ka AI Concierge hoon. 

Hum Manhattan, New York mein luxury customized celebration cakes, wedding centerpieces aur artisanal desserts banate hain. 🎂

Aapko kis celebration ke liye cake chahiye? (Birthday, Wedding, Anniversary, ya Daily treats?)`;
  }

  if (q.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/i)) {
    return `Hello and welcome to The Velvet Cake Co. in Manhattan! ✨ 

I am your AI Concierge. We bake handcrafted luxury celebration cakes, multi-tiered wedding centerpieces, and Parisian macarons daily using pure Madagascar vanilla and European butter. 🍰

How can I assist you with your celebration today?`;
  }

  // 2. PRICING & MENU QUESTIONS (Roman Urdu & English)
  if (q.includes('price') || q.includes('qeemat') || q.includes('kitne ka') || q.includes('kitne ke') || q.includes('cost') || q.includes('rate') || q.includes('charges') || q.includes('menu')) {
    if (q.includes('wedding') || q.includes('shadi') || q.includes('dulha') || q.includes('dulhan')) {
      return `💍 Grand Tiered Wedding Cakes:
• 2-Tier Celebration Cake: $185.00 (Serves 25-30)
• 3-Tier Golden Radiance Centerpiece: $295.00 (Serves 50-65)
• 4-5 Tier Bespoke Grand Centerpiece: $450.00+

✨ Includes champagne reduction sponge, 24k edible gold leaf accents, and fresh organic floral cascade. Custom wedding consultations can be designed directly in our 'Custom Cakes' studio!`;
    }

    if (q.includes('macaron') || q.includes('macarons')) {
      return `🍓 Parisian Macaron Gift Box:
• $48.00 for an authentic 18-piece assortment.
• Includes Raspberry Ganache, Sicilian Pistachio, Salted Caramel, and 70% Dark Chocolate Valrhona ganache. Hand-packaged in our signature luxury gift box!`;
    }

    if (q.includes('cupcake') || q.includes('cupcakes')) {
      return `🧁 Velvet Cupcake Boxes:
• Petite Bouquet (6 pcs): $22.00
• Artisan Grand Box (12 pcs): $36.00
• Includes Grand Red Velvet, Belgian Chocolate Ganache, Madagascar Vanilla, and Salted Caramel.`;
    }

    return `🍰 Signature Cake Menu & Exact Prices:
• The Signature Velvet Noir: $85.00
• Chocoholic Hazelnut Praline: $88.00
• Strawberry Velvet Shortcake: $62.00
• Grand Red Velvet Royale: $78.00
• Classic New York Cheesecake: $58.00
• Matcha Pistachio Opera Cake: $72.00
• Parisian Macaron Gift Box (18 pcs): $48.00
• Velvet Cupcake Box (12 pcs): $36.00

🚚 Manhattan & NYC Delivery: FREE on all orders over $100! In-store pickup is always free at 245 Lexington Ave.`;
  }

  // 3. HOW TO ORDER / ORDERING PROCESS (Roman Urdu & English)
  if ((q.includes('order') || q.includes('buy') || q.includes('kharid')) && (q.includes('kaise') || q.includes('kese') || q.includes('karna') || q.includes('how') || q.includes('kahan') || q.includes('karo'))) {
    return `Order place karna bohat asaan hai! 🎂

1. 🍰 'Cakes' ya 'Menu' tab par click karein aur apna manpasand cake select karein.
2. ✨ 'Order' ya 'Add to Bag' dabayein aur apna custom flavor & size choose karein.
3. ✍️ 'Custom Cake Studio' mein ja kar apni celebration photo ya personalized plaque message bhi likh sakte hain.
4. 💳 Checkout par apna address, delivery date aur payment method (Visa, Mastercard, Apple Pay, Google Pay, ya Pay on Delivery) choose karein.
5. 🧾 Order complete hotay hi aapko foran Official Digital Tax Invoice aur confirmation mil jayegi!`;
  }

  // 4. FLAVORS (32 Artisanal Flavors)
  if (q.includes('flavor') || q.includes('flavour') || q.includes('zaika') || q.includes('taste') || q.includes('types') || q.includes('variety')) {
    return `Hum 32+ Handcrafted Signature Flavors offer karte hain! 🍰

🌟 Bestseller Flavors:
• Grand Red Velvet with Silky Cream Cheese
• Belgian Dark Chocolate Truffle & Valrhona Ganache
• Madagascar Pure Vanilla Bean & White Chocolate
• Lotus Biscoff Dream & Spiced Speculoos Crunch
• Ferrero Rocher Toasted Hazelnut Praline
• Fresh Strawberry Shortcake & Organic Chantilly
• Sicilian Pistachio & Rose Water
• Ceremonial Matcha Green Tea & White Ganache
• Authentic Manhattan Cheesecake Crumb

Aap har cake order karte waqt apna favorite flavor select kar sakte hain!`;
  }

  // 5. VEGAN / EGGLESS / DIETARY REQUIREMENTS
  if (q.includes('eggless') || q.includes('vegan') || q.includes('bina ande') || q.includes('gluten') || q.includes('sugar free') || q.includes('keto') || q.includes('halal') || q.includes('dietary')) {
    return `🌿 Dietary & Special Dietary Options:
• 100% Eggless: Hamare tamam popular sponge cakes eggless recipe mein fresh bake hotay hain.
• Certified Vegan: Dairy-free, plant-based European buttercream aur organic cocoa ke sath.
• Gluten-Free: Almond flour aur gluten-free starches se bana soft, moist crumb.
• Halal-Friendly: 0% alcohol and 100% pure vegetarian-grade extracts used.

Aap checkout ke dauran ya Custom Cake Studio mein apni dietary preference select kar sakte hain!`;
  }

  // 6. CUSTOM CAKES / WEDDING CAKES / BESPOKE DESIGN
  if (q.includes('custom') || q.includes('shadi') || q.includes('wedding') || q.includes('design') || q.includes('tier') || q.includes('banwana') || q.includes('photo') || q.includes('picture')) {
    return `🎨 Bespoke Custom Cake Studio:
• Tiers: 1 Tier (8-10 servings) se le kar 5 Tiers (50+ servings) tak.
• Flavors & Fillings: 32+ custom flavor combinations.
• Custom Decorations: 24k Gold leaf, hand-piped Lambeth vintage borders, edible photo plaques, fresh florals, and chocolate drip.
• Lead Time: Celebration cakes ke liye 24-48 hours; Grand wedding tiers ke liye 1-2 weeks advance notice behtar hai.

Aap upar 'Custom Cakes' page par ja kar live 3D cake builder use kar sakte hain! 🎂`;
  }

  // 7. LOCATION, TIMINGS, CONTACT DETAILS
  if (q.includes('address') || q.includes('location') || q.includes('kahan') || q.includes('store') || q.includes('shop') || q.includes('timing') || q.includes('hours') || q.includes('phone') || q.includes('contact') || q.includes('number') || q.includes('call')) {
    return `📍 The Velvet Cake Co. Flagship Patisserie:
• Address: 245 Lexington Avenue, Manhattan, New York, NY 10016 (Corner of 34th & Lexington)
• Operating Hours: Monday to Sunday, 8:00 AM – 9:00 PM EST
• Phone: +1 (212) 555-0187
• Email: orders@thevelvetcakeco.com
• Pastry Chef & Owner: Rana Amir Shahzad

In-store pickup is always free, with complimentary boutique packaging! 🎁`;
  }

  // 8. DELIVERY & SHIPPING
  if (q.includes('delivery') || q.includes('deliver') || q.includes('shipping') || q.includes('same day') || q.includes('same-day') || q.includes('time') || q.includes('kahan delivery')) {
    return `🚚 Delivery & Dispatch Policies:
• Manhattan Same-Day Delivery: Available for orders placed before 3:00 PM.
• All NYC Boroughs: Next-Day climate-controlled courier delivery across Manhattan, Brooklyn, Queens, Bronx, and Staten Island.
• Free Delivery: On all orders over $100.00!
• Standard Delivery Fee: $10.00 for orders under $100.
• In-Store Pickup: 100% Free at 245 Lexington Ave, Manhattan.`;
  }

  // 9. ORDER TRACKING & INVOICE LOOKUP
  if (q.includes('track') || q.includes('status') || q.includes('receipt') || q.includes('invoice') || q.includes('order number') || q.includes('pata karna')) {
    return `🧾 Order Tracking & Digital Invoice:
Aap hamari website ke 'Order' page par ja kar 'Find & Print Existing Order Invoice' section mein apna Email Address ya Order Number (jaise #VELVET-1234) enter karke live status aur official tax invoice download/print kar sakte hain!`;
  }

  // 10. REVIEWS & RATINGS
  if (q.includes('rating') || q.includes('review') || q.includes('stars') || q.includes('feedback')) {
    return `⭐ Customer Ratings & Reviews:
Hamare tamam cakes par real customer reviews 4.7 se 5.0 stars ke darmiyan verified hain!
Aap kisi bhi cake card par 'Rate' ya 'Review' button click karke apna feedback, star rating aur celebration experience submit kar sakte hain.`;
  }

  // 11. GENERAL HELPFUL CONVERSATIONAL FALLBACK
  return `Thank you for your question! ✨

At The Velvet Cake Co. (245 Lexington Ave, Manhattan), we specialize in:
• 🎂 Signature Artisanal Cakes ($58 – $88) with 32 flavors
• 💍 Bespoke Multi-Tier Wedding Cakes ($185 – $450+)
• 🌿 100% Eggless, Vegan, Gluten-Free & Halal-friendly recipes
• 🚚 Same-Day Manhattan & Next-Day NYC delivery (Free over $100)
• 🧾 Instant digital invoices and order tracking

Aap mujhse cake flavors, prices, custom designs, ya delivery timings ke baray mein kuch bhi pooch sakte hain! 🍰`;
}
