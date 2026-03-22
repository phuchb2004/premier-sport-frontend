export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  enabled: boolean;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export type ProductCategory = 'KITS' | 'BOOTS' | 'ACCESSORIES' | 'BALLS';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  brand: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  sizes: string[];
  stock: number;
  isFeatured: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  color?: string;
  quantity: number;
  unitPrice: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: CartItem[];
  shippingAddress: Address;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
}

export interface AddToCartRequest {
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  color?: string;
  quantity: number;
  // unitPrice is NOT sent — server fetches it from product-service to prevent tampering
}

// Admin types

export interface CreateProductRequest {
  name: string;
  category: ProductCategory;
  brand: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  sizes: string[];
  stock: number;
  isFeatured: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  category?: ProductCategory;
  brand?: string;
  description?: string;
  price?: number;
  salePrice?: number;
  clearSalePrice?: boolean;
  images?: string[];
  sizes?: string[];
  stock?: number;
  isFeatured?: boolean;
}

export interface TopProductDto {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface AnalyticsDto {
  totalOrders: number;
  totalRevenue: number;
  ordersToday: number;
  revenueToday: number;
  ordersPreviousPeriod: number;
  revenuePreviousPeriod: number;
  topProducts: TopProductDto[];
  recentOrders: Order[];
}

// Chat types

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  createdAt: string;
}

export interface ProductSuggestion {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  price: number;
  salePrice?: number;
  category: ProductCategory;
}

export interface SearchSuggestionsResponse {
  products: ProductSuggestion[];
  categories: string[];
  brands: string[];
}
