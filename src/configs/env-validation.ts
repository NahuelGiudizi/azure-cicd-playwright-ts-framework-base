// src/configs/env-validation.ts
import { z } from 'zod';

/**
 * Schema de validación para variables de entorno usando Zod
 * Mantiene compatibilidad con el sistema actual de configuración
 */
const envSchema = z.object({
  // URLs base
  BASE_URL: z.string().url().default('https://automationexercise.com'),
  API_BASE_URL: z.string().url().default('https://automationexercise.com/api'),
  
  // Credenciales de usuario de prueba
  TEST_EMAIL: z.string().email().default('test.user@ngexample.com'),
  TEST_PASSWORD: z.string().min(8).default('testpassword123'),
  TEST_USERNAME: z.string().min(3).default('TestUser'),
  
  // Configuración de email (opcional)
  EMAIL_USER: z.string().email().optional(),
  EMAIL_PASS: z.string().optional(),
  EMAIL_RECIPIENTS: z.string().optional(),
  
  // Variables de entorno adicionales para CI/CD
  CI: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Valida y parsea las variables de entorno
 * @returns Objeto con variables de entorno validadas
 * @throws Error si alguna variable requerida no es válida
 */
function validateEnv(): z.infer<typeof envSchema> {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError && error.errors) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join('\n');
      
      throw new Error(`Variables de entorno inválidas:\n${errorMessages}`);
    }
    throw error;
  }
}

/**
 * Objeto exportado con variables de entorno validadas
 * Compatible con el sistema actual de configuración
 */
export const env = validateEnv();

/**
 * Helper para obtener configuración específica
 */
export const getEnvConfig = {
  /**
   * Obtiene la URL base para tests UI
   */
  getBaseUrl: () => env.BASE_URL,
  
  /**
   * Obtiene la URL base para tests API
   */
  getApiBaseUrl: () => env.API_BASE_URL,
  
  /**
   * Obtiene credenciales de usuario de prueba
   */
  getTestCredentials: () => ({
    email: env.TEST_EMAIL,
    password: env.TEST_PASSWORD,
    username: env.TEST_USERNAME,
  }),
  
  /**
   * Verifica si está en modo CI
   */
  isCI: () => !!env.CI,
  
  /**
   * Obtiene configuración de email si está disponible
   */
  getEmailConfig: () => ({
    user: env.EMAIL_USER,
    password: env.EMAIL_PASS,
    recipients: env.EMAIL_RECIPIENTS,
  }),
};

// Re-exportar tipos para uso externo
export type EnvConfig = z.infer<typeof envSchema>;
