import { GoogleGenAI } from '@google/genai';
import { db } from '../config/db.ts';

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

const BAKERY_SYSTEM_PROMPT = `You are the official, friendly, and refined AI Concierge for "The Velvet Cake Co.", a premier luxury custom cake and dessert bakery located in Manhattan, New York.

BUSINESS FACTS & GUIDELINES:
- Brand Name: The Velvet Cake Co.
- Tagline: Crafted for Every Celebration
- Address: 245 Lexington Avenue, Manhattan, New York, NY 10016
- Phone: +1 (212) 555-0187
- Email: orders@thevelvetcakeco.com
- Hours: Monday to Sunday, 8:00 AM to 9:00 PM
- Core Message: "Every celebration deserves something extraordinary."

PRODUCTS & OFFERINGS:
- Custom Birthday Cakes, Wedding Cakes, Baby Shower Cakes, Anniversary Cakes, Graduation Cakes, Engagement Cakes, Corporate Cakes
- Artisan Cupcakes, Classic New York Cheesecakes, Parisian Macarons, Cookies, Brownies, Dessert Boxes, Seasonal Desserts
- Over 32 Signature Flavors including Chocolate Truffle, Red Velvet, Vanilla Bean, NY Cheesecake, Strawberry Shortcake, Oreo Cookies & Cream, Salted Caramel, Lotus Biscoff, Ferrero Rocher, Lemon Blueberry, Tiramisu, Matcha Green Tea, Pistachio Rose, and more.

CUSTOMIZATION & DIETARY:
- Customization options: Cake size, shape, number of tiers (1 to 5), flavor combinations, filling, frosting, colors, theme, personalized plaque messages, edible photos, cake toppers.
- Dietary Requirements: Eggless, Vegan, Gluten-Free, Sugar-Free (all treated as special requests with high care).
- Advance Notice: Custom cakes require at least 24 to 48 hours notice. Large wedding, corporate, or elaborate tiered designs require additional advance consultation.

DELIVERY & PICKUP:
- Same-Day Delivery: Available across Manhattan for selected ready cakes and desserts, subject to daily bakery availability.
- Next-Day Delivery: Available throughout all 5 boroughs of New York City.
- Delivery Pricing: Free delivery on all orders over $100! Otherwise, standard delivery ranges from $8 to $20 depending on exact NYC location.
- In-store pickup is always free at 245 Lexington Avenue, Manhattan.

RULES & TONE:
- Professional, warm, refined, concise, and helpful.
- Never invent prices, promotions, fake awards, or delivery guarantees.
- Never promise same-day delivery for bespoke multi-tier custom cakes.
- Keep responses clean and well-structured using short paragraphs or bullet points where helpful.`;

export async function generateChatbotResponse(userMessage: string, history: Array<{ role: 'USER' | 'ASSISTANT'; message: string }>): Promise<string> {
  const ai = getGenAI();

  if (!ai) {
    // Intelligent contextual fallback when API key is not yet set in environment
    const lower = userMessage.toLowerCase();
    if (lower.includes('flavor') || lower.includes('flavour')) {
      return "At The Velvet Cake Co., we offer over 32 signature artisanal flavors including Chocolate Truffle, Grand Red Velvet, Vanilla Bean, NY Cheesecake, Strawberry Shortcake, Lotus Biscoff, Salted Caramel, Ferrero Rocher, Matcha Green Tea, and Pistachio Rose! Would you like recommendations for a specific occasion?";
    }
    if (lower.includes('delivery') || lower.includes('ship') || lower.includes('cost')) {
      return "We offer Same-Day Delivery across Manhattan for selected cakes, and Next-Day Delivery across all of New York City! Delivery is FREE on orders over $100 (or $8–$20 for standard qualifying orders). Custom multi-tier cakes require 24–48 hours advance notice.";
    }
    if (lower.includes('vegan') || lower.includes('eggless') || lower.includes('gluten') || lower.includes('dietary')) {
      return "Yes! We take dietary preferences very seriously. We offer customized Eggless, Vegan, Gluten-Free, and Sugar-Free cakes upon request. You can select your dietary requirements directly in our Custom Cake Studio or during checkout.";
    }
    if (lower.includes('hour') || lower.includes('open') || lower.includes('location') || lower.includes('address')) {
      return "We are located at 245 Lexington Avenue, Manhattan, New York, NY 10016. We are open Monday through Sunday from 8:00 AM to 9:00 PM. We'd love to welcome you!";
    }
    if (lower.includes('custom') || lower.includes('wedding') || lower.includes('order')) {
      return "You can order custom cakes right here through our website under the 'Custom Cakes' studio! We specialize in tiered wedding cakes, birthday masterpieces, and corporate celebrations. Please allow 24–48 hours notice for bespoke creations.";
    }
    return "Thank you for reaching out to The Velvet Cake Co.! We specialize in handcrafted custom celebration cakes, wedding tiers, and artisanal desserts in Manhattan. You can explore our Menu, design a custom cake in our Studio, or visit us at 245 Lexington Ave. How can I assist with your celebration today?";
  }

  try {
    // Format conversation history for Gemini
    const contents: any[] = [];
    
    // Add system instruction via config
    // Limit history to last 10 messages for prompt efficiency
    const recentHistory = history.slice(-8);
    for (const h of recentHistory) {
      contents.push({
        role: h.role === 'USER' ? 'user' : 'model',
        parts: [{ text: h.message }]
      });
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents,
      config: {
        systemInstruction: BAKERY_SYSTEM_PROMPT,
        temperature: 0.7,
      }
    });

    return response.text?.trim() || "Thank you for your message. Our pastry team at The Velvet Cake Co. is delighted to assist you. Please feel free to ask about our cakes, flavors, delivery, or custom orders!";
  } catch (error) {
    console.error('Gemini Chatbot Error:', error);
    return "Thank you for reaching out to The Velvet Cake Co.! We are open daily from 8:00 AM to 9:00 PM at 245 Lexington Avenue, Manhattan. For urgent inquiries or custom orders, feel free to submit our Custom Cake form or call us at +1 (212) 555-0187.";
  }
}
