// src/configs/index.ts

/**
 * Exportaciones centralizadas de configuraciones
 * Mantiene compatibilidad con configuraciones existentes
 */

// Existing configurations
export { baseConfig } from './base.config';

// New environment validation
export {
  env,
  getEnvConfig,
} from './env-validation';

// Re-export types for convenience
export type { EnvConfig } from './env-validation';

