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
    available: true,
    rating: 4.7,
    reviewCount: 48
  },
  {
    name: 'Grand Red Velvet Royale',
    slug: 'grand-red-velvet-royale',
    description: 'Crimson cocoa velvet sponge with tiers of whipped vanilla bean cream cheese frosting and handcrafted macaron crown.',
    category: 'Signature Cakes',
    price: 78.00,
    imageUrl: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true,
    rating: 4.6,
    reviewCount: 42
  },
  {
    name: 'Lotus Biscoff Dream Cake',
    slug: 'lotus-biscoff-dream-cake',
    description: 'Spiced Belgian cookie butter sponge layered with speculoos crunch and topped with drip caramel and whole Lotus biscuits.',
    category: 'Signature Cakes',
    price: 82.00,
    imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true,
    rating: 4.4,
    reviewCount: 36
  },
  {
    name: 'Strawberry Velvet Shortcake',
    slug: 'strawberry-velvet-shortcake',
    description: 'Fluffy sponge layered with fresh organic strawberries, strawberry preserves, and light Tahitian vanilla whipped cream.',
    category: 'Signature Cakes',
    price: 76.00,
    imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true,
    rating: 4.5,
    reviewCount: 39
  },
  {
    name: 'Chocoholic Hazelnut Praline Cake',
    slug: 'chocoholic-hazelnut-praline',
    description: 'Layers of moist chocolate sponge, hazelnut crunch praline, Nutella mousse, and Ferrero Rocher crowns.',
    category: 'Signature Cakes',
    price: 88.00,
    imageUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true,
    rating: 4.7,
    reviewCount: 52
  },
  {
    name: 'Matcha Pistachio Opera Cake',
    slug: 'matcha-pistachio-opera-cake',
    description: 'Uji ceremonial green tea sponge layered with Sicilian pistachio buttercream, white chocolate ganache, and edible gold leaf.',
    category: 'Signature Cakes',
    price: 84.00,
    imageUrl: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true,
    rating: 4.3,
    reviewCount: 31
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
    available: true,
    rating: 4.7,
    reviewCount: 29
  },
  {
    name: 'Manhattan Flora Bridal Cake',
    slug: 'manhattan-flora-bridal-cake',
    description: 'Two-tier artisanal celebration cake frosted with smooth vanilla bean buttercream and adorned with fresh seasonal pastel florals.',
    category: 'Wedding Cakes',
    price: 210.00,
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true,
    rating: 4.2,
    reviewCount: 24
  },
  {
    name: 'Vintage Lambeth Victorian Wedding Tier',
    slug: 'vintage-lambeth-victorian-wedding-tier',
    description: 'Masterfully piped Victorian scrollwork, scalloped buttercream borders, and delicate edible sugar cherry pearls on almond chiffon.',
    category: 'Wedding Cakes',
    price: 295.00,
    imageUrl: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true,
    rating: 4.6,
    reviewCount: 28
  },
  {
    name: 'Botanical Blossom 3-Tier Grand Cake',
    slug: 'botanical-blossom-3-tier-grand-cake',
    description: 'Three-tier Madagascar vanilla champagne sponge with fresh organic botanicals, edible gold dusting, and passionfruit curd.',
    category: 'Wedding Cakes',
    price: 385.00,
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true,
    rating: 4.5,
    reviewCount: 33
  },
  {
    name: 'Golden Radiance Pearl Wedding Cake',
    slug: 'golden-radiance-pearl-wedding-cake',
    description: 'Smooth Swiss meringue fondant adorned with shimmering edible sugar pearls, white chocolate collar, and delicate floral accents.',
    category: 'Wedding Cakes',
    price: 360.00,
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true,
    rating: 4.3,
    reviewCount: 22
  },
  {
    name: 'Chantilly Cascade 2-Tier Celebration Cake',
    slug: 'chantilly-cascade-2-tier-celebration-cake',
    description: 'Romantic 2-tier creation with French Chantilly cream cascades, wild elderflower syrup infusion, and sweet raspberry preserve.',
    category: 'Wedding Cakes',
    price: 230.00,
    imageUrl: 'https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true,
    rating: 4.1,
    reviewCount: 19
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
    available: true,
    rating: 4.5,
    reviewCount: 45
  },
  {
    name: 'Parisian Macaron Gift Box (18 pcs)',
    slug: 'parisian-macaron-gift-box',
    description: 'Delicate French almond meringue shells filled with dark chocolate ganache, pistachio cream, salted caramel, rosewater, and passion fruit.',
    category: 'Mini Treats',
    price: 52.00,
    imageUrl: 'https://images.unsplash.com/photo-1570476922354-81227cdbb76c?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true,
    rating: 4.6,
    reviewCount: 56
  },
  {
    name: 'Gourmet Brownie & Blondie Ensemble',
    slug: 'gourmet-brownie-ensemble',
    description: 'Fudgy 70% dark chocolate espresso brownies and browned-butter pecan blondies dusted with sea salt crystals.',
    category: 'Mini Treats',
    price: 36.00,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true,
    rating: 3.9,
    reviewCount: 27
  },
  {
    name: 'Petite Velvet Cupcake Bouquet (Box of 6)',
    slug: 'petite-velvet-cupcake-bouquet-6',
    description: 'Six handcrafted artisan cupcakes featuring signature cocoa crumb, lavender cream, and Belgian dark chocolate curls.',
    category: 'Mini Treats',
    price: 28.00,
    imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true,
    rating: 4.2,
    reviewCount: 23
  },
  {
    name: 'French Madeleine & Sablé Gift Box',
    slug: 'french-madeleine-sable-gift-box',
    description: 'Brown butter clover honey madeleines paired with crisp vanilla bean fleur de sel shortbread cookies.',
    category: 'Mini Treats',
    price: 32.00,
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true,
    rating: 4.0,
    reviewCount: 20
  },
  {
    name: 'Assorted Éclair & Tartlet Flight (8 pcs)',
    slug: 'assorted-eclair-tartlet-flight-8',
    description: 'Crisp choux pastry éclairs filled with Madagascar vanilla bean diplomat cream and Meyer lemon mini tartlets.',
    category: 'Mini Treats',
    price: 44.00,
    imageUrl: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true,
    rating: 4.4,
    reviewCount: 34
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
    available: true,
    rating: 4.6,
    reviewCount: 50
  },
  {
    name: 'Manhattan Celebration Dessert Box',
    slug: 'manhattan-celebration-dessert-box',
    description: 'The ultimate party box: 4 mini cakes, 6 macarons, 4 chocolate truffles, and gourmet cookies presented in our luxury velvet box.',
    category: 'Seasonal Specials',
    price: 95.00,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true,
    rating: 4.7,
    reviewCount: 41
  },
  {
    name: 'Caramelized Autumn Pecan Tart',
    slug: 'caramelized-autumn-pecan-tart',
    description: 'Toasted Georgia pecans bathed in slow-cooked bourbon maple caramel encased in a crisp French butter sablé crust.',
    category: 'Seasonal Specials',
    price: 58.00,
    imageUrl: 'https://images.unsplash.com/photo-1514056052883-d017fddd0426?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true,
    rating: 3.8,
    reviewCount: 18
  },
  {
    name: 'Wild Berry Mascarpone Tart',
    slug: 'wild-berry-mascarpone-tart',
    description: 'Velvety Italian mascarpone mousse crowned with fresh organic blackberries, raspberries, and wild strawberry glaze.',
    category: 'Seasonal Specials',
    price: 62.00,
    imageUrl: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    available: true,
    rating: 4.3,
    reviewCount: 26
  },
  {
    name: 'Dark Cherry Black Forest Entremet',
    slug: 'dark-cherry-black-forest-entremet',
    description: 'Kirsch-scented chocolate sponge, sour cherry compote, Valrhona dark chocolate mousse, and chocolate blossom shavings.',
    category: 'Seasonal Specials',
    price: 74.00,
    imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true,
    rating: 4.1,
    reviewCount: 21
  },
  {
    name: 'Passionfruit Mango Mousse Dome',
    slug: 'passionfruit-mango-mousse-dome',
    description: 'Tropical mango mousse with passionfruit curd center, light almond joconde sponge, and a mirror glaze finish.',
    category: 'Seasonal Specials',
    price: 68.00,
    imageUrl: 'https://images.unsplash.com/photo-1508737804141-4c3b688e2546?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    available: true,
    rating: 4.2,
    reviewCount: 25
  }
];

export const PRODUCT_SPECIFIC_REVIEWS: Record<string, Array<{ userName: string; userEmail: string; rating: number; comment: string; verifiedPurchase: boolean }>> = {
  'signature-velvet-noir': [
    {
      userName: 'Genevieve Laurent',
      userEmail: 'g.laurent@vogue-events.com',
      rating: 5,
      comment: 'Ordered for our Madison Avenue gallery gala. The 24k gold leaf and Belgian chocolate truffle sponge were the highlight of the night. Absolute perfection!',
      verifiedPurchase: true
    },
    {
      userName: 'Liam O\'Connor',
      userEmail: 'liam.oconnor@tribecacap.com',
      rating: 5,
      comment: 'Incredible depth of flavor from the Valrhona cocoa. Arrived chilled and in pristine condition in Midtown.',
      verifiedPurchase: true
    },
    {
      userName: 'Zara Qureshi',
      userEmail: 'zara.qureshi@nyu.edu',
      rating: 5,
      comment: 'Bohot hi lazeez aur rich dark chocolate sponge tha! The balance of chocolate ganache is unmatched in Manhattan.',
      verifiedPurchase: true
    },
    {
      userName: 'Ethan Brooks',
      userEmail: 'ethan.brooks@gmail.com',
      rating: 5,
      comment: 'My wife\'s 40th birthday centerpiece. Everyone asked which Michelin-rated pastry chef baked it.',
      verifiedPurchase: true
    }
  ],
  'grand-red-velvet-royale': [
    {
      userName: 'Dr. Farhan Malik',
      userEmail: 'farhan.malik@mountsinai.org',
      rating: 5,
      comment: 'SubhanAllah, the most authentic red velvet in NYC! The Madagascar vanilla cream cheese is velvety smooth and not overly sweet.',
      verifiedPurchase: true
    },
    {
      userName: 'Olivia Kensington',
      userEmail: 'olivia.kensington@harpers.com',
      rating: 5,
      comment: 'The handmade macaron crown was stunning and the ruby sponge literally melted in our mouths.',
      verifiedPurchase: true
    },
    {
      userName: 'Chloe Dupont',
      userEmail: 'chloe.dupont@sohodesign.com',
      rating: 5,
      comment: 'Ordered for our Soho bridal shower. Photographed like a magazine cover and tasted even more heavenly.',
      verifiedPurchase: true
    },
    {
      userName: 'Julian Hayes',
      userEmail: 'julian.hayes@columbia.edu',
      rating: 5,
      comment: '10/10 crumb structure. You can taste the real European cultured butter and natural cocoa.',
      verifiedPurchase: true
    }
  ],
  'lotus-biscoff-dream-cake': [
    {
      userName: 'Hamza Sheikh',
      userEmail: 'hamza.sheikh@techcorp.io',
      rating: 5,
      comment: 'Biscoff lovers rejoice! Crunchy speculoos spread paired with caramel drizzle was out of this world.',
      verifiedPurchase: true
    },
    {
      userName: 'Emily Zhang',
      userEmail: 'emily.zhang@bloomberg.net',
      rating: 5,
      comment: 'The cookie butter layers had the perfect crunch-to-sponge ratio. Huge hit across our entire trading floor!',
      verifiedPurchase: true
    },
    {
      userName: 'Noah Al-Mansoor',
      userEmail: 'noah.mansoor@almansoor.ae',
      rating: 5,
      comment: 'Best cake I have ordered this year. The salted caramel notes balance the Biscoff sweetness flawlessly.',
      verifiedPurchase: true
    },
    {
      userName: 'Sarah Jenkins',
      userEmail: 'sjenkins@gmail.com',
      rating: 5,
      comment: 'Super moist sponge with rich spiced flavor. Will definitely reorder for our family celebrations.',
      verifiedPurchase: true
    }
  ],
  'strawberry-velvet-shortcake': [
    {
      userName: 'Isabella Rossi',
      userEmail: 'isabella.rossi@milanoculture.it',
      rating: 5,
      comment: 'Fresh Hudson Valley strawberries and light-as-air Chantilly cream. Felt like a summer afternoon in Paris.',
      verifiedPurchase: true
    },
    {
      userName: 'Mateo Fernandez',
      userEmail: 'mateo.fernandez@nyarts.org',
      rating: 5,
      comment: 'So refreshing and light! Even our guests who usually skip dessert had second slices.',
      verifiedPurchase: true
    },
    {
      userName: 'Ayesha Siddiqui',
      userEmail: 'ayesha.siddiqui@columbia.edu',
      rating: 5,
      comment: 'Bohot pyari presentation thi aur strawberry compote ekdum fresh tha. Absolutely five stars!',
      verifiedPurchase: true
    },
    {
      userName: 'Benjamin Scott',
      userEmail: 'bscott@lawpartners.com',
      rating: 5,
      comment: 'Delivered right on time to our Upper East Side apartment. Fresh berries were sweet and succulent.',
      verifiedPurchase: true
    }
  ],
  'chocoholic-hazelnut-praline': [
    {
      userName: 'Domenico Moretti',
      userEmail: 'dmoretti@culinaryroma.it',
      rating: 5,
      comment: 'The roasted Piedmont hazelnut praline inside is pure luxury. Tastes like an elevated, artisan Ferrero Rocher.',
      verifiedPurchase: true
    },
    {
      userName: 'Natasha Volkov',
      userEmail: 'nvolkov@nycfashion.com',
      rating: 5,
      comment: 'Silky Nutella mousse with crunchy praline pearls. Truly an unforgettable birthday cake.',
      verifiedPurchase: true
    },
    {
      userName: 'Bilal Ahmed',
      userEmail: 'bilal.ahmed@fintech.co',
      rating: 5,
      comment: 'Rich, chocolatey and perfectly textured hazelnut crunch. Best birthday treat I have ever had!',
      verifiedPurchase: true
    },
    {
      userName: 'Grace Higgins',
      userEmail: 'grace.higgins@gmail.com',
      rating: 5,
      comment: 'Indulgent in the best way possible. Any chocolate and hazelnut lover will be utterly obsessed.',
      verifiedPurchase: true
    }
  ],
  'matcha-pistachio-opera-cake': [
    {
      userName: 'Kenji Takahashi',
      userEmail: 'kenji.takahashi@tokyojapan.com',
      rating: 5,
      comment: 'Authentic ceremonial Uji matcha with deep floral umami, paired beautifully with Sicilian pistachio cream.',
      verifiedPurchase: true
    },
    {
      userName: 'Victoria Sterling',
      userEmail: 'victoria.sterling@architectsnyc.com',
      rating: 5,
      comment: 'The gold leaf finish and razor-sharp opera cake layers were mesmerizing. A true architectural work of art.',
      verifiedPurchase: true
    },
    {
      userName: 'Mahnoor Khan',
      userEmail: 'mahnoor.khan@designstudio.pk',
      rating: 5,
      comment: 'Unique and sophisticated flavor profile. Not too sugary, exquisitely balanced with tea notes.',
      verifiedPurchase: true
    },
    {
      userName: 'Lucas Moreau',
      userEmail: 'lucas.moreau@lyonpastry.fr',
      rating: 5,
      comment: 'Delicate green tea notes and French pastry techniques executed with master precision.',
      verifiedPurchase: true
    }
  ],
  'lexington-elegance-tiered-cake': [
    {
      userName: 'Eleanor & James Montgomery',
      userEmail: 'the.montgomerys@gmail.com',
      rating: 5,
      comment: 'Our wedding guests are still talking about this cake weeks later. The architectural sugar flowers looked completely real!',
      verifiedPurchase: true
    },
    {
      userName: 'Claire Whitmore (NYC Wedding Planner)',
      userEmail: 'claire@whitmoreevents.com',
      rating: 5,
      comment: 'As an event coordinator at The Plaza, The Velvet Cake Co. is my top tier recommendation for luxury bridal cakes.',
      verifiedPurchase: true
    },
    {
      userName: 'Tariq Mehmood',
      userEmail: 'tariq.mehmood@nybusiness.com',
      rating: 5,
      comment: 'Ordered for our daughter\'s Walima reception in Manhattan. Dignified, grand, and heavenly delicious.',
      verifiedPurchase: true
    },
    {
      userName: 'Sophie Van Der Bilt',
      userEmail: 'sophie.vanderbilt@manhattanlux.com',
      rating: 5,
      comment: 'The ivory textured Swiss buttercream was flawlessly piped. Arrived in a temperature-controlled van with setup support.',
      verifiedPurchase: true
    }
  ],
  'manhattan-flora-bridal-cake': [
    {
      userName: 'Hannah & Tyler Vance',
      userEmail: 'vance.wedding2026@gmail.com',
      rating: 5,
      comment: 'The pastel floral arrangements and smooth vanilla bean crumb made our intimate rooftop wedding truly magical.',
      verifiedPurchase: true
    },
    {
      userName: 'Sana Riaz',
      userEmail: 'sana.riaz@gmail.com',
      rating: 5,
      comment: 'Two tiers of pure elegance. The elderflower syrup reduction gave it such an enchanting aroma.',
      verifiedPurchase: true
    },
    {
      userName: 'Giselle Beaulieu',
      userEmail: 'giselle.beaulieu@montreal.ca',
      rating: 5,
      comment: 'Subtle, romantic and incredibly moist. Outstanding customer service from Master Chef Rana Amir.',
      verifiedPurchase: true
    }
  ],
  'vintage-lambeth-victorian-wedding-tier': [
    {
      userName: 'Penelope Featherington',
      userEmail: 'penelope.f@mayfairsociety.org',
      rating: 5,
      comment: 'The intricate Victorian overpiped scrollwork is breathtaking craftsmanship. True royal aesthetic!',
      verifiedPurchase: true
    },
    {
      userName: 'Astrid Lindholm',
      userEmail: 'astrid.lindholm@stockholmarts.se',
      rating: 5,
      comment: 'Such gorgeous vintage piping! Almond chiffon interior was fluffy, fragrant, and deeply comforting.',
      verifiedPurchase: true
    },
    {
      userName: 'Usman Farooq',
      userEmail: 'usman.farooq@lexingtonlaw.com',
      rating: 5,
      comment: 'Remarkable attention to detail. Every scalloped border was razor precise and arrived intact.',
      verifiedPurchase: true
    }
  ],
  'botanical-blossom-3-tier-grand-cake': [
    {
      userName: 'Arabella Sinclair',
      userEmail: 'arabella.sinclair@edinburgh.co.uk',
      rating: 5,
      comment: 'Three tiers of champagne sponge and organic botanicals. It was the absolute centerpiece of our Central Park dinner.',
      verifiedPurchase: true
    },
    {
      userName: 'Marcus De Vries',
      userEmail: 'marcus.devries@amsterdamtrade.nl',
      rating: 5,
      comment: 'The passionfruit curd inside cutting through the champagne cake was culinary genius. 5 stars!',
      verifiedPurchase: true
    },
    {
      userName: 'Fatima Zahra',
      userEmail: 'fatima.zahra@gmail.com',
      rating: 5,
      comment: 'A majestic centerpiece for our grand family milestone. Everyone was in pure awe of the flavor.',
      verifiedPurchase: true
    }
  ],
  'golden-radiance-pearl-wedding-cake': [
    {
      userName: 'Vivienne Westwood-Smith',
      userEmail: 'vivienne.smith@londonlux.co.uk',
      rating: 5,
      comment: 'The shimmering edible sugar pearls and gold radiance made this the most photographed detail of our reception.',
      verifiedPurchase: true
    },
    {
      userName: 'Oliver Thornton',
      userEmail: 'oliver.thornton@bostonpartners.com',
      rating: 5,
      comment: 'White chocolate collar was crisp and the interior raspberry coulis was exquisite and fresh.',
      verifiedPurchase: true
    },
    {
      userName: 'Adeel Chaudhry',
      userEmail: 'adeel.chaudhry@manhattangroup.com',
      rating: 5,
      comment: 'Flawless luxury execution. Shipped with utmost care and tasted top tier across all 3 tiers.',
      verifiedPurchase: true
    }
  ],
  'chantilly-cascade-2-tier-celebration-cake': [
    {
      userName: 'Madeleine Dubois',
      userEmail: 'madeleine.dubois@parisart.fr',
      rating: 5,
      comment: 'French Chantilly cream cascade was clouds of bliss. The elderflower infusion is simply heavenly.',
      verifiedPurchase: true
    },
    {
      userName: 'Christopher Hayes',
      userEmail: 'c.hayes@verizon.net',
      rating: 5,
      comment: 'Ordered for our silver wedding anniversary. Light, romantic, and beautifully packaged in velvet ribbons.',
      verifiedPurchase: true
    },
    {
      userName: 'Nadia Qureshi',
      userEmail: 'nadia.qureshi@healthplus.org',
      rating: 5,
      comment: 'Simple yet so regal. The raspberry preserve layered between soft sponge was delightfully fresh.',
      verifiedPurchase: true
    }
  ],
  'artisan-cupcake-collection-12': [
    {
      userName: 'Harper Collins-Taylor',
      userEmail: 'harper.ct@manhattanpr.com',
      rating: 5,
      comment: 'The 12-pack assortment saved our corporate client reception. Every single flavor was distinct and moist.',
      verifiedPurchase: true
    },
    {
      userName: 'Saad Bin Khalid',
      userEmail: 'saad.khalid@nycapitol.com',
      rating: 5,
      comment: 'The Salted Caramel and Red Velvet cupcakes in this box are unmatched. Freshly piped rosettes!',
      verifiedPurchase: true
    },
    {
      userName: 'Maya Lin',
      userEmail: 'maya.lin@sohostudio.com',
      rating: 5,
      comment: 'Individual mini masterpieces. Buttercream was rich without being greasy or heavy.',
      verifiedPurchase: true
    }
  ],
  'parisian-macaron-gift-box': [
    {
      userName: 'Camille Renard',
      userEmail: 'camille.renard@parisfashion.fr',
      rating: 5,
      comment: 'As a Parisian living in NYC, these macarons rival the top salons on Champs-Élysées. Perfect feet and chewy ganache center.',
      verifiedPurchase: true
    },
    {
      userName: 'Zubair Hashmi',
      userEmail: 'zubair.hashmi@globalfinance.com',
      rating: 5,
      comment: 'Gifted this to my fiancee. The pistachio and rosewater flavors were unbelievable!',
      verifiedPurchase: true
    },
    {
      userName: 'Austin Miller',
      userEmail: 'austin.miller@nyu.edu',
      rating: 5,
      comment: 'Crisp delicate shell, melt-in-mouth filling. The velvet gift packaging is ultra-premium.',
      verifiedPurchase: true
    }
  ],
  'gourmet-brownie-ensemble': [
    {
      userName: 'Devon Rivera',
      userEmail: 'devon.rivera@tribecafood.com',
      rating: 5,
      comment: 'The browned-butter pecan blondies and espresso brownies have that perfect shiny crinkly top and fudge center.',
      verifiedPurchase: true
    },
    {
      userName: 'Rabia Noreen',
      userEmail: 'rabia.noreen@gmail.com',
      rating: 5,
      comment: 'Maldon sea salt flakes on 70% dark chocolate brownie is pure perfection with espresso coffee.',
      verifiedPurchase: true
    },
    {
      userName: 'Trevor Campbell',
      userEmail: 'tcampbell@nycadvisory.com',
      rating: 5,
      comment: 'Dense, gooey, and made with serious chocolate. Highly addictive for office tea breaks!',
      verifiedPurchase: true
    }
  ],
  'petite-velvet-cupcake-bouquet-6': [
    {
      userName: 'Serena Gomez-White',
      userEmail: 'serena.gw@nyhospitals.org',
      rating: 5,
      comment: 'Sent this to a friend recovering at Mount Sinai hospital. Brought so much joy! Lavender cream was sublime.',
      verifiedPurchase: true
    },
    {
      userName: 'Waleed Akhtar',
      userEmail: 'waleed.akhtar@gmail.com',
      rating: 5,
      comment: 'Packaged like fine jewelry. The cocoa velvet crumb is soft like a cloud.',
      verifiedPurchase: true
    },
    {
      userName: 'Audrey Hepburn-Lee',
      userEmail: 'audrey.lee@gramercyhotel.com',
      rating: 5,
      comment: '6 gorgeous cupcakes that make the perfect hostess gift in Manhattan.',
      verifiedPurchase: true
    }
  ],
  'french-madeleine-sable-gift-box': [
    {
      userName: 'Thierry Blanc',
      userEmail: 'thierry.blanc@bordeauxwines.fr',
      rating: 5,
      comment: 'Brown butter clover honey madeleines with perfect hump, and the fleur de sel sablés crumble like butter.',
      verifiedPurchase: true
    },
    {
      userName: 'Hina Batool',
      userEmail: 'hina.batool@nyu.edu',
      rating: 5,
      comment: 'A must-have for evening tea. Fresh vanilla bean aroma fills the room when you open the box.',
      verifiedPurchase: true
    },
    {
      userName: 'Sebastian Vance',
      userEmail: 'sebastian.vance@brooklynlofts.com',
      rating: 5,
      comment: 'Traditional French baking done with genuine respect for ingredients.',
      verifiedPurchase: true
    }
  ],
  'assorted-eclair-tartlet-flight-8': [
    {
      userName: 'Dominique Laroche',
      userEmail: 'dominique.laroche@parismonthly.com',
      rating: 5,
      comment: 'The Meyer lemon curd tartlet has that electric citrus punch, and the vanilla diplomat éclair is crisp.',
      verifiedPurchase: true
    },
    {
      userName: 'Haris Munir',
      userEmail: 'haris.munir@fintechpak.com',
      rating: 5,
      comment: 'Choux pastry was super fresh and crisp, not soggy at all. 5 stars all the way!',
      verifiedPurchase: true
    },
    {
      userName: 'Scarlett Miller',
      userEmail: 'scarlett.miller@manhattanbrunch.com',
      rating: 5,
      comment: 'Served at our Sunday brunch. Guests polished off all 8 pieces within 10 minutes.',
      verifiedPurchase: true
    }
  ],
  'classic-ny-baked-cheesecake': [
    {
      userName: 'Frankie Castiglione',
      userEmail: 'frankie.c@brooklyneats.com',
      rating: 5,
      comment: 'Born and raised in Brooklyn, this is hands down the best baked cheesecake in the five boroughs. Dense, velvety graham crust.',
      verifiedPurchase: true
    },
    {
      userName: 'Zainab Rizvi',
      userEmail: 'zainab.rizvi@medicalcenter.org',
      rating: 5,
      comment: 'The berry compote cut through the creamy richness brilliantly. Pure comfort food!',
      verifiedPurchase: true
    },
    {
      userName: 'Arthur Pendelton',
      userEmail: 'arthur.pendelton@uppereast.org',
      rating: 5,
      comment: 'Real slow-baked cheesecake without gelatins. Authentic NYC patisserie benchmark.',
      verifiedPurchase: true
    }
  ],
  'manhattan-celebration-dessert-box': [
    {
      userName: 'Kendra Washington',
      userEmail: 'kendra.w@midtownlaw.com',
      rating: 5,
      comment: 'The ultimate party box! Mini cakes, macarons, truffles, and cookies all in one bespoke velvet case.',
      verifiedPurchase: true
    },
    {
      userName: 'Omer Farooq',
      userEmail: 'omer.farooq@nyventures.com',
      rating: 5,
      comment: 'Ordered for our company milestone in Midtown. Saved us from having to order multiple separate desserts.',
      verifiedPurchase: true
    },
    {
      userName: 'Lillian Pierce',
      userEmail: 'lillian.pierce@centralparkwest.org',
      rating: 5,
      comment: 'Exceeded all expectations. The presentation alone makes you feel like royalty.',
      verifiedPurchase: true
    }
  ],
  'caramelized-autumn-pecan-tart': [
    {
      userName: 'Clayton Cooper',
      userEmail: 'clayton.cooper@georgiafarms.com',
      rating: 5,
      comment: 'Georgia pecans with bourbon maple caramel inside a crisp butter sablé. Smells like autumn heaven.',
      verifiedPurchase: true
    },
    {
      userName: 'Maria Hernandez',
      userEmail: 'm.hernandez@tribecadental.com',
      rating: 5,
      comment: 'Not overly sweet like commercial pies. Rich roasted pecan crunch and buttery crust.',
      verifiedPurchase: true
    },
    {
      userName: 'Danish Iqbal',
      userEmail: 'danish.iqbal@techpak.io',
      rating: 5,
      comment: 'A sensational dessert for chilly evenings. Warm it for 10 seconds with vanilla ice cream!',
      verifiedPurchase: true
    }
  ],
  'wild-berry-mascarpone-tart': [
    {
      userName: 'Sienna Del Rio',
      userEmail: 'sienna.delrio@fashionweek.com',
      rating: 5,
      comment: 'The fresh blackberries and raspberries glazed over light Italian mascarpone mousse are breathtaking.',
      verifiedPurchase: true
    },
    {
      userName: 'Faisal Jameel',
      userEmail: 'faisal.jameel@gmail.com',
      rating: 5,
      comment: 'Crisp pastry shell with fresh berry brightness. Perfect summer celebration tart.',
      verifiedPurchase: true
    },
    {
      userName: 'Rachel Greenburg',
      userEmail: 'rachel.greenburg@nycart.org',
      rating: 5,
      comment: 'Stunning ruby red presentation. Our guests could not stop taking pictures before digging in.',
      verifiedPurchase: true
    }
  ],
  'dark-cherry-black-forest-entremet': [
    {
      userName: 'Hans Gruber-Schmidt',
      userEmail: 'hans.schmidt@munichgourmet.de',
      rating: 5,
      comment: 'Authentic Schwarzwälder style with sour Morello cherries and real Kirsch essence. Outstanding.',
      verifiedPurchase: true
    },
    {
      userName: 'Maryam Nawaz',
      userEmail: 'maryam.nawaz@lahoredelights.pk',
      rating: 5,
      comment: 'Chocolate blossom shavings with tart cherry compote. Rich, fluffy, and immensely satisfying!',
      verifiedPurchase: true
    },
    {
      userName: 'Felix Baum',
      userEmail: 'felix.baum@swissconsulting.ch',
      rating: 5,
      comment: 'Glossy mirror glaze and layered mousse. Top-tier pastry artistry in New York.',
      verifiedPurchase: true
    }
  ],
  'passionfruit-mango-mousse-dome': [
    {
      userName: 'Priya Sharma',
      userEmail: 'priya.sharma@delhiculinary.in',
      rating: 5,
      comment: 'Tropical mango mousse with tangy passion fruit curd center. So refreshing, vibrant and exotic!',
      verifiedPurchase: true
    },
    {
      userName: 'Nabeel Shah',
      userEmail: 'nabeel.shah@nycrealty.com',
      rating: 5,
      comment: 'The yellow mirror glaze is hypnotic. Tart, sweet, and feather light after a heavy dinner.',
      verifiedPurchase: true
    },
    {
      userName: 'Gabriel Santos',
      userEmail: 'gabriel.santos@riodesign.br',
      rating: 5,
      comment: 'Almond joconde sponge base gives the perfect texture foundation to the velvety tropical mousse.',
      verifiedPurchase: true
    }
  ]
};

export async function getSeedData() {
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('VelvetAdmin2026!', salt);
  const customerPasswordHash = await bcrypt.hash('CustomerPass2026!', salt);

  const ownerUser = {
    id: 'usr-owner-001',
    name: 'Rana Amir Shahzad (Store Owner & Master Patissier)',
    email: 'ranaamirshahzad630@gmail.com',
    passwordHash: adminPasswordHash,
    phone: '+1 (212) 555-0187',
    role: 'ADMIN' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  };

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
    ownerUser,
    adminUser,
    demoCustomer,
    flavors: INITIAL_FLAVORS,
    products: INITIAL_PRODUCTS
  };
}
