// src/tests/api/user-authentication.spec.ts
import { test, expect } from '@playwright/test';
import { UserController, LoginRequest, CreateAccountRequest } from '../../api-client/controllers/UserController';

test.describe('User Authentication API Tests', () => {
  let userController: UserController;

  test.beforeEach(async ({ request }) => {
    userController = new UserController(request);
    await userController.init();
  });

  test(
    'API 7: POST To Verify Login with valid details - Should return 200',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that user login with valid credentials returns 200 status and correct success message.",
        },
      ],
    },
    async ({ }) => {
    // Arrange
    const validCredentials: LoginRequest = {
      email: process.env.TEST_EMAIL || 'test.user@ngexample.com',
      password: process.env.TEST_PASSWORD || 'testpassword123'
    };

    // Act
    const { status, data } = await userController.verifyLogin(validCredentials);

    // Assert
    expect(status).toBe(200);
    expect(data).toHaveProperty('responseCode', 200);
    expect(data).toHaveProperty('message', 'User exists!');


  });

  test(
    'API 8: POST To Verify Login without email parameter - Should return 400',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that login attempt without email parameter returns 400 Bad Request error.",
        },
      ],
    },
    async () => {
    // Act
    const { status, data } = await userController.verifyLoginWithoutEmail('testpassword123');

    // Assert
    expect(status).toBe(200);
    expect(data).toHaveProperty('responseCode', 400);
    expect(data).toHaveProperty('message', 'Bad request, email or password parameter is missing in POST request.');

  
  });

  test(
    'API 9: DELETE To Verify Login - Should return 405',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that DELETE method on login endpoint returns 405 Method Not Allowed error.",
        },
      ],
    },
    async () => {
    // Act
    const { status, data } = await userController.deleteVerifyLogin();

    // Assert
    expect(status).toBe(200);
    expect(data).toHaveProperty('responseCode', 405);
    expect(data).toHaveProperty('message', 'This request method is not supported.');


  });

  test(
    'API 10: POST To Verify Login with invalid details - Should return 404',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that login with invalid credentials returns 404 User not found error.",
        },
      ],
    },
    async () => {
    // Act
    const { status, data } = await userController.verifyLoginWithInvalidCredentials();

    // Assert
    expect(status).toBe(200);
    expect(data).toHaveProperty('responseCode', 404);
    expect(data).toHaveProperty('message', 'User not found!');


  });

  test(
    'API 11: POST To Create/Register User Account - Should return 201',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates user account creation with complete profile data returns 201 status and success message.",
        },
      ],
    },
    async () => {
    // Arrange
    const userData: CreateAccountRequest = {
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

  test(
    'API 12: DELETE METHOD To Delete User Account - Should return 200',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that user account deletion returns 200 status and proper confirmation message.",
        },
      ],
    },
    async () => {
    // Arrange - First create a user to delete
    const userData: CreateAccountRequest = {
      name: `DeleteTestUser${Date.now()}`,
      email: `delete.test.${Date.now()}@example.com`,
      password: 'testpassword123',
      title: 'Mrs',
      birth_date: '20',
      birth_month: 'February',
      birth_year: '1985',
      firstname: 'Delete',
      lastname: 'Test',
      company: 'Delete Test Company',
      address1: '456 Delete Street',
      address2: '',
      country: 'Canada',
      zipcode: '54321',
      state: 'Ontario',
      city: 'Toronto',
      mobile_number: '+1987654321'
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

  test(
    'API 13: PUT METHOD To Update User Account - Should return 200',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that user account update with modified profile data returns 200 status and success message.",
        },
      ],
    },
    async () => {
    // Arrange - First create a user to update
    const originalData: CreateAccountRequest = {
      name: `UpdateTestUser${Date.now()}`,
      email: `update.test.${Date.now()}@example.com`,
      password: 'testpassword123',
      title: 'Mr',
      birth_date: '10',
      birth_month: 'March',
      birth_year: '1992',
      firstname: 'Update',
      lastname: 'Test',
      company: 'Original Company',
      address1: '789 Original Street',
      address2: '',
      country: 'Australia',
      zipcode: '98765',
      state: 'NSW',
      city: 'Sydney',
      mobile_number: '+61123456789'
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

  test(
    'API 14: GET user account detail by email - Should return 200',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that retrieving user details by email returns 200 status with complete user information.",
        },
      ],
    },
    async () => {
    // Arrange - First create a user to retrieve
    const userData: CreateAccountRequest = {
      name: `GetTestUser${Date.now()}`,
      email: `get.test.${Date.now()}@example.com`,
      password: 'testpassword123',
      title: 'Miss',
      birth_date: '25',
      birth_month: 'April',
      birth_year: '1995',
      firstname: 'Get',
      lastname: 'Test',
      company: 'Get Test Company',
      address1: '321 Get Street',
      address2: 'Unit 5',
      country: 'United Kingdom',
      zipcode: 'SW1A 1AA',
      state: 'England',
      city: 'London',
      mobile_number: '+44123456789'
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
    
    // Verify user details
    const user = data.user;
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

  test(
    'Edge Cases: Login with missing password parameter',
    {
      annotation: [
        {
          type: "API Test",
          description: "Tests edge case where login is attempted with missing or empty password parameter.",
        },
      ],
    },
    async () => {
    // Act
    const { status, data } = await userController.verifyLogin({
      email: 'test@example.com',
      password: ''
    });

    
    // Assert - API returns HTTP 200 but error details in response body
    expect(status).toBe(200);
    expect([400, 404]).toContain(data.responseCode);
    expect(data.message).toBeTruthy();
    

  });

  test(
    'Edge Cases: Create account with duplicate email',
    {
      annotation: [
        {
          type: "API Test",
          description: "Tests edge case where account creation is attempted with an already existing email address.",
        },
      ],
    },
    async () => {
    // Arrange
    const userData: CreateAccountRequest = {
      name: 'Duplicate Test',
      email: `duplicate.test.${Date.now()}@example.com`,
      password: 'testpassword123',
      title: 'Mr',
      birth_date: '1',
      birth_month: 'January',
      birth_year: '1990',
      firstname: 'Duplicate',
      lastname: 'Test',
      company: 'Duplicate Company',
      address1: '123 Duplicate Street',
      address2: '',
      country: 'United States',
      zipcode: '12345',
      state: 'California',
      city: 'Test City',
      mobile_number: '+1234567890'
    };

    // Create the user first time
    const firstResponse = await userController.createAccount(userData);
    expect(firstResponse.status).toBe(200);

    // Act - Try to create same user again
    const { status, data } = await userController.createAccount(userData);

    // Assert - Should handle duplicate email appropriately
  
    expect(status).toBe(200);
    expect(data.responseCode).toBe(400);
    expect(data.message).toBe('Email already exists!');
    


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
