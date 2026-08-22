// Intelligent Conversational AI Concierge Engine for The Velvet Cake Co.
// Provides natural, context-rich, helpful English responses tailored to luxury patisserie inquiries.

export function getSmartBakeryResponse(userInput: string, chatHistory: Array<{ role: 'USER' | 'ASSISTANT'; message: string }> = []): string {
  const q = (userInput || '').toLowerCase().trim();

  // 1. GREETINGS & CASUAL HELLOS
  if (q.match(/^(hi|hello|hey|good morning|good afternoon|good evening|greetings|howdy|whats up|sup)\b/i) || q === 'hi' || q === 'hello') {
    const greetings = [
      `Hello and welcome to The Velvet Cake Co.! ✨ I am your personal Patisserie Concierge. How may I assist you with your celebration or custom cake order today?`,
      `Warm greetings from our Manhattan bakery! 🍰 Whether you are looking for our signature celebration cakes, tiered wedding centerpieces, or artisanal macarons, I am here to help. What can I help you find?`,
      `Hi there! 🎂 Welcome to The Velvet Cake Co. at 245 Lexington Ave. How can I delight your sweet cravings or help plan your special event today?`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // 2. BESTSELLERS & POPULAR RECOMMENDATIONS
  if (q.includes('bestseller') || q.includes('popular') || q.includes('recommend') || q.includes('favorite') || q.includes('top cake') || q.includes('best cake')) {
    return `🌟 Our Most Celebrated Bestsellers:

1. **The Signature Velvet Noir ($85.00)**: Rich Belgian dark chocolate truffle layers with velvety chocolate ganache, 24k gold leaf accents, and chocolate blossom crowns.
2. **Grand Red Velvet Royale ($78.00)**: Crimson cocoa velvet sponge paired with Madagascar vanilla cream cheese frosting and French macaron garnish.
3. **Lotus Biscoff Dream Cake ($82.00)**: Spiced Belgian cookie butter sponge layered with speculoos crunch and caramel drip.
4. **Strawberry Velvet Shortcake ($76.00)**: Fluffy sponge layered with fresh Hudson Valley strawberries and Chantilly cream.
5. **New York Basque Burnt Cheesecake ($68.00)**: Caramelized exterior with an ultra-creamy vanilla bean molten custard center.

Would you like me to guide you on how to add any of these to your bag or customize them?`;
  }

  // 3. FLAVORS & ARTISANAL OPTIONS
  if (q.includes('flavor') || q.includes('flavour') || q.includes('taste') || q.includes('variet') || q.includes('fillings') || q.includes('sponge')) {
    return `🍰 We offer 16+ Signature Handcrafted Cake Flavors:

• **Decadent Chocolates**: Belgian Dark Chocolate Truffle, Chocoholic Hazelnut Praline (Ferrero Rocher), Black Forest Cherry Kirsch.
• **Velvet & Creams**: Grand Red Velvet Royale, Pure Tahitian Vanilla Bean, Oreo Cookies & Cream.
• **Gourmet & Spiced**: Lotus Biscoff Speculoos, Salted Caramel Butterscotch, Autumn Spiced Pecan Carrot.
• **Fruit & Botanical**: Fresh Strawberry Shortcake, Zesty Lemon Blueberry, Mango Passion Fruit, Sicilian Pistachio & Rosewater.
• **Tea & Espresso**: Uji Ceremonial Matcha Opera, Italian Tiramisu Mascarpone.
• **Cheesecakes**: Authentic New York Baked Cheesecake, Basque Burnt Vanilla.

Every flavor can be customized with your choice of size, dietary preferences, and plaque inscription!`;
  }

  // 4. PRICING & COST QUESTIONS
  if (q.includes('price') || q.includes('cost') || q.includes('how much') || q.includes('rate') || q.includes('fee') || q.includes('charges') || q.includes('menu')) {
    if (q.includes('wedding') || q.includes('tier') || q.includes('bridal')) {
      return `💍 Bespoke Multi-Tier Wedding Cake Pricing:
• **2-Tier Celebration Cake (Serves 25–30)**: Starting at $210.00
• **3-Tier Grand Botanical Centerpiece (Serves 50–65)**: Starting at $295.00 – $385.00
• **4–5 Tier Bespoke Architectural Masterpiece (Serves 80+)**: $450.00+

*All tiered wedding cakes include edible 24k gold leaf detailing, sugar florals, structural doweling, and dedicated cold-courier delivery.*`;
    }

    if (q.includes('cupcake') || q.includes('macaron') || q.includes('mini') || q.includes('treat')) {
      return `🧁 Mini Treats & Pastry Gift Boxes:
• **Petite Velvet Cupcake Bouquet (6 pcs)**: $28.00
• **Artisan Cupcake Collection (12 pcs)**: $48.00
• **Parisian Macaron Luxury Gift Box (18 pcs)**: $52.00
• **Gourmet Brownie & Blondie Ensemble**: $36.00`;
    }

    return `🎂 Signature Cakes & Menu Pricing Overview:
• **Signature 8" & 10" Cakes**: $68.00 – $88.00
• **Artisan Cupcakes & Macarons**: $28.00 – $52.00
• **Seasonal Specials & Tarts**: $45.00 – $74.00
• **Multi-Tier Wedding Cakes**: $210.00 – $385.00+

🚚 **Delivery**: 100% FREE for all orders over $100.00! In-store pickup at 245 Lexington Ave is always complimentary.`;
  }

  // 5. CUSTOM CAKE DESIGN & BESPOKE ORDERS
  if (q.includes('custom') || q.includes('design') || q.includes('photo') || q.includes('picture') || q.includes('wedding') || q.includes('tier') || q.includes('personalized') || q.includes('customise') || q.includes('customize')) {
    return `🎨 How to Create a Custom Bespoke Cake:

1. **Visit our 'Custom Cakes' Page**: Use our interactive online Cake Studio.
2. **Choose Your Cake Structure**: Select from 1 to 5 tiers, round or square shapes, and serving sizes from 8 to 100+ guests.
3. **Select Flavor & Frosting**: Pair your preferred sponge (e.g. Red Velvet, Pistachio, Belgian Chocolate) with Swiss meringue buttercream, ganache, or cream cheese.
4. **Upload Inspiration**: You can upload reference images, choose custom color palettes, and write personalized gold inscription plaques.
5. **Receive Instant Quotation**: Review the live design estimate and submit your request for confirmation!`;
  }

  // 6. HOW TO PLACE AN ORDER
  if (q.includes('how to order') || q.includes('place order') || q.includes('checkout') || q.includes('buy') || q.includes('purchas') || q.includes('ordering')) {
    return `🛒 Placing an Order is Fast and Seamless:

1. Browse our **Cakes** or **Menu** collections and select your favorite creation.
2. Click **'Order'** or **'Customize Size & Inscription'** to select quantity and optional special instructions.
3. Open your shopping bag by clicking **'View Bag & Checkout'**.
4. Enter your delivery address or select complimentary **In-Store Pickup (245 Lexington Ave)**.
5. Select your preferred delivery date and payment method (Visa, Mastercard, Apple Pay, Google Pay, or Cash on Delivery).
6. Click **'Place Order'** to instantly receive your official Order Confirmation & Printable Tax Invoice!`;
  }

  // 7. DIETARY / EGGLESS / VEGAN / GLUTEN-FREE / HALAL
  if (q.includes('eggless') || q.includes('vegan') || q.includes('gluten') || q.includes('dairy') || q.includes('nut') || q.includes('allergy') || q.includes('allergies') || q.includes('halal') || q.includes('dietary')) {
    return `🌿 Dietary Accommodations & Allergy Safety:

• **100% Eggless Option**: Available across all our signature sponge cakes upon request at no extra charge.
• **Plant-Based Vegan**: Crafted with organic coconut creams, almond milks, and dairy-free European cocoa ganache.
• **Gluten-Friendly**: Made with premium blanched almond flour and gluten-free starches.
• **Halal-Certified**: 100% alcohol-free vanilla and natural fruit purées; zero animal gelatins.
• **Nut-Free Facility Options**: We take cross-contamination very seriously. Please specify any nut or dairy allergies in the order notes during checkout!`;
  }

  // 8. DELIVERY, TIME SLOTS, BOROUGHS
  if (q.includes('delivery') || q.includes('ship') || q.includes('same day') || q.includes('same-day') || q.includes('area') || q.includes('borough') || q.includes('time') || q.includes('when')) {
    return `🚚 NYC Delivery & Logistics Policies:

• **Same-Day Manhattan Delivery**: Available for orders placed before 3:00 PM EST.
• **Coverage**: Manhattan, Brooklyn, Queens, Bronx, and Staten Island via temperature-controlled courier vans.
• **Free Delivery**: On all orders of $100.00 or more! ($10–$15 flat rate for orders under $100).
• **Store Pickup**: 100% Complimentary at our flagship patisserie (245 Lexington Ave, Manhattan).
• **Delivery Windows**: Morning (9:00 AM – 1:00 PM) and Afternoon (2:00 PM – 7:00 PM).`;
  }

  // 9. LOCATION, TIMINGS, CONTACT
  if (q.includes('location') || q.includes('where') || q.includes('address') || q.includes('hours') || q.includes('timing') || q.includes('open') || q.includes('contact') || q.includes('phone') || q.includes('call') || q.includes('email')) {
    return `📍 Flagship Bakery Location & Hours:

• **Address**: 245 Lexington Avenue, Manhattan, New York, NY 10016 (Corner of 34th & Lexington)
• **Operating Hours**: Monday – Sunday, 8:00 AM to 9:00 PM EST
• **Direct Telephone**: +1 (212) 555-0187
• **Customer Inquiries**: orders@thevelvetcakeco.com
• **Master Patissier**: Chef Rana Amir Shahzad

You are always welcome to stop by our boutique showroom to view our daily display tiers and enjoy freshly brewed espresso!`;
  }

  // 10. ORDER TRACKING & DIGITAL INVOICES
  if (q.includes('track') || q.includes('status') || q.includes('invoice') || q.includes('receipt') || q.includes('order number') || q.includes('find order')) {
    return `🧾 Order Tracking & Invoice Lookup:

You can view, download, and print your official bakery receipt anytime:
1. Navigate to the **'Order'** tab on our navigation bar.
2. Scroll to the **'Find & Print Existing Order Invoice'** section.
3. Enter your **Order Number** (e.g. *#VELVET-849201*) or your **Email Address**.
4. View real-time preparation status (Pending, Preparing, Out for Delivery, Completed) and print your official Tax Receipt!`;
  }

  // 11. RATINGS, REVIEWS & FEEDBACK
  if (q.includes('rating') || q.includes('review') || q.includes('feedback') || q.includes('stars') || q.includes('testimonial')) {
    return `⭐ Customer Ratings & Testimonials:

All our signature creations feature verified 5-star and 4.9-star ratings from hundreds of satisfied celebration hosts across New York City!

To leave a rating or read detailed reviews:
• Click on the **'Rate'** or **'Review'** badge on any cake card.
• Submit your star rating, celebration photos, and comments directly. Your review will be saved and visible to our patisserie community!`;
  }

  // 12. GENERAL ELEGANT CONVERSATIONAL FALLBACK
  return `Thank you for reaching out to The Velvet Cake Co.! ✨

Here is how I can assist you:
• 🎂 **Signature Cakes ($68–$88)** with 16+ artisan flavors
• 💍 **Bespoke Tiered Wedding Centerpieces**
• 🌿 **Eggless, Vegan, Gluten-Free & Halal Options**
• 🚚 **Same-Day Manhattan & Next-Day NYC Delivery (Free over $100)**
• 🧾 **Instant Order Confirmation & Printable Tax Invoices**

Please let me know if you would like recommendations for a birthday, anniversary, wedding, or corporate event!`;
}
