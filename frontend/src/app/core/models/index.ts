import { Timestamp } from '@angular/fire/firestore';

export type UserRole = 'customer' | 'admin';

export interface Address {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface AppUser {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  profileImage?: string;
  defaultAddress?: Address;
  isPhoneVerified: boolean;
  isBlocked?: boolean;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  icon?: string;
  isActive: boolean;
  sortOrder?: number;
  createdAt: Timestamp | Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  categoryId: string;
  categoryName: string;
  stock: number;
  unit: string;
  thumbnail: string;
  images: string[];
  searchKeywords: string[];
  rating?: number;
  isAvailable: boolean;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  imageUrl: string;
  redirectUrl: string;
  isActive: boolean;
  sortOrder?: number;
}

export interface CartItem {
  productId: string;
  name: string;
  thumbnail: string;
  price: number;
  unit: string;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: Timestamp | Date;
}

export type OrderStatus =
  | 'placed'
  | 'preparing'
  | 'packed'
  | 'outForDelivery'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';
export type PaymentMethod = 'cod' | 'razorpay';

export interface OrderProduct {
  productId: string;
  name: string;
  thumbnail: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  orderId: string;
  userId: string;
  userName: string;
  userPhone: string;
  products: OrderProduct[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  orderStatus: OrderStatus;
  deliverySlot: string;
  estimatedArrivalTime: Timestamp | Date;
  address: Address;
  cancelReason?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface Payment {
  paymentId: string;
  orderId: string;
  userId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: 'INR';
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: Timestamp | Date;
}

export interface Refund {
  refundId: string;
  orderId: string;
  paymentId: string;
  userId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  razorpayRefundId?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

/** Firestore clients may deserialize numbers as strings; normalize before math / `toFixed`. */
export function coerceNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

export function productUnitPrice(p: Pick<Product, 'price' | 'discountPrice'>): number {
  return coerceNumber(p.discountPrice ?? p.price, 0);
}
