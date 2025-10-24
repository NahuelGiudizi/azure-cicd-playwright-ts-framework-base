// src/models/pages/components/SubscriptionComponent.ts
import { Page, Locator } from '@playwright/test';

/**
 * Componente para la sección de suscripción
 * Maneja todos los elementos relacionados con la suscripción al newsletter
 */
export class SubscriptionComponent {
    readonly page: Page;
    
    // Elementos de la sección de suscripción
    readonly subscriptionSection: Locator;
    readonly subscriptionTitle: Locator;
    readonly subscriptionForm: Locator;
    readonly subscriptionEmailInput: Locator;
    readonly subscriptionButton: Locator;
    readonly subscriptionDescription: Locator;
    readonly subscriptionSuccessMessage: Locator;
    readonly subscriptionCsrfToken: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Elementos de la sección de suscripción
        this.subscriptionSection = page.locator('.single-widget:has(h2:has-text("Subscription"))');
        this.subscriptionTitle = page.locator('.single-widget h2:has-text("Subscription")');
        this.subscriptionForm = page.locator('.single-widget form.searchform');
        this.subscriptionEmailInput = page.locator('#susbscribe_email');
        this.subscriptionButton = page.locator('#subscribe');
        this.subscriptionDescription = page.locator('.single-widget p');
        this.subscriptionSuccessMessage = page.locator('#success-subscribe .alert-success');
        this.subscriptionCsrfToken = page.locator('.single-widget input[name="csrfmiddlewaretoken"]');
    }

    /**
     * Verifica si la sección de suscripción está visible
     */
    async isVisible(): Promise<boolean> {
        return await this.subscriptionSection.isVisible();
    }

    /**
     * Suscribe un email al newsletter
     */
    async subscribe(email: string): Promise<void> {
        await this.subscriptionEmailInput.fill(email);
        await this.subscriptionButton.click();
    }

    /**
     * Verifica si el mensaje de éxito está visible
     */
    async isSuccessMessageVisible(): Promise<boolean> {
        return await this.subscriptionSuccessMessage.isVisible();
    }

    /**
     * Obtiene el texto del mensaje de éxito
     */
    async getSuccessMessage(): Promise<string> {
        return await this.subscriptionSuccessMessage.textContent() || '';
    }

    /**
     * Obtiene el título de la sección
     */
    async getTitle(): Promise<string> {
        return await this.subscriptionTitle.textContent() || '';
    }

    /**
     * Obtiene la descripción de la sección
     */
    async getDescription(): Promise<string> {
        return await this.subscriptionDescription.textContent() || '';
    }

    /**
     * Verifica si el formulario está presente
     */
    async isFormPresent(): Promise<boolean> {
        return await this.subscriptionForm.isVisible();
    }
}
