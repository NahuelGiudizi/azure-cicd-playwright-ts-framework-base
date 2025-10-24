// src/models/pages/index.ts

/**
 * Exportaciones centralizadas de páginas
 * Facilita la importación de páginas individuales
 */

// Páginas principales
export { HomePage } from './HomePage';
export { LoginPage } from './LoginPage';
export { ProductsPage } from './ProductsPage';

// Página del carrito con sus componentes
export { CartPage } from './cart/CartPage';
export * from './cart/components';

