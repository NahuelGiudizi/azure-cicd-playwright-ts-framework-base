// src/api-client/controllers/ProductsController.ts
import { APIRequestContext } from '@playwright/test';
import { ApiClient } from '../base/ApiClient';

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

export interface ProductsResponse {
    responseCode: number;
    products: Product[];
}

export interface SearchProductResponse {
    responseCode: number;
    products: Product[];
}

export class ProductsController extends ApiClient {
    constructor(request: APIRequestContext, baseUrl?: string) {
        super(request, baseUrl);
    }

    /**
     * API 1: Get All Products List
     * GET /productsList
     */
    async getAllProducts(): Promise<{ status: number, data: ProductsResponse }> {
        return await this.get<ProductsResponse>('/productsList');
    }

    /**
     * API 2: POST To All Products List (should return 405)
     * POST /productsList
     */
    async postToProductsList(): Promise<{ status: number, data: any }> {
        return await this.post<any>('/productsList');
    }

    /**
     * API 5: POST To Search Product
     * POST /searchProduct
     */
    async searchProduct(searchTerm: string): Promise<{ status: number, data: SearchProductResponse }> {
        return await this.postForm<SearchProductResponse>('/searchProduct', {
            search_product: searchTerm
        });
    }

    /**
     * API 6: POST To Search Product without search_product parameter (should return 400)
     * POST /searchProduct
     */
    async searchProductWithoutParameter(): Promise<{ status: number, data: any }> {
        return await this.postForm<any>('/searchProduct', {});
    }
}



