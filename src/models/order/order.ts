// src/models/order/order.ts

export interface Order {
    id?: number;
    userId: number;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    billingAddress?: BillingAddress;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    status: OrderStatus;
    createdAt: Date;
    updatedAt?: Date;
}

export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface ShippingAddress {
    fullName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    mobileNumber: string;
}

export interface BillingAddress extends ShippingAddress {}

export interface PaymentMethod {
    type: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer';
    cardNumber?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvv?: string;
    nameOnCard?: string;
}

export type OrderStatus = 
    | 'pending' 
    | 'confirmed' 
    | 'processing' 
    | 'shipped' 
    | 'delivered' 
    | 'cancelled';

export interface OrderSummary {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
}

export interface CheckoutForm {
    deliveryAddress: ShippingAddress;
    billingAddress?: BillingAddress;
    paymentDetails: PaymentMethod;
    orderComment?: string;
}



