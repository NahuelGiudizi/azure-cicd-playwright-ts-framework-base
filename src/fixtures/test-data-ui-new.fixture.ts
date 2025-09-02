// src/fixtures/test-data-ui-new.fixture.ts
import { test as base } from '@playwright/test';

export interface UITestData {
  validUser: {
    name: string;
    email: string;
    password: string;
  };
  testUser: {
    name: string;
    email: string;
    password: string;
  };
  invalidUser: {
    email: string;
    password: string;
  };
  newUser: {
    name: string;
    email: string;
    password: string;
    title: string;
    birth_date: string;
    birth_month: string;
    birth_year: string;
    firstname: string;
    lastname: string;
    company: string;
    address1: string;
    address2: string;
    country: string;
    zipcode: string;
    state: string;
    city: string;
    mobile_number: string;
  };
  contactForm: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  searchTerms: {
    validProduct: string;
    invalidProduct: string;
    categoryProduct: string;
  };
  subscriptionEmail: string;
  productTestData: {
    expectedProductCount: number;
    sampleProductName: string;
    searchableProduct: string;
  };
}

export const uiTestData: UITestData = {
  validUser: {
    name: 'Test User',
    email: process.env.TEST_EMAIL || 'test.user@example.com',
    password: process.env.TEST_PASSWORD || 'testpassword123'
  },
  testUser: {
    name: process.env.TEST_USERNAME || 'TestUser',
    email: process.env.TEST_EMAIL || 'test.user@example.com',
    password: process.env.TEST_PASSWORD || 'testpassword123'
  },
  invalidUser: {
    email: 'invalid@test.com',
    password: 'wrongpassword'
  },
  newUser: {
    name: `TestUser${Date.now()}`,
    email: `test.user.${Date.now()}@example.com`,
    password: 'testpassword123',
    title: 'Mr',
    birth_date: '15',
    birth_month: 'January',
    birth_year: '1990',
    firstname: 'Test',
    lastname: 'User',
    company: 'Test Company Inc.',
    address1: '123 Test Street',
    address2: 'Apt 4B',
    country: 'United States',
    zipcode: '12345',
    state: 'California',
    city: 'Test City',
    mobile_number: '+1234567890'
  },
  contactForm: {
    name: 'Test Contact',
    email: 'test.contact@example.com',
    subject: 'Test Subject - Automated Testing',
    message: 'This is a test message sent via automated testing. Please ignore this message.'
  },
  searchTerms: {
    validProduct: 'top',
    invalidProduct: 'nonexistentproduct123',
    categoryProduct: 'dress'
  },
  subscriptionEmail: 'test.subscription@example.com',
  productTestData: {
    expectedProductCount: 34, // Based on AutomationExercise.com
    sampleProductName: 'Blue Top',
    searchableProduct: 'Blue Top'
  }
};

// Extend base test with UI test data
export const testWithUIData = base.extend<{ uiTestData: UITestData }>({
  uiTestData: async ({}, use) => {
    await use(uiTestData);
  },
});

export { expect } from '@playwright/test';



