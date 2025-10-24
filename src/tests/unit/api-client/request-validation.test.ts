// src/tests/unit/api-client/request-validation.test.ts

import { describe, it, expect } from 'vitest';
import { 
  LoginRequestSchema, 
  CreateAccountRequestSchema, 
  UpdateAccountRequestSchema,
  validateRequest,
  safeValidateRequest
} from '../../../api-client/schemas/request-schemas';

describe('Request Validation', () => {
  describe('LoginRequestSchema', () => {
    it('should validate valid login request', () => {
      const validRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      const result = LoginRequestSchema.parse(validRequest);
      expect(result).toEqual(validRequest);
    });

    it('should reject invalid email', () => {
      const invalidRequest = {
        email: 'invalid-email',
        password: 'password123'
      };

      expect(() => LoginRequestSchema.parse(invalidRequest)).toThrow();
    });

    it('should reject empty password', () => {
      const invalidRequest = {
        email: 'test@example.com',
        password: ''
      };

      expect(() => LoginRequestSchema.parse(invalidRequest)).toThrow();
    });
  });

  describe('CreateAccountRequestSchema', () => {
    it('should validate valid create account request', () => {
      const validRequest = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        title: 'Mr',
        birth_date: '15',
        birth_month: 'January',
        birth_year: '1990',
        firstname: 'Test',
        lastname: 'User',
        address1: '123 Test St',
        country: 'United States',
        zipcode: '12345',
        state: 'CA',
        city: 'Test City',
        mobile_number: '+1234567890'
      };

      const result = CreateAccountRequestSchema.parse(validRequest);
      expect(result).toEqual(validRequest);
    });

    it('should reject invalid title', () => {
      const invalidRequest = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        title: 'Invalid',
        birth_date: '15',
        birth_month: 'January',
        birth_year: '1990',
        firstname: 'Test',
        lastname: 'User',
        address1: '123 Test St',
        country: 'United States',
        zipcode: '12345',
        state: 'CA',
        city: 'Test City',
        mobile_number: '+1234567890'
      };

      expect(() => CreateAccountRequestSchema.parse(invalidRequest)).toThrow();
    });

    it('should reject short password', () => {
      const invalidRequest = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123',
        title: 'Mr',
        birth_date: '15',
        birth_month: 'January',
        birth_year: '1990',
        firstname: 'Test',
        lastname: 'User',
        address1: '123 Test St',
        country: 'United States',
        zipcode: '12345',
        state: 'CA',
        city: 'Test City',
        mobile_number: '+1234567890'
      };

      expect(() => CreateAccountRequestSchema.parse(invalidRequest)).toThrow();
    });
  });

  describe('UpdateAccountRequestSchema', () => {
    it('should validate partial update request', () => {
      const partialRequest = {
        email: 'newemail@example.com',
        mobile_number: '+9876543210'
      };

      const result = UpdateAccountRequestSchema.parse(partialRequest);
      expect(result).toEqual(partialRequest);
    });

    it('should validate empty update request', () => {
      const emptyRequest = {};

      const result = UpdateAccountRequestSchema.parse(emptyRequest);
      expect(result).toEqual(emptyRequest);
    });
  });

  describe('validateRequest helper', () => {
    it('should validate and return data on success', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const result = validateRequest(LoginRequestSchema, validData);
      expect(result).toEqual(validData);
    });

    it('should throw error with detailed message on failure', () => {
      const invalidData = {
        email: 'invalid-email',
        password: ''
      };

      expect(() => validateRequest(LoginRequestSchema, invalidData)).toThrow(/Request validation failed/);
    });
  });

  describe('safeValidateRequest helper', () => {
    it('should return success result for valid data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const result = safeValidateRequest(LoginRequestSchema, validData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
      expect(result.errors).toBeUndefined();
    });

    it('should return error result for invalid data', () => {
      const invalidData = {
        email: 'invalid-email',
        password: ''
      };

      const result = safeValidateRequest(LoginRequestSchema, invalidData);
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });
  });
});

