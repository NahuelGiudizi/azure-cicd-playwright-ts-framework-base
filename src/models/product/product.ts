// src/models/product/product.ts

export interface Product {
    id: number;
    name: string;
    price: string;
    brand: string;
    category: {
        usertype: {
            usertype: string;
        };
        category: string;
    };
}

export interface ProductDetails extends Product {
    description?: string;
    availability?: string;
    condition?: string;
    images?: string[];
}

export interface ProductFilter {
    category?: string;
    brand?: string;
    priceRange?: {
        min: number;
        max: number;
    };
    searchTerm?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
    totalPrice: number;
}

export interface Cart {
    items: CartItem[];
    totalItems: number;
    totalAmount: number;
}



