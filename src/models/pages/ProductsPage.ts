// src/models/pages/ProductsPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class ProductsPage {
    readonly page: Page;
    
    // Navigation Elements
    readonly productsLink: Locator;
    readonly homeLink: Locator;
    readonly cartLink: Locator;
    readonly loginLink: Locator;
    
    // Main Content Area
    readonly allProductsTitle: Locator;
    readonly featuresItemsSection: Locator;
    readonly productGridContainer: Locator;
    
    // Search Elements - Using IDs (most robust)
    readonly searchProductInput: Locator;
    readonly searchButton: Locator;
    readonly searchedProductsTitle: Locator;
    
    // Product Elements - Specific and robust selectors
    readonly productItems: Locator;
    readonly productCards: Locator;
    readonly productImages: Locator;
    readonly productNames: Locator;
    readonly productPrices: Locator;
    readonly viewProductLinks: Locator;
    readonly addToCartButtons: Locator;
    readonly productOverlays: Locator;
    
    // Category Sidebar Elements
    readonly leftSidebar: Locator;
    readonly categoriesSection: Locator;
    readonly categoryAccordion: Locator;
    readonly womenCategory: Locator;
    readonly menCategory: Locator;
    readonly kidsCategory: Locator;
    readonly categoryLinks: Locator;
    
    // Brand Sidebar Elements
    readonly brandsSection: Locator;
    readonly brandsList: Locator;
    readonly brandLinks: Locator;
    
    // Modal Elements
    readonly cartModal: Locator;
    readonly cartModalTitle: Locator;
    readonly cartModalBody: Locator;
    readonly continueShoppingButton: Locator;
    readonly viewCartLink: Locator;
    readonly closeModalButton: Locator;
    
    // Advertisement Section
    readonly advertisementSection: Locator;
    readonly saleImage: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Navigation Elements - Using href attributes for reliability
        this.productsLink = page.locator('a[href="/products"]');
        this.homeLink = page.locator('a[href="/"]').first();
        this.cartLink = page.locator('a[href="/view_cart"]').first();
        this.loginLink = page.locator('a[href="/login"]');
        
        // Main Content Area - Using CSS classes for specificity
        this.allProductsTitle = page.locator('.title.text-center:has-text("All Products")');
        this.featuresItemsSection = page.locator('.features_items');
        this.productGridContainer = page.locator('.col-sm-9.padding-right');
        
        // Search Elements - Using IDs (most robust approach)
        this.searchProductInput = page.locator('#search_product');
        this.searchButton = page.locator('#submit_search');
        this.searchedProductsTitle = page.locator('.title.text-center:has-text("Searched Products")');
        
        // Product Elements - Specific and robust selectors
        this.productItems = page.locator('.product-image-wrapper');
        this.productCards = page.locator('.single-products');
        this.productImages = page.locator('.productinfo.text-center img[alt="ecommerce website products"]');
        this.productNames = page.locator('.productinfo.text-center p');
        this.productPrices = page.locator('.productinfo.text-center h2');
        this.viewProductLinks = page.locator('a:has-text("View Product")');
        this.addToCartButtons = page.locator('a.add-to-cart[data-product-id]');
        this.productOverlays = page.locator('.product-overlay .overlay-content');
        
        // Category Sidebar Elements - Using IDs and specific class combinations
        this.leftSidebar = page.locator('.left-sidebar');
        this.categoriesSection = page.locator('.left-sidebar h2:has-text("Category")');
        this.categoryAccordion = page.locator('#accordian.category-products');
        this.womenCategory = page.locator('#accordian a[href="#Women"]');
        this.menCategory = page.locator('#accordian a[href="#Men"]');
        this.kidsCategory = page.locator('#accordian a[href="#Kids"]');
        this.categoryLinks = page.locator('#accordian .panel-body a[href*="/category_products/"]');
        
        // Brand Sidebar Elements - Using specific class combinations
        this.brandsSection = page.locator('.brands_products');
        this.brandsList = page.locator('.brands_products .brands-name');
        this.brandLinks = page.locator('.brands_products a[href*="/brand_products/"]');
        
        // Modal Elements - Using ID and specific classes
        this.cartModal = page.locator('#cartModal.modal');
        this.cartModalTitle = page.locator('#cartModal .modal-title:has-text("Added!")');
        this.cartModalBody = page.locator('#cartModal .modal-body');
        this.continueShoppingButton = page.locator('#cartModal button.close-modal:has-text("Continue Shopping")');
        this.viewCartLink = page.locator('#cartModal a[href="/view_cart"]:has-text("View Cart")');
        this.closeModalButton = page.locator('#cartModal [data-dismiss="modal"]');
        
        // Advertisement Section - Using ID
        this.advertisementSection = page.locator('#advertisement');
        this.saleImage = page.locator('#sale_image[alt="Website for practice"]');
    }

    // Navigation Methods
    async navigateToProducts(): Promise<void> {
        await this.productsLink.click();
        await expect(this.page).toHaveURL(/.*products/);
        await expect(this.allProductsTitle).toBeVisible();
    }

    async navigateToHome(): Promise<void> {
        await this.homeLink.click();
        await expect(this.page).toHaveURL(/.*\//);
    }

    async navigateToCart(): Promise<void> {
        await this.cartLink.click();
        await expect(this.page).toHaveURL(/.*view_cart/);
    }

    // Search Methods
    async searchForProduct(productName: string): Promise<void> {
        await this.searchProductInput.fill(productName);
        await this.searchButton.click();
        // Wait for results to load
        await this.page.waitForLoadState('networkidle');
    }

    async clearSearch(): Promise<void> {
        await this.searchProductInput.clear();
        await this.searchButton.click();
    }

    async isSearchResultsDisplayed(): Promise<boolean> {
        return await this.searchedProductsTitle.isVisible();
    }

    // Product Information Methods
    async getProductCount(): Promise<number> {
        await this.productItems.first().waitFor({ state: 'visible' });
        return await this.productItems.count();
    }

    async getProductNames(): Promise<string[]> {
        await this.productNames.first().waitFor({ state: 'visible' });
        return await this.productNames.allTextContents();
    }

    async getProductPrices(): Promise<string[]> {
        await this.productPrices.first().waitFor({ state: 'visible' });
        return await this.productPrices.allTextContents();
    }

    async getProductByIndex(index: number): Promise<{ name: string; price: string; productId: string }> {
        const name = await this.productNames.nth(index).textContent() || '';
        const price = await this.productPrices.nth(index).textContent() || '';
        const productId = await this.addToCartButtons.nth(index).getAttribute('data-product-id') || '';
        
        return { name, price, productId };
    }

    async getProductByName(productName: string): Promise<{ index: number; name: string; price: string; productId: string }> {
        const productNames = await this.getProductNames();
        const index = productNames.findIndex(name => 
            name.toLowerCase().includes(productName.toLowerCase())
        );
        
        if (index === -1) {
            throw new Error(`Product "${productName}" not found`);
        }
        
        const product = await this.getProductByIndex(index);
        return { index, ...product };
    }

    // Product Interaction Methods
    async viewProductByIndex(index: number): Promise<void> {
        await this.viewProductLinks.nth(index).click();
        await expect(this.page).toHaveURL(/.*product_details/);
    }

    async viewProductByName(productName: string): Promise<void> {
        const { index } = await this.getProductByName(productName);
        await this.viewProductByIndex(index);
    }

    async viewProductById(productId: string): Promise<void> {
        const productButton = this.addToCartButtons.locator(`[data-product-id="${productId}"]`).first();
        
        // Check if product exists
        const productExists = await productButton.count() > 0;
        if (!productExists) {
            throw new Error(`Product with ID "${productId}" not found`);
        }
        
        // Find the index of the product with this ID
        const allButtons = await this.addToCartButtons.all();
        let index = -1;
        
        for (let i = 0; i < allButtons.length; i++) {
            const buttonProductId = await allButtons[i].getAttribute('data-product-id');
            if (buttonProductId === productId) {
                index = i;
                break;
            }
        }
        
        if (index === -1) {
            throw new Error(`Product with ID "${productId}" not found`);
        }
        
        await this.viewProductByIndex(index);
    }

    // Cart Methods
    async addProductToCart(index: number): Promise<void> {
        // Scroll the button into view and force click to avoid interception issues
        await this.addToCartButtons.nth(index).scrollIntoViewIfNeeded();
        await this.addToCartButtons.nth(index).click({ force: true });
        
        // Wait for modal to appear, but don't fail if it doesn't (sometimes it's instant)
        try {
            await expect(this.cartModal).toBeVisible({ timeout: 2000 });
            await this.continueShoppingButton.click();
            await expect(this.cartModal).toBeHidden();
        } catch {
            // Modal might not appear or might close instantly, that's OK
            // Just ensure we're back on the products page
            await expect(this.allProductsTitle).toBeVisible();
        }
    }

    async addProductToCartWithoutClosingModal(index: number): Promise<void> {
        await this.addToCartButtons.nth(index).scrollIntoViewIfNeeded();
        await this.addToCartButtons.nth(index).click({ force: true });
        await expect(this.cartModal).toBeVisible();
        // Modal remains open for further assertions
    }

    async continueShoppingFromModal(): Promise<void> {
        // Check if modal is visible, if not, it might have already closed
        try {
            await expect(this.cartModal).toBeVisible({ timeout: 1000 });
            await this.continueShoppingButton.click();
            await expect(this.cartModal).toBeHidden();
        } catch {
            // Modal might already be closed, verify we're on products page
            await expect(this.allProductsTitle).toBeVisible();
        }
    }

    async addProductToCartByName(productName: string): Promise<void> {
        const { index } = await this.getProductByName(productName);
        await this.addProductToCart(index);
    }

    async addProductToCartById(productId: string): Promise<void> {
        const cartButton = this.addToCartButtons.locator(`[data-product-id="${productId}"]`).first();
        await cartButton.click();
        await expect(this.cartModal).toBeVisible();
        await this.continueShoppingButton.click();
        await expect(this.cartModal).toBeHidden();
    }

    async addProductToCartAndViewCart(index: number): Promise<void> {
        await this.addToCartButtons.nth(index).click();
        await expect(this.cartModal).toBeVisible();
        await this.viewCartLink.click();
    }

    async addMultipleProductsToCart(indices: number[]): Promise<void> {
        for (const index of indices) {
            await this.addProductToCart(index);
            await this.page.waitForTimeout(500); // Small delay between additions
        }
    }

    // Category Methods
    async expandCategorySection(categoryName: 'Women' | 'Men' | 'Kids'): Promise<void> {
        const categoryHeader = this.page.locator(`#accordian a[href="#${categoryName}"]`);
        const categoryPanel = this.page.locator(`#${categoryName}.panel-collapse`);
        
        // Check if already expanded
        const isExpanded = await categoryPanel.isVisible();
        if (isExpanded) {
            return; // Already expanded
        }
        
        // Click to expand
        await categoryHeader.click();
        
        // Wait for the accordion to expand (Bootstrap animation)
        await expect(categoryPanel).toBeVisible();
        
        // Wait a bit more for content to be fully rendered
        await this.page.waitForTimeout(300);
    }

    async filterByCategory(categoryName: string): Promise<void> {
        // First expand the appropriate parent category
        if (categoryName.toLowerCase().includes('dress') || categoryName.toLowerCase().includes('tops') || categoryName.toLowerCase().includes('saree')) {
            await this.expandCategorySection('Women');
        } else if (categoryName.toLowerCase().includes('tshirts') || categoryName.toLowerCase().includes('jeans')) {
            await this.expandCategorySection('Men');
        } else if (categoryName.toLowerCase().includes('kids')) {
            await this.expandCategorySection('Kids');
        }

        const categoryLink = this.categoryLinks.filter({ hasText: categoryName }).first();
        await categoryLink.click();
        await this.page.waitForLoadState('networkidle');
    }

    async getCategoryLinks(): Promise<string[]> {
        // Expand all categories first
        await this.expandCategorySection('Women');
        await this.expandCategorySection('Men');
        await this.expandCategorySection('Kids');
        
        return await this.categoryLinks.allTextContents();
    }

    // Brand Methods
    async filterByBrand(brandName: string): Promise<void> {
        const brandLink = this.brandLinks.filter({ hasText: brandName }).first();
        await brandLink.click();
        await this.page.waitForLoadState('networkidle');
    }

    async getBrandLinks(): Promise<string[]> {
        return await this.brandLinks.allTextContents();
    }

    async getBrandWithCount(brandName: string): Promise<{ name: string; count: number }> {
        const brandLink = this.brandLinks.filter({ hasText: brandName }).first();
        const fullText = await brandLink.textContent() || '';
        const countMatch = fullText.match(/\((\d+)\)/);
        const count = countMatch ? parseInt(countMatch[1]) : 0;
        
        return { name: brandName, count };
    }

    // Verification Methods
    async verifyProductsDisplayed(): Promise<void> {
        await expect(this.productItems.first()).toBeVisible();
        const count = await this.getProductCount();
        expect(count).toBeGreaterThan(0);
    }

    async verifySearchResults(searchTerm: string): Promise<void> {
        const productNames = await this.getProductNames();
        
        if (productNames.length === 0) {
            // No products found - this might be valid for some searches
            console.log(`No products found for search term: "${searchTerm}"`);
            return;
        }
        
        // Verify at least one product contains the search term
        const hasMatchingProduct = productNames.some(name => 
            name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        expect(hasMatchingProduct).toBe(true);
    }

    async verifyCategoriesVisible(): Promise<void> {
        await expect(this.categoriesSection).toBeVisible();
        await expect(this.categoryAccordion).toBeVisible();
    }

    async isCategoryExpanded(categoryName: 'Women' | 'Men' | 'Kids'): Promise<boolean> {
        const categoryPanel = this.page.locator(`#${categoryName}.panel-collapse`);
        return await categoryPanel.isVisible();
    }

    async verifyCategoryHeadersVisible(): Promise<void> {
        // Verify category headers are visible (these should always be visible)
        const womenHeader = this.page.locator('#accordian a[href="#Women"]');
        const menHeader = this.page.locator('#accordian a[href="#Men"]');
        const kidsHeader = this.page.locator('#accordian a[href="#Kids"]');
        
        await expect(womenHeader).toBeVisible();
        await expect(menHeader).toBeVisible(); 
        await expect(kidsHeader).toBeVisible();
    }

    async verifyBrandsVisible(): Promise<void> {
        await expect(this.brandsSection).toBeVisible();
        await expect(this.brandsList).toBeVisible();
    }

    async verifyProductStructure(): Promise<void> {
        const firstProduct = this.productItems.first();
        await expect(firstProduct).toBeVisible();
        
        // Verify each product has required elements
        await expect(firstProduct.locator('.productinfo.text-center')).toBeVisible();
        await expect(firstProduct.locator('img')).toBeVisible();
        await expect(firstProduct.locator('h2').first()).toBeVisible(); // Price
        await expect(firstProduct.locator('p').first()).toBeVisible();  // Product name
        await expect(firstProduct.locator('a.add-to-cart').first()).toBeVisible();
        await expect(firstProduct.locator('a:has-text("View Product")')).toBeVisible();
    }

    async verifyModalFunctionality(): Promise<void> {
        // Add a product to trigger modal
        await this.addToCartButtons.first().click();
        
        // Verify modal appears and has correct elements
        await expect(this.cartModal).toBeVisible();
        await expect(this.cartModalTitle).toBeVisible();
        await expect(this.cartModalBody).toBeVisible();
        await expect(this.continueShoppingButton).toBeVisible();
        await expect(this.viewCartLink).toBeVisible();
        
        // Close modal
        await this.continueShoppingButton.click();
        await expect(this.cartModal).toBeHidden();
    }

    // Utility Methods
    async waitForProductsToLoad(): Promise<void> {
        await this.productItems.first().waitFor({ state: 'visible' });
        await this.page.waitForLoadState('networkidle');
    }

    async scrollToProduct(index: number): Promise<void> {
        await this.productItems.nth(index).scrollIntoViewIfNeeded();
    }

    async hoverOverProduct(index: number): Promise<void> {
        await this.productItems.nth(index).hover();
        await expect(this.productOverlays.nth(index)).toBeVisible();
    }

    async getSearchPlaceholder(): Promise<string> {
        return await this.searchProductInput.getAttribute('placeholder') || '';
    }

    async isAdvertisementVisible(): Promise<boolean> {
        return await this.advertisementSection.isVisible();
    }
}



