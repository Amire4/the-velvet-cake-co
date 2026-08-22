import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Filter out ugly Markdown raw asterisks like **bold** or *stars* that clutter conversational responses
function cleanChatResponse(text: string): string {
  if (!text) return '';
  // Remove markdown bold/italic asterisks (* and **) so text looks clean and natural
  let cleaned = text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^(\s*)\*\s+/gm, '$1• '); // Convert leading bullet asterisks into clean bullets

  // Clean multiple asterisks
  cleaned = cleaned.replace(/\*{1,}/g, '');
  return cleaned.trim();
}

const BAKERY_SYSTEM_PROMPT = `You are the official, intelligent, highly articulate, polite, and luxury AI Concierge for "The Velvet Cake Co.", a world-class luxury artisanal bakery and custom cake patisserie located at 245 Lexington Avenue, Manhattan, New York.

CRITICAL FORMATTING & CONVERSATIONAL RULES:
1. NEVER use raw asterisks (*) or (**) for bolding or bullet points. Do NOT output markdown stars anywhere in your responses.
2. Use clean unicode bullets (•) or numbers (1., 2.) for lists.
3. You MAY use pleasant, premium emojis (🍰, 🎂, ✨, 🍓, 🍫, 📍, 📞, 🚚, ☕, 🌿) tastefully to make conversations warm, engaging, and lively.
4. Give 100% accurate, definitive, and realistic bakery answers. Never hallucinate fake menu items or false policies.
5. LANGUAGE ADAPTABILITY:
   - Understand and respond fluently in whatever language the customer speaks: English, Urdu, Roman Urdu (e.g. "cake price kya hai", "kese order karun", "flavors bataen", "location kahan hai"), Hindi, Spanish, or French.
   - When the user writes in Roman Urdu or Urdu, reply in polite, warm, conversational Roman Urdu/Urdu with exact prices and bakery details.
   - When the user writes in English, reply in refined, warm, professional luxury English.

ABOUT THE VELVET CAKE CO.:
- Brand Name: The Velvet Cake Co.
- Tagline: Crafted for Every Celebration
- Address: 245 Lexington Avenue, Manhattan, New York, NY 10016 (Corner of 34th & Lexington)
- Phone: +1 (212) 555-0187
- Email: orders@thevelvetcakeco.com
- Working Hours: Monday to Sunday, 8:00 AM to 9:00 PM
- Core Promise: Handcrafted daily with pure Madagascar vanilla beans, French Valrhona cocoa, and European cultured butter.

MENU & SIGNATURE PRODUCTS (EXACT PRICES):
1. The Signature Velvet Noir ($85.00) - 3-tier celebration cake with gold leaf and handcrafted sugar roses.
2. Parisian Macaron Gift Box ($48.00 - 18 pcs) - Crisp almond shells with delicate ganache (Raspberry, Pistachio, Salted Caramel, Dark Chocolate).
3. Strawberry Velvet Shortcake ($62.00) - Light chiffon sponge layered with fresh Chantilly cream and organic strawberries.
4. Golden Tiered Wedding Cake ($295.00) - Sculpted multi-tier wedding centerpiece with champagne reduction and velvet crumb.
5. Celebration Birthday Cake ($68.00) - Joyful confetti vanilla sponge with smooth buttercream and custom celebration plaque.
6. Chocoholic Hazelnut Praline Cake ($88.00) - 70% French Valrhona cocoa with silky bittersweet ganache and roasted hazelnuts.
7. Classic New York Cheesecake ($58.00) - Ultra-creamy graham-crusted authentic Manhattan cheesecake.
8. Velvet Cupcake Box ($36.00 - 12 pcs) - Assorted Red Velvet, Chocolate Truffle, and Salted Caramel cupcakes.
9. Artisanal Coffee & Beverages ($4.50 - $7.00) - Double Origin Espresso, Velvet Madagascar Vanilla Latte, Valrhona Hot Chocolate, Ceremonial Matcha.

OVER 32 ARTISANAL FLAVORS:
- Belgian Chocolate Truffle, Grand Red Velvet, Madagascar Vanilla Bean, Classic NY Cheesecake, Strawberry Shortcake, Oreo Cookies & Cream, Salted Caramel Crunch, Lotus Biscoff Dream, Ferrero Rocher Hazelnut, Lemon Blueberry Bliss, Tiramisu Espresso, Ceremonial Matcha Green Tea, Pistachio Rose Water, Raspberry Dark Chocolate, Mango Passionfruit, Coconut White Chocolate.

CUSTOM CAKE STUDIO:
- 1 to 5 Tiers
- Sizes: 6-inch (8-10 servings), 8-inch (14-18 servings), 10-inch (22-26 servings), 12-inch (30-36 servings), 14-inch (40+ servings).
- Sponge, filling, frosting, colors, theme, personalized plaque messages, and photo prints.
- Lead time: 24 to 48 hours for custom celebration cakes; 1-2 weeks for wedding centerpieces.

DIETARY OPTIONS:
- 100% Eggless available on all popular sponge flavors.
- Certified Vegan cakes (dairy-free, egg-free plant-based buttercreams).
- Gluten-Free and Sugar-Free / Keto options.

DELIVERY & PICKUP:
- Same-Day Delivery across Manhattan.
- Next-Day Delivery across all 5 NYC boroughs (Manhattan, Brooklyn, Queens, Bronx, Staten Island).
- FREE Delivery on all orders over $100.
- FREE In-Store Pickup at 245 Lexington Ave, Manhattan.

ORDER TRACKING & INVOICES:
- Instant digital invoice receipts and email notifications.
- Customers can track live order status anytime on the Order page using their email or order number.`;

export async function generateChatbotResponse(userMessage: string, history: Array<{ role: 'USER' | 'ASSISTANT'; message: string }>): Promise<string> {
  const ai = getGenAI();

  if (ai) {
    const contents: any[] = [];
    const recentHistory = history.slice(-8);
    for (const h of recentHistory) {
      contents.push({
        role: h.role === 'USER' ? 'user' : 'model',
        parts: [{ text: h.message }]
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const modelsToTry = ['gemini-3.7-flash', 'gemini-3.1-flash-lite'];

    for (const modelName of modelsToTry) {
      // Try up to 2 attempts per model with exponential backoff for transient 503/429 spikes
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction: BAKERY_SYSTEM_PROMPT,
              temperature: 0.7,
            }
          });

          const reply = response.text?.trim();
          if (reply) return cleanChatResponse(reply);
        } catch (error: any) {
          const errorMsg = error?.message || error?.toString() || '';
          const is503OrRateLimit = errorMsg.includes('503') || errorMsg.includes('high demand') || errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED');

          if (is503OrRateLimit && attempt === 1) {
            // Short backoff before retry
            await new Promise((resolve) => setTimeout(resolve, 800));
            continue;
          }

          // If not 503 or max attempts for this model reached, try next model or fallback
          break;
        }
      }
    }
  }

  // Comprehensive Contextual NLP Response Engine for multilingual accuracy (English, Roman Urdu, Urdu, Hindi)
  return cleanChatResponse(getIntelligentFallbackResponse(userMessage));
}

function getIntelligentFallbackResponse(input: string): string {
  const q = input.toLowerCase().trim();

  // 1. Roman Urdu / Urdu Greetings & Inquiries
  if (q.includes('salam') || q.includes('salaam') || q.includes('kese ho') || q.includes('kaise ho') || q.includes('kya haal')) {
    return "Walaikum Assalam! ✨ Main The Velvet Cake Co. ka AI Concierge hoon. Hum Manhattan, New York mein luxury customized celebration cakes, wedding cakes aur artisanal desserts banate hain. 🎂 Aapko kis type ka cake ya flavor chahiye?";
  }

  if (q.includes('price') || q.includes('qeemat') || q.includes('kitne ka') || q.includes('kitne ke') || q.includes('cost') || q.includes('rate') || q.includes('charges')) {
    if (q.includes('wedding') || q.includes('shadi')) {
      return "Hamare Grand Tiered Wedding Cakes $295 se start hote hain (custom tiers aur champagne reduction ke sath). 💍 Aap 'Custom Cakes' studio mein ja kar apna custom design bana sakte hain!";
    }
    if (q.includes('macaron')) {
      return "Parisian Macaron Gift Box (18 pieces) ki price $48.00 hai, jismein 4 artisanal flavors shamil hain! 🍓";
    }
    if (q.includes('delivery')) {
      return "New York City delivery $8 se $20 tak hoti hai, lekin $100 se upar ke tamam orders par Delivery bilkul FREE hai! 🚚 245 Lexington Ave se in-store pickup bhi hamesha FREE hai. 📍";
    }
    return "Hamare artisanal cakes ki prices $58 se $88 tak hain:\n• The Signature Velvet Noir: $85\n• Chocoholic Hazelnut Praline: $88\n• Celebration Birthday Cake: $68\n• Strawberry Velvet Shortcake: $62\n• Classic New York Cheesecake: $58\n• 18-pc Parisian Macaron Box: $48\n• 12-pc Velvet Cupcake Box: $36\n🚚 $100 se upar delivery bilkul Free hai!";
  }

  if (q.includes('order') && (q.includes('kaise') || q.includes('kese') || q.includes('karna') || q.includes('how to') || q.includes('kahan se'))) {
    return "Aap hamari website se seedha order place kar sakte hain:\n1. 'Cakes' ya 'Menu' page par ja kar apna pasandeeda cake select karein. 🍰\n2. 'Add to Bag' par click karein aur apna favorite flavor & size choose karein. ✨\n3. Checkout par apna name, address aur payment method (Visa, Apple Pay, Google Pay, COD) choose karke confirm karein. Aapko foran digital invoice & email receipt mil jayegi!";
  }

  if (q.includes('flavor') || q.includes('flavour') || q.includes('zaika') || q.includes('taste')) {
    return "The Velvet Cake Co. mein hum 32+ Signature Flavors offer karte hain! 🍰 Popular flavors yeh hain:\n• Grand Red Velvet with Cream Cheese\n• Belgian Chocolate Truffle & Dark Ganache\n• Madagascar Vanilla Bean\n• Lotus Biscoff Dream & Salted Caramel\n• Ferrero Rocher Hazelnut\n• Fresh Strawberry Shortcake\n• Pistachio Rose Water & Ceremonial Matcha\nAap har cake ke liye apna manpasand flavor select kar sakte hain!";
  }

  if (q.includes('vegan') || q.includes('eggless') || q.includes('bina ande') || q.includes('gluten') || q.includes('dietary')) {
    return "Jee bilkul! 🌿 Hum 100% Eggless, Vegan (dairy-free), Gluten-Free aur Sugar-Free cakes special care ke sath tayar karte hain. Aap checkout ya Custom Cake Studio mein apni dietary preference select kar sakte hain.";
  }

  if (q.includes('custom') || q.includes('shadi') || q.includes('wedding') || q.includes('birthday') || q.includes('design') || q.includes('tier') || q.includes('banwana')) {
    return "Hamara 'Custom Cakes' studio best hai bespoke celebration cakes ke liye! 🎂 Aap 1 se 5 tiers, custom colors, photo plaques, fondant themes aur special flavors customize kar sakte hain. Custom orders ke liye baraye meherbani 24-48 hours pehle order karein.";
  }

  if (q.includes('delivery') || q.includes('deliver') || q.includes('kahan deliver') || q.includes('same day')) {
    return "Hum Manhattan mein Same-Day delivery offer karte hain, aur poore New York City (Brooklyn, Queens, Bronx, Staten Island) mein Next-Day delivery available hai. 🚚 $100 se zyada ke orders par Delivery FREE hai!";
  }

  if (q.includes('address') || q.includes('location') || q.includes('kahan hai') || q.includes('store') || q.includes('shop') || q.includes('timings') || q.includes('hours') || q.includes('phone') || q.includes('contact') || q.includes('number')) {
    return "The Velvet Cake Co. ki bakery Manhattan mein waqia hai:\n📍 Address: 245 Lexington Avenue, Manhattan, New York, NY 10016 (Corner of 34th & Lexington)\n⏰ Timings: Rozana Monday to Sunday, 8:00 AM se 9:00 PM\n📞 Phone: +1 (212) 555-0187\n✉️ Email: orders@thevelvetcakeco.com";
  }

  if (q.includes('track') || q.includes('receipt') || q.includes('email') || q.includes('status') || q.includes('order number')) {
    return "Aap hamare 'Order' page par ja kar 'Order & Email Receipt Tracking' tool mein apna Email Address ya Order Number enter karke kisi bhi waqt apna order status aur digital invoice dekh sakte hain! 🧾";
  }

  // 2. English Inquiries
  if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('good morning') || q.includes('good evening')) {
    return "Hello and welcome to The Velvet Cake Co. in Manhattan! ✨ We craft luxury celebration cakes, tiered wedding centerpieces, and Parisian macarons using pure European butter and Madagascar vanilla. 🍰 How can I assist with your celebration today?";
  }

  if (q.includes('signature') || q.includes('velvet noir') || q.includes('lexington')) {
    return "The Signature Velvet Noir ($85.00) is our signature 3-tier celebration cake! ✨ It features handcrafted 24k gold leaf accents, delicate sugar petals, and your choice of 32 artisanal fillings like Belgian Truffle or Grand Red Velvet. Available for Manhattan delivery or in-store pickup. 🎂";
  }

  if (q.includes('strawberry velvet') || q.includes('strawberry')) {
    return "Our Strawberry Velvet Shortcake ($62.00) is baked with airy sponge chiffon, pure Madagascar Chantilly cream, and organic fresh strawberries. 🍓 It is one of our bestselling signature creations!";
  }

  if (q.includes('macaron')) {
    return "Our Parisian Macaron Gift Box ($48.00) includes 18 handcrafted French macarons with crisp almond shells and silky ganache centers (Raspberry, Dark Chocolate, Pistachio, and Salted Caramel). ✨";
  }

  if (q.includes('cheesecake')) {
    return "Our Classic New York Cheesecake ($58.00) is baked in traditional Manhattan style with rich Philadelphia cream cheese, a hint of Madagascar vanilla, and a buttery golden graham crust. 🍰";
  }

  if (q.includes('cupcake') || q.includes('cupcakes')) {
    return "We offer our Velvet Cupcake Box ($36.00 for a dozen), featuring assorted Red Velvet, Chocolate Ganache, Vanilla Bean, and Salted Caramel cupcakes with delicate piping. 🧁";
  }

  if (q.includes('discount') || q.includes('coupon') || q.includes('promo') || q.includes('offer')) {
    return "We offer Free NYC Delivery on all orders over $100! 🚚 First-time registered customers also receive 10% off at checkout. ✨";
  }

  return `Thank you for reaching out! At The Velvet Cake Co. (245 Lexington Ave, Manhattan), we specialize in handcrafted custom cakes, tiered wedding centerpieces, and daily Parisian treats with 32 signature flavors. 🍰

Here are quick ways I can help you:
• 🎂 Explore Signature Cakes ($58 - $88)
• 🎨 Design a Custom Multi-Tier Cake (24-48h notice)
• 🌿 Inquire about Eggless, Vegan & Gluten-Free options
• 🚚 Same-Day Manhattan & Next-Day NYC Delivery (Free over $100)
• 📍 Visit our bakery at 245 Lexington Ave (Open daily 8 AM - 9 PM)

What would you like to explore? ✨`;
}
