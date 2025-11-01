import type { Role, Allergen, PricingType, DeliveryType, OrderStatus } from '../enums';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cake {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  allergens: Allergen[];
  pricingType: PricingType;
  pricePerKg?: number;
  pricePerItem?: number;
  minWeight?: number;
  availableQuantities: number[];
  picture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Gallery {
  id: string;
  picture: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  message?: string;
  cakeId: string;
  quantity?: number;
  weight?: number;
  deliveryType: DeliveryType;
  deliveryAddress?: string;
  deliveryFee?: number;
  deliveryTimeSlot?: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

