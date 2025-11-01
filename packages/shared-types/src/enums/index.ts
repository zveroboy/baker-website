export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum Allergen {
  GLUTEN = 'GLUTEN',
  DAIRY = 'DAIRY',
  EGGS = 'EGGS',
  NUTS = 'NUTS',
  SOY = 'SOY',
  PEANUTS = 'PEANUTS',
}

export enum PricingType {
  PER_KG = 'PER_KG',
  PER_ITEM = 'PER_ITEM',
}

export enum DeliveryType {
  PICKUP = 'PICKUP',
  DELIVERY = 'DELIVERY',
}

export enum OrderStatus {
  NEW = 'NEW',
  CONFIRMED = 'CONFIRMED',
  STARTED = 'STARTED',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  PICKED_UP = 'PICKED_UP',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

