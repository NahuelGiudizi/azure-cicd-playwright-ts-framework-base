// src/models/pages/CartPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { 
    CartTableComponent, 
    CheckoutModalComponent, 
    SubscriptionComponent, 
    HeaderComponent 
} from './components';

/**
 * Página del carrito de compras refactorizada usando patrón Composite
 * Compuesta por componentes más pequeños y especializados
 */
export class CartPage {
    readonly page: Page;
    
    // Componentes principales
    readonly header: HeaderComponent;
    readonly cartTable: CartTableComponent;
    readonly checkoutModal: CheckoutModalComponent;
    readonly subscription: SubscriptionComponent;
    
    // Elementos principales de la página
    readonly cartItemsSection: Locator;
    readonly cartContainer: Locator;
    readonly breadcrumbs: Locator;
    readonly breadcrumbList: Locator;
    readonly homecrumb: Locator;
    readonly cartTitle: Locator;
    readonly doActionSection: Locator;
    readonly proceedToCheckoutButton: Locator;
    readonly emptyCartSpan: Locator;
    readonly emptyCartMessage: Locator;
    readonly emptyCartLink: Locator;
    readonly footer: Locator;
    readonly footerWidget: Locator;
    readonly footerBottom: Locator;
    readonly copyrightText: Locator;
    readonly scrollUpButton: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Inicializar componentes
        this.header = new HeaderComponent(page);
        this.cartTable = new CartTableComponent(page);
        this.checkoutModal = new CheckoutModalComponent(page);
        this.subscription = new SubscriptionComponent(page);
        
        // Elementos principales de la página
        this.cartItemsSection = page.locator('#cart_items');
        this.cartContainer = page.locator('#cart_items .container').first();
        this.breadcrumbs = page.locator('.breadcrumbs');
        this.breadcrumbList = page.locator('.breadcrumb');
        this.homecrumb = page.locator('.breadcrumb a[href="/"]');
        this.cartTitle = page.locator('.breadcrumb .active:has-text("Shopping Cart")');
        this.doActionSection = page.locator('#do_action');
        this.proceedToCheckoutButton = page.locator('.btn.btn-default.check_out:has-text("Proceed To Checkout")');
        this.emptyCartSpan = page.locator('#empty_cart');
        this.emptyCartMessage = page.locator('#empty_cart p:has-text("Cart is empty!")');
        this.emptyCartLink = page.locator('#empty_cart a[href="/products"]:has-text("here")');
        this.footer = page.locator('#footer');
        this.footerWidget = page.locator('.footer-widget');
        this.footerBottom = page.locator('.footer-bottom');
        this.copyrightText = page.locator('.footer-bottom p:has-text("Copyright © 2021")');
        this.scrollUpButton = page.locator('#scrollUp');
    }

    // Navigation Methods
    /**
     * Navigates to the cart page
     * @throws Error if navigation fails or cart page is not loaded
     */
    async navigateToCart(): Promise<void> {
        await this.page.goto('/view_cart');
        await this.waitForPageLoad();
    }

    async navigateToHome(): Promise<void> {
        await this.header.goToHome();
        await expect(this.page).toHaveURL(/.*\/$/);
    }

    async navigateToProducts(): Promise<void> {
        await this.header.goToProducts();
        await expect(this.page).toHaveURL(/.*products/);
    }

    async navigateToLogin(): Promise<void> {
        await this.header.goToLogin();
        await expect(this.page).toHaveURL(/.*login/);
    }

    async clickHomeBreadcrumb(): Promise<void> {
        await this.homecrumb.click();
        await expect(this.page).toHaveURL(/.*\/$/);
    }

    // Cart Information Methods
    /**
     * Gets the current number of items in the cart
     * @returns Promise<number> The number of items in the cart
     */
    async getCartItemCount(): Promise<number> {
        return await this.cartTable.getProductCount();
    }

    async getProductNames(): Promise<string[]> {
        if (await this.isCartEmpty()) {
            return [];
        }
        const count = await this.cartTable.getProductCount();
        const names: string[] = [];
        for (let i = 0; i < count; i++) {
            names.push(await this.cartTable.getProductName(i));
        }
        return names;
    }

    async getProductPrices(): Promise<string[]> {
        if (await this.isCartEmpty()) {
            return [];
        }
        const count = await this.cartTable.getProductCount();
        const prices: string[] = [];
        for (let i = 0; i < count; i++) {
            prices.push(await this.cartTable.getProductPrice(i));
        }
        return prices;
    }

    async getProductQuantities(): Promise<string[]> {
        if (await this.isCartEmpty()) {
            return [];
        }
        const count = await this.cartTable.getProductCount();
        const quantities: string[] = [];
        for (let i = 0; i < count; i++) {
            quantities.push(await this.cartTable.getProductQuantity(i));
        }
        return quantities;
    }

    async getProductTotals(): Promise<string[]> {
        if (await this.isCartEmpty()) {
            return [];
        }
        const count = await this.cartTable.getProductCount();
        const totals: string[] = [];
        for (let i = 0; i < count; i++) {
            totals.push(await this.cartTable.getProductTotal(i));
        }
        return totals;
    }

    // Product Removal Methods
    /**
     * Removes a product from cart by its index position
     * @param index - Zero-based index of product in cart
     * @throws Error if product not found or removal fails
     */
    async removeProductByIndex(index: number): Promise<void> {
        const initialCount = await this.getCartItemCount();
        await this.cartTable.deleteProduct(index);
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

    async removeAllProducts(): Promise<void> {
        const itemCount = await this.getCartItemCount();
        for (let i = 0; i < itemCount; i++) {
            await this.removeProductByIndex(0); // Always remove first item as indices change
            await this.page.waitForTimeout(1000); // Wait for UI update
        }
        await this.verifyCartIsEmpty();
    }

    // Checkout Methods
    async proceedToCheckout(): Promise<void> {
        await this.proceedToCheckoutButton.click();
        
        // Check if modal appears (for non-logged in users)
        try {
            await this.checkoutModal.waitForModal();
        } catch {
            // If no modal, user is logged in and checkout proceeds directly
            await expect(this.page).toHaveURL(/.*checkout/);
        }
    }

    async clickRegisterLoginFromModal(): Promise<void> {
        await this.checkoutModal.clickRegisterLoginLink();
        await expect(this.page).toHaveURL(/.*login/);
    }

    async clickContinueOnCartFromModal(): Promise<void> {
        await this.checkoutModal.clickContinueOnCart();
    }

    async closeCheckoutModal(): Promise<void> {
        await this.checkoutModal.closeModal();
    }

    // Subscription Methods
    async subscribeToNewsletter(email: string): Promise<void> {
        await this.subscription.subscribe(email);
    }

    async isSubscriptionSuccessVisible(): Promise<boolean> {
        return await this.subscription.isSuccessMessageVisible();
    }

    async getSubscriptionSuccessMessage(): Promise<string> {
        return await this.subscription.getSuccessMessage();
    }

    // Utility Methods
    async isCartEmpty(): Promise<boolean> {
        return await this.cartTable.isEmpty();
    }

    async verifyCartIsEmpty(): Promise<void> {
        await expect(this.emptyCartMessage).toBeVisible();
        await expect(this.emptyCartLink).toBeVisible();
    }

    async verifyCartHasItems(): Promise<void> {
        await expect(this.cartTable.cartTable).toBeVisible();
        const count = await this.getCartItemCount();
        expect(count).toBeGreaterThan(0);
    }

    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
        await this.cartItemsSection.waitFor({ state: 'visible' });
    }

    async scrollToTop(): Promise<void> {
        await this.scrollUpButton.click();
    }

    // Verification Methods
    async verifyPageElements(): Promise<void> {
        await expect(this.header.header).toBeVisible();
        await expect(this.cartItemsSection).toBeVisible();
        await expect(this.breadcrumbs).toBeVisible();
        await expect(this.footer).toBeVisible();
    }

    async verifyBreadcrumbs(): Promise<void> {
        await expect(this.breadcrumbList).toBeVisible();
        await expect(this.homecrumb).toBeVisible();
        await expect(this.cartTitle).toBeVisible();
    }

    async verifyFooter(): Promise<void> {
        await expect(this.footer).toBeVisible();
        await expect(this.footerWidget).toBeVisible();
        await expect(this.footerBottom).toBeVisible();
        await expect(this.copyrightText).toBeVisible();
    }

    // Additional methods needed by tests
    async verifyCartStructure(): Promise<void> {
        await expect(this.cartItemsSection).toBeVisible();
        await expect(this.cartContainer).toBeVisible();
        await expect(this.breadcrumbs).toBeVisible();
    }

    async verifyTableHeaders(): Promise<void> {
        const isEmpty = await this.isCartEmpty();
        if (!isEmpty) {
            await expect(this.cartTable.cartTable).toBeVisible();
            // Verify table headers exist
            await expect(this.cartTable.cartTable.locator('thead')).toBeVisible();
        }
    }

    async getProductCategories(): Promise<string[]> {
        if (await this.isCartEmpty()) {
            return [];
        }
        const count = await this.cartTable.getProductCount();
        const categories: string[] = [];
        for (let i = 0; i < count; i++) {
            categories.push(await this.cartTable.getProductCategory(i));
        }
        return categories;
    }

    async getProductByIndex(index: number): Promise<{
        name: string;
        price: string;
        quantity: string;
        total: string;
        category: string;
        productId: string;
    }> {
        return await this.cartTable.getProductDetails(index);
    }

    async verifyProductNotInCart(productName: string): Promise<void> {
        const productNames = await this.getProductNames();
        const isPresent = productNames.some(name => 
            name.toLowerCase().includes(productName.toLowerCase())
        );
        expect(isPresent).toBe(false);
    }

    async verifyCartTotal(): Promise<void> {
        await expect(this.cartTable.cartTable).toBeVisible();
        // Verify total calculation
        const totalAmount = await this.getTotalAmount();
        expect(totalAmount).toMatch(/Rs\. \d+/);
    }

    async getTotalAmount(): Promise<string> {
        return await this.cartTable.getTotalAmount();
    }

    async isCheckoutModalVisible(): Promise<boolean> {
        return await this.checkoutModal.isModalVisible();
    }

    async handleCheckoutModal(): Promise<void> {
        await this.checkoutModal.waitForModal();
    }

    async continueShopping(): Promise<void> {
        await this.emptyCartLink.click();
        await expect(this.page).toHaveURL(/.*products/);
    }

    async getCartSummary(): Promise<{
        itemCount: number;
        totalValue: string;
        isEmpty: boolean;
    }> {
        const itemCount = await this.getCartItemCount();
        const totalValue = await this.getTotalAmount();
        const isEmpty = await this.isCartEmpty();
        
        return {
            itemCount,
            totalValue,
            isEmpty
        };
    }

    async verifySubscriptionSection(): Promise<void> {
        await expect(this.subscription.subscriptionSection).toBeVisible();
    }

    // Additional locators needed by tests
    get logo() { return this.header.logo; }
    get shopMenu() { return this.header.shopMenu; }
    get homeLink() { return this.header.homeLink; }
    get productsLink() { return this.header.productsLink; }
    get cartLink() { return this.header.cartLink; }
    get signupLoginLink() { return this.header.signupLoginLink; }
    get cartInfoContainer() { return this.cartContainer; }
    get subscriptionEmailInput() { return this.subscription.subscriptionEmailInput; }
    get checkoutModalTitle() { return this.checkoutModal.checkoutModalTitle; }
    get registerLoginLink() { return this.checkoutModal.registerLoginLink; }
    get continueOnCartButton() { return this.checkoutModal.continueOnCartButton; }
    get productImages() { return this.cartTable.productImages; }
    get productLinks() { return this.cartTable.productLinks; }
    get deleteButtons() { return this.cartTable.deleteButtons; }
    get quantityButtons() { return this.cartTable.quantityButtons; }
}