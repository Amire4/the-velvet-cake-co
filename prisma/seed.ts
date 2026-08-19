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
  {
    name: 'The Signature Velvet Noir',
    slug: 'signature-velvet-noir',
    description: 'Our crown jewel. Belgian dark chocolate truffle layers with velvety chocolate ganache, 24k gold leaf accents, and chocolate blossom crowns.',
    category: 'Birthday Cake',
    price: 85.00,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true
  },
  {
    name: 'Grand Red Velvet Royale',
    slug: 'grand-red-velvet-royale',
    description: 'Crimson cocoa velvet sponge with tiers of whipped vanilla bean cream cheese frosting and handcrafted macaron crown.',
    category: 'Birthday Cake',
    price: 78.00,
    imageUrl: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true
  },
  {
    name: 'Lexington Elegance Tiered Cake',
    slug: 'lexington-elegance-tiered-cake',
    description: 'Breathtaking 3-tier architectural wedding masterpiece with textured ivory buttercream, edible sugar florals, and delicate gold leaf.',
    category: 'Wedding Cake',
    price: 340.00,
    imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true
  },
  {
    name: 'Manhattan Flora Bridal Cake',
    slug: 'manhattan-flora-bridal-cake',
    description: 'Two-tier artisanal celebration cake frosted with smooth vanilla bean buttercream and adorned with fresh seasonal pastel florals.',
    category: 'Wedding Cake',
    price: 210.00,
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true
  },
  {
    name: 'Artisan Cupcake Collection (Box of 12)',
    slug: 'artisan-cupcake-collection-12',
    description: 'Assortment of our finest cupcakes: Red Velvet, Salted Caramel, Chocolate Truffle, and Lemon Blueberry topped with buttercream rosettes.',
    category: 'Cupcake',
    price: 48.00,
    imageUrl: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true
  },
  {
    name: 'Classic New York Baked Cheesecake',
    slug: 'classic-ny-baked-cheesecake',
    description: 'Traditional Manhattan recipe with organic cream cheese, sweet vanilla essence, buttery graham cracker crust, and fresh berry compote.',
    category: 'Cheesecake',
    price: 65.00,
    imageUrl: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true
  },
  {
    name: 'Parisian Macaron Gift Box (18 pcs)',
    slug: 'parisian-macaron-gift-box',
    description: 'Delicate French almond meringue shells filled with dark chocolate ganache, pistachio cream, salted caramel, rosewater, and passion fruit.',
    category: 'Macaron',
    price: 52.00,
    imageUrl: 'https://images.unsplash.com/photo-1569864321390-3882779fbe41?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true
  },
  {
    name: 'Gourmet Brownie & Blondie Ensemble',
    slug: 'gourmet-brownie-ensemble',
    description: 'Fudgy 70% dark chocolate espresso brownies and browned-butter pecan blondies dusted with sea salt crystals.',
    category: 'Brownie',
    price: 36.00,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true
  },
  {
    name: 'Manhattan Celebration Dessert Box',
    slug: 'manhattan-celebration-dessert-box',
    description: 'The ultimate party box: 4 mini cakes, 6 macarons, 4 chocolate truffles, and gourmet cookies presented in our luxury velvet box.',
    category: 'Dessert Box',
    price: 95.00,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true
  },
  {
    name: 'Lotus Biscoff Dream Cake',
    slug: 'lotus-biscoff-dream-cake',
    description: 'Spiced Belgian cookie butter sponge layered with speculoos crunch and topped with drip caramel and whole Lotus biscuits.',
    category: 'Birthday Cake',
    price: 82.00,
    imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true
  },
  {
    name: 'Strawberry Velvet Shortcake',
    slug: 'strawberry-velvet-shortcake',
    description: 'Fluffy sponge layered with fresh organic strawberries, strawberry preserves, and light Tahitian vanilla whipped cream.',
    category: 'Birthday Cake',
    price: 76.00,
    imageUrl: 'https://images.unsplash.com/photo-1562772186-3689454652fe?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true
  },
  {
    name: 'Chocoholic Hazelnut Praline Cake',
    slug: 'chocoholic-hazelnut-praline',
    description: 'Layers of moist chocolate sponge, hazelnut crunch praline, Nutella mousse, and Ferrero Rocher crowns.',
    category: 'Birthday Cake',
    price: 88.00,
    imageUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true
  },
  {
    name: 'Chunky Chocolate Chip NYC Cookies (Box of 8)',
    slug: 'nyc-chocolate-chip-cookies-8',
    description: 'Thick, golden, gooey NYC style cookies packed with semi-sweet and bittersweet chocolate chunks with crisp edges.',
    category: 'Cookie',
    price: 32.00,
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true
  },
  {
    name: 'Pistachio Rose Blossom Cake',
    slug: 'pistachio-rose-blossom-cake',
    description: 'Fragrant Sicilian pistachio sponge brushed with organic rosewater, filled with white chocolate pistachio ganache and dried rose petals.',
    category: 'Birthday Cake',
    price: 86.00,
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true
  },
  {
    name: 'Matcha Uji Green Tea Mousse Cake',
    slug: 'matcha-uji-mousse-cake',
    description: 'Smooth authentic Japanese matcha mousse with red bean chiffon base and white chocolate drizzle.',
    category: 'Cheesecake',
    price: 72.00,
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true
  },
  {
    name: 'Lemon Blueberry Meringue Cake',
    slug: 'lemon-blueberry-meringue-cake',
    description: 'Zesty lemon sponge with wild Maine blueberry reduction and toasted Italian meringue swirls.',
    category: 'Birthday Cake',
    price: 79.00,
    imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true
  }
];

export async function getSeedData() {
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('AdminSecret2026!', salt);
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
    email: 'customer@example.com',
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
