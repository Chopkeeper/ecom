export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPercent: number;
  category: string;
  image: string;
  stock: number;
  shippingCost: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isAuthenticated: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'verified' | 'shipped';
  paymentMethod: 'promptpay';
  timestamp: number;
  slipImage?: string;
}

export interface RevenueData {
  name: string; // Month/Quarter name
  revenue: number;
}

export enum AppRoute {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  PRODUCT_DETAIL = '/product/:id',
  CART = '/cart',
  CHECKOUT = '/checkout',
  ADMIN_DASHBOARD = '/admin/dashboard',
  ADMIN_PRODUCTS = '/admin/products',
  ADMIN_ORDERS = '/admin/orders',
}