import { getSeedData, PRODUCT_SPECIFIC_REVIEWS } from './seedData.ts';
import { getPostgresPool, initPostgresDatabase, isPostgresConnected } from '../db/postgres.ts';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string | null;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userEmail?: string;
  rating: number;
  comment: string;
  verifiedPurchase?: boolean;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  featured: boolean;
  available: boolean;
  rating?: number;
  reviewCount?: number;
  reviews?: ProductReview[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CakeFlavor {
  id: string;
  name: string;
  description: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomCakeRequest {
  id: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  cakeType: string;
  size: string;
  shape: string;
  tiers: number;
  flavor: string;
  filling: string;
  frosting: string;
  colors: string;
  theme?: string | null;
  message?: string | null;
  dietaryRequirement?: string | null;
  eventDate: Date;
  referenceImageUrl?: string | null;
  additionalNotes?: string | null;
  quotedPrice?: number | null;
  status: 'PENDING' | 'REVIEWING' | 'QUOTED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  customization?: string | null;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId?: string | null;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryMethod: string;
  deliveryAddress?: string | null;
  preferredDate: Date;
  customerNotes?: string | null;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItem[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'RESOLVED';
  createdAt: Date;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed: boolean;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'USER' | 'ASSISTANT';
  message: string;
  createdAt: Date;
}

export interface ChatConversation {
  id: string;
  userId?: string | null;
  sessionId: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
}

// Durable Store for Database Operations supporting PostgreSQL and In-Memory Fallback
class DatabaseStore {
  private users: User[] = [];
  private products: Product[] = [];
  private cakeFlavors: CakeFlavor[] = [];
  private customCakeRequests: CustomCakeRequest[] = [];
  private orders: Order[] = [];
  private orderItems: OrderItem[] = [];
  private contactMessages: ContactMessage[] = [];
  private newsletterSubscribers: NewsletterSubscriber[] = [];
  private chatConversations: ChatConversation[] = [];
  private chatMessages: ChatMessage[] = [];
  private productReviews: ProductReview[] = [];
  private initialized = false;

  public async init() {
    if (this.initialized) return;

    // Attempt PostgreSQL initialization
    await initPostgresDatabase();

    // Initialize Memory Store as fallback
    const seed = await getSeedData();

    this.users = [seed.ownerUser, seed.adminUser, seed.demoCustomer];
    
    this.cakeFlavors = seed.flavors.map((f, i) => ({
      id: `flv-${String(i + 1).padStart(3, '0')}`,
      name: f.name,
      description: f.description,
      available: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    this.products = seed.products.map((p, i) => {
      const prodId = `prod-${String(i + 1).padStart(3, '0')}`;
      const specificReviews = PRODUCT_SPECIFIC_REVIEWS[p.slug] || [];
      const reviewCount = p.reviewCount ?? (specificReviews.length || (24 + ((i * 11) % 25)));
      const rating = p.rating ?? 4.5;

      return {
        id: prodId,
        name: p.name,
        slug: p.slug,
        description: p.description,
        category: p.category,
        price: p.price,
        imageUrl: p.imageUrl,
        featured: p.featured,
        available: p.available,
        rating: Math.min(4.7, Math.max(3.0, rating)),
        reviewCount,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    // Seed per-product verified reviews
    this.products.forEach((prod, pIdx) => {
      const specificReviews = PRODUCT_SPECIFIC_REVIEWS[prod.slug] || [
        {
          userName: `Gourmet Patron #${pIdx + 1}`,
          userEmail: `patron${pIdx + 1}@manhattanpatisserie.com`,
          rating: Math.round(prod.rating || 4),
          comment: `Exquisite flavor, texture, and presentation for ${prod.name}!`,
          verifiedPurchase: true
        }
      ];

      specificReviews.forEach((rev, rIdx) => {
        this.productReviews.push({
          id: `rev-${prod.id}-${rIdx + 1}`,
          productId: prod.id,
          userName: rev.userName,
          userEmail: rev.userEmail,
          rating: rev.rating,
          comment: rev.comment,
          verifiedPurchase: rev.verifiedPurchase ?? true,
          createdAt: new Date(Date.now() - (rIdx + 1) * 86400000 * 2 - (pIdx * 3600000))
        });
      });
    });

    // Seed sample order
    const sampleOrderId = 'ord-001';
    const sampleProduct1 = this.products[0];
    const sampleProduct2 = this.products[4];

    const sampleOrder: Order = {
      id: sampleOrderId,
      userId: seed.demoCustomer.id,
      orderNumber: 'VLC-2026-00001',
      customerName: seed.demoCustomer.name,
      customerEmail: seed.demoCustomer.email,
      customerPhone: seed.demoCustomer.phone || '+1 (917) 555-0142',
      subtotal: 133.00,
      deliveryFee: 0.00,
      total: 133.00,
      deliveryMethod: 'SAME_DAY_MANHATTAN',
      deliveryAddress: '450 Lexington Ave, Suite 1204, Manhattan, NY 10017',
      preferredDate: new Date(Date.now() + 86400000),
      customerNotes: 'Please ring bell for 1204. Handle with utmost care.',
      paymentMethod: 'VISA',
      paymentStatus: 'PAID',
      orderStatus: 'PREPARING',
      createdAt: new Date(Date.now() - 3600000 * 4),
      updatedAt: new Date(),
      orderItems: []
    };

    const item1: OrderItem = {
      id: 'itm-001',
      orderId: sampleOrderId,
      productId: sampleProduct1.id,
      product: sampleProduct1,
      quantity: 1,
      unitPrice: sampleProduct1.price,
      customization: JSON.stringify({ flavor: 'Chocolate Truffle', size: '8-inch', message: 'Happy Anniversary David & Sophia!' }),
      createdAt: new Date()
    };

    const item2: OrderItem = {
      id: 'itm-002',
      orderId: sampleOrderId,
      productId: sampleProduct2.id,
      product: sampleProduct2,
      quantity: 1,
      unitPrice: sampleProduct2.price,
      customization: JSON.stringify({ flavor: 'Assorted Favorites', size: 'Box of 12' }),
      createdAt: new Date()
    };

    sampleOrder.orderItems = [item1, item2];
    this.orders.push(sampleOrder);
    this.orderItems.push(item1, item2);

    this.initialized = true;
  }

  // --- Users ---
  public async findUserByEmail(email: string): Promise<User | null> {
    await this.init();
    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        const res = await pool.query(
          'SELECT id, name, email, password_hash AS "passwordHash", phone, role, created_at AS "createdAt", updated_at AS "updatedAt" FROM users WHERE LOWER(email) = LOWER($1)',
          [email.trim()]
        );
        if (res.rows.length > 0) return res.rows[0];
      } catch (e) {
        console.warn('PostgreSQL findUserByEmail fallback:', e);
      }
    }
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  public async findUserById(id: string): Promise<User | null> {
    await this.init();
    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        const res = await pool.query(
          'SELECT id, name, email, password_hash AS "passwordHash", phone, role, created_at AS "createdAt", updated_at AS "updatedAt" FROM users WHERE id = $1',
          [id]
        );
        if (res.rows.length > 0) return res.rows[0];
      } catch (e) {
        console.warn('PostgreSQL findUserById fallback:', e);
      }
    }
    return this.users.find(u => u.id === id) || null;
  }

  public async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    await this.init();
    const id = `usr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const now = new Date();

    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        const res = await pool.query(
          `INSERT INTO users (id, name, email, password_hash, phone, role, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id, name, email, password_hash AS "passwordHash", phone, role, created_at AS "createdAt", updated_at AS "updatedAt"`,
          [id, data.name, data.email, data.passwordHash, data.phone || null, data.role, now, now]
        );
        if (res.rows.length > 0) {
          this.users.push(res.rows[0]);
          return res.rows[0];
        }
      } catch (e) {
        console.warn('PostgreSQL createUser fallback:', e);
      }
    }

    const newUser: User = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.users.push(newUser);
    return newUser;
  }

  public async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    await this.init();
    const now = new Date();

    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        const existing = await this.findUserById(id);
        if (existing) {
          const updated = { ...existing, ...data, updatedAt: now };
          await pool.query(
            `UPDATE users SET name = $1, phone = $2, role = $3, updated_at = $4 WHERE id = $5`,
            [updated.name, updated.phone || null, updated.role, now, id]
          );
          return updated;
        }
      } catch (e) {
        console.warn('PostgreSQL updateUser fallback:', e);
      }
    }

    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...data, updatedAt: now };
    return this.users[index];
  }

  public async getAllUsers(): Promise<User[]> {
    await this.init();
    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        const res = await pool.query(
          'SELECT id, name, email, password_hash AS "passwordHash", phone, role, created_at AS "createdAt", updated_at AS "updatedAt" FROM users ORDER BY created_at DESC'
        );
        if (res.rows.length > 0) return res.rows;
      } catch (e) {
        console.warn('PostgreSQL getAllUsers fallback:', e);
      }
    }
    return [...this.users];
  }

  // --- Products ---
  public async getAllProducts(filters?: { category?: string; featured?: boolean; availableOnly?: boolean }): Promise<Product[]> {
    await this.init();
    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        let query = 'SELECT id, name, slug, description, category, price::float, image_url AS "imageUrl", featured, available, rating::float, review_count AS "reviewCount", created_at AS "createdAt", updated_at AS "updatedAt" FROM products WHERE 1=1';
        const params: any[] = [];

        if (filters?.availableOnly) {
          params.push(true);
          query += ` AND available = $${params.length}`;
        }
        if (filters?.category && filters.category !== 'All') {
          params.push(filters.category.toLowerCase());
          query += ` AND LOWER(category) = $${params.length}`;
        }
        if (filters?.featured !== undefined) {
          params.push(filters.featured);
          query += ` AND featured = $${params.length}`;
        }

        query += ' ORDER BY featured DESC, created_at DESC';
        const res = await pool.query(query, params);
        if (res.rows.length > 0) return res.rows;
      } catch (e) {
        console.warn('PostgreSQL getAllProducts fallback:', e);
      }
    }

    let list = [...this.products];
    if (filters?.availableOnly) {
      list = list.filter(p => p.available);
    }
    if (filters?.category && filters.category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === filters.category!.toLowerCase());
    }
    if (filters?.featured !== undefined) {
      list = list.filter(p => p.featured === filters.featured);
    }
    return list;
  }

  public async getProductById(id: string): Promise<Product | null> {
    await this.init();
    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        const res = await pool.query(
          'SELECT id, name, slug, description, category, price::float, image_url AS "imageUrl", featured, available, rating::float, review_count AS "reviewCount", created_at AS "createdAt", updated_at AS "updatedAt" FROM products WHERE id = $1 OR slug = $1',
          [id]
        );
        if (res.rows.length > 0) return res.rows[0];
      } catch (e) {
        console.warn('PostgreSQL getProductById fallback:', e);
      }
    }
    return this.products.find(p => p.id === id || p.slug === id) || null;
  }

  public async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    await this.init();
    const id = `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const now = new Date();

    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        const res = await pool.query(
          `INSERT INTO products (id, name, slug, description, category, price, image_url, featured, available, rating, review_count, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           RETURNING id, name, slug, description, category, price::float, image_url AS "imageUrl", featured, available, rating::float, review_count AS "reviewCount", created_at AS "createdAt", updated_at AS "updatedAt"`,
          [id, data.name, data.slug, data.description, data.category, data.price, data.imageUrl, data.featured ?? false, data.available ?? true, data.rating || 5.0, data.reviewCount || 0, now, now]
        );
        if (res.rows.length > 0) {
          this.products.unshift(res.rows[0]);
          return res.rows[0];
        }
      } catch (e) {
        console.warn('PostgreSQL createProduct fallback:', e);
      }
    }

    const newProd: Product = {
      ...data,
      id,
      rating: data.rating || 5.0,
      reviewCount: data.reviewCount || 0,
      createdAt: now,
      updatedAt: now
    };
    this.products.unshift(newProd);
    return newProd;
  }

  public async updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
    await this.init();
    const now = new Date();

    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        const existing = await this.getProductById(id);
        if (existing) {
          const updated = { ...existing, ...data, updatedAt: now };
          await pool.query(
            `UPDATE products SET name = $1, description = $2, category = $3, price = $4, image_url = $5, featured = $6, available = $7, rating = $8, review_count = $9, updated_at = $10 WHERE id = $11`,
            [updated.name, updated.description, updated.category, updated.price, updated.imageUrl, updated.featured, updated.available, updated.rating, updated.reviewCount, now, existing.id]
          );
          return updated;
        }
      } catch (e) {
        console.warn('PostgreSQL updateProduct fallback:', e);
      }
    }

    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...data, updatedAt: now };
    return this.products[index];
  }

  public async deleteProduct(id: string): Promise<boolean> {
    await this.init();
    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        await pool.query('DELETE FROM products WHERE id = $1', [id]);
      } catch (e) {
        console.warn('PostgreSQL deleteProduct fallback:', e);
      }
    }
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }

  // --- Product Reviews ---
  public async getProductReviews(productId: string): Promise<ProductReview[]> {
    await this.init();
    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        const res = await pool.query(
          'SELECT id, product_id AS "productId", user_name AS "userName", user_email AS "userEmail", rating, comment, verified_purchase AS "verifiedPurchase", created_at AS "createdAt" FROM product_reviews WHERE product_id = $1 ORDER BY created_at DESC',
          [productId]
        );
        if (res.rows.length > 0) return res.rows;
      } catch (e) {
        console.warn('PostgreSQL getProductReviews fallback:', e);
      }
    }
    return this.productReviews
      .filter(r => r.productId === productId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public async addProductReview(productId: string, data: { userName: string; userEmail?: string; rating: number; comment: string; verifiedPurchase?: boolean }) {
    await this.init();
    const product = await this.getProductById(productId);
    if (!product) return null;

    const id = `rev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const now = new Date();
    const rating = Math.min(5, Math.max(1, Number(data.rating) || 5));

    const newReview: ProductReview = {
      id,
      productId: product.id,
      userName: data.userName || 'Valued Guest',
      userEmail: data.userEmail,
      rating,
      comment: data.comment || 'Wonderful artisanal cake!',
      verifiedPurchase: data.verifiedPurchase ?? true,
      createdAt: now
    };

    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        await pool.query(
          `INSERT INTO product_reviews (id, product_id, user_name, user_email, rating, comment, verified_purchase, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [id, product.id, newReview.userName, newReview.userEmail || null, rating, newReview.comment, newReview.verifiedPurchase, now]
        );

        const avgRes = await pool.query('SELECT AVG(rating)::float AS avg, COUNT(*)::int AS count FROM product_reviews WHERE product_id = $1', [product.id]);
        const avg = Number((avgRes.rows[0]?.avg || rating).toFixed(1));
        const count = avgRes.rows[0]?.count || 1;

        await pool.query('UPDATE products SET rating = $1, review_count = $2 WHERE id = $3', [avg, count, product.id]);

        return {
          review: newReview,
          product: { ...product, rating: avg, reviewCount: count }
        };
      } catch (e) {
        console.warn('PostgreSQL addProductReview fallback:', e);
      }
    }

    this.productReviews.unshift(newReview);
    const allProdReviews = this.productReviews.filter(r => r.productId === product.id);
    const sum = allProdReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = Number((sum / allProdReviews.length).toFixed(1));
    product.rating = avg;
    product.reviewCount = allProdReviews.length;

    return {
      review: newReview,
      product: { ...product, rating: avg, reviewCount: allProdReviews.length }
    };
  }

  // --- Cake Flavors ---
  public async getAllFlavors(availableOnly = false): Promise<CakeFlavor[]> {
    await this.init();
    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        const query = availableOnly
          ? 'SELECT id, name, description, available, created_at AS "createdAt", updated_at AS "updatedAt" FROM cake_flavors WHERE available = true ORDER BY name ASC'
          : 'SELECT id, name, description, available, created_at AS "createdAt", updated_at AS "updatedAt" FROM cake_flavors ORDER BY name ASC';
        const res = await pool.query(query);
        if (res.rows.length > 0) return res.rows;
      } catch (e) {
        console.warn('PostgreSQL getAllFlavors fallback:', e);
      }
    }

    if (availableOnly) {
      return this.cakeFlavors.filter(f => f.available);
    }
    return [...this.cakeFlavors];
  }

  public async createFlavor(data: Omit<CakeFlavor, 'id' | 'createdAt' | 'updatedAt'>): Promise<CakeFlavor> {
    await this.init();
    const id = `flv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const now = new Date();

    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        const res = await pool.query(
          `INSERT INTO cake_flavors (id, name, description, available, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, name, description, available, created_at AS "createdAt", updated_at AS "updatedAt"`,
          [id, data.name, data.description, data.available ?? true, now, now]
        );
        if (res.rows.length > 0) {
          this.cakeFlavors.push(res.rows[0]);
          return res.rows[0];
        }
      } catch (e) {
        console.warn('PostgreSQL createFlavor fallback:', e);
      }
    }

    const newFlv: CakeFlavor = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.cakeFlavors.push(newFlv);
    return newFlv;
  }

  public async updateFlavor(id: string, data: Partial<CakeFlavor>): Promise<CakeFlavor | null> {
    await this.init();
    const now = new Date();

    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        await pool.query(
          `UPDATE cake_flavors SET name = COALESCE($1, name), description = COALESCE($2, description), available = COALESCE($3, available), updated_at = $4 WHERE id = $5`,
          [data.name || null, data.description || null, data.available !== undefined ? data.available : null, now, id]
        );
      } catch (e) {
        console.warn('PostgreSQL updateFlavor fallback:', e);
      }
    }

    const index = this.cakeFlavors.findIndex(f => f.id === id);
    if (index === -1) return null;
    this.cakeFlavors[index] = { ...this.cakeFlavors[index], ...data, updatedAt: now };
    return this.cakeFlavors[index];
  }

  public async deleteFlavor(id: string): Promise<boolean> {
    await this.init();
    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        await pool.query('DELETE FROM cake_flavors WHERE id = $1', [id]);
      } catch (e) {
        console.warn('PostgreSQL deleteFlavor fallback:', e);
      }
    }
    const index = this.cakeFlavors.findIndex(f => f.id === id);
    if (index === -1) return false;
    this.cakeFlavors.splice(index, 1);
    return true;
  }

  // --- Orders ---
  public async createOrder(
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'orderItems'>,
    items: Array<{ productId: string; quantity: number; customization?: string }>
  ): Promise<Order> {
    await this.init();
    const count = this.orders.length + 1;
    const orderNumber = `VLC-${new Date().getFullYear()}-${String(count).padStart(5, '0')}`;
    const orderId = `ord-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const now = new Date();

    let calculatedSubtotal = 0;
    const createdItems: OrderItem[] = [];

    for (const itm of items) {
      const prod = await this.getProductById(itm.productId);
      if (!prod) continue;
      const unitPrice = prod.price;
      calculatedSubtotal += unitPrice * itm.quantity;

      const orderItem: OrderItem = {
        id: `itm-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        orderId,
        productId: prod.id,
        product: prod,
        quantity: itm.quantity,
        unitPrice,
        customization: itm.customization || null,
        createdAt: now
      };
      createdItems.push(orderItem);
      this.orderItems.push(orderItem);
    }

    let deliveryFee = 0;
    if (orderData.deliveryMethod === 'IN_STORE_PICKUP') {
      deliveryFee = 0;
    } else if (calculatedSubtotal >= 100) {
      deliveryFee = 0;
    } else {
      deliveryFee = orderData.deliveryMethod === 'SAME_DAY_MANHATTAN' ? 15.00 : 10.00;
    }

    const total = calculatedSubtotal + deliveryFee;

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      orderNumber,
      subtotal: calculatedSubtotal,
      deliveryFee,
      total,
      orderStatus: 'CONFIRMED',
      paymentStatus: 'PAID',
      createdAt: now,
      updatedAt: now,
      orderItems: createdItems
    };

    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        await pool.query(
          `INSERT INTO orders (id, user_id, order_number, customer_name, customer_email, customer_phone, subtotal, delivery_fee, total, delivery_method, delivery_address, preferred_date, customer_notes, payment_method, payment_status, order_status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
          [orderId, orderData.userId || null, orderNumber, orderData.customerName, orderData.customerEmail, orderData.customerPhone, calculatedSubtotal, deliveryFee, total, orderData.deliveryMethod, orderData.deliveryAddress || null, orderData.preferredDate, orderData.customerNotes || null, orderData.paymentMethod, 'PAID', 'CONFIRMED', now, now]
        );

        for (const itm of createdItems) {
          await pool.query(
            `INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, customization, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [itm.id, orderId, itm.productId, itm.quantity, itm.unitPrice, itm.customization || null, now]
          );
        }
      } catch (e) {
        console.warn('PostgreSQL createOrder fallback:', e);
      }
    }

    this.orders.unshift(newOrder);
    return newOrder;
  }

  public async getAllOrders(userId?: string): Promise<Order[]> {
    await this.init();
    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        const query = userId
          ? 'SELECT id, user_id AS "userId", order_number AS "orderNumber", customer_name AS "customerName", customer_email AS "customerEmail", customer_phone AS "customerPhone", subtotal::float, delivery_fee::float AS "deliveryFee", total::float, delivery_method AS "deliveryMethod", delivery_address AS "deliveryAddress", preferred_date AS "preferredDate", customer_notes AS "customerNotes", payment_method AS "paymentMethod", payment_status AS "paymentStatus", order_status AS "orderStatus", created_at AS "createdAt", updated_at AS "updatedAt" FROM orders WHERE user_id = $1 ORDER BY created_at DESC'
          : 'SELECT id, user_id AS "userId", order_number AS "orderNumber", customer_name AS "customerName", customer_email AS "customerEmail", customer_phone AS "customerPhone", subtotal::float, delivery_fee::float AS "deliveryFee", total::float, delivery_method AS "deliveryMethod", delivery_address AS "deliveryAddress", preferred_date AS "preferredDate", customer_notes AS "customerNotes", payment_method AS "paymentMethod", payment_status AS "paymentStatus", order_status AS "orderStatus", created_at AS "createdAt", updated_at AS "updatedAt" FROM orders ORDER BY created_at DESC';
        const res = await pool.query(query, userId ? [userId] : []);

        const orders: Order[] = [];
        for (const row of res.rows) {
          const itemsRes = await pool.query(
            'SELECT id, order_id AS "orderId", product_id AS "productId", quantity, unit_price::float AS "unitPrice", customization, created_at AS "createdAt" FROM order_items WHERE order_id = $1',
            [row.id]
          );
          const itemsWithProduct = await Promise.all(
            itemsRes.rows.map(async (itm: any) => ({
              ...itm,
              product: await this.getProductById(itm.productId)
            }))
          );
          orders.push({ ...row, orderItems: itemsWithProduct });
        }
        if (orders.length > 0) return orders;
      } catch (e) {
        console.warn('PostgreSQL getAllOrders fallback:', e);
      }
    }

    let list = [...this.orders];
    if (userId) {
      list = list.filter(o => o.userId === userId);
    }
    return list.map(order => ({
      ...order,
      orderItems: this.orderItems
        .filter(item => item.orderId === order.id)
        .map(item => ({
          ...item,
          product: this.products.find(p => p.id === item.productId)
        }))
    }));
  }

  public async getOrderById(id: string): Promise<Order | null> {
    await this.init();
    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        const res = await pool.query(
          'SELECT id, user_id AS "userId", order_number AS "orderNumber", customer_name AS "customerName", customer_email AS "customerEmail", customer_phone AS "customerPhone", subtotal::float, delivery_fee::float AS "deliveryFee", total::float, delivery_method AS "deliveryMethod", delivery_address AS "deliveryAddress", preferred_date AS "preferredDate", customer_notes AS "customerNotes", payment_method AS "paymentMethod", payment_status AS "paymentStatus", order_status AS "orderStatus", created_at AS "createdAt", updated_at AS "updatedAt" FROM orders WHERE id = $1 OR order_number = $1',
          [id]
        );
        if (res.rows.length > 0) {
          const row = res.rows[0];
          const itemsRes = await pool.query(
            'SELECT id, order_id AS "orderId", product_id AS "productId", quantity, unit_price::float AS "unitPrice", customization, created_at AS "createdAt" FROM order_items WHERE order_id = $1',
            [row.id]
          );
          const itemsWithProduct = await Promise.all(
            itemsRes.rows.map(async (itm: any) => ({
              ...itm,
              product: await this.getProductById(itm.productId)
            }))
          );
          return { ...row, orderItems: itemsWithProduct };
        }
      } catch (e) {
        console.warn('PostgreSQL getOrderById fallback:', e);
      }
    }

    const order = this.orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) return null;
    return {
      ...order,
      orderItems: this.orderItems
        .filter(item => item.orderId === order.id)
        .map(item => ({
          ...item,
          product: this.products.find(p => p.id === item.productId)
        }))
    };
  }

  public async getOrdersByEmailOrNumber(query: string): Promise<Order[]> {
    await this.init();
    const clean = query.trim().toLowerCase();

    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        const res = await pool.query(
          'SELECT id, user_id AS "userId", order_number AS "orderNumber", customer_name AS "customerName", customer_email AS "customerEmail", customer_phone AS "customerPhone", subtotal::float, delivery_fee::float AS "deliveryFee", total::float, delivery_method AS "deliveryMethod", delivery_address AS "deliveryAddress", preferred_date AS "preferredDate", customer_notes AS "customerNotes", payment_method AS "paymentMethod", payment_status AS "paymentStatus", order_status AS "orderStatus", created_at AS "createdAt", updated_at AS "updatedAt" FROM orders WHERE LOWER(order_number) = $1 OR LOWER(customer_email) = $1 OR customer_phone LIKE $2',
          [clean, `%${clean}%`]
        );

        const orders: Order[] = [];
        for (const row of res.rows) {
          const itemsRes = await pool.query(
            'SELECT id, order_id AS "orderId", product_id AS "productId", quantity, unit_price::float AS "unitPrice", customization, created_at AS "createdAt" FROM order_items WHERE order_id = $1',
            [row.id]
          );
          const itemsWithProduct = await Promise.all(
            itemsRes.rows.map(async (itm: any) => ({
              ...itm,
              product: await this.getProductById(itm.productId)
            }))
          );
          orders.push({ ...row, orderItems: itemsWithProduct });
        }
        if (orders.length > 0) return orders;
      } catch (e) {
        console.warn('PostgreSQL getOrdersByEmailOrNumber fallback:', e);
      }
    }

    const matches = this.orders.filter(o =>
      o.orderNumber.toLowerCase() === clean ||
      o.customerEmail.toLowerCase() === clean ||
      (o.customerPhone && o.customerPhone.includes(clean))
    );

    return matches.map(order => ({
      ...order,
      orderItems: this.orderItems
        .filter(item => item.orderId === order.id)
        .map(item => ({
          ...item,
          product: this.products.find(p => p.id === item.productId)
        }))
    }));
  }

  public async updateOrderStatus(id: string, orderStatus: Order['orderStatus'], paymentStatus?: Order['paymentStatus']): Promise<Order | null> {
    await this.init();
    const now = new Date();

    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        await pool.query(
          'UPDATE orders SET order_status = $1, payment_status = COALESCE($2, payment_status), updated_at = $3 WHERE id = $4 OR order_number = $4',
          [orderStatus, paymentStatus || null, now, id]
        );
      } catch (e) {
        console.warn('PostgreSQL updateOrderStatus fallback:', e);
      }
    }

    const index = this.orders.findIndex(o => o.id === id || o.orderNumber === id);
    if (index === -1) return null;
    this.orders[index].orderStatus = orderStatus;
    if (paymentStatus) {
      this.orders[index].paymentStatus = paymentStatus;
    }
    this.orders[index].updatedAt = now;
    return this.orders[index];
  }

  // --- Custom Cake Requests ---
  public async createCustomCakeRequest(data: Omit<CustomCakeRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'quotedPrice'>): Promise<CustomCakeRequest> {
    await this.init();
    const id = `req-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const now = new Date();

    const newReq: CustomCakeRequest = {
      ...data,
      id,
      status: 'PENDING',
      quotedPrice: null,
      createdAt: now,
      updatedAt: now
    };

    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        await pool.query(
          `INSERT INTO custom_cake_requests (id, user_id, customer_name, customer_email, customer_phone, cake_type, size, shape, tiers, flavor, filling, frosting, colors, theme, message, dietary_requirement, event_date, reference_image_url, additional_notes, quoted_price, status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)`,
          [id, data.userId || null, data.customerName, data.customerEmail, data.customerPhone, data.cakeType, data.size, data.shape, data.tiers || 1, data.flavor, data.filling, data.frosting, data.colors, data.theme || null, data.message || null, data.dietaryRequirement || null, data.eventDate, data.referenceImageUrl || null, data.additionalNotes || null, null, 'PENDING', now, now]
        );
      } catch (e) {
        console.warn('PostgreSQL createCustomCakeRequest fallback:', e);
      }
    }

    this.customCakeRequests.unshift(newReq);
    return newReq;
  }

  public async getAllCustomCakeRequests(userId?: string): Promise<CustomCakeRequest[]> {
    await this.init();
    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        const query = userId
          ? 'SELECT id, user_id AS "userId", customer_name AS "customerName", customer_email AS "customerEmail", customer_phone AS "customerPhone", cake_type AS "cakeType", size, shape, tiers, flavor, filling, frosting, colors, theme, message, dietary_requirement AS "dietaryRequirement", event_date AS "eventDate", reference_image_url AS "referenceImageUrl", additional_notes AS "additionalNotes", quoted_price::float AS "quotedPrice", status, created_at AS "createdAt", updated_at AS "updatedAt" FROM custom_cake_requests WHERE user_id = $1 ORDER BY created_at DESC'
          : 'SELECT id, user_id AS "userId", customer_name AS "customerName", customer_email AS "customerEmail", customer_phone AS "customerPhone", cake_type AS "cakeType", size, shape, tiers, flavor, filling, frosting, colors, theme, message, dietary_requirement AS "dietaryRequirement", event_date AS "eventDate", reference_image_url AS "referenceImageUrl", additional_notes AS "additionalNotes", quoted_price::float AS "quotedPrice", status, created_at AS "createdAt", updated_at AS "updatedAt" FROM custom_cake_requests ORDER BY created_at DESC';
        const res = await pool.query(query, userId ? [userId] : []);
        if (res.rows.length > 0) return res.rows;
      } catch (e) {
        console.warn('PostgreSQL getAllCustomCakeRequests fallback:', e);
      }
    }

    if (userId) {
      return this.customCakeRequests.filter(r => r.userId === userId);
    }
    return [...this.customCakeRequests];
  }

  public async getCustomCakeRequestById(id: string): Promise<CustomCakeRequest | null> {
    await this.init();
    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        const res = await pool.query(
          'SELECT id, user_id AS "userId", customer_name AS "customerName", customer_email AS "customerEmail", customer_phone AS "customerPhone", cake_type AS "cakeType", size, shape, tiers, flavor, filling, frosting, colors, theme, message, dietary_requirement AS "dietaryRequirement", event_date AS "eventDate", reference_image_url AS "referenceImageUrl", additional_notes AS "additionalNotes", quoted_price::float AS "quotedPrice", status, created_at AS "createdAt", updated_at AS "updatedAt" FROM custom_cake_requests WHERE id = $1',
          [id]
        );
        if (res.rows.length > 0) return res.rows[0];
      } catch (e) {
        console.warn('PostgreSQL getCustomCakeRequestById fallback:', e);
      }
    }
    return this.customCakeRequests.find(r => r.id === id) || null;
  }

  public async updateCustomCakeStatus(id: string, status: CustomCakeRequest['status'], quotedPrice?: number): Promise<CustomCakeRequest | null> {
    await this.init();
    const now = new Date();

    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        await pool.query(
          'UPDATE custom_cake_requests SET status = $1, quoted_price = COALESCE($2, quoted_price), updated_at = $3 WHERE id = $4',
          [status, quotedPrice !== undefined ? quotedPrice : null, now, id]
        );
      } catch (e) {
        console.warn('PostgreSQL updateCustomCakeStatus fallback:', e);
      }
    }

    const index = this.customCakeRequests.findIndex(r => r.id === id);
    if (index === -1) return null;
    this.customCakeRequests[index].status = status;
    if (quotedPrice !== undefined) {
      this.customCakeRequests[index].quotedPrice = quotedPrice;
    }
    this.customCakeRequests[index].updatedAt = now;
    return this.customCakeRequests[index];
  }

  // --- Contact Messages ---
  public async createContactMessage(data: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): Promise<ContactMessage> {
    await this.init();
    const id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const now = new Date();

    const newMsg: ContactMessage = {
      ...data,
      id,
      status: 'NEW',
      createdAt: now
    };

    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        await pool.query(
          `INSERT INTO contact_messages (id, name, email, phone, subject, message, status, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [id, data.name, data.email, data.phone || null, data.subject, data.message, 'NEW', now]
        );
      } catch (e) {
        console.warn('PostgreSQL createContactMessage fallback:', e);
      }
    }

    this.contactMessages.unshift(newMsg);
    return newMsg;
  }

  public async getAllContactMessages(): Promise<ContactMessage[]> {
    await this.init();
    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        const res = await pool.query('SELECT id, name, email, phone, subject, message, status, created_at AS "createdAt" FROM contact_messages ORDER BY created_at DESC');
        if (res.rows.length > 0) return res.rows;
      } catch (e) {
        console.warn('PostgreSQL getAllContactMessages fallback:', e);
      }
    }
    return [...this.contactMessages];
  }

  public async updateContactStatus(id: string, status: ContactMessage['status']): Promise<ContactMessage | null> {
    await this.init();
    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        await pool.query('UPDATE contact_messages SET status = $1 WHERE id = $2', [status, id]);
      } catch (e) {
        console.warn('PostgreSQL updateContactStatus fallback:', e);
      }
    }
    const index = this.contactMessages.findIndex(m => m.id === id);
    if (index === -1) return null;
    this.contactMessages[index].status = status;
    return this.contactMessages[index];
  }

  // --- Newsletter ---
  public async addNewsletterSubscriber(email: string): Promise<NewsletterSubscriber> {
    await this.init();
    const cleanEmail = email.toLowerCase();
    const now = new Date();

    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        const id = `sub-${Date.now()}`;
        await pool.query(
          `INSERT INTO newsletter_subscribers (id, email, subscribed, created_at)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (email) DO UPDATE SET subscribed = true`,
          [id, cleanEmail, true, now]
        );
        return { id, email: cleanEmail, subscribed: true, createdAt: now };
      } catch (e) {
        console.warn('PostgreSQL addNewsletterSubscriber fallback:', e);
      }
    }

    const existing = this.newsletterSubscribers.find(s => s.email.toLowerCase() === cleanEmail);
    if (existing) {
      existing.subscribed = true;
      return existing;
    }
    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: cleanEmail,
      subscribed: true,
      createdAt: now
    };
    this.newsletterSubscribers.unshift(newSub);
    return newSub;
  }

  public async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    await this.init();
    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        const res = await pool.query('SELECT id, email, subscribed, created_at AS "createdAt" FROM newsletter_subscribers ORDER BY created_at DESC');
        if (res.rows.length > 0) return res.rows;
      } catch (e) {
        console.warn('PostgreSQL getNewsletterSubscribers fallback:', e);
      }
    }
    return [...this.newsletterSubscribers];
  }

  // --- Chat Conversations ---
  public async getOrCreateChatConversation(sessionId: string, userId?: string): Promise<ChatConversation> {
    await this.init();
    const now = new Date();

    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        const res = await pool.query(
          'SELECT id, user_id AS "userId", session_id AS "sessionId", created_at AS "createdAt", updated_at AS "updatedAt" FROM chat_conversations WHERE session_id = $1',
          [sessionId]
        );
        if (res.rows.length > 0) {
          const conv = res.rows[0];
          const msgRes = await pool.query(
            'SELECT id, conversation_id AS "conversationId", role, message, created_at AS "createdAt" FROM chat_messages WHERE conversation_id = $1 ORDER BY created_at ASC',
            [conv.id]
          );
          return { ...conv, messages: msgRes.rows };
        } else {
          const id = `conv-${Date.now()}`;
          await pool.query(
            'INSERT INTO chat_conversations (id, user_id, session_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)',
            [id, userId || null, sessionId, now, now]
          );
          return { id, userId: userId || null, sessionId, createdAt: now, updatedAt: now, messages: [] };
        }
      } catch (e) {
        console.warn('PostgreSQL getOrCreateChatConversation fallback:', e);
      }
    }

    let conv = this.chatConversations.find(c => c.sessionId === sessionId);
    if (!conv) {
      conv = {
        id: `conv-${Date.now()}`,
        sessionId,
        userId: userId || null,
        createdAt: now,
        updatedAt: now,
        messages: []
      };
      this.chatConversations.push(conv);
    }
    return conv;
  }

  public async addChatMessage(sessionId: string, role: 'USER' | 'ASSISTANT', message: string, userId?: string): Promise<ChatMessage> {
    const conv = await this.getOrCreateChatConversation(sessionId, userId);
    const now = new Date();
    const id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const newMsg: ChatMessage = {
      id,
      conversationId: conv.id,
      role,
      message,
      createdAt: now
    };

    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        await pool.query(
          'INSERT INTO chat_messages (id, conversation_id, role, message, created_at) VALUES ($1, $2, $3, $4, $5)',
          [id, conv.id, role, message, now]
        );
        await pool.query('UPDATE chat_conversations SET updated_at = $1 WHERE id = $2', [now, conv.id]);
      } catch (e) {
        console.warn('PostgreSQL addChatMessage fallback:', e);
      }
    }

    conv.messages.push(newMsg);
    conv.updatedAt = now;
    this.chatMessages.push(newMsg);
    return newMsg;
  }

  public async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    const conv = await this.getOrCreateChatConversation(sessionId);
    return conv.messages;
  }

  // --- Analytics / Admin Stats ---
  public async getAdminStats() {
    await this.init();

    if (isPostgresConnected()) {
      try {
        const pool = getPostgresPool();
        const ordersRes = await pool.query('SELECT total::float, order_status FROM orders');
        const totalOrders = ordersRes.rows.length;
        const totalSales = ordersRes.rows.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);
        const pendingOrders = ordersRes.rows.filter((o: any) => o.order_status === 'PENDING' || o.order_status === 'CONFIRMED' || o.order_status === 'PREPARING').length;
        const completedOrders = ordersRes.rows.filter((o: any) => o.order_status === 'COMPLETED').length;

        const usersRes = await pool.query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'CUSTOMER'");
        const totalCustomers = usersRes.rows[0]?.count || 0;

        const cakesRes = await pool.query('SELECT status FROM custom_cake_requests');
        const customCakeRequests = cakesRes.rows.length;
        const pendingCustomCakes = cakesRes.rows.filter((r: any) => r.status === 'PENDING' || r.status === 'REVIEWING').length;

        const msgRes = await pool.query("SELECT COUNT(*)::int AS count FROM contact_messages WHERE status = 'NEW'");
        const unreadMessages = msgRes.rows[0]?.count || 0;

        return {
          totalSales,
          totalOrders,
          pendingOrders,
          completedOrders,
          totalCustomers,
          customCakeRequests,
          pendingCustomCakes,
          unreadMessages
        };
      } catch (e) {
        console.warn('PostgreSQL getAdminStats fallback:', e);
      }
    }

    const totalOrders = this.orders.length;
    const totalSales = this.orders.reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = this.orders.filter(o => o.orderStatus === 'PENDING' || o.orderStatus === 'CONFIRMED' || o.orderStatus === 'PREPARING').length;
    const completedOrders = this.orders.filter(o => o.orderStatus === 'COMPLETED').length;
    const totalCustomers = this.users.filter(u => u.role === 'CUSTOMER').length;
    const customCakeRequests = this.customCakeRequests.length;
    const pendingCustomCakes = this.customCakeRequests.filter(r => r.status === 'PENDING' || r.status === 'REVIEWING').length;
    const unreadMessages = this.contactMessages.filter(m => m.status === 'NEW').length;

    return {
      totalSales,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalCustomers,
      customCakeRequests,
      pendingCustomCakes,
      unreadMessages
    };
  }
}

export const db = new DatabaseStore();
