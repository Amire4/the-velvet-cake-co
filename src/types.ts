export type Role = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  createdAt?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userEmail?: string;
  rating: number;
  comment: string;
  verifiedPurchase?: boolean;
  createdAt: string;
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
}

export interface CakeFlavor {
  id: string;
  name: string;
  description: string;
  available: boolean;
}

export interface OrderItem {
  id?: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  customization?: string | null;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  customization: {
    flavor?: string;
    size?: string;
    message?: string;
    dietary?: string;
  };
  totalPrice: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

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
  preferredDate: string;
  customerNotes?: string | null;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
  orderItems: Array<{
    id: string;
    productId: string;
    product?: Product;
    quantity: number;
    unitPrice: number;
    customization?: string | null;
  }>;
  emailConfirmation?: {
    sent: boolean;
    simulated: boolean;
    recipient: string;
    htmlPreview?: string;
  };
}

export type CustomCakeStatus = 'PENDING' | 'REVIEWING' | 'QUOTED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

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
  eventDate: string;
  referenceImageUrl?: string | null;
  additionalNotes?: string | null;
  quotedPrice?: number | null;
  status: CustomCakeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'RESOLVED';
  createdAt: string;
}

export interface ChatMessage {
  id?: string;
  role: 'USER' | 'ASSISTANT';
  message: string;
  createdAt?: string;
}

export interface AdminStats {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalCustomers: number;
  customCakeRequests: number;
  pendingCustomCakes: number;
  unreadMessages: number;
}
