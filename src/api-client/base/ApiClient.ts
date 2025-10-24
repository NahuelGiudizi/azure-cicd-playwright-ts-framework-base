// src/api-client/base/ApiClient.ts - VERSIÓN SIMPLIFICADA
import { APIRequestContext, APIResponse } from '@playwright/test';
import { ErrorResponse } from '../types/api-responses';

type QueryParams = Record<string, string | number | boolean>;
type RequestData = Record<string, unknown> | string | null;
type FormData = Record<string, string>;

export interface SuccessResponse<T = unknown> {
    success: boolean;
    data: T;
    message?: string;
}

export type ApiResponse<T = unknown> = T | ErrorResponse | SuccessResponse<T> | string;

/**
 * Cliente API simple y directo
 */
export class ApiClient {
    protected request: APIRequestContext;
    protected baseUrl: string;
    protected timeout: number;
    protected enableLogging: boolean;

    constructor(
        request: APIRequestContext, 
        baseUrl?: string, 
        timeout?: number, 
        enableLogging?: boolean
    ) {
        this.request = request;
        this.baseUrl = baseUrl || process.env.API_BASE_URL || 'https://automationexercise.com/api';
        this.timeout = timeout || 30000;
        this.enableLogging = enableLogging ?? process.env.NODE_ENV === 'development';
    }

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

    private logRequest(method: string, endpoint: string, data?: unknown): void {
        if (this.enableLogging) {
            console.log(`[API] ${method} ${this.baseUrl}${endpoint}`);
            if (data) console.log(`[API] Request data:`, data);
        }
    }

    private logResponse(method: string, endpoint: string, status: number, data?: unknown): void {
        if (this.enableLogging) {
            console.log(`[API] ${method} ${endpoint} -> ${status}`);
            if (data) console.log(`[API] Response data:`, data);
        }
    }

    /**
     * GET request
     */
    async get<T>(
        endpoint: string, 
        params?: QueryParams
    ): Promise<{ status: number, data: ApiResponse<T> }> {
        this.logRequest('GET', endpoint, params);
        
        const response = await this.request.get(`${this.baseUrl}${endpoint}`, {
            headers: this.getHeaders(),
            timeout: this.timeout,
            ...(params && { params })
        });

        const status = response.status();
        const data = await this.parseResponse<ApiResponse<T>>(response);
        
        this.logResponse('GET', endpoint, status, data);
        return { status, data };
    }

    /**
     * POST request con JSON
     */
    async post<T>(
        endpoint: string, 
        data?: RequestData
    ): Promise<{ status: number, data: ApiResponse<T> }> {
        this.logRequest('POST', endpoint, data);
        
        const response = await this.request.post(`${this.baseUrl}${endpoint}`, {
            headers: this.getHeaders(),
            timeout: this.timeout,
            data
        });

        const status = response.status();
        const responseData = await this.parseResponse<ApiResponse<T>>(response);
        
        this.logResponse('POST', endpoint, status, responseData);
        return { status, data: responseData };
    }

    /**
     * POST request con form data
     */
    async postForm<T>(
        endpoint: string, 
        formData?: FormData
    ): Promise<{ status: number, data: ApiResponse<T> }> {
        this.logRequest('POST_FORM', endpoint, formData);
        
        const response = await this.request.post(`${this.baseUrl}${endpoint}`, {
            headers: this.getFormHeaders(),
            timeout: this.timeout,
            ...(formData && { form: formData })
        });

        const status = response.status();
        const responseData = await this.parseResponse<ApiResponse<T>>(response);
        
        this.logResponse('POST_FORM', endpoint, status, responseData);
        return { status, data: responseData };
    }

    /**
     * PUT request con JSON
     */
    async put<T>(
        endpoint: string, 
        data?: RequestData
    ): Promise<{ status: number, data: ApiResponse<T> }> {
        this.logRequest('PUT', endpoint, data);
        
        const response = await this.request.put(`${this.baseUrl}${endpoint}`, {
            headers: this.getHeaders(),
            timeout: this.timeout,
            data
        });

        const status = response.status();
        const responseData = await this.parseResponse<ApiResponse<T>>(response);
        
        this.logResponse('PUT', endpoint, status, responseData);
        return { status, data: responseData };
    }

    /**
     * PUT request con form data
     */
    async putForm<T>(
        endpoint: string, 
        formData?: FormData
    ): Promise<{ status: number, data: ApiResponse<T> }> {
        this.logRequest('PUT_FORM', endpoint, formData);
        
        const response = await this.request.put(`${this.baseUrl}${endpoint}`, {
            headers: this.getFormHeaders(),
            timeout: this.timeout,
            ...(formData && { form: formData })
        });

        const status = response.status();
        const responseData = await this.parseResponse<ApiResponse<T>>(response);
        
        this.logResponse('PUT_FORM', endpoint, status, responseData);
        return { status, data: responseData };
    }

    /**
     * DELETE request
     */
    async delete<T>(
        endpoint: string, 
        formData?: FormData
    ): Promise<{ status: number, data: ApiResponse<T> }> {
        const response = await this.request.delete(`${this.baseUrl}${endpoint}`, {
            headers: this.getFormHeaders(),
            ...(formData && { form: formData })
        });

        const status = response.status();
        const data = await this.parseResponse<ApiResponse<T>>(response);
        return { status, data };
    }

    private async parseResponse<T>(response: APIResponse): Promise<T> {
        const text = await response.text();
        
        if (!text || text.trim() === '') {
            return null as T;
        }

        try {
            return JSON.parse(text) as T;
        } catch {
            // Si no es JSON válido, verificar si es un error conocido
            if (this.isErrorText(text)) {
                return {
                    error: 'Parse Error',
                    message: text,
                    statusCode: response.status()
                } as T;
            }
            return text as T;
        }
    }

    private isErrorText(text: string): boolean {
        const errorPatterns = [
            /error/i, /failed/i, /invalid/i, 
            /not found/i, /unauthorized/i, /forbidden/i
        ];
        return errorPatterns.some(pattern => pattern.test(text));
    }

    isErrorResponse(response: { status: number; data: unknown }): boolean {
        return response.status >= 400 || 
               (typeof response.data === 'object' && 
                response.data !== null && 
                'error' in response.data);
    }

    isSuccessResponse(response: { status: number; data: unknown }): boolean {
        return response.status >= 200 && response.status < 300;
    }

    getRequestContext(): APIRequestContext {
        return this.request;
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }
}