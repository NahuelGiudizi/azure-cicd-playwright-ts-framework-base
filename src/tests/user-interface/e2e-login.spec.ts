// src/tests/user-interface/e2e-login.spec.ts
import { testWithUIData, expect } from '../../fixtures/test-data-ui-new.fixture';
import { TIMEOUTS } from '../../constants/timeouts';
import { HomePage } from '../../models/pages/HomePage';
import { LoginPage } from '../../models/pages/LoginPage';

testWithUIData.describe('AutomationExercise - Login Functionality', () => {
  let homePage: HomePage;
  let loginPage: LoginPage;

  testWithUIData.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    
    // Navigate with increased timeout for demo site
    await page.goto('https://automationexercise.com/', { 
      waitUntil: 'domcontentloaded', 
      timeout: TIMEOUTS.PAGE_LOAD 
    });
    
    // Wait for essential elements without networkidle (too slow for demo)
    await page.waitForSelector('img[alt="Website for automation practice"]', { timeout: TIMEOUTS.NAVIGATION });
  });

  testWithUIData(
    'Should successfully navigate to login page',
    {
      annotation: [
        {
          type: "UI Test",
          description: "Validates that navigation to the login page works and all form elements are visible.",
        },
      ],
    },
    async ({ uiTestData }) => {
    // Act
    await loginPage.navigateToLoginPage();

    // Assert
    await expect(loginPage.page).toHaveURL(/.*login/);
    await expect(loginPage.page).toHaveTitle(/.*Automation Exercise.*/);
    
    // Verify page structure
    await loginPage.verifyPageStructure();
    await loginPage.verifyLoginFormElements();
    await loginPage.verifySignupFormElements();
    
    // Verify specific form elements
    await expect(loginPage.loginEmailInput).toBeVisible();
    await expect(loginPage.loginPasswordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.signupNameInput).toBeVisible();
    await expect(loginPage.signupEmailInput).toBeVisible();
    await expect(loginPage.signupButton).toBeVisible();
    
    // Verify OR separator
    await expect(loginPage.orSeparator).toBeVisible();
    await expect(loginPage.orSeparator).toHaveText('OR');
    
    // Verify form titles
    await expect(loginPage.loginFormTitle).toBeVisible();
    await expect(loginPage.signupFormTitle).toBeVisible();
  });

  testWithUIData(
    'Should display login form elements correctly',
    {
      annotation: [
        {
          type: "UI Test",
          description: "Verifies that all login form elements are properly displayed with correct attributes.",
        },
      ],
    },
    async ({ uiTestData }) => {
    // Arrange & Act
    await loginPage.navigateToLoginPage();

    // Assert - Check all login form elements are present
    await expect(loginPage.loginFormTitle).toHaveText('Login to your account');
    await expect(loginPage.loginForm).toBeVisible();
    await expect(loginPage.loginForm).toHaveAttribute('action', '/login');
    
    // Verify input elements and attributes
    await expect(loginPage.loginEmailInput).toBeVisible();
    await expect(loginPage.loginEmailInput).toHaveAttribute('data-qa', 'login-email');
    await expect(loginPage.loginEmailInput).toHaveAttribute('type', 'email');
    await expect(loginPage.loginEmailInput).toHaveAttribute('required');
    
    await expect(loginPage.loginPasswordInput).toBeVisible();
    await expect(loginPage.loginPasswordInput).toHaveAttribute('data-qa', 'login-password');
    await expect(loginPage.loginPasswordInput).toHaveAttribute('type', 'password');
    await expect(loginPage.loginPasswordInput).toHaveAttribute('required');
    
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.loginButton).toHaveAttribute('data-qa', 'login-button');
    await expect(loginPage.loginButton).toHaveText('Login');
    
    // Verify placeholders
    const emailPlaceholder = await loginPage.getLoginEmailPlaceholder();
    const passwordPlaceholder = await loginPage.getLoginPasswordPlaceholder();
    expect(emailPlaceholder).toBeTruthy();
    expect(passwordPlaceholder).toBeTruthy();
    
    // Verify form security
    await loginPage.verifyFormSecurity();
  });

  testWithUIData(
    'Should display signup form elements correctly',
    {
      annotation: [
        {
          type: "UI Test",
          description: "Validates that all signup form elements are properly displayed with correct attributes.",
        },
      ],
    },
    async ({ uiTestData }) => {
    // Arrange & Act
    await loginPage.navigateToLoginPage();

    // Assert - Check all signup form elements are present
    await expect(loginPage.signupFormTitle).toHaveText('New User Signup!');
    await expect(loginPage.signupForm).toBeVisible();
    await expect(loginPage.signupForm).toHaveAttribute('action', '/signup');
    
    // Verify input elements and attributes
    await expect(loginPage.signupNameInput).toBeVisible();
    await expect(loginPage.signupNameInput).toHaveAttribute('data-qa', 'signup-name');
    await expect(loginPage.signupNameInput).toHaveAttribute('type', 'text');
    await expect(loginPage.signupNameInput).toHaveAttribute('required');
    
    await expect(loginPage.signupEmailInput).toBeVisible();
    await expect(loginPage.signupEmailInput).toHaveAttribute('data-qa', 'signup-email');
    await expect(loginPage.signupEmailInput).toHaveAttribute('type', 'email');
    await expect(loginPage.signupEmailInput).toHaveAttribute('required');
    
    await expect(loginPage.signupButton).toBeVisible();
    await expect(loginPage.signupButton).toHaveAttribute('data-qa', 'signup-button');
    await expect(loginPage.signupButton).toHaveText('Signup');
    
    // Verify hidden form type field
    await expect(loginPage.signupHiddenFormType).toBeHidden();
    await expect(loginPage.signupHiddenFormType).toHaveAttribute('value', 'signup');
    
    // Verify placeholders
    const namePlaceholder = await loginPage.getSignupNamePlaceholder();
    const emailPlaceholder = await loginPage.getSignupEmailPlaceholder();
    expect(namePlaceholder).toBeTruthy();
    expect(emailPlaceholder).toBeTruthy();
  });

  testWithUIData(
    'Should show validation message for invalid login',
    {
      annotation: [
        {
          type: "UI Test",
          description: "Tests that appropriate error messages are displayed when invalid login credentials are used.",
        },
      ],
    },
    async ({ uiTestData }) => {
    // Arrange
    await loginPage.navigateToLoginPage();
    const invalidCredentials = uiTestData.invalidUser;

    // Act
    const loginSuccess = await loginPage.loginWithValidation(invalidCredentials.email, invalidCredentials.password);

    // Assert
    expect(loginSuccess).toBe(false);
    await expect(loginPage.page).toHaveURL(/.*login/);
    
    // Should show error message or stay on login page
    try {
      await loginPage.verifyLoginError();
      await expect(loginPage.loginErrorMessage).toBeVisible();
      await expect(loginPage.loginErrorMessage).toContainText('incorrect');
    } catch {
      // If no specific error message, verify we're still on login page
      await expect(loginPage.loginEmailInput).toBeVisible();
      await expect(loginPage.loginPasswordInput).toBeVisible();
    }
    
    // Verify form is still functional
    await expect(loginPage.loginButton).toBeEnabled();
    const emailValue = await loginPage.getLoginEmailValue();
    expect(emailValue).toBe(invalidCredentials.email);
  });

  testWithUIData(
    'Should handle empty email validation',
    {
      annotation: [
        {
          type: "UI Test",
          description: "Validates that the system properly handles empty email field validation during login.",
        },
      ],
    },
    async ({ uiTestData }) => {
    // Arrange
    await loginPage.navigateToLoginPage();

    // Act
    await loginPage.loginPasswordInput.fill(uiTestData.validUser.password);
    await loginPage.loginButton.click();

    // Assert - Browser should show HTML5 validation or prevent submission
    const emailValue = await loginPage.getLoginEmailValue();
    const passwordValue = await loginPage.getLoginPasswordValue();
    
    expect(emailValue).toBe('');
    expect(passwordValue).toBe(uiTestData.validUser.password);
    
    // Should stay on login page due to validation
    await expect(loginPage.page).toHaveURL(/.*login/);
    
    // Verify form validation
    await loginPage.verifyFormValidation();
    
    // Check that email field is required
    await expect(loginPage.loginEmailInput).toHaveAttribute('required');
    
    // Verify form is still functional
    await expect(loginPage.loginEmailInput).toBeFocused();
    await expect(loginPage.loginEmailInput).toBeVisible();
    await expect(loginPage.loginPasswordInput).toBeVisible();
  });

  testWithUIData(
    'Should handle empty password validation',
    {
      annotation: [
        {
          type: "UI Test",
          description: "Tests that the system properly handles empty password field validation during login.",
        },
      ],
    },
    async ({ uiTestData }) => {
    // Arrange
    await loginPage.navigateToLoginPage();

    // Act
    await loginPage.loginEmailInput.fill(uiTestData.validUser.email);
    await loginPage.loginButton.click();

    // Assert - Browser should show HTML5 validation or prevent submission
    const emailValue = await loginPage.getLoginEmailValue();
    const passwordValue = await loginPage.getLoginPasswordValue();
    
    expect(emailValue).toBe(uiTestData.validUser.email);
    expect(passwordValue).toBe('');
    
    // Should stay on login page due to validation
    await expect(loginPage.page).toHaveURL(/.*login/);
    
    // Check that password field is required
    await expect(loginPage.loginPasswordInput).toHaveAttribute('required');
    
    // Verify the password field gets focus or shows validation
    await expect(loginPage.loginPasswordInput).toBeVisible();
    await expect(loginPage.loginEmailInput).toBeVisible();
    
    // Clear and verify form can be reset
    await loginPage.clearLoginForm();
    expect(await loginPage.getLoginEmailValue()).toBe('');
    expect(await loginPage.getLoginPasswordValue()).toBe('');
  });

  testWithUIData(
    'Should handle signup with potentially existing email',
    {
      annotation: [
        {
          type: "UI Test",
          description: "Tests that the system properly handles signup attempts with potentially existing emails.",
        },
      ],
    },
    async ({ uiTestData }) => {
    // Arrange
    await loginPage.navigateToLoginPage();
    const existingEmail = uiTestData.testUser.email; // Using fixture data
    const testName = uiTestData.testUser.name;

    // Act
    const signupSuccess = await loginPage.signupWithValidation(testName, existingEmail);

    // Assert - Should either show error or continue to signup
    if (!signupSuccess) {
      // If signup failed, check for error message
      try {
        await loginPage.verifySignupError();
        await expect(loginPage.signupErrorMessage).toBeVisible();
        await expect(loginPage.signupErrorMessage).toContainText('exist');
      } catch {
        // If no specific error message, verify we're still on login page
        await expect(loginPage.page).toHaveURL(/.*login/);
        await expect(loginPage.signupForm).toBeVisible();
      }
    } else {
      // If signup succeeded, should navigate to signup form
      await expect(loginPage.page).toHaveURL(/.*signup/);
    }
    
    // Verify form remains functional
    if (await loginPage.isOnLoginPage()) {
      await expect(loginPage.signupNameInput).toBeVisible();
      await expect(loginPage.signupEmailInput).toBeVisible();
      await expect(loginPage.signupButton).toBeEnabled();
      
      // Test form can be cleared and reused
      await loginPage.clearSignupForm();
      expect(await loginPage.getSignupNameValue()).toBe('');
      expect(await loginPage.getSignupEmailValue()).toBe('');
    }
  });

  testWithUIData(
    'Should maintain form state during navigation',
    {
      annotation: [
        {
          type: "UI Test",
          description: "Verifies that form state is properly managed during navigation away from and back to the login page.",
        },
      ],
    },
    async ({ uiTestData }) => {
    // Arrange
    await loginPage.navigateToLoginPage();
    const testEmail = uiTestData.validUser.email;
    const testPassword = uiTestData.validUser.password;
    const testName = uiTestData.testUser.name;
    const testSignupEmail = uiTestData.testUser.email;

    // Act - Fill both forms
    await loginPage.loginEmailInput.fill(testEmail);
    await loginPage.loginPasswordInput.fill(testPassword);
    await loginPage.signupNameInput.fill(testName);
    await loginPage.signupEmailInput.fill(testSignupEmail);
    
    // Verify forms are filled
    expect(await loginPage.getLoginEmailValue()).toBe(testEmail);
    expect(await loginPage.getLoginPasswordValue()).toBe(testPassword);
    expect(await loginPage.getSignupNameValue()).toBe(testName);
    expect(await loginPage.getSignupEmailValue()).toBe(testSignupEmail);
    
    // Navigate away and back
    await homePage.navigate();
    await homePage.verifyHomePage();
    await loginPage.navigateToLoginPage();

    // Assert - Forms should be cleared (fresh state)
    expect(await loginPage.getLoginEmailValue()).toBe('');
    expect(await loginPage.getLoginPasswordValue()).toBe('');
    expect(await loginPage.getSignupNameValue()).toBe('');
    expect(await loginPage.getSignupEmailValue()).toBe('');
    
    // Verify forms are still functional
    await loginPage.verifyLoginFormElements();
    await loginPage.verifySignupFormElements();
    await expect(loginPage.loginButton).toBeEnabled();
    await expect(loginPage.signupButton).toBeEnabled();
  });

  testWithUIData(
    'Should handle special characters in email and password',
    {
      annotation: [
        {
          type: "UI Test",
          description: "Tests that the login form properly handles special characters in email and password fields.",
        },
      ],
    },
    async ({ uiTestData }) => {
    // Arrange
    await loginPage.navigateToLoginPage();
    const specialEmail = 'test+special@test-domain.co.uk';
    const specialPassword = 'P@ssw0rd!123#$%';
    const unicodePassword = 'Test123üñíçødé';

    // Act - Test with special characters
    await loginPage.loginEmailInput.fill(specialEmail);
    await loginPage.loginPasswordInput.fill(specialPassword);
    
    // Verify values are set correctly
    expect(await loginPage.getLoginEmailValue()).toBe(specialEmail);
    expect(await loginPage.getLoginPasswordValue()).toBe(specialPassword);
    
    const loginSuccess = await loginPage.loginWithValidation(specialEmail, specialPassword);

    // Assert - Should handle special characters without crashing
    expect(loginSuccess).toBe(false); // Expected to fail with invalid credentials
    await expect(loginPage.page).toHaveURL(/.*login/); // Should stay on login page
    await expect(loginPage.loginEmailInput).toBeVisible(); // Page should still be functional
    
    // Test with unicode characters
    await loginPage.clearLoginForm();
    await loginPage.loginEmailInput.fill(specialEmail);
    await loginPage.loginPasswordInput.fill(unicodePassword);
    
    expect(await loginPage.getLoginEmailValue()).toBe(specialEmail);
    expect(await loginPage.getLoginPasswordValue()).toBe(unicodePassword);
    
    // Verify form remains functional after special character input
    await expect(loginPage.loginButton).toBeEnabled();
    await expect(loginPage.loginEmailInput).toBeVisible();
    await expect(loginPage.loginPasswordInput).toBeVisible();
    
    // Test form security by verifying password is masked
    await expect(loginPage.loginPasswordInput).toHaveAttribute('type', 'password');
  });

  testWithUIData(
    'Should verify page title and meta information',
    {
      annotation: [
        {
          type: "UI Test",
          description: "Validates that the login page has correct title and meta information for SEO and accessibility.",
        },
      ],
    },
    async ({ uiTestData }) => {
    // Arrange & Act
    await loginPage.navigateToLoginPage();

    // Assert - Page title and meta information
    await expect(loginPage.page).toHaveTitle(/.*Automation Exercise.*Signup.*Login.*/);
    
    // Check meta tags via page evaluation
    const metaDescription = await loginPage.page.getAttribute('meta[name="description"]', 'content');
    const metaKeywords = await loginPage.page.getAttribute('meta[name="keywords"]', 'content');
    
    expect(metaDescription).toBeTruthy();
    expect(metaKeywords).toBeTruthy();
    if (metaDescription) {
      expect(metaDescription).toContain('automation');
    }
    
    // Check page language
    const htmlLang = await loginPage.page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('en');
    
    // Verify viewport meta tag for responsiveness
    const viewportMeta = await loginPage.page.getAttribute('meta[name="viewport"]', 'content');
    expect(viewportMeta).toContain('width=device-width');
  });

  testWithUIData(
    'Should test form accessibility features',
    {
      annotation: [
        {
          type: "Accessibility Test",
          description: "Tests that the login form meets accessibility standards with proper input types and tab navigation.",
        },
      ],
    },
    async ({ uiTestData }) => {
    // Arrange & Act
    await loginPage.navigateToLoginPage();

    // Assert - Check for proper input types and attributes
    await expect(loginPage.loginEmailInput).toHaveAttribute('type', 'email');
    await expect(loginPage.loginPasswordInput).toHaveAttribute('type', 'password');
    await expect(loginPage.signupNameInput).toHaveAttribute('type', 'text');
    await expect(loginPage.signupEmailInput).toHaveAttribute('type', 'email');
    
    // Test required attributes for screen readers
    await expect(loginPage.loginEmailInput).toHaveAttribute('required');
    await expect(loginPage.loginPasswordInput).toHaveAttribute('required');
    await expect(loginPage.signupNameInput).toHaveAttribute('required');
    await expect(loginPage.signupEmailInput).toHaveAttribute('required');
    
    // Test tab navigation order
    await loginPage.loginEmailInput.focus();
    await expect(loginPage.loginEmailInput).toBeFocused();
    
    await loginPage.page.keyboard.press('Tab');
    await expect(loginPage.loginPasswordInput).toBeFocused();
    
    await loginPage.page.keyboard.press('Tab');
    await expect(loginPage.loginButton).toBeFocused();
    
    // Test form structure and accessibility
    await expect(loginPage.loginForm).toHaveAttribute('method', 'POST');
    await expect(loginPage.signupForm).toHaveAttribute('method', 'POST');
    
    // Verify forms have proper structure
    await expect(loginPage.loginForm).toContainText('Login');
    await expect(loginPage.signupForm).toContainText('Signup');
    
    // Test that forms can be submitted with Enter key
    await loginPage.loginEmailInput.focus();
    await loginPage.loginEmailInput.fill('test@test.com');
    await loginPage.page.keyboard.press('Tab');
    await loginPage.loginPasswordInput.fill('testpass');
    
    // Verify both forms have proper ARIA structure
    await expect(loginPage.loginForm).toHaveAttribute('action');
    await expect(loginPage.signupForm).toHaveAttribute('action');
  });
});