// src/tests/unit/helpers/env-validation.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Environment Validation', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Guardar variables de entorno originales
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Restaurar variables de entorno originales
    process.env = originalEnv;
  });

  describe('env object', () => {
    it('should validate email format', () => {
      process.env.TEST_EMAIL = 'invalid-email';
      
      expect(() => {
        require('../../../../configs/env-validation');
      }).toThrow();
    });

    it('should validate URL format', () => {
      process.env.BASE_URL = 'not-a-url';
      
      expect(() => {
        require('../../../../configs/env-validation');
      }).toThrow();
    });

    it('should validate password minimum length', () => {
      process.env.TEST_PASSWORD = '123';
      
      expect(() => {
        require('../../../../configs/env-validation');
      }).toThrow();
    });
  });
});