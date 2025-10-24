// src/tests/unit/helpers/mocking.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockServer, MockServerFactory, MockRoute } from '../../../helpers/mocking/mock-server';

// Mock de Page de Playwright
const mockPage = {
  route: vi.fn(),
  unrouteAll: vi.fn()
};

describe('Mock Server', () => {
  let mockServer: MockServer;

  beforeEach(() => {
    vi.clearAllMocks();
    mockServer = new MockServer(mockPage as any, { baseUrl: 'https://test.com' });
  });

  describe('addRoute', () => {
    it('should add route to routes map', () => {
      const route: MockRoute = {
        url: '/api/test',
        method: 'GET',
        status: 200,
        response: { data: 'test' }
      };

      mockServer.addRoute(route);
      
      // Verificar que la ruta se agregó (acceso interno para testing)
      const routes = (mockServer as any).routes;
      expect(routes.size).toBe(1);
    });
  });

  describe('setupMocks', () => {
    it('should call page.route for each added route', async () => {
      const route: MockRoute = {
        url: '/api/test',
        method: 'GET',
        status: 200,
        response: { data: 'test' }
      };

      mockServer.addRoute(route);
      await mockServer.setupMocks();

      expect(mockPage.route).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearMocks', () => {
    it('should call page.unrouteAll and clear routes', async () => {
      const route: MockRoute = {
        url: '/api/test',
        method: 'GET',
        status: 200,
        response: { data: 'test' }
      };

      mockServer.addRoute(route);
      await mockServer.clearMocks();

      expect(mockPage.unrouteAll).toHaveBeenCalledTimes(1);
      
      // Verificar que las rutas se limpiaron
      const routes = (mockServer as any).routes;
      expect(routes.size).toBe(0);
    });
  });
});

describe('MockServerFactory', () => {
  describe('createUserApiMocks', () => {
    it('should create user API mock routes', () => {
      const mocks = MockServerFactory.createUserApiMocks();
      
      expect(mocks).toBeDefined();
      expect(mocks.length).toBeGreaterThan(0);
      
      // Verificar que contiene las rutas esperadas
      const hasVerifyLogin = mocks.some(mock => 
        mock.url.toString().includes('verifyLogin')
      );
      const hasCreateAccount = mocks.some(mock => 
        mock.url.toString().includes('createAccount')
      );
      const hasDeleteAccount = mocks.some(mock => 
        mock.url.toString().includes('deleteAccount')
      );
      
      expect(hasVerifyLogin).toBe(true);
      expect(hasCreateAccount).toBe(true);
      expect(hasDeleteAccount).toBe(true);
    });

    it('should have correct response structure for verifyLogin', () => {
      const mocks = MockServerFactory.createUserApiMocks();
      const verifyLoginMock = mocks.find(mock => 
        mock.url.toString().includes('verifyLogin')
      );
      
      expect(verifyLoginMock).toBeDefined();
      expect(verifyLoginMock!.status).toBe(200);
      expect(verifyLoginMock!.response).toHaveProperty('responseCode', 200);
      expect(verifyLoginMock!.response).toHaveProperty('message', 'User exists!');
    });
  });

  describe('createProductApiMocks', () => {
    it('should create product API mock routes', () => {
      const mocks = MockServerFactory.createProductApiMocks();
      
      expect(mocks).toBeDefined();
      expect(mocks.length).toBeGreaterThan(0);
      
      // Verificar que contiene las rutas esperadas
      const hasProductsList = mocks.some(mock => 
        mock.url.toString().includes('productsList')
      );
      const hasProductDetail = mocks.some(mock => 
        mock.url.toString().includes('productDetail')
      );
      
      expect(hasProductsList).toBe(true);
      expect(hasProductDetail).toBe(true);
    });

    it('should have correct product data structure', () => {
      const mocks = MockServerFactory.createProductApiMocks();
      const productsListMock = mocks.find(mock => 
        mock.url.toString().includes('productsList')
      );
      
      expect(productsListMock).toBeDefined();
      expect(productsListMock!.response).toHaveProperty('products');
      expect(Array.isArray((productsListMock!.response as any).products)).toBe(true);
    });
  });

  describe('createBrandApiMocks', () => {
    it('should create brand API mock routes', () => {
      const mocks = MockServerFactory.createBrandApiMocks();
      
      expect(mocks).toBeDefined();
      expect(mocks.length).toBeGreaterThan(0);
      
      // Verificar que contiene la ruta esperada
      const hasBrandsList = mocks.some(mock => 
        mock.url.toString().includes('brandsList')
      );
      
      expect(hasBrandsList).toBe(true);
    });

    it('should have correct brand data structure', () => {
      const mocks = MockServerFactory.createBrandApiMocks();
      const brandsListMock = mocks.find(mock => 
        mock.url.toString().includes('brandsList')
      );
      
      expect(brandsListMock).toBeDefined();
      expect(brandsListMock!.response).toHaveProperty('brands');
      expect(Array.isArray((brandsListMock!.response as any).brands)).toBe(true);
    });
  });

  describe('createNetworkErrorMocks', () => {
    it('should create network error mock routes', () => {
      const mocks = MockServerFactory.createNetworkErrorMocks();
      
      expect(mocks).toBeDefined();
      expect(mocks.length).toBeGreaterThan(0);
      
      // Verificar que contiene diferentes tipos de errores
      const hasTimeout = mocks.some(mock => 
        mock.url.toString().includes('timeout')
      );
      const hasServerError = mocks.some(mock => 
        mock.url.toString().includes('server-error')
      );
      const hasNotFound = mocks.some(mock => 
        mock.url.toString().includes('not-found')
      );
      
      expect(hasTimeout).toBe(true);
      expect(hasServerError).toBe(true);
      expect(hasNotFound).toBe(true);
    });

    it('should have correct error status codes', () => {
      const mocks = MockServerFactory.createNetworkErrorMocks();
      
      const timeoutMock = mocks.find(mock => 
        mock.url.toString().includes('timeout')
      );
      const serverErrorMock = mocks.find(mock => 
        mock.url.toString().includes('server-error')
      );
      const notFoundMock = mocks.find(mock => 
        mock.url.toString().includes('not-found')
      );
      
      expect(timeoutMock!.status).toBe(408);
      expect(serverErrorMock!.status).toBe(500);
      expect(notFoundMock!.status).toBe(404);
    });
  });
});

