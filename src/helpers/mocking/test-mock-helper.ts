// src/helpers/mocking/test-mock-helper.ts

import { Page } from '@playwright/test';
import { MockServer, MockServerFactory, MockRoute } from './mock-server';

/**
 * Helper para configurar mocks en tests
 * Simplifica la configuración de mocks para diferentes escenarios de prueba
 */
export class TestMockHelper {
  private page: Page;
  private mockServer: MockServer;

  constructor(page: Page, baseUrl: string = 'https://automationexercise.com/api') {
    this.page = page;
    this.mockServer = new MockServer(page, { baseUrl });
  }

  /**
   * Configura mocks para pruebas de usuario
   */
  async setupUserMocks(): Promise<void> {
    const userMocks = MockServerFactory.createUserApiMocks();
    userMocks.forEach(mock => this.mockServer.addRoute(mock));
    await this.mockServer.setupMocks();
  }

  /**
   * Configura mocks para pruebas de productos
   */
  async setupProductMocks(): Promise<void> {
    const productMocks = MockServerFactory.createProductApiMocks();
    productMocks.forEach(mock => this.mockServer.addRoute(mock));
    await this.mockServer.setupMocks();
  }

  /**
   * Configura mocks para pruebas de marcas
   */
  async setupBrandMocks(): Promise<void> {
    const brandMocks = MockServerFactory.createBrandApiMocks();
    brandMocks.forEach(mock => this.mockServer.addRoute(mock));
    await this.mockServer.setupMocks();
  }

  /**
   * Configura mocks para pruebas de errores de red
   */
  async setupNetworkErrorMocks(): Promise<void> {
    const errorMocks = MockServerFactory.createNetworkErrorMocks();
    errorMocks.forEach(mock => this.mockServer.addRoute(mock));
    await this.mockServer.setupMocks();
  }

  /**
   * Configura mocks personalizados
   */
  async setupCustomMocks(routes: MockRoute[]): Promise<void> {
    routes.forEach(route => this.mockServer.addRoute(route));
    await this.mockServer.setupMocks();
  }

  /**
   * Configura mocks para escenarios específicos
   */
  async setupScenario(scenario: 'success' | 'error' | 'timeout' | 'mixed'): Promise<void> {
    switch (scenario) {
      case 'success':
        await this.setupUserMocks();
        await this.setupProductMocks();
        await this.setupBrandMocks();
        break;
      
      case 'error':
        await this.setupNetworkErrorMocks();
        break;
      
      case 'timeout':
        await this.setupCustomMocks([
          {
            url: /.*\/api\/.*/,
            method: 'GET',
            status: 408,
            response: { error: 'Request timeout' },
            delay: 10000
          }
        ]);
        break;
      
      case 'mixed':
        await this.setupUserMocks();
        await this.setupCustomMocks([
          {
            url: /.*\/productsList/,
            method: 'GET',
            status: 500,
            response: { error: 'Service unavailable' }
          }
        ]);
        break;
    }
  }

  /**
   * Limpia todos los mocks
   */
  async clearMocks(): Promise<void> {
    await this.mockServer.clearMocks();
  }

  /**
   * Obtiene el servidor mock para configuración avanzada
   */
  getMockServer(): MockServer {
    return this.mockServer;
  }

  /**
   * Obtiene la página asociada al helper
   */
  getPage(): Page {
    return this.page;
  }
}

/**
 * Factory para crear helpers de mock con configuraciones predefinidas
 */
export class TestMockHelperFactory {
  /**
   * Crea un helper para pruebas de API
   */
  static createApiTestHelper(page: Page): TestMockHelper {
    return new TestMockHelper(page, 'https://automationexercise.com/api');
  }

  /**
   * Crea un helper para pruebas de UI
   */
  static createUiTestHelper(page: Page): TestMockHelper {
    return new TestMockHelper(page, 'https://automationexercise.com');
  }

  /**
   * Crea un helper para pruebas de integración
   */
  static createIntegrationTestHelper(page: Page): TestMockHelper {
    return new TestMockHelper(page, 'https://automationexercise.com/api');
  }
}

