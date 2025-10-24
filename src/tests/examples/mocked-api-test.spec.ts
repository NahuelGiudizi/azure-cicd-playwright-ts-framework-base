// src/tests/examples/mocked-api-test.spec.ts

import { test, expect } from '@playwright/test';
import { TestMockHelper, TestMockHelperFactory } from '../../helpers/mocking';
import { UserController } from '../../api-client/controllers/UserController';

/**
 * Ejemplo de test de API usando mocks
 * Demuestra cómo aislar las pruebas de dependencias externas
 */
test.describe('API Tests with Mocking', () => {
  let mockHelper: TestMockHelper;
  let userController: UserController;

  test.beforeEach(async ({ page, request }) => {
    // Crear helper de mock
    mockHelper = TestMockHelperFactory.createApiTestHelper(page);
    
    // Crear controlador de usuario
    userController = new UserController(request);
    
    // Configurar mocks para escenario de éxito
    await mockHelper.setupScenario('success');
  });

  test.afterEach(async () => {
    // Limpiar mocks después de cada test
    await mockHelper.clearMocks();
  });

  test('should verify login with mocked response', async () => {
    // Test con datos válidos
    const credentials = {
      email: 'test@example.com',
      password: 'testpassword123'
    };

    const response = await userController.verifyLogin(credentials);
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('responseCode', 200);
    expect(response.data).toHaveProperty('message', 'User exists!');
  });

  test('should create account with mocked response', async () => {
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
    expect(response.data).toHaveProperty('message', 'User created!');
  });

  test('should handle network errors with mocked responses', async () => {
    // Configurar mocks para errores de red
    await mockHelper.setupScenario('error');
    
    const credentials = {
      email: 'test@example.com',
      password: 'testpassword123'
    };

    // Este test debería fallar con el mock de error
    const response = await userController.verifyLogin(credentials);
    
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  test('should handle timeout scenarios', async () => {
    // Configurar mocks para timeout
    await mockHelper.setupScenario('timeout');
    
    const credentials = {
      email: 'test@example.com',
      password: 'testpassword123'
    };

    // Este test debería fallar por timeout
    await expect(userController.verifyLogin(credentials)).rejects.toThrow();
  });
});

/**
 * Ejemplo de test de UI usando mocks
 */
test.describe('UI Tests with Mocking', () => {
  let mockHelper: TestMockHelper;

  test.beforeEach(async ({ page }) => {
    mockHelper = TestMockHelperFactory.createUiTestHelper(page);
    
    // Configurar mocks para APIs que la UI necesita
    await mockHelper.setupUserMocks();
    await mockHelper.setupProductMocks();
  });

  test.afterEach(async () => {
    await mockHelper.clearMocks();
  });

  test('should load products page with mocked data', async ({ page }) => {
    await page.goto('/products');
    
    // Verificar que la página carga correctamente
    await expect(page.locator('h2:has-text("All Products")')).toBeVisible();
    
    // Verificar que los productos mockeados se muestran
    await expect(page.locator('text=Blue Top')).toBeVisible();
    await expect(page.locator('text=Men Tshirt')).toBeVisible();
  });

  test('should handle API errors gracefully in UI', async ({ page }) => {
    // Configurar mocks para errores
    await mockHelper.setupScenario('mixed');
    
    await page.goto('/products');
    
    // Verificar que la página maneja errores de API correctamente
    await expect(page.locator('text=Error loading products')).toBeVisible();
  });
});

/**
 * Ejemplo de test de integración con mocks parciales
 */
test.describe('Integration Tests with Partial Mocking', () => {
  let mockHelper: TestMockHelper;

  test.beforeEach(async ({ page }) => {
    mockHelper = TestMockHelperFactory.createIntegrationTestHelper(page);
  });

  test.afterEach(async () => {
    await mockHelper.clearMocks();
  });

  test('should test user flow with mocked external services', async ({ page }) => {
    // Mock solo servicios externos, mantener APIs internas reales
    await mockHelper.setupCustomMocks([
      {
        url: /.*\/external-payment-service/,
        method: 'POST',
        status: 200,
        response: { success: true, transactionId: 'mock-txn-123' }
      },
      {
        url: /.*\/external-email-service/,
        method: 'POST',
        status: 200,
        response: { success: true, messageId: 'mock-msg-456' }
      }
    ]);

    // Test del flujo completo con servicios externos mockeados
    await page.goto('/');
    await page.click('text=Signup / Login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'testpassword123');
    await page.click('button:has-text("Login")');
    
    // Verificar que el login funciona (API real)
    await expect(page.locator('text=Logged in as')).toBeVisible();
    
    // Continuar con el flujo que usa servicios externos mockeados
    await page.click('text=Cart');
    await page.click('text=Proceed To Checkout');
    
    // El checkout debería funcionar con el servicio de pago mockeado
    await expect(page.locator('text=Order placed successfully')).toBeVisible();
  });
});

