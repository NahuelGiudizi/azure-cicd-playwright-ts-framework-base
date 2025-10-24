// src/fixtures/api-client.fixture.ts

import { test as base } from '@playwright/test';
import { ApiClient } from '../api-client/base/ApiClient';
import { UserController } from '../api-client/controllers/UserController';
import { ProductsController } from '../api-client/controllers/ProductsController';
import { BrandsController } from '../api-client/controllers/BrandsController';

/**
 * Configuración para el cliente API
 */
export interface ApiClientConfig {
  baseUrl?: string;
  timeout?: number;
  enableLogging?: boolean;
  environment?: 'development' | 'staging' | 'production' | 'mock';
}

/**
 * Fixtures para el cliente API y controladores
 */
export interface ApiFixtures {
  apiClient: ApiClient;
  userController: UserController;
  productsController: ProductsController;
  brandsController: BrandsController;
  apiConfig: ApiClientConfig;
}

/**
 * Factory para crear configuración de API según el entorno
 */
export class ApiConfigFactory {
  static createConfig(environment: string = 'development'): ApiClientConfig {
    const configs: Record<string, ApiClientConfig> = {
      development: {
        baseUrl: process.env.API_BASE_URL || 'https://automationexercise.com/api',
        timeout: 30000,
        enableLogging: true,
        environment: 'development'
      },
      staging: {
        baseUrl: process.env.STAGING_API_BASE_URL || 'https://staging-automationexercise.com/api',
        timeout: 45000,
        enableLogging: true,
        environment: 'staging'
      },
      production: {
        baseUrl: process.env.PRODUCTION_API_BASE_URL || 'https://automationexercise.com/api',
        timeout: 60000,
        enableLogging: false,
        environment: 'production'
      },
      mock: {
        baseUrl: 'http://localhost:3000/api', // Mock server
        timeout: 5000,
        enableLogging: true,
        environment: 'mock'
      }
    };

    return configs[environment] || configs.development;
  }

  static createFromEnv(): ApiClientConfig {
    const env = process.env.NODE_ENV || 'development';
    return this.createConfig(env);
  }
}

/**
 * Extensión de Playwright con fixtures de API
 */
export const test = base.extend<ApiFixtures>({
  /**
   * Configuración de API
   */
  apiConfig: [async ({}, use) => {
    const config = ApiConfigFactory.createFromEnv();
    await use(config);
  }, { scope: 'test' }],

  /**
   * Cliente API base
   */
  apiClient: [async ({ request, apiConfig }, use) => {
    const apiClient = new ApiClient(
      request,
      apiConfig.baseUrl,
      apiConfig.timeout,
      apiConfig.enableLogging
    );
    
    await apiClient.init();
    await use(apiClient);
  }, { scope: 'test' }],

  /**
   * Controlador de usuarios
   */
  userController: [async ({ apiClient }, use) => {
    const userController = new UserController(apiClient.getRequestContext(), apiClient.getBaseUrl());
    await use(userController);
  }, { scope: 'test' }],

  /**
   * Controlador de productos
   */
  productsController: [async ({ apiClient }, use) => {
    const productsController = new ProductsController(apiClient.getRequestContext(), apiClient.getBaseUrl());
    await use(productsController);
  }, { scope: 'test' }],

  /**
   * Controlador de marcas
   */
  brandsController: [async ({ apiClient }, use) => {
    const brandsController = new BrandsController(apiClient.getRequestContext(), apiClient.getBaseUrl());
    await use(brandsController);
  }, { scope: 'test' }]
});

/**
 * Fixtures específicos para diferentes entornos
 */
export const testWithMockApi = base.extend<ApiFixtures>({
  apiConfig: [async ({}, use) => {
    const config = ApiConfigFactory.createConfig('mock');
    await use(config);
  }, { scope: 'test' }],

  apiClient: [async ({ request, apiConfig }, use) => {
    const apiClient = new ApiClient(
      request,
      apiConfig.baseUrl,
      apiConfig.timeout,
      apiConfig.enableLogging
    );
    
    await apiClient.init();
    await use(apiClient);
  }, { scope: 'test' }],

  userController: [async ({ apiClient }, use) => {
    const userController = new UserController(apiClient.getRequestContext(), apiClient.getBaseUrl());
    await use(userController);
  }, { scope: 'test' }],

  productsController: [async ({ apiClient }, use) => {
    const productsController = new ProductsController(apiClient.getRequestContext(), apiClient.getBaseUrl());
    await use(productsController);
  }, { scope: 'test' }],

  brandsController: [async ({ apiClient }, use) => {
    const brandsController = new BrandsController(apiClient.getRequestContext(), apiClient.getBaseUrl());
    await use(brandsController);
  }, { scope: 'test' }]
});

export const testWithStagingApi = base.extend<ApiFixtures>({
  apiConfig: [async ({}, use) => {
    const config = ApiConfigFactory.createConfig('staging');
    await use(config);
  }, { scope: 'test' }],

  apiClient: [async ({ request, apiConfig }, use) => {
    const apiClient = new ApiClient(
      request,
      apiConfig.baseUrl,
      apiConfig.timeout,
      apiConfig.enableLogging
    );
    
    await apiClient.init();
    await use(apiClient);
  }, { scope: 'test' }],

  userController: [async ({ apiClient }, use) => {
    const userController = new UserController(apiClient.getRequestContext(), apiClient.getBaseUrl());
    await use(userController);
  }, { scope: 'test' }],

  productsController: [async ({ apiClient }, use) => {
    const productsController = new ProductsController(apiClient.getRequestContext(), apiClient.getBaseUrl());
    await use(productsController);
  }, { scope: 'test' }],

  brandsController: [async ({ apiClient }, use) => {
    const brandsController = new BrandsController(apiClient.getRequestContext(), apiClient.getBaseUrl());
    await use(brandsController);
  }, { scope: 'test' }]
});

/**
 * Helper para crear fixtures personalizados
 */
export function createApiFixture(config: ApiClientConfig) {
  return base.extend<ApiFixtures>({
    apiConfig: [async ({}, use) => {
      await use(config);
    }, { scope: 'test' }],

    apiClient: [async ({ request, apiConfig }, use) => {
      const apiClient = new ApiClient(
        request,
        apiConfig.baseUrl,
        apiConfig.timeout,
        apiConfig.enableLogging
      );
      
      await apiClient.init();
      await use(apiClient);
    }, { scope: 'test' }],

    userController: [async ({ apiClient }, use) => {
      const userController = new UserController(apiClient.getRequestContext(), apiClient.getBaseUrl());
      await use(userController);
    }, { scope: 'test' }],

    productsController: [async ({ apiClient }, use) => {
      const productsController = new ProductsController(apiClient.getRequestContext(), apiClient.getBaseUrl());
      await use(productsController);
    }, { scope: 'test' }],

    brandsController: [async ({ apiClient }, use) => {
      const brandsController = new BrandsController(apiClient.getRequestContext(), apiClient.getBaseUrl());
      await use(brandsController);
    }, { scope: 'test' }]
  });
}
