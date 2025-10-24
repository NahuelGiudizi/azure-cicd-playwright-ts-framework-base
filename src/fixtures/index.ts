// src/fixtures/index.ts

/**
 * Exportaciones centralizadas de fixtures y factories
 * Mantiene compatibilidad con fixtures existentes
 */

// Existing fixtures
export { testWithAPIData } from './test-data-api-new.fixture';
export { testWithUIData } from './test-data-ui-new.fixture';

// New data factories
export {
  UserFactory,
  ProductFactory,
  OrderFactory,
  CartItemFactory,
  userFactory,
  productFactory,
  orderFactory,
  cartItemFactory,
  testDataBuilder,
} from './data-factories';

// Re-export types for convenience
export type {
  Product,
  Brand,
  UserData,
  LoginCredentials,
} from './test-data-api-new.fixture';

export type {
  User,
  UserProfile,
  ContactForm,
} from '../models/user/user';

export type {
  Product as ProductModel,
  ProductDetails,
  ProductFilter,
  CartItem,
  Cart,
} from '../models/product/product';

// API Client fixtures
export {
  test,
  testWithMockApi,
  testWithStagingApi,
  createApiFixture,
  ApiConfigFactory
} from './api-client.fixture';

export type { ApiClientConfig, ApiFixtures } from './api-client.fixture';
