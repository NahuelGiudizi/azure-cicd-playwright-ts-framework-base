// src/helpers/mocking/mock-server.ts

import { Page } from '@playwright/test';

/**
 * Configuración para el servidor mock
 */
export interface MockServerConfig {
  baseUrl: string;
  port?: number;
  delay?: number; // Simular latencia de red
}

/**
 * Configuración para una ruta mock
 */
export interface MockRoute {
  url: string | RegExp;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: number;
  response: unknown;
  headers?: Record<string, string>;
  delay?: number;
}

/**
 * Servidor mock para pruebas aisladas
 * Permite simular respuestas de API sin depender de servicios externos
 */
export class MockServer {
  private page: Page;
  private config: MockServerConfig;
  private routes: Map<string, MockRoute> = new Map();

  constructor(page: Page, config: MockServerConfig) {
    this.page = page;
    this.config = config;
  }

  /**
   * Agrega una ruta mock
   */
  addRoute(route: MockRoute): void {
    const key = this.getRouteKey(route.url, route.method);
    this.routes.set(key, route);
  }

  /**
   * Configura todas las rutas mock en la página
   */
  async setupMocks(): Promise<void> {
    for (const route of this.routes.values()) {
      await this.page.route(route.url, async (route) => {
        const mockRoute = this.findMatchingRoute(route.request().url(), route.request().method());
        
        if (mockRoute) {
          const delay = mockRoute.delay || this.config.delay || 0;
          
          if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          
          await route.fulfill({
            status: mockRoute.status,
            contentType: 'application/json',
            headers: mockRoute.headers || {},
            body: JSON.stringify(mockRoute.response)
          });
        } else {
          await route.continue();
        }
      });
    }
  }

  /**
   * Limpia todas las rutas mock
   */
  async clearMocks(): Promise<void> {
    await this.page.unrouteAll();
    this.routes.clear();
  }

  /**
   * Obtiene la clave única para una ruta
   */
  private getRouteKey(url: string | RegExp, method: string): string {
    return `${method}:${url.toString()}`;
  }

  /**
   * Encuentra la ruta que coincide con la URL y método
   */
  private findMatchingRoute(url: string, method: string): MockRoute | undefined {
    for (const route of this.routes.values()) {
      if (route.method === method) {
        if (typeof route.url === 'string') {
          if (url.includes(route.url)) {
            return route;
          }
        } else if (route.url instanceof RegExp) {
          if (route.url.test(url)) {
            return route;
          }
        }
      }
    }
    return undefined;
  }
}

/**
 * Factory para crear configuraciones comunes de mock
 */
export class MockServerFactory {
  /**
   * Crea un mock para APIs de usuario
   */
  static createUserApiMocks(): MockRoute[] {
    return [
      {
        url: /.*\/verifyLogin/,
        method: 'POST',
        status: 200,
        response: {
          responseCode: 200,
          message: 'User exists!'
        }
      },
      {
        url: /.*\/createAccount/,
        method: 'POST',
        status: 201,
        response: {
          responseCode: 201,
          message: 'User created!'
        }
      },
      {
        url: /.*\/deleteAccount/,
        method: 'DELETE',
        status: 200,
        response: {
          responseCode: 200,
          message: 'Account deleted!'
        }
      },
      {
        url: /.*\/getUserDetailByEmail/,
        method: 'GET',
        status: 200,
        response: {
          user: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            title: 'Mr',
            birth_date: '15',
            birth_month: 'January',
            birth_year: '1990',
            firstname: 'Test',
            lastname: 'User',
            company: 'Test Company',
            address1: '123 Test St',
            address2: 'Apt 1',
            country: 'United States',
            zipcode: '12345',
            state: 'CA',
            city: 'Test City',
            mobile_number: '+1234567890'
          }
        }
      }
    ];
  }

  /**
   * Crea un mock para APIs de productos
   */
  static createProductApiMocks(): MockRoute[] {
    return [
      {
        url: /.*\/productsList/,
        method: 'GET',
        status: 200,
        response: {
          products: [
            {
              id: 1,
              name: 'Blue Top',
              price: 'Rs. 500',
              brand: 'Polo',
              category: {
                usertype: {
                  usertype: 'Women'
                },
                category: 'Tops'
              }
            },
            {
              id: 2,
              name: 'Men Tshirt',
              price: 'Rs. 400',
              brand: 'H&M',
              category: {
                usertype: {
                  usertype: 'Men'
                },
                category: 'Tshirts'
              }
            }
          ]
        }
      },
      {
        url: /.*\/productDetail/,
        method: 'GET',
        status: 200,
        response: {
          product: {
            id: 1,
            name: 'Blue Top',
            price: 'Rs. 500',
            brand: 'Polo',
            category: {
              usertype: {
                usertype: 'Women'
              },
              category: 'Tops'
            },
            availability: 'In Stock',
            condition: 'New',
            description: 'Perfect blue top for casual wear'
          }
        }
      }
    ];
  }

  /**
   * Crea un mock para APIs de marcas
   */
  static createBrandApiMocks(): MockRoute[] {
    return [
      {
        url: /.*\/brandsList/,
        method: 'GET',
        status: 200,
        response: {
          brands: [
            { id: 1, brand: 'Polo' },
            { id: 2, brand: 'H&M' },
            { id: 3, brand: 'Madame' },
            { id: 4, brand: 'Mast & Harbour' },
            { id: 5, brand: 'Babyhug' },
            { id: 6, brand: 'Allen Solly Junior' },
            { id: 7, brand: 'Kookie Kids' },
            { id: 8, brand: 'Biba' }
          ]
        }
      }
    ];
  }

  /**
   * Crea mocks para errores de red
   */
  static createNetworkErrorMocks(): MockRoute[] {
    return [
      {
        url: /.*\/timeout/,
        method: 'GET',
        status: 408,
        response: { error: 'Request timeout' },
        delay: 5000
      },
      {
        url: /.*\/server-error/,
        method: 'GET',
        status: 500,
        response: { error: 'Internal server error' }
      },
      {
        url: /.*\/not-found/,
        method: 'GET',
        status: 404,
        response: { error: 'Not found' }
      }
    ];
  }
}

