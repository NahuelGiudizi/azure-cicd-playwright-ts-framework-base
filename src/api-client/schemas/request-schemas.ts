// src/api-client/schemas/request-schemas.ts

import { z } from 'zod';

/**
 * Esquemas de validación Zod para requests de API
 * Proporciona validación de tipos y datos antes del envío HTTP
 */

// Esquema para LoginRequest
export const LoginRequestSchema = z.object({
  email: z.string().email('Email debe ser válido'),
  password: z.string().min(1, 'Password es requerido'),
});

// Esquema para CreateAccountRequest
export const CreateAccountRequestSchema = z.object({
  name: z.string().min(1, 'Name es requerido'),
  email: z.string().email('Email debe ser válido'),
  password: z.string().min(8, 'Password debe tener al menos 8 caracteres'),
  title: z.enum(['Mr', 'Mrs', 'Miss'], {
    message: 'Title debe ser Mr, Mrs o Miss'
  }),
  birth_date: z.string().regex(/^\d{1,2}$/, 'Birth date debe ser un número de 1-2 dígitos'),
  birth_month: z.string().min(1, 'Birth month es requerido'),
  birth_year: z.string().regex(/^\d{4}$/, 'Birth year debe ser un año válido de 4 dígitos'),
  firstname: z.string().min(1, 'Firstname es requerido'),
  lastname: z.string().min(1, 'Lastname es requerido'),
  company: z.string().optional(),
  address1: z.string().min(1, 'Address1 es requerido'),
  address2: z.string().optional(),
  country: z.string().min(1, 'Country es requerido'),
  zipcode: z.string().min(1, 'Zipcode es requerido'),
  state: z.string().min(1, 'State es requerido'),
  city: z.string().min(1, 'City es requerido'),
  mobile_number: z.string().min(1, 'Mobile number es requerido'),
});

// Esquema para UpdateAccountRequest
export const UpdateAccountRequestSchema = CreateAccountRequestSchema.partial();

// Esquema para ProductRequest (si existe)
export const ProductRequestSchema = z.object({
  name: z.string().min(1, 'Product name es requerido'),
  price: z.string().regex(/^\d+\.?\d*$/, 'Price debe ser un número válido'),
  brand: z.string().min(1, 'Brand es requerido'),
  category: z.string().min(1, 'Category es requerido'),
});

// Esquema para OrderRequest
export const OrderRequestSchema = z.object({
  order_id: z.string().min(1, 'Order ID es requerido'),
  product_id: z.string().min(1, 'Product ID es requerido'),
  quantity: z.string().regex(/^\d+$/, 'Quantity debe ser un número entero'),
});

// Tipos inferidos de los esquemas
export type ValidatedLoginRequest = z.infer<typeof LoginRequestSchema>;
export type ValidatedCreateAccountRequest = z.infer<typeof CreateAccountRequestSchema>;
export type ValidatedUpdateAccountRequest = z.infer<typeof UpdateAccountRequestSchema>;
export type ValidatedProductRequest = z.infer<typeof ProductRequestSchema>;
export type ValidatedOrderRequest = z.infer<typeof OrderRequestSchema>;

// Función helper para validar requests
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join('\n');
      throw new Error(`Request validation failed:\n${errorMessages}`);
    }
    throw error;
  }
}

// Función helper para validar requests de forma segura (no lanza error)
export function safeValidateRequest<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      return { success: false, errors: errorMessages };
    }
    return { success: false, errors: ['Unknown validation error'] };
  }
}
