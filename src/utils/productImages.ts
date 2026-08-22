import { Product } from '../types.ts';

export const DEFAULT_CAKE_IMAGE = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80';

export const PRODUCT_FALLBACK_IMAGES: Record<string, string> = {
  'signature-velvet-noir': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80',
  'grand-red-velvet-royale': 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=1000&q=80',
  'lotus-biscoff-dream-cake': 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=1000&q=80',
  'strawberry-velvet-shortcake': 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1000&q=80',
  'chocoholic-hazelnut-praline': 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1000&q=80',
  'matcha-pistachio-opera-cake': 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=1000&q=80',
  'lexington-elegance-tiered-cake': 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1000&q=80',
  'manhattan-flora-bridal-cake': 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=80',
  'vintage-lambeth-victorian-wedding-tier': 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=1000&q=80',
  'botanical-blossom-3-tier-grand-cake': 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1000&q=80',
  'golden-radiance-pearl-wedding-cake': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1000&q=80',
  'chantilly-cascade-2-tier-celebration-cake': 'https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?auto=format&fit=crop&w=1000&q=80',
  'artisan-cupcake-collection-12': 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=1000&q=80',
  'parisian-macaron-gift-box': 'https://images.unsplash.com/photo-1570476922354-81227cdbb76c?auto=format&fit=crop&w=1000&q=80',
  'gourmet-brownie-ensemble': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1000&q=80',
  'petite-velvet-cupcake-bouquet-6': 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=1000&q=80',
  'french-madeleine-sable-gift-box': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1000&q=80',
  'assorted-eclair-tartlet-flight-8': 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=1000&q=80',
  'classic-ny-baked-cheesecake': 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=1000&q=80',
  'manhattan-celebration-dessert-box': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
  'caramelized-autumn-pecan-tart': 'https://images.unsplash.com/photo-1514056052883-d017fddd0426?auto=format&fit=crop&w=1000&q=80',
  'wild-berry-mascarpone-tart': 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=1000&q=80',
  'dark-cherry-black-forest-entremet': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1000&q=80',
  'passionfruit-mango-mousse-dome': 'https://images.unsplash.com/photo-1508737804141-4c3b688e2546?auto=format&fit=crop&w=1000&q=80',
};

export function getProductImageUrl(product?: Partial<Product> | null): string {
  if (!product) return DEFAULT_CAKE_IMAGE;
  
  // Direct imageUrl
  if (product.imageUrl && typeof product.imageUrl === 'string' && product.imageUrl.trim().length > 5) {
    return product.imageUrl;
  }
  
  // Any alias fields that might have been deserialized
  const anyProd = product as any;
  if (anyProd.image_url && typeof anyProd.image_url === 'string' && anyProd.image_url.trim().length > 5) {
    return anyProd.image_url;
  }
  if (anyProd.image && typeof anyProd.image === 'string' && anyProd.image.trim().length > 5) {
    return anyProd.image;
  }

  // Check slug lookup
  if (product.slug && PRODUCT_FALLBACK_IMAGES[product.slug]) {
    return PRODUCT_FALLBACK_IMAGES[product.slug];
  }

  // Check name lookup
  if (product.name) {
    const slugFromName = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    for (const [key, url] of Object.entries(PRODUCT_FALLBACK_IMAGES)) {
      if (slugFromName.includes(key) || key.includes(slugFromName)) {
        return url;
      }
    }
  }

  return DEFAULT_CAKE_IMAGE;
}
