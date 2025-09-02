// src/fixtures/test-data-api-new.fixture.ts
import { test as base } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Interfaces for AutomationExercise.com API
export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: {
    usertype: {
      usertype: string;
    };
    category: string;
  };
}

export interface Brand {
  id: number;
  brand: string;
}

export interface UserData {
  name: string;
  email: string;
  password: string;
  title: string;
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company?: string;
  address1: string;
  address2?: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Extend Playwright fixtures
export const testWithAPIData = base.extend({
  apiTestData: async ({ }, use) => {
    const apiTestData = {
      // Products API test data
      productsData: {
        expectedProductCount: 34,
        sampleProductNames: [
          "Blue Top",
          "Men Tshirt", 
          "Sleeveless Dress",
          "Stylish Dress"
        ],
        searchTerms: {
          valid: ["top", "tshirt", "dress", "jean"],
          invalid: ["nonexistent", "xyz123"],
          partial: ["blu", "men", "dres"]
        }
      },

      // Brands API test data
      brandsData: {
        expectedBrandCount: 8,
        sampleBrands: [
          "Polo",
          "H&M", 
          "Madame",
          "Mast & Harbour",
          "Babyhug",
          "Allen Solly Junior",
          "Kookie Kids",
          "Biba"
        ]
      },

      // User data for testing
      userData: {
        valid: {
          name: "Test User",
          email: `test.user.${Date.now()}@example.com`,
          password: "testpassword123",
          title: "Mr",
          birth_date: "15",
          birth_month: "January", 
          birth_year: "1990",
          firstname: "Test",
          lastname: "User",
          company: "Test Company Inc.",
          address1: "123 Test Street",
          address2: "Apt 4B",
          country: "United States",
          zipcode: "12345",
          state: "California",
          city: "Test City",
          mobile_number: "+1234567890"
        } as UserData,
        
        existing: {
          email: process.env.TEST_EMAIL || "test.user@example.com",
          password: process.env.TEST_PASSWORD || "testpassword123"
        } as LoginCredentials,

        invalid: {
          email: "invalid@test.com",
          password: "wrongpassword123"
        } as LoginCredentials
      },

      // API endpoints
      endpoints: {
        productsList: "/productsList",
        brandsList: "/brandsList", 
        searchProduct: "/searchProduct",
        verifyLogin: "/verifyLogin",
        createAccount: "/createAccount",
        deleteAccount: "/deleteAccount",
        updateAccount: "/updateAccount",
        getUserDetailByEmail: "/getUserDetailByEmail"
      },

      // Expected response codes
      expectedResponses: {
        success: 200,
        created: 201,
        badRequest: 400,
        notFound: 404,
        methodNotAllowed: 405
      },

      // Expected response messages
      expectedMessages: {
        userExists: "User exists!",
        userNotFound: "User not found!",
        userCreated: "User created!",
        accountDeleted: "Account deleted!",
        userUpdated: "User updated!",
        methodNotSupported: "This request method is not supported.",
        missingParameter: "Bad request, search_product parameter is missing in POST request.",
        missingEmailOrPassword: "Bad request, email or password parameter is missing in POST request."
      },

      // Form data for testing
      formData: {
        searchProduct: {
          valid: "top",
          empty: ""
        },
        loginMissingEmail: {
          password: "testpassword123"
        },
        loginMissingPassword: {
          email: "test@example.com"
        }
      },

      // Performance thresholds
      performance: {
        maxResponseTime: 5000, // 5 seconds
        expectedFastResponse: 2000 // 2 seconds
      },

      // Test scenarios for comprehensive coverage
      testScenarios: {
        products: {
          getAllProducts: {
            method: "GET",
            endpoint: "/productsList",
            expectedStatus: 200,
            description: "Get all products list"
          },
          postToProducts: {
            method: "POST", 
            endpoint: "/productsList",
            expectedStatus: 405,
            description: "POST to products list (should fail)"
          }
        },
        brands: {
          getAllBrands: {
            method: "GET",
            endpoint: "/brandsList",
            expectedStatus: 200,
            description: "Get all brands list"
          },
          putToBrands: {
            method: "PUT",
            endpoint: "/brandsList", 
            expectedStatus: 405,
            description: "PUT to brands list (should fail)"
          }
        },
        search: {
          searchWithParameter: {
            method: "POST",
            endpoint: "/searchProduct",
            expectedStatus: 200,
            description: "Search product with parameter"
          },
          searchWithoutParameter: {
            method: "POST",
            endpoint: "/searchProduct",
            expectedStatus: 400,
            description: "Search product without parameter (should fail)"
          }
        },
        authentication: {
          validLogin: {
            method: "POST",
            endpoint: "/verifyLogin",
            expectedStatus: 200,
            description: "Verify login with valid credentials"
          },
          invalidLogin: {
            method: "POST",
            endpoint: "/verifyLogin",
            expectedStatus: 404,
            description: "Verify login with invalid credentials"
          },
          loginMissingEmail: {
            method: "POST",
            endpoint: "/verifyLogin",
            expectedStatus: 400,
            description: "Verify login without email parameter"
          },
          deleteLogin: {
            method: "DELETE",
            endpoint: "/verifyLogin",
            expectedStatus: 405,
            description: "DELETE to verify login (should fail)"
          }
        }
      }
    };

    await use(apiTestData);
  },
});

export { expect } from '@playwright/test';



