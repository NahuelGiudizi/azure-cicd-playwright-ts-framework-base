// src/api-client/controllers/BrandsController.ts
import { APIRequestContext } from '@playwright/test';
import { ApiClient } from '../base/ApiClient';

export interface Brand {
    id: number;
    brand: string;
}

export interface BrandsResponse {
    responseCode: number;
    brands: Brand[];
}

export class BrandsController extends ApiClient {
    constructor(request: APIRequestContext, baseUrl?: string) {
        super(request, baseUrl);
    }

    /**
     * API 3: Get All Brands List
     * GET /brandsList
     */
    async getAllBrands(): Promise<{ status: number, data: BrandsResponse }> {
        return await this.get<BrandsResponse>('/brandsList');
    }

    /**
     * API 4: PUT To All Brands List (should return 405)
     * PUT /brandsList
     */
    async putToBrandsList(): Promise<{ status: number, data: any }> {
        return await this.put<any>('/brandsList');
    }
}



