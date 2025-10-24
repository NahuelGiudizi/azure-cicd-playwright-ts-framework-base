// src/helpers/retry-helper.ts

/**
 * Configuración por defecto para el sistema de retry
 */
interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  timeout: number;
}

/**
 * Configuración por defecto del sistema de retry
 */
const DEFAULT_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000, // 1 segundo
  maxDelay: 30000, // 30 segundos máximo
  timeout: 30000,  // 30 segundos timeout total
};

/**
 * Error personalizado para operaciones de retry
 */
export class RetryError extends Error {
  constructor(
    message: string,
    public readonly attempts: number,
    public readonly lastError?: Error
  ) {
    super(message);
    this.name = 'RetryError';
  }
}

/**
 * Calcula el delay exponencial con jitter para evitar thundering herd
 * @param attempt Número de intento actual (0-based)
 * @param baseDelay Delay base en milisegundos
 * @param maxDelay Delay máximo en milisegundos
 * @returns Delay calculado en milisegundos
 */
function calculateDelay(attempt: number, baseDelay: number, maxDelay: number): number {
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 0.1 * exponentialDelay; // 10% de jitter
  return Math.min(exponentialDelay + jitter, maxDelay);
}

/**
 * Ejecuta una función con retry automático y backoff exponencial
 * @param operation Función a ejecutar que puede fallar
 * @param config Configuración de retry (opcional)
 * @returns Promise con el resultado de la operación
 * @throws RetryError si todos los intentos fallan
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt < finalConfig.maxAttempts; attempt++) {
    try {
      // Crear timeout para la operación
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Operation timeout')), finalConfig.timeout);
      });
      
      // Ejecutar operación con timeout
      const result = await Promise.race([operation(), timeoutPromise]);
      return result;
      
    } catch (error) {
      lastError = error as Error;
      
      // Si es el último intento, lanzar error
      if (attempt === finalConfig.maxAttempts - 1) {
        throw new RetryError(
          `Operation failed after ${finalConfig.maxAttempts} attempts`,
          finalConfig.maxAttempts,
          lastError
        );
      }
      
      // Calcular delay para el siguiente intento
      const delay = calculateDelay(attempt, finalConfig.baseDelay, finalConfig.maxDelay);
      
      // Log del retry (solo en desarrollo)
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Retry attempt ${attempt + 1}/${finalConfig.maxAttempts} failed. Retrying in ${delay}ms...`);
      }
      
      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // Este código nunca debería ejecutarse, pero TypeScript lo requiere
  throw new RetryError('Unexpected error in retry logic', finalConfig.maxAttempts, lastError);
}

/**
 * Wrapper específico para operaciones de red (API calls)
 * @param apiCall Función que realiza la llamada API
 * @param customConfig Configuración personalizada (opcional)
 * @returns Promise con el resultado de la API
 */
export async function retryApiCall<T>(
  apiCall: () => Promise<T>,
  customConfig: Partial<RetryConfig> = {}
): Promise<T> {
  // Configuración optimizada para API calls
  const apiConfig: Partial<RetryConfig> = {
    maxAttempts: 3,
    baseDelay: 2000, // 2 segundos para APIs
    maxDelay: 30000,
    timeout: 30000,
    ...customConfig,
  };
  
  return withRetry(apiCall, apiConfig);
}

/**
 * Helper para crear operaciones de retry con configuración específica
 * @param config Configuración de retry
 * @returns Función de retry con configuración preestablecida
 */
export function createRetryFunction(config: Partial<RetryConfig>) {
  return <T>(operation: () => Promise<T>): Promise<T> => {
    return withRetry(operation, config);
  };
}

/**
 * Verifica si un error es recuperable para retry
 * @param error Error a evaluar
 * @returns true si el error es recuperable
 */
export function isRetryableError(error: Error): boolean {
  // Errores de red que pueden ser temporales
  const retryablePatterns = [
    /timeout/i,
    /network/i,
    /connection/i,
    /ECONNRESET/i,
    /ETIMEDOUT/i,
    /ENOTFOUND/i,
    /503/i, // Service Unavailable
    /502/i, // Bad Gateway
    /504/i, // Gateway Timeout
  ];
  
  const errorMessage = error.message.toLowerCase();
  return retryablePatterns.some(pattern => pattern.test(errorMessage));
}

/**
 * Configuraciones predefinidas para diferentes tipos de operaciones
 */
export const retryConfigs = {
  /**
   * Configuración para operaciones críticas (más intentos)
   */
  critical: {
    maxAttempts: 5,
    baseDelay: 1000,
    maxDelay: 30000,
    timeout: 45000,
  },
  
  /**
   * Configuración para operaciones rápidas (menos delay)
   */
  fast: {
    maxAttempts: 3,
    baseDelay: 500,
    maxDelay: 5000,
    timeout: 15000,
  },
  
  /**
   * Configuración para operaciones de larga duración
   */
  longRunning: {
    maxAttempts: 2,
    baseDelay: 5000,
    maxDelay: 60000,
    timeout: 120000,
  },
} as const;

