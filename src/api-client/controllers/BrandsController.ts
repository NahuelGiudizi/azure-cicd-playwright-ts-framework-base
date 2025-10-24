// src/api-client/controllers/BrandsController.ts
import { APIRequestContext } from '@playwright/test';
import { ApiClient } from '../base/ApiClient';
import { BrandsResponse, ErrorResponse } from '../types/api-responses';

export class BrandsController extends ApiClient {
    constructor(request: APIRequestContext, baseUrl?: string) {
        super(request, baseUrl);
    }

    /**
     * API 3: Get All Brands List
     * GET /brandsList
     */
    async getAllBrands() {
        return await this.get<BrandsResponse>('/brandsList');
    }

    /**
     * API 4: PUT To All Brands List (should return 405)
     * PUT /brandsList
     */
    async putToBrandsList() {
        return await this.put<ErrorResponse>('/brandsList');
    }
}



