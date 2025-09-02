// src/models/pages/HomePage.ts
import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    
    // Header Elements
    readonly header: Locator;
    readonly headerMiddle: Locator;
    readonly logoContainer: Locator;
    readonly logo: Locator;
    readonly logoLink: Locator;
    
    // Navigation Menu Elements - Using href attributes (most robust)
    readonly shopMenu: Locator;
    readonly navbarNav: Locator;
    readonly homeLink: Locator;
    readonly productsLink: Locator;
    readonly cartLink: Locator;
    readonly signupLoginLink: Locator;
    readonly testCasesLink: Locator;
    readonly apiTestingLink: Locator;
    readonly videoTutorialsLink: Locator;
    readonly contactUsLink: Locator;
    
    // Post-Login Navigation Elements
    readonly logoutLink: Locator;
    readonly deleteAccountLink: Locator;
    readonly loggedInUsername: Locator;
    
    // Main Slider/Carousel Section
    readonly sliderSection: Locator;
    readonly sliderCarousel: Locator;
    readonly carouselIndicators: Locator;
    readonly carouselInner: Locator;
    readonly carouselItems: Locator;
    readonly carouselActiveItem: Locator;
    readonly carouselLeftControl: Locator;
    readonly carouselRightControl: Locator;
    
    // Carousel Content Elements
    readonly carouselTitle: Locator;
    readonly carouselSubtitle: Locator;
    readonly carouselDescription: Locator;
    readonly testCasesButton: Locator;
    readonly apisListButton: Locator;
    readonly carouselImages: Locator;
    
    // Left Sidebar Elements
    readonly leftSidebar: Locator;
    readonly categorySection: Locator;
    readonly categoryAccordion: Locator;
    readonly categoryPanels: Locator;
    readonly womenCategory: Locator;
    readonly menCategory: Locator;
    readonly kidsCategory: Locator;
    readonly categoryLinks: Locator;
    
    // Brands Section
    readonly brandsSection: Locator;
    readonly brandsTitle: Locator;
    readonly brandsList: Locator;
    readonly brandLinks: Locator;
    
    // Featured Items Section
    readonly featuredItemsSection: Locator;
    readonly featuredItemsTitle: Locator;
    readonly featuredItems: Locator;
    readonly productImageWrappers: Locator;
    readonly singleProducts: Locator;
    readonly productInfos: Locator;
    readonly productImages: Locator;
    readonly productPrices: Locator;
    readonly productNames: Locator;
    readonly addToCartButtons: Locator;
    readonly viewProductLinks: Locator;
    readonly productOverlays: Locator;
    
    // Cart Modal Elements
    readonly cartModal: Locator;
    readonly cartModalDialog: Locator;
    readonly cartModalContent: Locator;
    readonly cartModalHeader: Locator;
    readonly cartModalTitle: Locator;
    readonly cartModalBody: Locator;
    readonly cartModalFooter: Locator;
    readonly continueShoppingButton: Locator;
    readonly viewCartLink: Locator;
    
    // Recommended Items Section
    readonly recommendedItemsSection: Locator;
    readonly recommendedItemsTitle: Locator;
    readonly recommendedItemsCarousel: Locator;
    readonly recommendedCarouselInner: Locator;
    readonly recommendedCarouselItems: Locator;
    readonly recommendedLeftControl: Locator;
    readonly recommendedRightControl: Locator;
    
    // Footer Elements
    readonly footer: Locator;
    readonly footerWidget: Locator;
    readonly footerBottom: Locator;
    readonly copyrightText: Locator;
    
    // Subscription Section (in footer)
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
        
        // Header Elements - Using ID and classes for reliability
        this.header = page.locator('#header');
        this.headerMiddle = page.locator('.header-middle');
        this.logoContainer = page.locator('.logo.pull-left');
        this.logo = page.locator('img[alt="Website for automation practice"]');
        this.logoLink = page.locator('.logo a[href="/"]');
        
        // Navigation Menu Elements - Using href attributes (most robust approach)
        this.shopMenu = page.locator('.shop-menu.pull-right');
        this.navbarNav = page.locator('.nav.navbar-nav');
        this.homeLink = page.locator('a[href="/"]').filter({ hasText: 'Home' });
        this.productsLink = page.locator('a[href="/products"]');
        this.cartLink = page.locator('a[href="/view_cart"]');
        this.signupLoginLink = page.locator('a[href="/login"]');
        this.testCasesLink = page.locator('a[href="/test_cases"]');
        this.apiTestingLink = page.locator('a[href="/api_list"]');
        this.videoTutorialsLink = page.locator('a[href="https://www.youtube.com/c/AutomationExercise"]');
        this.contactUsLink = page.locator('a[href="/contact_us"]');
        
        // Post-Login Navigation Elements
        this.logoutLink = page.locator('a[href="/logout"]:has-text("Logout")');
        this.deleteAccountLink = page.locator('a[href="/delete_account"]:has-text("Delete Account")');
        this.loggedInUsername = page.locator('.nav.navbar-nav b').first();
        
        // Main Slider/Carousel Section - Using ID (most robust)
        this.sliderSection = page.locator('#slider');
        this.sliderCarousel = page.locator('#slider-carousel.carousel.slide');
        this.carouselIndicators = page.locator('#slider-carousel .carousel-indicators');
        this.carouselInner = page.locator('#slider-carousel .carousel-inner');
        this.carouselItems = page.locator('#slider-carousel .carousel-inner .item');
        this.carouselActiveItem = page.locator('#slider-carousel .carousel-inner .item.active');
        this.carouselLeftControl = page.locator('#slider-carousel .left.control-carousel');
        this.carouselRightControl = page.locator('#slider-carousel .right.control-carousel');
        
        // Carousel Content Elements
        this.carouselTitle = page.locator('.carousel-inner h1:has-text("Automation")');
        this.carouselSubtitle = page.locator('.carousel-inner h2:has-text("Full-Fledged practice website")');
        this.carouselDescription = page.locator('.carousel-inner p').first();
        this.testCasesButton = page.locator('a.test_cases_list button:has-text("Test Cases")');
        this.apisListButton = page.locator('a.apis_list button:has-text("APIs list for practice")');
        this.carouselImages = page.locator('.carousel-inner img.girl.img-responsive');
        
        // Left Sidebar Elements - Using specific class combinations and ID
        this.leftSidebar = page.locator('.left-sidebar');
        this.categorySection = page.locator('.left-sidebar h2:has-text("Category")');
        this.categoryAccordion = page.locator('#accordian.category-products');
        this.categoryPanels = page.locator('#accordian .panel.panel-default');
        this.womenCategory = page.locator('#accordian a[href="#Women"]');
        this.menCategory = page.locator('#accordian a[href="#Men"]');
        this.kidsCategory = page.locator('#accordian a[href="#Kids"]');
        this.categoryLinks = page.locator('#accordian .panel-body a[href*="/category_products/"]');
        
        // Brands Section - Using specific class combinations
        this.brandsSection = page.locator('.brands_products');
        this.brandsTitle = page.locator('.brands_products h2:has-text("Brands")');
        this.brandsList = page.locator('.brands_products .brands-name');
        this.brandLinks = page.locator('.brands_products a[href*="/brand_products/"]');
        
        // Featured Items Section
        this.featuredItemsSection = page.locator('.features_items');
        this.featuredItemsTitle = page.locator('.features_items .title.text-center:has-text("Features Items")');
        this.featuredItems = page.locator('.features_items');
        this.productImageWrappers = page.locator('.product-image-wrapper');
        this.singleProducts = page.locator('.single-products');
        this.productInfos = page.locator('.productinfo.text-center');
        this.productImages = page.locator('.productinfo.text-center img[alt="ecommerce website products"]');
        this.productPrices = page.locator('.productinfo.text-center h2');
        this.productNames = page.locator('.productinfo.text-center p');
        this.addToCartButtons = page.locator('a.add-to-cart[data-product-id]');
        this.viewProductLinks = page.locator('a[href*="/product_details/"]:has-text("View Product")');
        this.productOverlays = page.locator('.product-overlay .overlay-content');
        
        // Cart Modal Elements - Using ID (most robust)
        this.cartModal = page.locator('#cartModal.modal');
        this.cartModalDialog = page.locator('#cartModal .modal-dialog');
        this.cartModalContent = page.locator('#cartModal .modal-content');
        this.cartModalHeader = page.locator('#cartModal .modal-header');
        this.cartModalTitle = page.locator('#cartModal .modal-title:has-text("Added!")');
        this.cartModalBody = page.locator('#cartModal .modal-body');
        this.cartModalFooter = page.locator('#cartModal .modal-footer');
        this.continueShoppingButton = page.locator('#cartModal button.close-modal:has-text("Continue Shopping")');
        this.viewCartLink = page.locator('#cartModal a[href="/view_cart"]:has-text("View Cart")');
        
        // Recommended Items Section
        this.recommendedItemsSection = page.locator('.recommended_items');
        this.recommendedItemsTitle = page.locator('.recommended_items .title.text-center:has-text("recommended items")');
        this.recommendedItemsCarousel = page.locator('#recommended-item-carousel.carousel.slide');
        this.recommendedCarouselInner = page.locator('#recommended-item-carousel .carousel-inner');
        this.recommendedCarouselItems = page.locator('#recommended-item-carousel .carousel-inner .item');
        this.recommendedLeftControl = page.locator('#recommended-item-carousel .left.recommended-item-control');
        this.recommendedRightControl = page.locator('#recommended-item-carousel .right.recommended-item-control');
        
        // Footer Elements - Using ID
        this.footer = page.locator('#footer');
        this.footerWidget = page.locator('.footer-widget');
        this.footerBottom = page.locator('.footer-bottom');
        this.copyrightText = page.locator('.footer-bottom p:has-text("Copyright © 2021")');
        
        // Subscription Section (in footer) - Using ID (most robust)
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
    async navigate(): Promise<void> {
        await this.page.goto('/');
        await this.waitForPageLoad();
    }

    async navigateToProducts(): Promise<void> {
        await this.productsLink.click();
        await expect(this.page).toHaveURL(/.*products/);
    }

    async navigateToCart(): Promise<void> {
        await this.cartLink.click();
        await expect(this.page).toHaveURL(/.*view_cart/);
    }

    async navigateToLogin(): Promise<void> {
        await this.signupLoginLink.click();
        await expect(this.page).toHaveURL(/.*login/);
    }

    async navigateToContactUs(): Promise<void> {
        await this.contactUsLink.click();
        await expect(this.page).toHaveURL(/.*contact_us/);
    }

    async navigateToTestCases(): Promise<void> {
        await this.testCasesLink.click();
        await expect(this.page).toHaveURL(/.*test_cases/);
    }

    async navigateToApiTesting(): Promise<void> {
        await this.apiTestingLink.click();
        await expect(this.page).toHaveURL(/.*api_list/);
    }

    async navigateToVideoTutorials(): Promise<void> {
        await this.videoTutorialsLink.click();
        // External link - verify new tab opens or URL changes
    }

    async clickLogo(): Promise<void> {
        await this.logoLink.click();
        await expect(this.page).toHaveURL(/.*\/$/);
    }

    // Carousel Methods
    async interactWithCarousel(): Promise<void> {
        await this.carouselLeftControl.click();
        await this.page.waitForTimeout(1000); // Wait for carousel animation
        await this.carouselRightControl.click();
        await this.page.waitForTimeout(1000);
    }

    async clickCarouselIndicator(index: number): Promise<void> {
        await this.carouselIndicators.locator('li').nth(index).click();
        await this.page.waitForTimeout(1000);
    }

    async getActiveCarouselSlide(): Promise<number> {
        const indicators = this.carouselIndicators.locator('li');
        const count = await indicators.count();
        
        for (let i = 0; i < count; i++) {
            const indicator = indicators.nth(i);
            const className = await indicator.getAttribute('class');
            if (className?.includes('active')) {
                return i;
            }
        }
        return -1;
    }

    async clickTestCasesButton(): Promise<void> {
        await this.testCasesButton.click();
        await expect(this.page).toHaveURL(/.*test_cases/);
    }

    async clickApisListButton(): Promise<void> {
        await this.apisListButton.click();
        await expect(this.page).toHaveURL(/.*api_list/);
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
        await expect(categoryPanel).toBeVisible();
        await this.page.waitForTimeout(300);
    }

    async clickCategoryLink(categoryName: string): Promise<void> {
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
    async clickBrandLink(brandName: string): Promise<void> {
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

    // Product Methods
    async getProductCount(): Promise<number> {
        await this.productImageWrappers.first().waitFor({ state: 'visible' });
        return await this.productImageWrappers.count();
    }

    async getProductNames(): Promise<string[]> {
        await this.productNames.first().waitFor({ state: 'visible' });
        return await this.productNames.allTextContents();
    }

    async getProductPrices(): Promise<string[]> {
        await this.productPrices.first().waitFor({ state: 'visible' });
        return await this.productPrices.allTextContents();
    }

    async addProductToCart(index: number): Promise<void> {
        await this.addToCartButtons.nth(index).click();
        await expect(this.cartModal).toBeVisible();
        await this.continueShoppingButton.click();
        await expect(this.cartModal).toBeHidden();
    }

    async addProductToCartById(productId: string): Promise<void> {
        const cartButton = this.addToCartButtons.locator(`[data-product-id="${productId}"]`).first();
        await cartButton.click();
        await expect(this.cartModal).toBeVisible();
        await this.continueShoppingButton.click();
        await expect(this.cartModal).toBeHidden();
    }

    async viewProduct(index: number): Promise<void> {
        await this.viewProductLinks.nth(index).click();
        await expect(this.page).toHaveURL(/.*product_details/);
    }

    async hoverOverProduct(index: number): Promise<void> {
        await this.productImageWrappers.nth(index).hover();
        await expect(this.productOverlays.nth(index)).toBeVisible();
    }

    // Recommended Items Carousel Methods
    async interactWithRecommendedCarousel(): Promise<void> {
        await this.recommendedLeftControl.click();
        await this.page.waitForTimeout(1000);
        await this.recommendedRightControl.click();
        await this.page.waitForTimeout(1000);
    }

    async addRecommendedProductToCart(index: number): Promise<void> {
        const recommendedAddToCartButton = this.recommendedCarouselItems
            .locator('.productinfo.text-center a.add-to-cart')
            .nth(index);
        await recommendedAddToCartButton.click();
        await expect(this.cartModal).toBeVisible();
        await this.continueShoppingButton.click();
        await expect(this.cartModal).toBeHidden();
    }

    // Post-Login Methods
    async logout(): Promise<void> {
        await this.logoutLink.click();
        await expect(this.page).toHaveURL(/.*login/);
    }

    async deleteAccount(): Promise<void> {
        await this.deleteAccountLink.click();
        await this.page.waitForLoadState('networkidle');
    }

    // Subscription Methods
    async subscribeToNewsletter(email: string): Promise<void> {
        await this.subscriptionEmailInput.fill(email);
        await this.subscriptionButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async verifySubscriptionSuccess(): Promise<void> {
        await expect(this.subscriptionSuccessMessage).toBeVisible();
    }

    async getSubscriptionPlaceholder(): Promise<string> {
        return await this.subscriptionEmailInput.getAttribute('placeholder') || '';
    }

    async getCsrfToken(): Promise<string> {
        return await this.subscriptionCsrfToken.getAttribute('value') || '';
    }

    // Verification Methods
    async verifyHomePage(): Promise<void> {
        await expect(this.logo).toBeVisible();
        await expect(this.featuredItemsSection).toBeVisible();
        await expect(this.sliderCarousel).toBeVisible();
        await expect(this.page).toHaveURL(/.*automationexercise.com/);
    }

    async verifyPageStructure(): Promise<void> {
        await expect(this.header).toBeVisible();
        await expect(this.sliderSection).toBeVisible();
        await expect(this.leftSidebar).toBeVisible();
        await expect(this.featuredItemsSection).toBeVisible();
        await expect(this.recommendedItemsSection).toBeVisible();
        await expect(this.footer).toBeVisible();
    }

    async verifyNavigationMenu(): Promise<void> {
        await expect(this.shopMenu).toBeVisible();
        await expect(this.homeLink).toBeVisible();
        await expect(this.productsLink).toBeVisible();
        await expect(this.cartLink).toBeVisible();
        await expect(this.signupLoginLink).toBeVisible();
        await expect(this.testCasesLink).toBeVisible();
        await expect(this.apiTestingLink).toBeVisible();
        await expect(this.videoTutorialsLink).toBeVisible();
        await expect(this.contactUsLink).toBeVisible();
    }

    async verifyUserLoggedIn(username?: string): Promise<void> {
        await expect(this.loggedInUsername).toBeVisible();
        await expect(this.logoutLink).toBeVisible();
        await expect(this.deleteAccountLink).toBeVisible();
        
        if (username) {
            await expect(this.loggedInUsername).toContainText(username);
        }
    }

    async verifyUserLoggedOut(): Promise<void> {
        await expect(this.signupLoginLink).toBeVisible();
        await expect(this.logoutLink).not.toBeVisible();
        await expect(this.deleteAccountLink).not.toBeVisible();
    }

    async verifyCarouselFunctionality(): Promise<void> {
        await expect(this.sliderCarousel).toBeVisible();
        await expect(this.carouselIndicators).toBeVisible();
        await expect(this.carouselLeftControl).toBeVisible();
        await expect(this.carouselRightControl).toBeVisible();
        
        const itemCount = await this.carouselItems.count();
        expect(itemCount).toBeGreaterThan(0);
        
        // Verify active item exists
        await expect(this.carouselActiveItem).toBeVisible();
    }

    async verifyCarouselContent(): Promise<void> {
        await expect(this.carouselTitle).toBeVisible();
        await expect(this.carouselSubtitle).toBeVisible();
        await expect(this.carouselDescription).toBeVisible();
        await expect(this.testCasesButton).toBeVisible();
        await expect(this.apisListButton).toBeVisible();
        await expect(this.carouselImages.first()).toBeVisible();
    }

    async verifyCategoriesVisible(): Promise<void> {
        await expect(this.categorySection).toBeVisible();
        await expect(this.categoryAccordion).toBeVisible();
        await expect(this.womenCategory).toBeVisible();
        await expect(this.menCategory).toBeVisible();
        await expect(this.kidsCategory).toBeVisible();
    }

    async verifyBrandsVisible(): Promise<void> {
        await expect(this.brandsSection).toBeVisible();
        await expect(this.brandsTitle).toBeVisible();
        await expect(this.brandsList).toBeVisible();
    }

    async verifyFeaturedItemsVisible(): Promise<void> {
        await expect(this.featuredItemsSection).toBeVisible();
        await expect(this.featuredItemsTitle).toBeVisible();
        
        const productCount = await this.getProductCount();
        expect(productCount).toBeGreaterThan(0);
    }

    async verifyRecommendedItemsVisible(): Promise<void> {
        await expect(this.recommendedItemsSection).toBeVisible();
        await expect(this.recommendedItemsTitle).toBeVisible();
        await expect(this.recommendedItemsCarousel).toBeVisible();
    }

    async verifySubscriptionSection(): Promise<void> {
        await expect(this.subscriptionSection).toBeVisible();
        await expect(this.subscriptionTitle).toBeVisible();
        await expect(this.subscriptionEmailInput).toBeVisible();
        await expect(this.subscriptionButton).toBeVisible();
        await expect(this.subscriptionDescription).toBeVisible();
    }

    async verifyFooter(): Promise<void> {
        await expect(this.footer).toBeVisible();
        await expect(this.footerWidget).toBeVisible();
        await expect(this.footerBottom).toBeVisible();
        await expect(this.copyrightText).toBeVisible();
    }

    async verifyProductStructure(): Promise<void> {
        const firstProduct = this.productImageWrappers.first();
        await expect(firstProduct).toBeVisible();
        
        // Verify each product has required elements
        await expect(firstProduct.locator('.productinfo.text-center')).toBeVisible();
        await expect(firstProduct.locator('img')).toBeVisible();
        await expect(firstProduct.locator('h2')).toBeVisible(); // Price
        await expect(firstProduct.locator('p')).toBeVisible();  // Product name
        await expect(firstProduct.locator('a.add-to-cart')).toBeVisible();
        await expect(firstProduct.locator('a:has-text("View Product")')).toBeVisible();
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

    async isOnHomePage(): Promise<boolean> {
        return this.page.url().includes('automationexercise.com') && 
               (this.page.url().endsWith('/') || this.page.url().includes('automationexercise.com'));
    }

    // Utility Methods
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
        await expect(this.logo).toBeVisible();
        await expect(this.featuredItemsSection).toBeVisible();
    }

    async scrollToElement(locator: Locator): Promise<void> {
        await locator.scrollIntoViewIfNeeded();
    }

    async scrollToFeaturedItems(): Promise<void> {
        await this.scrollToElement(this.featuredItemsSection);
    }

    async scrollToRecommendedItems(): Promise<void> {
        await this.scrollToElement(this.recommendedItemsSection);
    }

    async scrollToSubscription(): Promise<void> {
        await this.scrollToElement(this.subscriptionSection);
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
        // Scroll down first to make scroll up button visible
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

    // Accessibility Methods
    async verifyAccessibility(): Promise<void> {
        // Check logo has proper alt text
        await expect(this.logo).toHaveAttribute('alt', 'Website for automation practice');
        
        // Check input has proper attributes
        await expect(this.subscriptionEmailInput).toHaveAttribute('type', 'email');
        await expect(this.subscriptionEmailInput).toHaveAttribute('required');
        
        // Test keyboard navigation
        await this.homeLink.focus();
        await this.page.keyboard.press('Tab');
        await expect(this.productsLink).toBeFocused();
    }

    // Performance Methods
    async waitForAllImagesLoaded(): Promise<void> {
        await this.page.waitForFunction(() => {
            const images = Array.from(document.querySelectorAll('img'));
            return images.every(img => img.complete);
        });
    }

    async getLoadTime(): Promise<number> {
        const startTime = Date.now();
        await this.waitForPageLoad();
        return Date.now() - startTime;
    }
}



