// src/tests/examples/api-fixtures-example.spec.ts

import { test, testWithMockApi, testWithStagingApi, createApiFixture } from '../../fixtures/api-client.fixture';
import { expect } from '@playwright/test';
import { LoginRequestSchema } from '../../api-client/schemas/request-schemas';
import { ApiClient } from '../../api-client/base/ApiClient';

/**
 * Ejemplo de uso de fixtures de API
 * Demuestra cómo usar diferentes configuraciones de API de forma transparente
 */

// Test con configuración por defecto (desarrollo)
test.describe('API Tests with Default Fixtures', () => {
  test('should create user account with default API', async ({ userController }) => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword123',
      title: 'Mr',
      birth_date: '15',
      birth_month: 'January',
      birth_year: '1990',
      firstname: 'Test',
      lastname: 'User',
      address1: '123 Test St',
      country: 'United States',
      zipcode: '12345',
      state: 'CA',
      city: 'Test City',
      mobile_number: '+1234567890'
    };

    const response = await userController.createAccount(userData);
    
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('responseCode', 201);
  });

  test('should verify login with default API', async ({ userController }) => {
    const credentials = {
      email: 'test@example.com',
      password: 'testpassword123'
    };

    const response = await userController.verifyLogin(credentials);
    
    expect(response.status).toBe(200);
  });

  test('should get products list with default API', async ({ productsController }) => {
    const response = await productsController.getAllProducts();
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('products');
  });
});

// Test con API mockeada
testWithMockApi.describe('API Tests with Mocked API', () => {
  test('should work with mocked API responses', async ({ userController, apiConfig }) => {
    // Verificar que estamos usando la configuración mock
    expect(apiConfig.environment).toBe('mock');
    expect(apiConfig.baseUrl).toBe('http://localhost:3000/api');
    
    const credentials = {
      email: 'test@example.com',
      password: 'testpassword123'
    };

    // Este test funcionará con respuestas mockeadas
    const response = await userController.verifyLogin(credentials);
    
    expect(response.status).toBe(200);
  });
});

// Test con API de staging
testWithStagingApi.describe('API Tests with Staging API', () => {
  test('should work with staging environment', async ({ userController, apiConfig }) => {
    // Verificar que estamos usando la configuración de staging
    expect(apiConfig.environment).toBe('staging');
    expect(apiConfig.timeout).toBe(45000);
    
    const credentials = {
      email: 'test@example.com',
      password: 'testpassword123'
    };

    const response = await userController.verifyLogin(credentials);
    
    expect(response.status).toBe(200);
  });
});

// Test con configuración personalizada
const customTest = createApiFixture({
  baseUrl: 'https://custom-api.example.com',
  timeout: 10000,
  enableLogging: true,
  environment: 'production'
});

customTest.describe('API Tests with Custom Configuration', () => {
  test('should work with custom API configuration', async ({ userController, apiConfig }) => {
    expect(apiConfig.baseUrl).toBe('https://custom-api.example.com');
    expect(apiConfig.timeout).toBe(10000);
    
    const credentials = {
      email: 'test@example.com',
      password: 'testpassword123'
    };

    const response = await userController.verifyLogin(credentials);
    
    expect(response.status).toBe(200);
  });
});

// Test que demuestra la inyección de dependencias
test.describe('API Dependency Injection Example', () => {
  test('should inject different API clients', async ({ 
    apiClient, 
    userController, 
    productsController, 
    brandsController,
    apiConfig 
  }) => {
    // Todos los controladores comparten la misma configuración
    expect(apiConfig.environment).toBeDefined();
    
    // Verificar que todos los controladores están disponibles
    expect(userController).toBeDefined();
    expect(productsController).toBeDefined();
    expect(brandsController).toBeDefined();
    
    // Todos usan el mismo cliente API base
    expect(apiClient).toBeDefined();
  });

  test('should allow overriding API configuration per test', async ({ 
    apiClient, 
    userController 
  }) => {
    // El fixture permite configurar el API client por test
    const customConfig = {
      baseUrl: 'https://test-api.example.com',
      timeout: 5000,
      enableLogging: false,
      environment: 'test' as const
    };
    
    // Crear un nuevo cliente con configuración personalizada
    const customApiClient = new ApiClient(
      userController.getRequestContext(),
      customConfig.baseUrl,
      customConfig.timeout,
      customConfig.enableLogging
    );
    
    expect(customApiClient).toBeDefined();
  });
});

