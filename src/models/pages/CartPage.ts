// src/models/pages/CartPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    
    // Header Elements
    readonly header: Locator;
    readonly logo: Locator;
    readonly shopMenu: Locator;
    readonly homeLink: Locator;
    readonly productsLink: Locator;
    readonly cartLink: Locator;
    readonly signupLoginLink: Locator;
    readonly testCasesLink: Locator;
    readonly apiTestingLink: Locator;
    readonly videoTutorialsLink: Locator;
    readonly contactUsLink: Locator;
    
    // Main Cart Section
    readonly cartItemsSection: Locator;
    readonly cartContainer: Locator;
    
    // Breadcrumbs
    readonly breadcrumbs: Locator;
    readonly breadcrumbList: Locator;
    readonly homecrumb: Locator;
    readonly cartTitle: Locator;
    
    // Cart Table Elements - Using IDs (most robust)
    readonly cartInfoContainer: Locator;
    readonly cartTable: Locator;
    readonly cartTableHead: Locator;
    readonly cartMenu: Locator;
    readonly cartTableBody: Locator;
    readonly cartItems: Locator;
    
    // Table Header Elements
    readonly itemHeader: Locator;
    readonly descriptionHeader: Locator;
    readonly priceHeader: Locator;
    readonly quantityHeader: Locator;
    readonly totalHeader: Locator;
    
    // Product Row Elements
    readonly productRows: Locator;
    readonly cartProducts: Locator;
    readonly productImages: Locator;
    readonly cartDescriptions: Locator;
    readonly productNames: Locator;
    readonly productLinks: Locator;
    readonly productCategories: Locator;
    readonly cartPrices: Locator;
    readonly productPrices: Locator;
    readonly cartQuantities: Locator;
    readonly productQuantities: Locator;
    readonly quantityButtons: Locator;
    readonly cartTotals: Locator;
    readonly productTotals: Locator;
    readonly cartDeletes: Locator;
    readonly deleteButtons: Locator;
    
    // Action Section
    readonly doActionSection: Locator;
    readonly proceedToCheckoutButton: Locator;
    
    // Checkout Modal Elements - Using ID (most robust)
    readonly checkoutModal: Locator;
    readonly checkoutModalDialog: Locator;
    readonly checkoutModalContent: Locator;
    readonly checkoutModalHeader: Locator;
    readonly checkoutModalTitle: Locator;
    readonly checkoutModalBody: Locator;
    readonly checkoutModalFooter: Locator;
    readonly registerLoginLink: Locator;
    readonly registerLoginLinkText: Locator;
    readonly continueOnCartButton: Locator;
    readonly closeCheckoutModalButton: Locator;
    
    // Empty Cart Elements - Using ID
    readonly emptyCartSpan: Locator;
    readonly emptyCartMessage: Locator;
    readonly emptyCartLink: Locator;
    
    // Footer Elements
    readonly footer: Locator;
    readonly footerWidget: Locator;
    readonly footerBottom: Locator;
    readonly copyrightText: Locator;
    
    // Subscription Section (in footer) - Using ID
    readonly subscriptionSection: Locator;
    readonly subscriptionTitle: Locator;
    readonly subscriptionForm: Locator;
    readonly subscriptionEmailInput: Locator;
    readonly subscriptionButton: Locator;
    readonly subscriptionDescription: Locator;
    readonly subscriptionSuccessMessage: Locator;
    readonly subscriptionCsrfToken: Locator;
    
    // Scroll Elements
    readonly scrollUpButton: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Header Elements - Using href attributes for reliability
        this.header = page.locator('#header');
        this.logo = page.locator('img[alt="Website for automation practice"]');
        this.shopMenu = page.locator('.shop-menu.pull-right');
        this.homeLink = page.locator('a[href="/"]').first();
        this.productsLink = page.locator('a[href="/products"]').first();
        this.cartLink = page.locator('a[href="/view_cart"]');
        this.signupLoginLink = page.locator('a[href="/login"]').first();
        this.testCasesLink = page.locator('a[href="/test_cases"]');
        this.apiTestingLink = page.locator('a[href="/api_list"]');
        this.videoTutorialsLink = page.locator('a[href="https://www.youtube.com/c/AutomationExercise"]');
        this.contactUsLink = page.locator('a[href="/contact_us"]');
        
        // Main Cart Section - Using ID (most robust)
        this.cartItemsSection = page.locator('#cart_items');
        this.cartContainer = page.locator('#cart_items .container');
        
        // Breadcrumbs
        this.breadcrumbs = page.locator('.breadcrumbs');
        this.breadcrumbList = page.locator('.breadcrumb');
        this.homecrumb = page.locator('.breadcrumb a[href="/"]');
        this.cartTitle = page.locator('.breadcrumb .active:has-text("Shopping Cart")');
        
        // Cart Table Elements - Using IDs (most robust approach)
        this.cartInfoContainer = page.locator('#cart_info');
        this.cartTable = page.locator('#cart_info_table');
        this.cartTableHead = page.locator('#cart_info_table thead');
        this.cartMenu = page.locator('#cart_info_table .cart_menu');
        this.cartTableBody = page.locator('#cart_info_table tbody');
        this.cartItems = page.locator('#cart_info_table tbody tr[id^="product-"]');
        
        // Table Header Elements - Using specific class selectors
        this.itemHeader = page.locator('.cart_menu .image:has-text("Item")');
        this.descriptionHeader = page.locator('.cart_menu .description:has-text("Description")');
        this.priceHeader = page.locator('.cart_menu .price:has-text("Price")');
        this.quantityHeader = page.locator('.cart_menu .quantity:has-text("Quantity")');
        this.totalHeader = page.locator('.cart_menu .total:has-text("Total")');
        
        // Product Row Elements - Using specific class combinations
        this.productRows = page.locator('#cart_info_table tbody tr[id^="product-"]');
        this.cartProducts = page.locator('.cart_product');
        this.productImages = page.locator('.cart_product img.product_image');
        this.cartDescriptions = page.locator('.cart_description');
        this.productNames = page.locator('.cart_description h4 a[href*="/product_details/"]');
        this.productLinks = page.locator('.cart_description h4 a');
        this.productCategories = page.locator('.cart_description p');
        this.cartPrices = page.locator('.cart_price');
        this.productPrices = page.locator('.cart_price p');
        this.cartQuantities = page.locator('.cart_quantity');
        this.productQuantities = page.locator('.cart_quantity button.disabled');
        this.quantityButtons = page.locator('.cart_quantity button');
        this.cartTotals = page.locator('.cart_total');
        this.productTotals = page.locator('.cart_total .cart_total_price');
        this.cartDeletes = page.locator('.cart_delete');
        this.deleteButtons = page.locator('.cart_delete .cart_quantity_delete[data-product-id]');
        
        // Action Section - Using ID
        this.doActionSection = page.locator('#do_action');
        this.proceedToCheckoutButton = page.locator('.btn.btn-default.check_out:has-text("Proceed To Checkout")');
        
        // Checkout Modal Elements - Using ID (most robust approach)
        this.checkoutModal = page.locator('#checkoutModal.modal');
        this.checkoutModalDialog = page.locator('#checkoutModal .modal-dialog');
        this.checkoutModalContent = page.locator('#checkoutModal .modal-content');
        this.checkoutModalHeader = page.locator('#checkoutModal .modal-header');
        this.checkoutModalTitle = page.locator('#checkoutModal .modal-title:has-text("Checkout")');
        this.checkoutModalBody = page.locator('#checkoutModal .modal-body');
        this.checkoutModalFooter = page.locator('#checkoutModal .modal-footer');
        this.registerLoginLink = page.locator('#checkoutModal a[href="/login"]');
        this.registerLoginLinkText = page.locator('#checkoutModal a[href="/login"] u:has-text("Register / Login")');
        this.continueOnCartButton = page.locator('#checkoutModal button.close-checkout-modal:has-text("Continue On Cart")');
        this.closeCheckoutModalButton = page.locator('#checkoutModal [data-dismiss="modal"]');
        
        // Empty Cart Elements - Using ID
        this.emptyCartSpan = page.locator('#empty_cart');
        this.emptyCartMessage = page.locator('#empty_cart p:has-text("Cart is empty!")');
        this.emptyCartLink = page.locator('#empty_cart a[href="/products"]:has-text("here")');
        
        // Footer Elements - Using ID
        this.footer = page.locator('#footer');
        this.footerWidget = page.locator('.footer-widget');
        this.footerBottom = page.locator('.footer-bottom');
        this.copyrightText = page.locator('.footer-bottom p:has-text("Copyright © 2021")');
        
        // Subscription Section (in footer) - Using ID
        this.subscriptionSection = page.locator('.single-widget:has(h2:has-text("Subscription"))');
        this.subscriptionTitle = page.locator('.single-widget h2:has-text("Subscription")');
        this.subscriptionForm = page.locator('.single-widget form.searchform');
        this.subscriptionEmailInput = page.locator('#susbscribe_email');
        this.subscriptionButton = page.locator('#subscribe');
        this.subscriptionDescription = page.locator('.single-widget p');
        this.subscriptionSuccessMessage = page.locator('#success-subscribe .alert-success');
        this.subscriptionCsrfToken = page.locator('.single-widget input[name="csrfmiddlewaretoken"]');
        
        // Scroll Elements - Using ID
        this.scrollUpButton = page.locator('#scrollUp');
    }

    // Navigation Methods
    async navigateToCart(): Promise<void> {
        await this.page.goto('/view_cart');
        await this.waitForPageLoad();
    }

    async navigateToHome(): Promise<void> {
        await this.homeLink.click();
        await expect(this.page).toHaveURL(/.*\/$/);
    }

    async navigateToProducts(): Promise<void> {
        await this.productsLink.click();
        await expect(this.page).toHaveURL(/.*products/);
    }

    async navigateToLogin(): Promise<void> {
        await this.signupLoginLink.click();
        await expect(this.page).toHaveURL(/.*login/);
    }

    async clickHomeBreadcrumb(): Promise<void> {
        await this.homecrumb.click();
        await expect(this.page).toHaveURL(/.*\/$/);
    }

    // Cart Information Methods
    async getCartItemCount(): Promise<number> {
        try {
            await this.cartItems.first().waitFor({ state: 'visible', timeout: 3000 });
            return await this.cartItems.count();
        } catch {
            return 0;
        }
    }

    async getProductNames(): Promise<string[]> {
        if (await this.isCartEmpty()) {
            return [];
        }
        await this.productNames.first().waitFor({ state: 'visible' });
        return await this.productNames.allTextContents();
    }

    async getProductPrices(): Promise<string[]> {
        if (await this.isCartEmpty()) {
            return [];
        }
        await this.productPrices.first().waitFor({ state: 'visible' });
        return await this.productPrices.allTextContents();
    }

    async getProductQuantities(): Promise<string[]> {
        if (await this.isCartEmpty()) {
            return [];
        }
        await this.productQuantities.first().waitFor({ state: 'visible' });
        return await this.productQuantities.allTextContents();
    }

    async getProductTotals(): Promise<string[]> {
        if (await this.isCartEmpty()) {
            return [];
        }
        await this.productTotals.first().waitFor({ state: 'visible' });
        return await this.productTotals.allTextContents();
    }

    async getProductCategories(): Promise<string[]> {
        if (await this.isCartEmpty()) {
            return [];
        }
        await this.productCategories.first().waitFor({ state: 'visible' });
        return await this.productCategories.allTextContents();
    }

    async getProductById(productId: string): Promise<{ name: string; price: string; quantity: string; total: string; category: string } | null> {
        const productRow = this.productRows.filter({ hasText: productId }).first();
        
        if (!(await productRow.isVisible())) {
            return null;
        }

        const name = await productRow.locator('.cart_description h4 a').textContent() || '';
        const price = await productRow.locator('.cart_price p').textContent() || '';
        const quantity = await productRow.locator('.cart_quantity button').textContent() || '';
        const total = await productRow.locator('.cart_total .cart_total_price').textContent() || '';
        const category = await productRow.locator('.cart_description p').textContent() || '';

        return { name, price, quantity, total, category };
    }

    async getProductByIndex(index: number): Promise<{ name: string; price: string; quantity: string; total: string; category: string; productId: string }> {
        const productRow = this.productRows.nth(index);
        await productRow.waitFor({ state: 'visible' });

        const name = await productRow.locator('.cart_description h4 a').textContent() || '';
        const price = await productRow.locator('.cart_price p').textContent() || '';
        const quantity = await productRow.locator('.cart_quantity button').textContent() || '';
        const total = await productRow.locator('.cart_total .cart_total_price').textContent() || '';
        const category = await productRow.locator('.cart_description p').textContent() || '';
        const productId = await productRow.locator('.cart_delete .cart_quantity_delete').getAttribute('data-product-id') || '';

        return { name, price, quantity, total, category, productId };
    }

    // Product Removal Methods
    async removeProductByIndex(index: number): Promise<void> {
        const initialCount = await this.getCartItemCount();
        await this.deleteButtons.nth(index).click();
        await this.page.waitForLoadState('networkidle');
        
        // Wait for the item to be removed
        await this.page.waitForFunction((count) => {
            const currentItems = document.querySelectorAll('#cart_info_table tbody tr[id^="product-"]');
            return currentItems.length < count;
        }, initialCount);
    }

    async removeProductByName(productName: string): Promise<void> {
        const productNames = await this.getProductNames();
        const index = productNames.findIndex(name => name.toLowerCase().includes(productName.toLowerCase()));
        
        if (index === -1) {
            throw new Error(`Product "${productName}" not found in cart`);
        }
        
        await this.removeProductByIndex(index);
    }

    async removeProductById(productId: string): Promise<void> {
        const deleteButton = this.deleteButtons.locator(`[data-product-id="${productId}"]`).first();
        
        if (!(await deleteButton.isVisible())) {
            throw new Error(`Product with ID "${productId}" not found in cart`);
        }
        
        await deleteButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async removeAllProducts(): Promise<void> {
        const itemCount = await this.getCartItemCount();
        for (let i = 0; i < itemCount; i++) {
            await this.removeProductByIndex(0); // Always remove first item as indices change
            await this.page.waitForTimeout(1000); // Wait for UI update
        }
        await this.verifyCartIsEmpty();
    }

    // Product Details Methods
    async clickProductLink(index: number): Promise<void> {
        await this.productLinks.nth(index).click();
        await expect(this.page).toHaveURL(/.*product_details/);
    }

    async clickProductLinkByName(productName: string): Promise<void> {
        const productLink = this.productLinks.filter({ hasText: productName }).first();
        await productLink.click();
        await expect(this.page).toHaveURL(/.*product_details/);
    }

    async getProductImageSrc(index: number): Promise<string> {
        return await this.productImages.nth(index).getAttribute('src') || '';
    }

    // Checkout Methods
    async proceedToCheckout(): Promise<void> {
        await this.proceedToCheckoutButton.click();
        
        // Check if modal appears (for non-logged in users)
        try {
            await expect(this.checkoutModal).toBeVisible({ timeout: 3000 });
        } catch {
            // If no modal, user is logged in and checkout proceeds directly
            await expect(this.page).toHaveURL(/.*checkout/);
        }
    }

    async proceedToCheckoutAsGuest(): Promise<void> {
        await this.proceedToCheckoutButton.click();
        
        // Wait for modal to appear
        await expect(this.checkoutModal).toBeVisible();
        
        // Click register/login link
            await this.registerLoginLink.click();
        await expect(this.page).toHaveURL(/.*login/);
    }

    async proceedToCheckoutAsLoggedInUser(): Promise<void> {
        await this.proceedToCheckoutButton.click();
        
        // Should navigate directly to checkout without modal
        await expect(this.page).toHaveURL(/.*checkout/);
    }

    async closeCheckoutModal(): Promise<void> {
        await expect(this.checkoutModal).toBeVisible();
        await this.continueOnCartButton.click();
        await expect(this.checkoutModal).toBeHidden();
    }

    async handleCheckoutModal(): Promise<void> {
        await expect(this.checkoutModal).toBeVisible();
        await expect(this.checkoutModalTitle).toBeVisible();
        await expect(this.registerLoginLink).toBeVisible();
        await expect(this.continueOnCartButton).toBeVisible();
    }

    // Shopping Methods
    async continueShopping(): Promise<void> {
        await this.emptyCartLink.click();
        await expect(this.page).toHaveURL(/.*products/);
    }

    async subscribeToNewsletter(email: string): Promise<void> {
        await this.subscriptionEmailInput.fill(email);
        await this.subscriptionButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async verifySubscriptionSuccess(): Promise<void> {
        await expect(this.subscriptionSuccessMessage).toBeVisible();
    }

    // State Checking Methods
    async isCartEmpty(): Promise<boolean> {
        try {
            // Check if empty cart message is visible
            const emptyMessageVisible = await this.emptyCartMessage.isVisible();
            if (emptyMessageVisible) {
                return true;
            }
            
            // Check if cart items count is 0
            const itemCount = await this.getCartItemCount();
            return itemCount === 0;
        } catch {
            return true;
        }
    }

    async isCartVisible(): Promise<boolean> {
        return await this.cartTable.isVisible();
    }

    async isCheckoutModalVisible(): Promise<boolean> {
        return await this.checkoutModal.isVisible();
    }

    // Verification Methods
    async verifyCartIsEmpty(): Promise<void> {
        await expect(this.emptyCartSpan).toBeVisible();
        await expect(this.emptyCartMessage).toBeVisible();
        await expect(this.emptyCartLink).toBeVisible();
    }

    async verifyCartHasItems(): Promise<void> {
        const itemCount = await this.getCartItemCount();
        expect(itemCount).toBeGreaterThan(0);
        await expect(this.cartTable).toBeVisible();
        await expect(this.cartTableBody).toBeVisible();
    }

    async verifyCartStructure(): Promise<void> {
        await expect(this.cartItemsSection).toBeVisible();
        await expect(this.breadcrumbs).toBeVisible();
        await expect(this.cartTitle).toBeVisible();
        await expect(this.cartInfoContainer).toBeVisible();
        
        // Cart table and actions may not exist if cart is empty, so check conditionally
        const isEmpty = await this.isCartEmpty();
        if (!isEmpty) {
            await expect(this.cartTable).toBeVisible();
            await expect(this.cartTableHead).toBeVisible();
            await expect(this.doActionSection).toBeVisible();
            await expect(this.proceedToCheckoutButton).toBeVisible();
        }
    }

    async verifyTableHeaders(): Promise<void> {
        // Only verify table headers if cart has items
        const isEmpty = await this.isCartEmpty();
        if (!isEmpty) {
            await expect(this.itemHeader).toBeVisible();
            await expect(this.descriptionHeader).toBeVisible();
            await expect(this.priceHeader).toBeVisible();
            await expect(this.quantityHeader).toBeVisible();
            await expect(this.totalHeader).toBeVisible();
        }
    }

    async verifyProductInCart(productName: string): Promise<void> {
        const productNames = await this.getProductNames();
        const hasProduct = productNames.some(name => name.toLowerCase().includes(productName.toLowerCase()));
        expect(hasProduct).toBe(true);
    }

    async verifyProductNotInCart(productName: string): Promise<void> {
        const productNames = await this.getProductNames();
        const hasProduct = productNames.some(name => name.toLowerCase().includes(productName.toLowerCase()));
        expect(hasProduct).toBe(false);
    }

    async verifyProductQuantity(productName: string, expectedQuantity: string): Promise<void> {
        const productNames = await this.getProductNames();
        const productIndex = productNames.findIndex(name => name.toLowerCase().includes(productName.toLowerCase()));
        
        if (productIndex === -1) {
            throw new Error(`Product "${productName}" not found in cart`);
        }
        
        const quantities = await this.getProductQuantities();
        expect(quantities[productIndex]).toBe(expectedQuantity);
    }

    async verifyProductPrice(productName: string, expectedPrice: string): Promise<void> {
        const productNames = await this.getProductNames();
        const productIndex = productNames.findIndex(name => name.toLowerCase().includes(productName.toLowerCase()));
        
        if (productIndex === -1) {
            throw new Error(`Product "${productName}" not found in cart`);
        }
        
        const prices = await this.getProductPrices();
        expect(prices[productIndex]).toBe(expectedPrice);
    }

    async verifyProductDetails(productName: string, expectedDetails: { price?: string; quantity?: string; total?: string; category?: string }): Promise<void> {
        const productNames = await this.getProductNames();
        const productIndex = productNames.findIndex(name => name.toLowerCase().includes(productName.toLowerCase()));
        
        if (productIndex === -1) {
            throw new Error(`Product "${productName}" not found in cart`);
        }
        
        if (expectedDetails.price) {
            const prices = await this.getProductPrices();
            expect(prices[productIndex]).toBe(expectedDetails.price);
        }
        
        if (expectedDetails.quantity) {
            const quantities = await this.getProductQuantities();
            expect(quantities[productIndex]).toBe(expectedDetails.quantity);
        }
        
        if (expectedDetails.total) {
            const totals = await this.getProductTotals();
            expect(totals[productIndex]).toBe(expectedDetails.total);
        }
        
        if (expectedDetails.category) {
            const categories = await this.getProductCategories();
            expect(categories[productIndex]).toBe(expectedDetails.category);
        }
    }

    async verifyCartTotal(): Promise<void> {
        const productTotals = await this.getProductTotals();
        const calculatedTotal = productTotals.reduce((sum, total) => {
            // Extract numeric value from price string (e.g., "Rs. 500" -> 500)
            const numericValue = parseFloat(total.replace(/[^\d.]/g, ''));
            return sum + numericValue;
        }, 0);

        // Note: This cart doesn't seem to have a total amount display in the HTML provided
        // So we'll verify that individual totals are calculated correctly
        for (let i = 0; i < productTotals.length; i++) {
            const prices = await this.getProductPrices();
            const quantities = await this.getProductQuantities();
            
            const price = parseFloat(prices[i].replace(/[^\d.]/g, ''));
            const quantity = parseInt(quantities[i]);
            const expectedTotal = price * quantity;
            const actualTotal = parseFloat(productTotals[i].replace(/[^\d.]/g, ''));
            
            expect(actualTotal).toBe(expectedTotal);
        }
    }

    async verifyBreadcrumbs(): Promise<void> {
        await expect(this.breadcrumbs).toBeVisible();
        await expect(this.homecrumb).toBeVisible();
        await expect(this.cartTitle).toBeVisible();
        
        // Verify breadcrumb text
        await expect(this.homecrumb).toHaveText('Home');
        await expect(this.cartTitle).toHaveText('Shopping Cart');
    }

    async verifyFooter(): Promise<void> {
        await expect(this.footer).toBeVisible();
        await expect(this.footerWidget).toBeVisible();
        await expect(this.footerBottom).toBeVisible();
        await expect(this.copyrightText).toBeVisible();
    }

    async verifySubscriptionSection(): Promise<void> {
        await expect(this.subscriptionSection).toBeVisible();
        await expect(this.subscriptionTitle).toBeVisible();
        await expect(this.subscriptionEmailInput).toBeVisible();
        await expect(this.subscriptionButton).toBeVisible();
        await expect(this.subscriptionDescription).toBeVisible();
    }

    // Utility Methods
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
        await expect(this.cartTitle).toBeVisible();
    }

    async scrollToBottom(): Promise<void> {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await this.page.waitForTimeout(1000);
    }

    async scrollToTop(): Promise<void> {
        await this.page.evaluate(() => window.scrollTo(0, 0));
        await this.page.waitForTimeout(1000);
    }

    async useScrollUpButton(): Promise<void> {
        await this.scrollToBottom();
        await expect(this.scrollUpButton).toBeVisible();
        await this.scrollUpButton.click();
        await this.page.waitForTimeout(1000);
    }

    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }

    async takeScreenshot(name: string): Promise<void> {
        await this.page.screenshot({ 
            path: `screenshots/${name}-${Date.now()}.png`,
            fullPage: true 
        });
    }

    async refreshPage(): Promise<void> {
        await this.page.reload();
        await this.waitForPageLoad();
    }

    // Accessibility Methods
    async verifyAccessibility(): Promise<void> {
        // Check images have proper alt text
        const imageCount = await this.productImages.count();
        for (let i = 0; i < imageCount; i++) {
            await expect(this.productImages.nth(i)).toHaveAttribute('alt', 'Product Image');
        }
        
        // Check form accessibility
        await expect(this.subscriptionEmailInput).toHaveAttribute('type', 'email');
        await expect(this.subscriptionEmailInput).toHaveAttribute('required');
        
        // Test keyboard navigation
        await this.proceedToCheckoutButton.focus();
        await expect(this.proceedToCheckoutButton).toBeFocused();
    }

    // Performance Methods
    async getCartLoadTime(): Promise<number> {
        const startTime = Date.now();
        await this.waitForPageLoad();
        return Date.now() - startTime;
    }

    // Data Extraction Methods
    async exportCartData(): Promise<Array<{ name: string; price: string; quantity: string; total: string; category: string; productId: string }>> {
        const itemCount = await this.getCartItemCount();
        const cartData: Array<{ name: string; price: string; quantity: string; total: string; category: string; productId: string }> = [];
        
        for (let i = 0; i < itemCount; i++) {
            const product = await this.getProductByIndex(i);
            cartData.push(product);
        }
        
        return cartData;
    }

    async getCartSummary(): Promise<{ itemCount: number; totalValue: number; isEmpty: boolean }> {
        const isEmpty = await this.isCartEmpty();
        
        if (isEmpty) {
            return { itemCount: 0, totalValue: 0, isEmpty: true };
        }
        
        const itemCount = await this.getCartItemCount();
        const totals = await this.getProductTotals();
        const totalValue = totals.reduce((sum, total) => {
            const numericValue = parseFloat(total.replace(/[^\d.]/g, ''));
            return sum + numericValue;
        }, 0);
        
        return { itemCount, totalValue, isEmpty: false };
    }

    // Missing methods that are used in tests but were removed in cart improvements
    async updateProductQuantity(index: number, quantity: number): Promise<void> {
        // Note: Based on the HTML, quantities appear to be displayed as disabled buttons
        // This method may not work as expected since quantities seem to be fixed at 1
        // But keeping for test compatibility
        console.warn('updateProductQuantity: Quantities appear to be fixed in this cart implementation');
        
        // If there were quantity inputs, this would be the implementation:
        // const quantityInput = this.cartItems.nth(index).locator('input[type="number"]');
        // await quantityInput.fill(quantity.toString());
        // But since quantities are shown as disabled buttons, we'll just verify the current state
        const currentQuantity = await this.productQuantities.nth(index).textContent();
        return Promise.resolve();
    }

    async getTotalAmount(): Promise<string> {
        // The provided HTML doesn't show a total amount section
        // Calculate total from individual product totals
        const totals = await this.getProductTotals();
        const totalValue = totals.reduce((sum, total) => {
            const numericValue = parseFloat(total.replace(/[^\d.]/g, ''));
            return sum + numericValue;
        }, 0);
        
        return `Rs. ${totalValue}`;
    }

    async clearCart(): Promise<void> {
        return this.removeAllProducts();
        }

    // Add missing property that tests expect
    get continueShoppingLink(): Locator {
        return this.emptyCartLink;
    }
}



