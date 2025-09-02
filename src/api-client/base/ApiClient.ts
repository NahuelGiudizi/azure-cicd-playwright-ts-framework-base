// src/api/base/ApiClient.ts
import { APIRequestContext } from '@playwright/test';

export class ApiClient {
    protected request: APIRequestContext;
    protected baseUrl: string;

    constructor(request: APIRequestContext, baseUrl?: string) {
        this.request = request;
        this.baseUrl = baseUrl || process.env.API_BASE_URL || 'https://automationexercise.com/api';
    }

    // AutomationExercise.com APIs don't require authentication for most endpoints
    // We'll keep it simple without auth initialization
    async init(): Promise<void> {
        // No authentication required for AutomationExercise.com APIs
    }

    protected getHeaders(): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    protected getFormHeaders(): Record<string, string> {
        return {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        };
    }

    async get<T>(endpoint: string, params?: Record<string, any>): Promise<{ status: number, data: T }> {
        const response = await this.request.get(`${this.baseUrl}${endpoint}`, {
            headers: this.getHeaders(),
            params
        });

        const status = response.status();
        const data = await this.parseResponse<T>(response);

        return { status, data };
    }

    async post<T>(endpoint: string, data?: any): Promise<{ status: number, data: T }> {
        const response = await this.request.post(`${this.baseUrl}${endpoint}`, {
            headers: this.getHeaders(),
            data
        });

        const status = response.status();
        const responseData = await this.parseResponse<T>(response);

        return { status, data: responseData };
    }

    async postForm<T>(endpoint: string, formData?: Record<string, string>): Promise<{ status: number, data: T }> {
        const response = await this.request.post(`${this.baseUrl}${endpoint}`, {
            headers: this.getFormHeaders(),
            form: formData
        });

        const status = response.status();
        const responseData = await this.parseResponse<T>(response);

        return { status, data: responseData };
    }

    async put<T>(endpoint: string, data?: any): Promise<{ status: number, data: T }> {
        const response = await this.request.put(`${this.baseUrl}${endpoint}`, {
            headers: this.getHeaders(),
            data
        });

        const status = response.status();
        const responseData = await this.parseResponse<T>(response);

        return { status, data: responseData };
    }

    async putForm<T>(endpoint: string, formData?: Record<string, string>): Promise<{ status: number, data: T }> {
        const response = await this.request.put(`${this.baseUrl}${endpoint}`, {
            headers: this.getFormHeaders(),
            form: formData
        });

        const status = response.status();
        const responseData = await this.parseResponse<T>(response);

        return { status, data: responseData };
    }

    async delete<T>(endpoint: string, formData?: Record<string, string>): Promise<{ status: number, data: T }> {
        const response = await this.request.delete(`${this.baseUrl}${endpoint}`, {
            headers: this.getFormHeaders(),
            form: formData
        });

        const status = response.status();
        const data = await this.parseResponse<T>(response);

        return { status, data };
    }

    private async parseResponse<T>(response: any): Promise<T> {
        const text = await response.text();
        try {
            return text ? JSON.parse(text) : null as unknown as T;
        } catch (e) {
            return text as unknown as T;
        }
    }
}