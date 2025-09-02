// src/api-client/controllers/UserController.ts
import { APIRequestContext } from '@playwright/test';
import { ApiClient } from '../base/ApiClient';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface CreateAccountRequest {
    name: string;
    email: string;
    password: string;
    title: string; // Mr, Mrs, Miss
    birth_date: string;
    birth_month: string;
    birth_year: string;
    firstname: string;
    lastname: string;
    company?: string;
    address1: string;
    address2?: string;
    country: string;
    zipcode: string;
    state: string;
    city: string;
    mobile_number: string;
}

export interface UpdateAccountRequest extends CreateAccountRequest {}

export interface UserDetailResponse {
    responseCode: number;
    user: {
        id: number;
        name: string;
        email: string;
        title: string;
        birth_date: string;
        birth_month: string;
        birth_year: string;
        firstname: string;
        lastname: string;
        company: string;
        address1: string;
        address2: string;
        country: string;
        zipcode: string;
        state: string;
        city: string;
        mobile_number: string;
    };
}

export class UserController extends ApiClient {
    constructor(request: APIRequestContext, baseUrl?: string) {
        super(request, baseUrl);
    }

    /**
     * API 7: POST To Verify Login with valid details
     * POST /verifyLogin
     */
    async verifyLogin(credentials: LoginRequest): Promise<{ status: number, data: any }> {
        return await this.postForm<any>('/verifyLogin', {
            email: credentials.email,
            password: credentials.password
        });
    }

    /**
     * API 8: POST To Verify Login without email parameter (should return 400)
     * POST /verifyLogin
     */
    async verifyLoginWithoutEmail(password: string): Promise<{ status: number, data: any }> {
        return await this.postForm<any>('/verifyLogin', { password });
    }

    /**
     * API 9: DELETE To Verify Login (should return 405)
     * DELETE /verifyLogin
     */
    async deleteVerifyLogin(): Promise<{ status: number, data: any }> {
        return await this.delete<any>('/verifyLogin');
    }

    /**
     * API 10: POST To Verify Login with invalid details (should return 404)
     * POST /verifyLogin
     */
    async verifyLoginWithInvalidCredentials(): Promise<{ status: number, data: any }> {
        return await this.postForm<any>('/verifyLogin', {
            email: 'invalid@example.com',
            password: 'wrongpassword'
        });
    }

    /**
     * API 11: POST To Create/Register User Account
     * POST /createAccount
     */
    async createAccount(userData: CreateAccountRequest): Promise<{ status: number, data: any }> {
        return await this.postForm<any>('/createAccount', {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            title: userData.title,
            birth_date: userData.birth_date,
            birth_month: userData.birth_month,
            birth_year: userData.birth_year,
            firstname: userData.firstname,
            lastname: userData.lastname,
            company: userData.company || '',
            address1: userData.address1,
            address2: userData.address2 || '',
            country: userData.country,
            zipcode: userData.zipcode,
            state: userData.state,
            city: userData.city,
            mobile_number: userData.mobile_number
        });
    }

    /**
     * API 12: DELETE METHOD To Delete User Account
     * DELETE /deleteAccount
     */
    async deleteAccount(credentials: LoginRequest): Promise<{ status: number, data: any }> {
        return await this.delete<any>('/deleteAccount', {
            email: credentials.email,
            password: credentials.password
        });
    }

    /**
     * API 13: PUT METHOD To Update User Account
     * PUT /updateAccount
     */
    async updateAccount(userData: UpdateAccountRequest): Promise<{ status: number, data: any }> {
        return await this.putForm<any>('/updateAccount', {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            title: userData.title,
            birth_date: userData.birth_date,
            birth_month: userData.birth_month,
            birth_year: userData.birth_year,
            firstname: userData.firstname,
            lastname: userData.lastname,
            company: userData.company || '',
            address1: userData.address1,
            address2: userData.address2 || '',
            country: userData.country,
            zipcode: userData.zipcode,
            state: userData.state,
            city: userData.city,
            mobile_number: userData.mobile_number
        });
    }

    /**
     * API 14: GET user account detail by email
     * GET /getUserDetailByEmail
     */
    async getUserDetailByEmail(email: string): Promise<{ status: number, data: UserDetailResponse }> {
        return await this.get<UserDetailResponse>('/getUserDetailByEmail', { email });
    }
}
