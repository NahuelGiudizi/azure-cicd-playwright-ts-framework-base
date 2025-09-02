// src/api-client/controllers/index.ts
// AutomationExercise.com API Controllers
export * from './ProductsController';
export * from './BrandsController';
export * from './UserController';

// Re-export ApiClient as well for advanced customization
export { ApiClient } from '../base/ApiClient';