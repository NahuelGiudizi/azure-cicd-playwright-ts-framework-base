// src/models/pages/LoginPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    
    // Navigation Elements
    readonly signupLoginLink: Locator;
    readonly homeLink: Locator;
    readonly productsLink: Locator;
    readonly cartLink: Locator;
    
    // Main Form Section
    readonly formSection: Locator;
    readonly loginFormContainer: Locator;
    readonly signupFormContainer: Locator;
    
    // Login Form Elements - Using data-qa attributes (most robust)
    readonly loginFormTitle: Locator;
    readonly loginForm: Locator;
    readonly loginEmailInput: Locator;
    readonly loginPasswordInput: Locator;
    readonly loginButton: Locator;
    
    // Signup Form Elements - Using data-qa attributes (most robust)
    readonly signupFormTitle: Locator;
    readonly signupForm: Locator;
    readonly signupNameInput: Locator;
    readonly signupEmailInput: Locator;
    readonly signupButton: Locator;
    readonly signupHiddenFormType: Locator;
    
    // OR Separator
    readonly orSeparator: Locator;
    
    // Post-Login Elements (when logged in)
    readonly loggedInUsername: Locator;
    readonly logoutLink: Locator;
    readonly deleteAccountLink: Locator;
    
    // Error/Success Messages
    readonly loginErrorMessage: Locator;
    readonly signupErrorMessage: Locator;
    readonly successMessage: Locator;
    
    // Footer Subscription
    readonly subscriptionSection: Locator;
    readonly subscriptionEmailInput: Locator;
    readonly subscriptionButton: Locator;
    readonly subscriptionSuccessMessage: Locator;
    
    // CSRF Token (for form security)
    readonly csrfToken: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Navigation Elements - Using href attributes for reliability
        this.signupLoginLink = page.locator('a[href="/login"]');
        this.homeLink = page.locator('a[href="/"]');
        this.productsLink = page.locator('a[href="/products"]');
        this.cartLink = page.locator('a[href="/view_cart"]');
        
        // Main Form Section - Using ID and classes
        this.formSection = page.locator('#form');
        this.loginFormContainer = page.locator('.login-form');
        this.signupFormContainer = page.locator('.signup-form');
        
        // Login Form Elements - Using data-qa attributes (most robust approach)
        this.loginFormTitle = page.locator('.login-form h2:has-text("Login to your account")');
        this.loginForm = page.locator('.login-form form[action="/login"]');
        this.loginEmailInput = page.locator('input[data-qa="login-email"]');
        this.loginPasswordInput = page.locator('input[data-qa="login-password"]');
        this.loginButton = page.locator('button[data-qa="login-button"]');
        
        // Signup Form Elements - Using data-qa attributes (most robust approach)
        this.signupFormTitle = page.locator('.signup-form h2:has-text("New User Signup!")');
        this.signupForm = page.locator('.signup-form form[action="/signup"]');
        this.signupNameInput = page.locator('input[data-qa="signup-name"]');
        this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
        this.signupButton = page.locator('button[data-qa="signup-button"]');
        this.signupHiddenFormType = page.locator('input[name="form_type"][value="signup"]');
        
        // OR Separator
        this.orSeparator = page.locator('h2.or:has-text("OR")');
        
        // Post-Login Elements (when user is logged in)
        this.loggedInUsername = page.locator('.nav.navbar-nav b').first();
        this.logoutLink = page.locator('a[href="/logout"]:has-text("Logout")');
        this.deleteAccountLink = page.locator('a[href="/delete_account"]:has-text("Delete Account")');
        
        // Error/Success Messages - More specific selectors
        this.loginErrorMessage = page.locator('.login-form p:has-text("Your email or password is incorrect!")');
        this.signupErrorMessage = page.locator('.signup-form p:has-text("Email Address already exist!")');
        this.successMessage = page.locator('.alert-success');
        
        // Footer Subscription Section
        this.subscriptionSection = page.locator('.single-widget:has(h2:has-text("Subscription"))');
        this.subscriptionEmailInput = page.locator('#susbscribe_email');
        this.subscriptionButton = page.locator('#subscribe');
        this.subscriptionSuccessMessage = page.locator('#success-subscribe .alert-success');
        
        // CSRF Token (for security testing)
        this.csrfToken = page.locator('.login-form input[name="csrfmiddlewaretoken"]').first();
    }

    // Navigation Methods
    async navigateToLoginPage(): Promise<void> {
        await this.signupLoginLink.click();
        await expect(this.page).toHaveURL(/.*login/);
        await this.waitForPageLoad();
    }

    async navigateToHomePage(): Promise<void> {
        await this.homeLink.click();
        await expect(this.page).toHaveURL(/.*\//);
    }

    async navigateToProducts(): Promise<void> {
        await this.productsLink.click();
        await expect(this.page).toHaveURL(/.*products/);
    }

    async navigateToCart(): Promise<void> {
        await this.cartLink.click();
        await expect(this.page).toHaveURL(/.*view_cart/);
    }

    // Form Verification Methods
    async verifyLoginFormElements(): Promise<void> {
        await expect(this.loginFormTitle).toBeVisible();
        await expect(this.loginForm).toBeVisible();
        await expect(this.loginEmailInput).toBeVisible();
        await expect(this.loginPasswordInput).toBeVisible();
        await expect(this.loginButton).toBeVisible();
    }

    async verifySignupFormElements(): Promise<void> {
        await expect(this.signupFormTitle).toBeVisible();
        await expect(this.signupForm).toBeVisible();
        await expect(this.signupNameInput).toBeVisible();
        await expect(this.signupEmailInput).toBeVisible();
        await expect(this.signupButton).toBeVisible();
    }

    async verifyPageStructure(): Promise<void> {
        await expect(this.formSection).toBeVisible();
        await expect(this.loginFormContainer).toBeVisible();
        await expect(this.signupFormContainer).toBeVisible();
        await expect(this.orSeparator).toBeVisible();
    }

    // Login Methods
    async login(email: string, password: string): Promise<void> {
        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(password);
        await this.loginButton.click();
        // Wait for navigation or error message
        await this.page.waitForLoadState('networkidle');
    }

    async loginWithValidation(email: string, password: string): Promise<boolean> {
        await this.login(email, password);
        
        // Check if login was successful by checking URL or logged in state
        try {
            await expect(this.page).not.toHaveURL(/.*login/, { timeout: 3000 });
            return true;
        } catch {
            return false;
        }
    }

    async clearLoginForm(): Promise<void> {
        await this.loginEmailInput.clear();
        await this.loginPasswordInput.clear();
    }

    // Signup Methods
    async signup(name: string, email: string): Promise<void> {
        await this.signupNameInput.fill(name);
        await this.signupEmailInput.fill(email);
        await this.signupButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async signupWithValidation(name: string, email: string): Promise<boolean> {
        await this.signup(name, email);
        
        // Check if signup was successful by checking URL change
        try {
            await expect(this.page).toHaveURL(/.*signup/, { timeout: 3000 });
            return true;
        } catch {
            return false;
        }
    }

    async clearSignupForm(): Promise<void> {
        await this.signupNameInput.clear();
        await this.signupEmailInput.clear();
    }

    // Post-Login Methods
    async logout(): Promise<void> {
        await this.logoutLink.click();
        await expect(this.page).toHaveURL(/.*login/);
    }

    async deleteAccount(): Promise<void> {
        await this.deleteAccountLink.click();
        // Usually goes to account deletion confirmation page
        await this.page.waitForLoadState('networkidle');
    }

    // Verification Methods
    async verifyLoginSuccess(expectedUsername?: string): Promise<void> {
        await expect(this.loggedInUsername).toBeVisible();
        await expect(this.logoutLink).toBeVisible();
        await expect(this.deleteAccountLink).toBeVisible();
        
        if (expectedUsername) {
            await expect(this.loggedInUsername).toContainText(expectedUsername);
        }
    }

    async verifyLoginError(): Promise<void> {
        await expect(this.loginErrorMessage).toBeVisible();
    }

    async verifySignupError(): Promise<void> {
        await expect(this.signupErrorMessage).toBeVisible();
    }

    async verifyFormValidation(): Promise<void> {
        // Test HTML5 validation by trying to submit empty forms
        await this.loginButton.click();
        
        // Check that we're still on login page (form validation prevented submission)
        await expect(this.page).toHaveURL(/.*login/);
    }

    // State Checking Methods
    async isLoggedIn(): Promise<boolean> {
        try {
            return await this.loggedInUsername.isVisible();
        } catch {
            return false;
        }
    }

    async getCurrentUsername(): Promise<string> {
        if (await this.isLoggedIn()) {
            return await this.loggedInUsername.textContent() || '';
        }
        return '';
    }

    async isOnLoginPage(): Promise<boolean> {
        return this.page.url().includes('/login');
    }

    // Input Validation Methods
    async getLoginEmailValue(): Promise<string> {
        return await this.loginEmailInput.inputValue();
    }

    async getLoginPasswordValue(): Promise<string> {
        return await this.loginPasswordInput.inputValue();
    }

    async getSignupNameValue(): Promise<string> {
        return await this.signupNameInput.inputValue();
    }

    async getSignupEmailValue(): Promise<string> {
        return await this.signupEmailInput.inputValue();
    }

    // Form Attributes Methods
    async getLoginEmailPlaceholder(): Promise<string> {
        return await this.loginEmailInput.getAttribute('placeholder') || '';
    }

    async getLoginPasswordPlaceholder(): Promise<string> {
        return await this.loginPasswordInput.getAttribute('placeholder') || '';
    }

    async getSignupNamePlaceholder(): Promise<string> {
        return await this.signupNameInput.getAttribute('placeholder') || '';
    }

    async getSignupEmailPlaceholder(): Promise<string> {
        return await this.signupEmailInput.getAttribute('placeholder') || '';
    }

    // Security Methods
    async getCsrfToken(): Promise<string> {
        return await this.csrfToken.getAttribute('value') || '';
    }

    async verifyFormSecurity(): Promise<void> {
        // Verify CSRF tokens are present (hidden inputs should exist, not be visible)
        await expect(this.csrfToken).toBeAttached();
        
        // Verify forms have proper action URLs
        await expect(this.loginForm).toHaveAttribute('action', '/login');
        await expect(this.signupForm).toHaveAttribute('action', '/signup');
        
        // Verify required attributes
        await expect(this.loginEmailInput).toHaveAttribute('required');
        await expect(this.loginPasswordInput).toHaveAttribute('required');
        await expect(this.signupNameInput).toHaveAttribute('required');
        await expect(this.signupEmailInput).toHaveAttribute('required');
    }

    // Subscription Methods (footer)
    async subscribeToNewsletter(email: string): Promise<void> {
        await this.subscriptionEmailInput.fill(email);
        await this.subscriptionButton.click();
    }

    async verifySubscriptionSuccess(): Promise<void> {
        await expect(this.subscriptionSuccessMessage).toBeVisible();
    }

    // Utility Methods
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
        await expect(this.formSection).toBeVisible();
    }

    async takeScreenshotOnError(testName: string): Promise<void> {
        await this.page.screenshot({ 
            path: `screenshots/${testName}-error-${Date.now()}.png`,
            fullPage: true 
        });
    }

    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }

    async focusOnLoginEmail(): Promise<void> {
        await this.loginEmailInput.focus();
    }

    async focusOnSignupName(): Promise<void> {
        await this.signupNameInput.focus();
    }

    // Accessibility Methods
    async verifyAccessibility(): Promise<void> {
        // Check input types
        await expect(this.loginEmailInput).toHaveAttribute('type', 'email');
        await expect(this.loginPasswordInput).toHaveAttribute('type', 'password');
        await expect(this.signupEmailInput).toHaveAttribute('type', 'email');
        
        // Test tab navigation
        await this.loginEmailInput.focus();
        await this.page.keyboard.press('Tab');
        await expect(this.loginPasswordInput).toBeFocused();
    }
}



