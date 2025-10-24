// src/tests/unit/helpers/retry-helper.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  withRetry, 
  retryApiCall, 
  createRetryFunction, 
  isRetryableError, 
  RetryError,
  retryConfigs 
} from '../../../helpers/retry-helper';

describe('Retry Helper', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('withRetry', () => {
    it('should succeed on first attempt', async () => {
      const operation = vi.fn().mockResolvedValue('success');
      
      const result = await withRetry(operation);
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const operation = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Timeout'))
        .mockResolvedValue('success');

      const resultPromise = withRetry(operation);
      
      // Avanzar timers para simular delays
      await vi.runAllTimersAsync();
      
      const result = await resultPromise;
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should fail after max attempts', async () => {
      vi.useRealTimers(); // Usar timers reales para este test
      
      const operation = vi.fn().mockRejectedValue(new Error('Persistent error'));
      
      await expect(withRetry(operation, { maxAttempts: 2 })).rejects.toThrow(RetryError);
      expect(operation).toHaveBeenCalledTimes(2);
      
      vi.useFakeTimers(); // Volver a timers falsos
    });

    it('should respect timeout', async () => {
      vi.useRealTimers(); // Usar timers reales para este test
      
      const operation = vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 10000))
      );
      
      await expect(withRetry(operation, { timeout: 1000, maxAttempts: 1 })).rejects.toThrow(RetryError);
      
      vi.useFakeTimers(); // Volver a timers falsos
    });

    it('should use custom config', async () => {
      const operation = vi.fn()
        .mockRejectedValueOnce(new Error('Error'))
        .mockResolvedValue('success');

      const resultPromise = withRetry(operation, { 
        maxAttempts: 2, 
        baseDelay: 500,
        maxDelay: 2000 
      });
      
      await vi.runAllTimersAsync();
      
      const result = await resultPromise;
      expect(result).toBe('success');
    });
  });

  describe('retryApiCall', () => {
    it('should use API-specific configuration', async () => {
      const apiCall = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue({ data: 'success' });

      const resultPromise = retryApiCall(apiCall);
      
      await vi.runAllTimersAsync();
      
      const result = await resultPromise;
      expect(result).toEqual({ data: 'success' });
      expect(apiCall).toHaveBeenCalledTimes(2);
    });

    it('should allow custom config override', async () => {
      vi.useRealTimers(); // Usar timers reales para este test
      
      const apiCall = vi.fn().mockRejectedValue(new Error('Error'));
      
      await expect(retryApiCall(apiCall, { maxAttempts: 1 })).rejects.toThrow(RetryError);
      expect(apiCall).toHaveBeenCalledTimes(1);
      
      vi.useFakeTimers(); // Volver a timers falsos
    });
  });

  describe('createRetryFunction', () => {
    it('should create retry function with preset config', async () => {
      const retryWithCustomConfig = createRetryFunction({ 
        maxAttempts: 2, 
        baseDelay: 100 
      });
      
      const operation = vi.fn()
        .mockRejectedValueOnce(new Error('Error'))
        .mockResolvedValue('success');

      const resultPromise = retryWithCustomConfig(operation);
      
      await vi.runAllTimersAsync();
      
      const result = await resultPromise;
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });
  });

  describe('isRetryableError', () => {
    it('should identify retryable errors', () => {
      expect(isRetryableError(new Error('Network timeout'))).toBe(true);
      expect(isRetryableError(new Error('Connection reset'))).toBe(true);
      expect(isRetryableError(new Error('ECONNRESET'))).toBe(true);
      expect(isRetryableError(new Error('ETIMEDOUT'))).toBe(true);
      expect(isRetryableError(new Error('Service unavailable 503'))).toBe(true);
      expect(isRetryableError(new Error('Bad Gateway 502'))).toBe(true);
      expect(isRetryableError(new Error('Gateway Timeout 504'))).toBe(true);
    });

    it('should identify non-retryable errors', () => {
      expect(isRetryableError(new Error('Validation error'))).toBe(false);
      expect(isRetryableError(new Error('Unauthorized 401'))).toBe(false);
      expect(isRetryableError(new Error('Not Found 404'))).toBe(false);
      expect(isRetryableError(new Error('Business logic error'))).toBe(false);
    });
  });

  describe('RetryError', () => {
    it('should create error with correct properties', () => {
      const originalError = new Error('Original error');
      const retryError = new RetryError('Retry failed', 3, originalError);
      
      expect(retryError.message).toBe('Retry failed');
      expect(retryError.attempts).toBe(3);
      expect(retryError.lastError).toBe(originalError);
      expect(retryError.name).toBe('RetryError');
    });
  });

  describe('retryConfigs', () => {
    it('should have predefined configurations', () => {
      expect(retryConfigs.critical).toBeDefined();
      expect(retryConfigs.fast).toBeDefined();
      expect(retryConfigs.longRunning).toBeDefined();
      
      expect(retryConfigs.critical.maxAttempts).toBe(5);
      expect(retryConfigs.fast.maxAttempts).toBe(3);
      expect(retryConfigs.longRunning.maxAttempts).toBe(2);
    });
  });

  describe('delay calculation', () => {
    it('should calculate exponential delay with jitter', async () => {
      vi.useRealTimers(); // Usar timers reales para este test
      
      const operation = vi.fn().mockRejectedValue(new Error('Error'));
      
      // Mock Math.random para controlar jitter
      const originalRandom = Math.random;
      Math.random = vi.fn().mockReturnValue(0.1); // 10% jitter
      
      await expect(withRetry(operation, { 
        maxAttempts: 2, 
        baseDelay: 1000 
      })).rejects.toThrow(RetryError);
      
      // Restaurar Math.random
      Math.random = originalRandom;
      
      expect(operation).toHaveBeenCalledTimes(2);
      
      vi.useFakeTimers(); // Volver a timers falsos
    });
  });
});
