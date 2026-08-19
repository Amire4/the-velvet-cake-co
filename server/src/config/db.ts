import { getSeedData } from './seedData.ts';

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

// In-Memory Durable Store for Database Operations
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
  private initialized = false;

  public async init() {
    if (this.initialized) return;
    const seed = await getSeedData();

    this.users = [seed.adminUser, seed.demoCustomer];
    
    this.cakeFlavors = seed.flavors.map((f, i) => ({
      id: `flv-${String(i + 1).padStart(3, '0')}`,
      name: f.name,
      description: f.description,
      available: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    this.products = seed.products.map((p, i) => ({
      id: `prod-${String(i + 1).padStart(3, '0')}`,
      name: p.name,
      slug: p.slug,
      description: p.description,
      category: p.category,
      price: p.price,
      imageUrl: p.imageUrl,
      featured: p.featured,
      available: p.available,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Seed a sample order for demo customer
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
      deliveryFee: 0.00, // free over $100
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

    // Seed sample custom cake request
    this.customCakeRequests.push({
      id: 'req-001',
      userId: seed.demoCustomer.id,
      customerName: 'Sophia Montgomery',
      customerEmail: 'customer@example.com',
      customerPhone: '+1 (917) 555-0142',
      cakeType: 'Wedding Cake',
      size: 'Multi-tier (75-90 servings)',
      shape: 'Round',
      tiers: 3,
      flavor: 'Vanilla Bean & Raspberry Vanilla',
      filling: 'Madagascar Vanilla Bean & Tart Raspberry Coulis',
      frosting: 'Textured Ivory Swiss Meringue Buttercream',
      colors: 'Ivory, Blush Pink, and Brushed 24k Gold',
      theme: 'Modern Manhattan Botanical Garden',
      message: 'Forever & Always S & D',
      dietaryRequirement: 'Standard (Nut-free on top tier)',
      eventDate: new Date(Date.now() + 86400000 * 20),
      referenceImageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1000&q=80',
      additionalNotes: 'Need delivery to The Glasshouse Manhattan at 3:00 PM on event day.',
      quotedPrice: 420.00,
      status: 'QUOTED',
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date()
    });

    // Seed sample contact message
    this.contactMessages.push({
      id: 'msg-001',
      name: 'Victoria Hastings',
      email: 'victoria.hastings@metevents.com',
      phone: '+1 (212) 555-0899',
      subject: 'Corporate Gala Dessert Table for 250 Guests',
      message: 'Hello Velvet Cake Co. team! We are organizing a charity gala on Fifth Ave next month and would love to consult regarding custom branded dessert boxes and a centerpiece cake.',
      status: 'NEW',
      createdAt: new Date(Date.now() - 3600000 * 6)
    });

    this.initialized = true;
  }

  // --- Users ---
  public async findUserByEmail(email: string) {
    await this.init();
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public async findUserById(id: string) {
    await this.init();
    return this.users.find(u => u.id === id);
  }

  public async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    await this.init();
    const newUser: User = {
      ...data,
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  public async updateUser(id: string, data: Partial<User>) {
    await this.init();
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...data, updatedAt: new Date() };
    return this.users[index];
  }

  public async getAllUsers() {
    await this.init();
    return [...this.users];
  }

  // --- Products ---
  public async getAllProducts(filters?: { category?: string; featured?: boolean; availableOnly?: boolean }) {
    await this.init();
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

  public async getProductById(id: string) {
    await this.init();
    return this.products.find(p => p.id === id || p.slug === id);
  }

  public async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    await this.init();
    const newProd: Product = {
      ...data,
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.unshift(newProd);
    return newProd;
  }

  public async updateProduct(id: string, data: Partial<Product>) {
    await this.init();
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...data, updatedAt: new Date() };
    return this.products[index];
  }

  public async deleteProduct(id: string) {
    await this.init();
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }

  // --- Cake Flavors ---
  public async getAllFlavors(availableOnly = false) {
    await this.init();
    if (availableOnly) {
      return this.cakeFlavors.filter(f => f.available);
    }
    return [...this.cakeFlavors];
  }

  public async createFlavor(data: Omit<CakeFlavor, 'id' | 'createdAt' | 'updatedAt'>) {
    await this.init();
    const newFlv: CakeFlavor = {
      ...data,
      id: `flv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.cakeFlavors.push(newFlv);
    return newFlv;
  }

  public async updateFlavor(id: string, data: Partial<CakeFlavor>) {
    await this.init();
    const index = this.cakeFlavors.findIndex(f => f.id === id);
    if (index === -1) return null;
    this.cakeFlavors[index] = { ...this.cakeFlavors[index], ...data, updatedAt: new Date() };
    return this.cakeFlavors[index];
  }

  public async deleteFlavor(id: string) {
    await this.init();
    const index = this.cakeFlavors.findIndex(f => f.id === id);
    if (index === -1) return false;
    this.cakeFlavors.splice(index, 1);
    return true;
  }

  // --- Orders ---
  public async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'orderItems'>, items: Array<{ productId: string; quantity: number; customization?: string }>) {
    await this.init();
    const count = this.orders.length + 1;
    const orderNumber = `VLC-${new Date().getFullYear()}-${String(count).padStart(5, '0')}`;
    const orderId = `ord-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    let calculatedSubtotal = 0;
    const createdItems: OrderItem[] = [];

    for (const itm of items) {
      const prod = this.products.find(p => p.id === itm.productId);
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
        createdAt: new Date()
      };
      createdItems.push(orderItem);
      this.orderItems.push(orderItem);
    }

    // Free delivery over $100, otherwise $8 to $20 depending on method
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
      paymentStatus: 'PAID', // In demo/checkout flow, auto-clears
      createdAt: new Date(),
      updatedAt: new Date(),
      orderItems: createdItems
    };

    this.orders.unshift(newOrder);
    return newOrder;
  }

  public async getAllOrders(userId?: string) {
    await this.init();
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

  public async getOrderById(id: string) {
    await this.init();
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

  public async getOrdersByEmailOrNumber(query: string) {
    await this.init();
    const clean = query.trim().toLowerCase();
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

  public async updateOrderStatus(id: string, orderStatus: Order['orderStatus'], paymentStatus?: Order['paymentStatus']) {
    await this.init();
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) return null;
    this.orders[index].orderStatus = orderStatus;
    if (paymentStatus) {
      this.orders[index].paymentStatus = paymentStatus;
    }
    this.orders[index].updatedAt = new Date();
    return this.orders[index];
  }

  // --- Custom Cake Requests ---
  public async createCustomCakeRequest(data: Omit<CustomCakeRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'quotedPrice'>) {
    await this.init();
    const newReq: CustomCakeRequest = {
      ...data,
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      status: 'PENDING',
      quotedPrice: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.customCakeRequests.unshift(newReq);
    return newReq;
  }

  public async getAllCustomCakeRequests(userId?: string) {
    await this.init();
    if (userId) {
      return this.customCakeRequests.filter(r => r.userId === userId);
    }
    return [...this.customCakeRequests];
  }

  public async getCustomCakeRequestById(id: string) {
    await this.init();
    return this.customCakeRequests.find(r => r.id === id);
  }

  public async updateCustomCakeStatus(id: string, status: CustomCakeRequest['status'], quotedPrice?: number) {
    await this.init();
    const index = this.customCakeRequests.findIndex(r => r.id === id);
    if (index === -1) return null;
    this.customCakeRequests[index].status = status;
    if (quotedPrice !== undefined) {
      this.customCakeRequests[index].quotedPrice = quotedPrice;
    }
    this.customCakeRequests[index].updatedAt = new Date();
    return this.customCakeRequests[index];
  }

  // --- Contact Messages ---
  public async createContactMessage(data: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>) {
    await this.init();
    const newMsg: ContactMessage = {
      ...data,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      status: 'NEW',
      createdAt: new Date()
    };
    this.contactMessages.unshift(newMsg);
    return newMsg;
  }

  public async getAllContactMessages() {
    await this.init();
    return [...this.contactMessages];
  }

  public async updateContactStatus(id: string, status: ContactMessage['status']) {
    await this.init();
    const index = this.contactMessages.findIndex(m => m.id === id);
    if (index === -1) return null;
    this.contactMessages[index].status = status;
    return this.contactMessages[index];
  }

  // --- Newsletter ---
  public async addNewsletterSubscriber(email: string) {
    await this.init();
    const existing = this.newsletterSubscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      existing.subscribed = true;
      return existing;
    }
    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: email.toLowerCase(),
      subscribed: true,
      createdAt: new Date()
    };
    this.newsletterSubscribers.unshift(newSub);
    return newSub;
  }

  public async getNewsletterSubscribers() {
    await this.init();
    return [...this.newsletterSubscribers];
  }

  // --- Chat Conversations ---
  public async getOrCreateChatConversation(sessionId: string, userId?: string) {
    await this.init();
    let conv = this.chatConversations.find(c => c.sessionId === sessionId);
    if (!conv) {
      conv = {
        id: `conv-${Date.now()}`,
        sessionId,
        userId: userId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: []
      };
      this.chatConversations.push(conv);
    }
    return conv;
  }

  public async addChatMessage(sessionId: string, role: 'USER' | 'ASSISTANT', message: string, userId?: string) {
    const conv = await this.getOrCreateChatConversation(sessionId, userId);
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      conversationId: conv.id,
      role,
      message,
      createdAt: new Date()
    };
    conv.messages.push(newMsg);
    conv.updatedAt = new Date();
    this.chatMessages.push(newMsg);
    return newMsg;
  }

  public async getChatHistory(sessionId: string) {
    const conv = await this.getOrCreateChatConversation(sessionId);
    return conv.messages;
  }

  // --- Analytics / Admin Stats ---
  public async getAdminStats() {
    await this.init();
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
