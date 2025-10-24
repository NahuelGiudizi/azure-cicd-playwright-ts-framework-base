// src/api-client/controllers/UserController.ts - VERSIÓN SIMPLIFICADA
import { APIRequestContext } from '@playwright/test';
import { ApiClient } from '../base/ApiClient';
import { UserAccountBuilder } from '../builders';
import { 
  LoginResponse, 
  CreateAccountResponse, 
  DeleteAccountResponse, 
  UpdateAccountResponse, 
  ErrorResponse 
} from '../types/api-responses';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface CreateAccountRequest {
    name: string;
    email: string;
    password: string;
    title: string;
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

/**
 * Controlador de usuario - Simple y directo
 */
export class UserController extends ApiClient {
    constructor(request: APIRequestContext, baseUrl?: string) {
        super(request, baseUrl);
    }

    /**
     * API 7: POST To Verify Login with valid details
     */
    async verifyLogin(credentials: LoginRequest) {
        return await this.postForm<LoginResponse | ErrorResponse>('/verifyLogin', {
            email: credentials.email,
            password: credentials.password
        });
    }

    /**
     * API 8: POST To Verify Login without email parameter
     */
    async verifyLoginWithoutEmail(password: string) {
        return await this.postForm<ErrorResponse>('/verifyLogin', { password });
    }

    /**
     * API 9: DELETE To Verify Login
     */
    async deleteVerifyLogin() {
        return await this.delete<ErrorResponse>('/verifyLogin');
    }

    /**
     * API 10: POST To Verify Login with invalid details
     */
    async verifyLoginWithInvalidCredentials() {
        return await this.postForm<ErrorResponse>('/verifyLogin', {
            email: 'invalid@example.com',
            password: 'wrongpassword'
        });
    }

    /**
     * API 11: POST To Create/Register User Account
     */
    async createAccount(userData: CreateAccountRequest) {
        return await this.postForm<CreateAccountResponse>('/createAccount', {
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
     * Crear cuenta usando Builder pattern
     */
    async createAccountWithBuilder(builder: UserAccountBuilder) {
        const userData = builder.build();
        return await this.createAccount(userData);
    }

    /**
     * Crear cuenta de prueba con datos por defecto
     */
    async createTestAccount() {
        const testUserBuilder = UserAccountBuilder.createTestUser();
        return await this.createAccountWithBuilder(testUserBuilder);
    }

    /**
     * API 12: DELETE METHOD To Delete User Account
     */
    async deleteAccount(credentials: LoginRequest) {
        return await this.delete<DeleteAccountResponse>('/deleteAccount', {
            email: credentials.email,
            password: credentials.password
        });
    }

    /**
     * API 13: PUT METHOD To Update User Account
     */
    async updateAccount(userData: UpdateAccountRequest) {
        return await this.putForm<UpdateAccountResponse>('/updateAccount', {
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
     * Actualizar cuenta usando Builder pattern
     */
    async updateAccountWithBuilder(builder: UserAccountBuilder) {
        const userData = builder.buildForUpdate();
        return await this.updateAccount(userData);
    }

    /**
     * API 14: GET user account detail by email
     */
    async getUserDetailByEmail(email: string) {
        return await this.get<UserDetailResponse>('/getUserDetailByEmail', { email });
    }

    /**
     * Helper para crear un builder de usuario
     */
    createUserBuilder(): UserAccountBuilder {
        return new UserAccountBuilder();
    }
}