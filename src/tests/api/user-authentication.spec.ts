// src/tests/api/user-authentication.spec.ts
import { testWithAPIData, expect } from '../../fixtures/test-data-api-new.fixture';
import { UserController } from '../../api-client/controllers/UserController';
import { LoginRequestSchema, CreateAccountRequestSchema } from '../../api-client/schemas/request-schemas';
import { LoginResponse, ErrorResponse } from '../../api-client/types/api-responses';
import { ApiResponse } from '../../api-client/base/ApiClient';
import { z } from 'zod';

// Definir tipos basados en los esquemas Zod
type LoginRequest = z.infer<typeof LoginRequestSchema>;
type CreateAccountRequest = z.infer<typeof CreateAccountRequestSchema>;
type UserDetailResponse = {
  responseCode: number;
  message: string;
  user: {
    email: string;
    name: string;
    first_name: string;
    last_name: string;
  };
};

testWithAPIData.describe('User Authentication API Tests', () => {
  let userController: UserController;

  testWithAPIData.beforeEach(async ({ request }) => {
    userController = new UserController(request);
    await userController.init();
  });

  testWithAPIData(
    'API 7: POST To Verify Login with valid details - Should return 200',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that user login with valid credentials returns 200 status and correct success message.",
        },
      ],
    },
    async ({ apiTestData }) => {
    // Arrange - Create a user first, then test login
    const userData: CreateAccountRequest = {
      ...apiTestData.userData.valid,
      name: `LoginTestUser${Date.now()}`,
      email: `login.test.${Date.now()}@example.com`,
      firstname: 'Login',
      lastname: 'Test'
    };

    // Create the user first
    const createResponse = await userController.createAccount(userData);
    expect(createResponse.status).toBe(200);

    const validCredentials: LoginRequest = {
      email: userData.email,
      password: userData.password
    };

    // Act
    const { status, data } = await userController.verifyLogin(validCredentials);

    // Assert
    expect(status).toBe(200);
    expect(data).toHaveProperty('responseCode', 200);
    expect(data).toHaveProperty('message', 'User exists!');

    // Cleanup
    try {
      await userController.deleteAccount({
        email: userData.email,
        password: userData.password
      });
    } catch (error) {
      console.warn('Cleanup failed:', error);
    }


  });

  testWithAPIData(
    'API 8: POST To Verify Login without email parameter - Should return 400',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that login attempt without email parameter returns 400 Bad Request error.",
        },
      ],
    },
    async ({ apiTestData }) => {
    // Act
    const { status, data } = await userController.verifyLoginWithoutEmail('testpassword123');

    // Assert
    expect(status).toBe(200);
    expect(data).toHaveProperty('responseCode', 400);
    expect(data).toHaveProperty('message', 'Bad request, email or password parameter is missing in POST request.');

  
  });

  testWithAPIData(
    'API 9: DELETE To Verify Login - Should return 405',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that DELETE method on login endpoint returns 405 Method Not Allowed error.",
        },
      ],
    },
    async ({ apiTestData }) => {
    // Act
    const { status, data } = await userController.deleteVerifyLogin();

    // Assert
    expect(status).toBe(200);
    expect(data).toHaveProperty('responseCode', 405);
    expect(data).toHaveProperty('message', 'This request method is not supported.');


  });

  testWithAPIData(
    'API 10: POST To Verify Login with invalid details - Should return 404',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that login with invalid credentials returns 404 User not found error.",
        },
      ],
    },
    async ({ apiTestData }) => {
    // Act
    const { status, data } = await userController.verifyLogin(apiTestData.userData.invalid);

    // Assert
    expect(status).toBe(200);
    expect(data).toHaveProperty('responseCode', 404);
    expect(data).toHaveProperty('message', 'User not found!');


  });

  testWithAPIData(
    'API 11: POST To Create/Register User Account - Should return 201',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates user account creation with complete profile data returns 201 status and success message.",
        },
      ],
    },
    async ({ apiTestData }) => {
    // Arrange
    const userData: CreateAccountRequest = {
      ...apiTestData.userData.valid,
      name: `TestUser${Date.now()}`,
      email: `test.user.${Date.now()}@example.com`
    };

    // Act
    const { status, data } = await userController.createAccount(userData);

    // Assert
    expect(status).toBe(200);
    expect(data).toHaveProperty('responseCode', 201);
    expect(data).toHaveProperty('message', 'User created!');

    

    // Cleanup: Delete the created account
    try {
      await userController.deleteAccount({
        email: userData.email,
        password: userData.password
      });

    } catch (error) {
      
    }
  });

  testWithAPIData(
    'API 12: DELETE METHOD To Delete User Account - Should return 200',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that user account deletion returns 200 status and proper confirmation message.",
        },
      ],
    },
    async ({ apiTestData }) => {
    // Arrange - First create a user to delete
    const userData: CreateAccountRequest = {
      ...apiTestData.userData.valid,
      name: `DeleteTestUser${Date.now()}`,
      email: `delete.test.${Date.now()}@example.com`,
      firstname: 'Delete',
      lastname: 'Test'
    };

    // Create the user first
    const createResponse = await userController.createAccount(userData);
    expect(createResponse.status).toBe(200);

    // Act - Delete the user
    const { status, data } = await userController.deleteAccount({
      email: userData.email,
      password: userData.password
    });

    // Assert
    expect(status).toBe(200);
    expect(data).toHaveProperty('responseCode', 200);
    expect(data).toHaveProperty('message', 'Account deleted!');

    
  });

  testWithAPIData(
    'API 13: PUT METHOD To Update User Account - Should return 200',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that user account update with modified profile data returns 200 status and success message.",
        },
      ],
    },
    async ({ apiTestData }) => {
    // Arrange - First create a user to update
    const originalData: CreateAccountRequest = {
      ...apiTestData.userData.valid,
      name: `UpdateTestUser${Date.now()}`,
      email: `update.test.${Date.now()}@example.com`,
      firstname: 'Update',
      lastname: 'Test',
      company: 'Original Company'
    };

    // Create the user first
    const createResponse = await userController.createAccount(originalData);
    expect(createResponse.status).toBe(200);

    // Prepare updated data
    const updatedData = {
      ...originalData,
      company: 'Updated Company Ltd.',
      address1: '789 Updated Street',
      city: 'Melbourne'
    };

    // Act - Update the user
    const { status, data } = await userController.updateAccount(updatedData);

    // Assert
    expect(status).toBe(200);
    expect(data).toHaveProperty('responseCode', 200);
    expect(data).toHaveProperty('message', 'User updated!');

  

    // Cleanup
    try {
      await userController.deleteAccount({
        email: originalData.email,
        password: originalData.password
      });
     
    } catch (error) {
     
    }
  });

  testWithAPIData(
    'API 14: GET user account detail by email - Should return 200',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that retrieving user details by email returns 200 status with complete user information.",
        },
      ],
    },
    async ({ apiTestData }) => {
    // Arrange - First create a user to retrieve
    const userData: CreateAccountRequest = {
      ...apiTestData.userData.valid,
      name: `GetTestUser${Date.now()}`,
      email: `get.test.${Date.now()}@example.com`,
      firstname: 'Get',
      lastname: 'Test',
      company: 'Get Test Company'
    };

    // Create the user first
    const createResponse = await userController.createAccount(userData);
    expect(createResponse.status).toBe(200);

    // Act - Get user details
    const { status, data } = await userController.getUserDetailByEmail(userData.email);

    // Assert
    expect(status).toBe(200);
    expect(data).toHaveProperty('responseCode', 200);
    expect(data).toHaveProperty('user');
    
    // Type assertion para acceder a la propiedad user
    const userDetailData = data as UserDetailResponse;
    const user = userDetailData.user;
    expect(user).toHaveProperty('email', userData.email);
    expect(user).toHaveProperty('name', userData.name);
    expect(user).toHaveProperty('first_name', userData.firstname);
    expect(user).toHaveProperty('last_name', userData.lastname);



    // Cleanup
    try {
      await userController.deleteAccount({
        email: userData.email,
        password: userData.password
      });

    } catch (error) {

    }
  });

  testWithAPIData(
    'Edge Cases: Login with missing password parameter',
    {
      annotation: [
        {
          type: "API Test",
          description: "Tests edge case where login is attempted with missing or empty password parameter.",
        },
      ],
    },
    async ({ apiTestData }) => {
    // Act
    const { status, data } = await userController.verifyLogin({
      email: 'test@example.com',
      password: ''
    });

    
    // Assert - API returns HTTP 200 but error details in response body
    expect(status).toBe(200);
    
    // Type assertion para acceder a las propiedades de error
    const errorData = data as ErrorResponse;
    expect([400, 404]).toContain(errorData.responseCode);
    expect(errorData.message).toBeTruthy();
    

  });

  testWithAPIData(
    'Edge Cases: Create account with duplicate email',
    {
      annotation: [
        {
          type: "API Test",
          description: "Tests edge case where account creation is attempted with an already existing email address.",
        },
      ],
    },
    async ({ apiTestData }) => {
    // Arrange
    const userData: CreateAccountRequest = {
      ...apiTestData.userData.valid,
      name: 'Duplicate Test',
      email: `duplicate.test.${Date.now()}@example.com`,
      firstname: 'Duplicate',
      lastname: 'Test',
      company: 'Duplicate Company'
    };

    // Create the user first time
    const firstResponse = await userController.createAccount(userData);
    expect(firstResponse.status).toBe(200);

    // Act - Try to create same user again
    const { status, data } = await userController.createAccount(userData);

    // Assert - Should handle duplicate email appropriately
  
    expect(status).toBe(200);
    
    // Type assertion para acceder a las propiedades de error
    const errorData = data as ErrorResponse;
    expect(errorData.responseCode).toBe(400);
    expect(errorData.message).toBe('Email already exists!');
    


    // Cleanup
    try {
      await userController.deleteAccount({
        email: userData.email,
        password: userData.password
      });
    } catch (error) {
    }
  });
});
