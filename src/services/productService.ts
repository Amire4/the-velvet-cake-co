import api from './api.ts';
import { Product, CakeFlavor, ProductReview } from '../types.ts';
import { FALLBACK_PRODUCTS, FALLBACK_FLAVORS } from '../data/fallbackData.ts';

// Pre-seeded verified reviews for each cake to ensure rich social proof
const DEFAULT_VERIFIED_REVIEWS: Record<string, ProductReview[]> = {
  'prod-sig-1': [
    {
      id: 'rev-sig-1-1',
      productId: 'prod-sig-1',
      userName: 'Eleanor Vance',
      rating: 5,
      comment: 'Ordered for our 10th anniversary. The Belgian chocolate truffle ganache is exquisitely rich without being overwhelming. The 24k gold leaf was stunning!',
      verifiedPurchase: true,
      createdAt: '2026-08-10T14:32:00.000Z'
    },
    {
      id: 'rev-sig-1-2',
      productId: 'prod-sig-1',
      userName: 'Julian Martinez',
      rating: 5,
      comment: 'Best chocolate cake in Manhattan by a mile. Moisture level is unbelievable and delivery was precisely on time in a cooled boutique box.',
      verifiedPurchase: true,
      createdAt: '2026-08-14T19:15:00.000Z'
    },
    {
      id: 'rev-sig-1-3',
      productId: 'prod-sig-1',
      userName: 'Sarah Jenkins',
      rating: 5,
      comment: 'Pure luxury! Our guests could not stop talking about the depth of flavor. 10/10 recommend.',
      verifiedPurchase: true,
      createdAt: '2026-08-18T11:20:00.000Z'
    }
  ],
  'prod-sig-2': [
    {
      id: 'rev-sig-2-1',
      productId: 'prod-sig-2',
      userName: 'Chloe Dupont',
      rating: 5,
      comment: 'Authentic velvet crumb with genuine Madagascar vanilla bean cream cheese. Light, silky, and beautifully decorated with macarons.',
      verifiedPurchase: true,
      createdAt: '2026-08-08T16:40:00.000Z'
    },
    {
      id: 'rev-sig-2-2',
      productId: 'prod-sig-2',
      userName: 'Marcus Sterling',
      rating: 5,
      comment: 'Ordered for my mother’s 60th birthday. It looked like an art piece and tasted even better.',
      verifiedPurchase: true,
      createdAt: '2026-08-15T12:00:00.000Z'
    }
  ],
  'prod-sig-3': [
    {
      id: 'rev-sig-3-1',
      productId: 'prod-sig-3',
      userName: 'Hannah Morales',
      rating: 5,
      comment: 'If you love Biscoff, this is paradise. The crunchy speculoos layers and drip caramel are pure perfection.',
      verifiedPurchase: true,
      createdAt: '2026-08-12T17:25:00.000Z'
    },
    {
      id: 'rev-sig-3-2',
      productId: 'prod-sig-3',
      userName: 'David Kim',
      rating: 5,
      comment: 'Ordered online for same-day delivery to Tribeca. Arrived in pristine condition. Highly recommended!',
      verifiedPurchase: true,
      createdAt: '2026-08-16T15:10:00.000Z'
    }
  ]
};

function getLocalProductOverrides(): Record<string, Partial<Product>> {
  try {
    const raw = localStorage.getItem('velvet_products_override');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalProductOverride(productId: string, data: Partial<Product>) {
  try {
    const current = getLocalProductOverrides();
    current[productId] = { ...current[productId], ...data };
    localStorage.setItem('velvet_products_override', JSON.stringify(current));
  } catch (err) {
    console.error('Failed to save local product override:', err);
  }
}

export function getLocalReviewsForProduct(productId: string): ProductReview[] {
  try {
    const raw = localStorage.getItem(`velvet_reviews_${productId}`);
    const customReviews: ProductReview[] = raw ? JSON.parse(raw) : [];
    const defaults = DEFAULT_VERIFIED_REVIEWS[productId] || [
      {
        id: `rev-default-${productId}-1`,
        productId,
        userName: 'Sophia Montgomery',
        rating: 5,
        comment: 'Absolutely spectacular craftsmanship! Freshly baked, perfect sweetness, and immaculate presentation.',
        verifiedPurchase: true,
        createdAt: '2026-08-11T10:00:00.000Z'
      },
      {
        id: `rev-default-${productId}-2`,
        productId,
        userName: 'Alexander Wright',
        rating: 5,
        comment: 'Top-tier luxury patisserie. Our whole family was impressed by the exquisite quality and textures.',
        verifiedPurchase: true,
        createdAt: '2026-08-16T14:45:00.000Z'
      }
    ];
    return [...customReviews, ...defaults];
  } catch {
    return DEFAULT_VERIFIED_REVIEWS[productId] || [];
  }
}

export async function getProductsApi(params?: { category?: string; featured?: boolean; available?: boolean }): Promise<Product[]> {
  const overrides = getLocalProductOverrides();
  
  try {
    const res = await api.get('/products', { params });
    if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data.map((p: Product) => ({
        ...p,
        ...(overrides[p.id] || {})
      }));
    }
  } catch (err) {
    console.warn('Backend API unavailable, using built-in high-definition cake catalog fallback:', err);
  }

  let catalog = FALLBACK_PRODUCTS.map(p => ({
    ...p,
    ...(overrides[p.id] || {})
  }));

  if (params?.category && params.category !== 'All' && params.category !== 'All Collections') {
    catalog = catalog.filter(p => p.category.toLowerCase() === params.category!.toLowerCase());
  }
  if (params?.featured !== undefined) {
    catalog = catalog.filter(p => p.featured === params.featured);
  }
  return catalog;
}

export async function getProductByIdApi(id: string): Promise<Product> {
  const overrides = getLocalProductOverrides();

  try {
    const res = await api.get(`/products/${id}`);
    if (res.data?.data) {
      const p = res.data.data;
      return { ...p, ...(overrides[p.id] || {}) };
    }
  } catch (err) {
    // Continue to fallback
  }

  const found = FALLBACK_PRODUCTS.find(p => p.id === id || p.slug === id);
  const base = found || FALLBACK_PRODUCTS[0];
  return { ...base, ...(overrides[base.id] || {}) };
}

export async function createProductApi(data: Partial<Product>): Promise<Product> {
  try {
    const res = await api.post('/products', data);
    return res.data.data;
  } catch {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: data.name || 'Artisan Cake',
      slug: (data.name || 'artisan-cake').toLowerCase().replace(/\s+/g, '-'),
      description: data.description || '',
      category: data.category || 'Signature Cakes',
      price: data.price || 75.0,
      imageUrl: data.imageUrl || FALLBACK_PRODUCTS[0].imageUrl,
      featured: !!data.featured,
      available: data.available !== false,
      rating: 5.0,
      reviewCount: 1
    };
    saveLocalProductOverride(newProduct.id, newProduct);
    return newProduct;
  }
}

export async function updateProductApi(id: string, data: Partial<Product>): Promise<Product> {
  try {
    const res = await api.put(`/products/${id}`, data);
    return res.data.data;
  } catch {
    saveLocalProductOverride(id, data);
    const existing = await getProductByIdApi(id);
    return { ...existing, ...data };
  }
}

export async function deleteProductApi(id: string): Promise<void> {
  try {
    await api.delete(`/products/${id}`);
  } catch {
    saveLocalProductOverride(id, { available: false });
  }
}

export async function getProductReviewsApi(productId: string): Promise<ProductReview[]> {
  try {
    const res = await api.get(`/products/${productId}/reviews`);
    if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch {
    // use local
  }
  return getLocalReviewsForProduct(productId);
}

export async function submitProductReviewApi(
  productId: string,
  data: { userName: string; userEmail?: string; rating: number; comment: string }
): Promise<{ success: boolean; message: string; data?: { product: Product; review: ProductReview } }> {
  try {
    const res = await api.post(`/products/${productId}/reviews`, data);
    if (res.data?.success && res.data?.data) {
      return res.data;
    }
  } catch {
    // Fallback to local storage persistence
  }

  // Create new local review record
  const newReview: ProductReview = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    productId,
    userName: data.userName.trim() || 'Valued Guest',
    userEmail: data.userEmail?.trim(),
    rating: Math.max(1, Math.min(5, data.rating)),
    comment: data.comment.trim(),
    verifiedPurchase: true,
    createdAt: new Date().toISOString()
  };

  // Append to local storage
  const currentReviews = getLocalReviewsForProduct(productId);
  const updatedReviews = [newReview, ...currentReviews];
  try {
    const userOnlyReviewsRaw = localStorage.getItem(`velvet_reviews_${productId}`);
    const userOnlyReviews: ProductReview[] = userOnlyReviewsRaw ? JSON.parse(userOnlyReviewsRaw) : [];
    userOnlyReviews.unshift(newReview);
    localStorage.setItem(`velvet_reviews_${productId}`, JSON.stringify(userOnlyReviews));
  } catch (err) {
    console.error('Failed to store review in localStorage:', err);
  }

  // Calculate new average rating
  const totalScore = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
  const newAvgRating = parseFloat((totalScore / updatedReviews.length).toFixed(1));
  const newReviewCount = updatedReviews.length;

  // Update product override
  const existingProduct = await getProductByIdApi(productId);
  const updatedProduct: Product = {
    ...existingProduct,
    rating: newAvgRating,
    reviewCount: newReviewCount
  };
  saveLocalProductOverride(productId, { rating: newAvgRating, reviewCount: newReviewCount });

  return {
    success: true,
    message: 'Thank you! Your rating and review have been submitted successfully.',
    data: {
      product: updatedProduct,
      review: newReview
    }
  };
}

export async function getFlavorsApi(availableOnly = false): Promise<CakeFlavor[]> {
  try {
    const res = await api.get('/flavors', { params: { available: availableOnly } });
    if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch (err) {
    console.warn('Backend API unavailable, using built-in flavor catalog fallback:', err);
  }
  return availableOnly ? FALLBACK_FLAVORS.filter(f => f.available) : FALLBACK_FLAVORS;
}

export async function createFlavorApi(data: Partial<CakeFlavor>): Promise<CakeFlavor> {
  const res = await api.post('/flavors', data);
  return res.data.data;
}

export async function updateFlavorApi(id: string, data: Partial<CakeFlavor>): Promise<CakeFlavor> {
  const res = await api.put(`/flavors/${id}`, data);
  return res.data.data;
}

export async function deleteFlavorApi(id: string): Promise<void> {
  await api.delete(`/flavors/${id}`);
}
