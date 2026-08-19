// Database Seed script for The Velvet Cake Co.
import bcrypt from 'bcryptjs';

export const INITIAL_FLAVORS = [
  { name: 'Chocolate Truffle', description: 'Rich Belgian dark chocolate ganache infused sponge with silky truffle glaze.' },
  { name: 'Red Velvet', description: 'Classic velvety cocoa crumb layered with signature Madagascar vanilla cream cheese.' },
  { name: 'Vanilla Bean', description: 'Pure Tahitian vanilla bean sponge paired with whipped French buttercream.' },
  { name: 'New York Cheesecake', description: 'Authentic dense, ultra-creamy baked cheesecake with buttery graham crust.' },
  { name: 'Strawberry Shortcake', description: 'Airy sponge layered with fresh Hudson Valley strawberries and Chantilly cream.' },
  { name: 'Oreo Cookies & Cream', description: 'Decadent chocolate sponge folded with crushed Oreo cookies and creamy filling.' },
  { name: 'Salted Caramel', description: 'Buttery butterscotch cake with handcrafted Maldon sea salt caramel drizzle.' },
  { name: 'Lotus Biscoff', description: 'Spiced speculoos crumb layered with crunchy Biscoff cookie spread.' },
  { name: 'Ferrero Rocher', description: 'Hazelnut praline mousse, crushed roasted hazelnuts, and Nutella ganache.' },
  { name: 'Lemon Blueberry', description: 'Zesty Meyer lemon sponge studded with fresh wild Maine blueberries.' },
  { name: 'Tiramisu', description: 'Espresso-soaked ladyfinger sponge with light mascarpone cream and cocoa dust.' },
  { name: 'Matcha Green Tea', description: 'Ceremonial Uji matcha green tea sponge with white chocolate mousse.' },
  { name: 'Black Forest', description: 'Kirsch-scented chocolate cake filled with tart Morello cherries and cream.' },
  { name: 'Chocolate Hazelnut', description: 'Roasted Piedmont hazelnuts blended with velvety Gianduja chocolate cream.' },
  { name: 'Coconut Cream', description: 'Toasted coconut flakes folded in tender coconut milk sponge and silk curd.' },
  { name: 'Raspberry Vanilla', description: 'Madagascar vanilla cake filled with tart raspberry compote reduction.' },
  { name: 'Mango Passion Fruit', description: 'Tropical Alphonso mango mousse balanced with tangy passion fruit glaze.' },
  { name: 'Carrot Cake', description: 'Spiced heirloom carrot cake with toasted walnuts, cinnamon, and cream cheese.' },
  { name: 'Banana Cream', description: 'Caramelized banana sponge with diplomat custard and crisp wafer pearls.' },
  { name: 'Cookies & Cream', description: 'Velvety vanilla crumb loaded with dark cocoa cookies and whipped frosting.' },
  { name: 'Mocha Coffee', description: 'Dark roasted espresso buttercream paired with moist Dutch chocolate cake.' },
  { name: 'Pistachio Rose', description: 'Sicilian pistachio sponge lightly perfumed with organic rosewater petals.' },
  { name: 'Vanilla Strawberry', description: 'Tender vanilla bean cake with fresh strawberry preserve and cream.' },
  { name: 'Chocolate Peanut Butter', description: 'Dark chocolate cake layered with smooth creamy peanut butter frosting.' },
  { name: 'Red Velvet Cheesecake', description: 'Dual layered red velvet cake encasing a full New York cheesecake center.' },
  { name: 'Blueberry Vanilla', description: 'Sweet vanilla bean cake rippled with homemade blueberry jam.' },
  { name: 'Lemon Raspberry', description: 'Tart lemon curd meets sweet raspberry coulis and delicate yellow sponge.' },
  { name: 'Caramel Crunch', description: 'Caramelized sponge layered with crunchy toffee bits and dulce de leche.' },
  { name: 'Dark Chocolate Ganache', description: '70% Valrhona dark chocolate whip with glossy mirror ganache glaze.' },
  { name: 'White Chocolate Raspberry', description: 'Silky ivory white chocolate mousse paired with fresh tart raspberries.' },
  { name: 'Classic Vanilla', description: 'Timeless light golden sponge with creamy traditional vanilla buttercream.' },
  { name: 'Chocolate Fudge', description: 'Old-fashioned deep chocolate fudge cake layered with rich fudge icing.' },
];

export const INITIAL_PRODUCTS = [
  // 1. SIGNATURE CAKES (6 items)
  {
    name: 'The Signature Velvet Noir',
    slug: 'signature-velvet-noir',
    description: 'Our crown jewel. Belgian dark chocolate truffle layers with velvety chocolate ganache, 24k gold leaf accents, and chocolate blossom crowns.',
    category: 'Signature Cakes',
    price: 85.00,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true
  },
  {
    name: 'Grand Red Velvet Royale',
    slug: 'grand-red-velvet-royale',
    description: 'Crimson cocoa velvet sponge with tiers of whipped vanilla bean cream cheese frosting and handcrafted macaron crown.',
    category: 'Signature Cakes',
    price: 78.00,
    imageUrl: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true
  },
  {
    name: 'Lotus Biscoff Dream Cake',
    slug: 'lotus-biscoff-dream-cake',
    description: 'Spiced Belgian cookie butter sponge layered with speculoos crunch and topped with drip caramel and whole Lotus biscuits.',
    category: 'Signature Cakes',
    price: 82.00,
    imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true
  },
  {
    name: 'Strawberry Velvet Shortcake',
    slug: 'strawberry-velvet-shortcake',
    description: 'Fluffy sponge layered with fresh organic strawberries, strawberry preserves, and light Tahitian vanilla whipped cream.',
    category: 'Signature Cakes',
    price: 76.00,
    imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true
  },
  {
    name: 'Chocoholic Hazelnut Praline Cake',
    slug: 'chocoholic-hazelnut-praline',
    description: 'Layers of moist chocolate sponge, hazelnut crunch praline, Nutella mousse, and Ferrero Rocher crowns.',
    category: 'Signature Cakes',
    price: 88.00,
    imageUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true
  },
  {
    name: 'Matcha Pistachio Opera Cake',
    slug: 'matcha-pistachio-opera-cake',
    description: 'Uji ceremonial green tea sponge layered with Sicilian pistachio buttercream, white chocolate ganache, and edible gold leaf.',
    category: 'Signature Cakes',
    price: 84.00,
    imageUrl: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true
  },

  // 2. WEDDING CAKES (6 items)
  {
    name: 'Lexington Elegance Tiered Cake',
    slug: 'lexington-elegance-tiered-cake',
    description: 'Breathtaking 3-tier architectural wedding centerpiece with textured ivory buttercream, edible sugar florals, and delicate gold leaf.',
    category: 'Wedding Cakes',
    price: 340.00,
    imageUrl: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true
  },
  {
    name: 'Manhattan Flora Bridal Cake',
    slug: 'manhattan-flora-bridal-cake',
    description: 'Two-tier artisanal celebration cake frosted with smooth vanilla bean buttercream and adorned with fresh seasonal pastel florals.',
    category: 'Wedding Cakes',
    price: 210.00,
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true
  },
  {
    name: 'Vintage Lambeth Victorian Wedding Tier',
    slug: 'vintage-lambeth-victorian-wedding-tier',
    description: 'Masterfully piped Victorian scrollwork, scalloped buttercream borders, and delicate edible sugar cherry pearls on almond chiffon.',
    category: 'Wedding Cakes',
    price: 295.00,
    imageUrl: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true
  },
  {
    name: 'Botanical Blossom 3-Tier Grand Cake',
    slug: 'botanical-blossom-3-tier-grand-cake',
    description: 'Three-tier Madagascar vanilla champagne sponge with fresh organic botanicals, edible gold dusting, and passionfruit curd.',
    category: 'Wedding Cakes',
    price: 385.00,
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true
  },
  {
    name: 'Golden Radiance Pearl Wedding Cake',
    slug: 'golden-radiance-pearl-wedding-cake',
    description: 'Smooth Swiss meringue fondant adorned with shimmering edible sugar pearls, white chocolate collar, and delicate floral accents.',
    category: 'Wedding Cakes',
    price: 360.00,
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true
  },
  {
    name: 'Chantilly Cascade 2-Tier Celebration Cake',
    slug: 'chantilly-cascade-2-tier-celebration-cake',
    description: 'Romantic 2-tier creation with French Chantilly cream cascades, wild elderflower syrup infusion, and sweet raspberry preserve.',
    category: 'Wedding Cakes',
    price: 230.00,
    imageUrl: 'https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true
  },

  // 3. MINI TREATS (6 items)
  {
    name: 'Artisan Cupcake Collection (Box of 12)',
    slug: 'artisan-cupcake-collection-12',
    description: 'Assortment of our finest cupcakes: Red Velvet, Salted Caramel, Chocolate Truffle, and Lemon Blueberry topped with buttercream rosettes.',
    category: 'Mini Treats',
    price: 48.00,
    imageUrl: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true
  },
  {
    name: 'Parisian Macaron Gift Box (18 pcs)',
    slug: 'parisian-macaron-gift-box',
    description: 'Delicate French almond meringue shells filled with dark chocolate ganache, pistachio cream, salted caramel, rosewater, and passion fruit.',
    category: 'Mini Treats',
    price: 52.00,
    imageUrl: 'https://images.unsplash.com/photo-1570476922354-81227cdbb76c?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true
  },
  {
    name: 'Gourmet Brownie & Blondie Ensemble',
    slug: 'gourmet-brownie-ensemble',
    description: 'Fudgy 70% dark chocolate espresso brownies and browned-butter pecan blondies dusted with sea salt crystals.',
    category: 'Mini Treats',
    price: 36.00,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true
  },
  {
    name: 'Petite Velvet Cupcake Bouquet (Box of 6)',
    slug: 'petite-velvet-cupcake-bouquet-6',
    description: 'Six handcrafted artisan cupcakes featuring signature cocoa crumb, lavender cream, and Belgian dark chocolate curls.',
    category: 'Mini Treats',
    price: 28.00,
    imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true
  },
  {
    name: 'French Madeleine & Sablé Gift Box',
    slug: 'french-madeleine-sable-gift-box',
    description: 'Brown butter clover honey madeleines paired with crisp vanilla bean fleur de sel shortbread cookies.',
    category: 'Mini Treats',
    price: 32.00,
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true
  },
  {
    name: 'Assorted Éclair & Tartlet Flight (8 pcs)',
    slug: 'assorted-eclair-tartlet-flight-8',
    description: 'Crisp choux pastry éclairs filled with Madagascar vanilla bean diplomat cream and Meyer lemon mini tartlets.',
    category: 'Mini Treats',
    price: 44.00,
    imageUrl: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true
  },

  // 4. SEASONAL SPECIALS (6 items)
  {
    name: 'Classic New York Baked Cheesecake',
    slug: 'classic-ny-baked-cheesecake',
    description: 'Traditional Manhattan recipe with organic cream cheese, sweet vanilla essence, buttery graham cracker crust, and fresh berry compote.',
    category: 'Seasonal Specials',
    price: 65.00,
    imageUrl: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true
  },
  {
    name: 'Manhattan Celebration Dessert Box',
    slug: 'manhattan-celebration-dessert-box',
    description: 'The ultimate party box: 4 mini cakes, 6 macarons, 4 chocolate truffles, and gourmet cookies presented in our luxury velvet box.',
    category: 'Seasonal Specials',
    price: 95.00,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true
  },
  {
    name: 'Caramelized Autumn Pecan Tart',
    slug: 'caramelized-autumn-pecan-tart',
    description: 'Toasted Georgia pecans bathed in slow-cooked bourbon maple caramel encased in a crisp French butter sablé crust.',
    category: 'Seasonal Specials',
    price: 58.00,
    imageUrl: 'https://images.unsplash.com/photo-1514056052883-d017fddd0426?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true
  },
  {
    name: 'Wild Berry Mascarpone Tart',
    slug: 'wild-berry-mascarpone-tart',
    description: 'Velvety Italian mascarpone mousse crowned with fresh organic blackberries, raspberries, and wild strawberry glaze.',
    category: 'Seasonal Specials',
    price: 62.00,
    imageUrl: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true
  },
  {
    name: 'Dark Cherry Black Forest Entremet',
    slug: 'dark-cherry-black-forest-entremet',
    description: 'Kirsch-scented chocolate sponge, sour cherry compote, Valrhona dark chocolate mousse, and chocolate blossom shavings.',
    category: 'Seasonal Specials',
    price: 74.00,
    imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true
  },
  {
    name: 'Passionfruit Mango Mousse Dome',
    slug: 'passionfruit-mango-mousse-dome',
    description: 'Tropical mango mousse with passionfruit curd center, light almond joconde sponge, and a mirror glaze finish.',
    category: 'Seasonal Specials',
    price: 68.00,
    imageUrl: 'https://images.unsplash.com/photo-1508737804141-4c3b688e2546?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true
  }
];

export async function getSeedData() {
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('VelvetAdmin2026!', salt);
  const customerPasswordHash = await bcrypt.hash('CustomerPass2026!', salt);

  const adminUser = {
    id: 'usr-admin-001',
    name: 'Elena Rostova (Executive Pastry Chef)',
    email: 'admin@thevelvetcakeco.com',
    passwordHash: adminPasswordHash,
    phone: '+1 (212) 555-0187',
    role: 'ADMIN' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const demoCustomer = {
    id: 'usr-cust-001',
    name: 'Sophia Montgomery',
    email: 'customer@thevelvetcakeco.com',
    passwordHash: customerPasswordHash,
    phone: '+1 (917) 555-0142',
    role: 'CUSTOMER' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return {
    adminUser,
    demoCustomer,
    flavors: INITIAL_FLAVORS,
    products: INITIAL_PRODUCTS
  };
}
