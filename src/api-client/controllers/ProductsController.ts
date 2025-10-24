// src/api-client/controllers/ProductsController.ts
import { APIRequestContext } from '@playwright/test';
import { ApiClient } from '../base/ApiClient';
import { ProductsResponse, SearchProductsResponse, ErrorResponse } from '../types/api-responses';

export class ProductsController extends ApiClient {
    constructor(request: APIRequestContext, baseUrl?: string) {
        super(request, baseUrl);
    }

    /**
     * API 1: Get All Products List
     * GET /productsList
     */
    async getAllProducts() {
        return await this.get<ProductsResponse>('/productsList');
    }

    /**
     * API 2: POST To All Products List (should return 405)
     * POST /productsList
     */
    async postToProductsList() {
        return await this.post<ErrorResponse>('/productsList');
    }

    /**
     * API 5: POST To Search Product
     * POST /searchProduct
     */
    async searchProduct(searchTerm: string) {
        return await this.postForm<SearchProductsResponse>('/searchProduct', {
            search_product: searchTerm
        });
    }

    /**
     * API 6: POST To Search Product without search_product parameter (should return 400)
     * POST /searchProduct
     */
    async searchProductWithoutParameter() {
        return await this.postForm<ErrorResponse>('/searchProduct', {});
    }
}



