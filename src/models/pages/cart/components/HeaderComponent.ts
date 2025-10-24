// src/models/pages/components/HeaderComponent.ts
import { Page, Locator } from '@playwright/test';

/**
 * Componente para el header de la página
 * Maneja todos los elementos relacionados con la navegación principal
 */
export class HeaderComponent {
    readonly page: Page;
    
    // Elementos del header
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

    constructor(page: Page) {
        this.page = page;
        
        // Elementos del header
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
    }

    /**
     * Verifica si el header está visible
     */
    async isVisible(): Promise<boolean> {
        return await this.header.isVisible();
    }

    /**
     * Navega a la página de inicio
     */
    async goToHome(): Promise<void> {
        await this.homeLink.click();
    }

    /**
     * Navega a la página de productos
     */
    async goToProducts(): Promise<void> {
        await this.productsLink.click();
    }

    /**
     * Navega al carrito
     */
    async goToCart(): Promise<void> {
        await this.cartLink.click();
    }

    /**
     * Navega a la página de login
     */
    async goToLogin(): Promise<void> {
        await this.signupLoginLink.click();
    }

    /**
     * Navega a los casos de prueba
     */
    async goToTestCases(): Promise<void> {
        await this.testCasesLink.click();
    }

    /**
     * Navega a la API de testing
     */
    async goToApiTesting(): Promise<void> {
        await this.apiTestingLink.click();
    }

    /**
     * Navega a los tutoriales en video
     */
    async goToVideoTutorials(): Promise<void> {
        await this.videoTutorialsLink.click();
    }

    /**
     * Navega a la página de contacto
     */
    async goToContactUs(): Promise<void> {
        await this.contactUsLink.click();
    }

    /**
     * Verifica si el logo está visible
     */
    async isLogoVisible(): Promise<boolean> {
        return await this.logo.isVisible();
    }

    /**
     * Obtiene el texto del enlace del carrito
     */
    async getCartLinkText(): Promise<string> {
        return await this.cartLink.textContent() || '';
    }
}
