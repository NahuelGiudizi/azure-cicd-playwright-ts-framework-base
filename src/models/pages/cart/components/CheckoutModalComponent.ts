// src/models/pages/components/CheckoutModalComponent.ts
import { Page, Locator } from '@playwright/test';

/**
 * Componente para el modal de checkout
 * Maneja todos los elementos relacionados con el modal de checkout
 */
export class CheckoutModalComponent {
    readonly page: Page;
    
    // Modal principal
    readonly checkoutModal: Locator;
    readonly checkoutModalDialog: Locator;
    readonly checkoutModalContent: Locator;
    readonly checkoutModalHeader: Locator;
    readonly checkoutModalTitle: Locator;
    readonly checkoutModalBody: Locator;
    readonly checkoutModalFooter: Locator;
    
    // Enlaces y botones del modal
    readonly registerLoginLink: Locator;
    readonly registerLoginLinkText: Locator;
    readonly continueOnCartButton: Locator;
    readonly closeCheckoutModalButton: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Modal principal
        this.checkoutModal = page.locator('#checkoutModal.modal');
        this.checkoutModalDialog = page.locator('#checkoutModal .modal-dialog');
        this.checkoutModalContent = page.locator('#checkoutModal .modal-content');
        this.checkoutModalHeader = page.locator('#checkoutModal .modal-header');
        this.checkoutModalTitle = page.locator('#checkoutModal .modal-title:has-text("Checkout")');
        this.checkoutModalBody = page.locator('#checkoutModal .modal-body');
        this.checkoutModalFooter = page.locator('#checkoutModal .modal-footer');
        
        // Enlaces y botones del modal
        this.registerLoginLink = page.locator('#checkoutModal a[href="/login"]');
        this.registerLoginLinkText = page.locator('#checkoutModal a[href="/login"] u:has-text("Register / Login")');
        this.continueOnCartButton = page.locator('#checkoutModal button.close-checkout-modal:has-text("Continue On Cart")');
        this.closeCheckoutModalButton = page.locator('#checkoutModal [data-dismiss="modal"]');
    }

    /**
     * Verifica si el modal de checkout está visible
     */
    async isVisible(): Promise<boolean> {
        return await this.checkoutModal.isVisible();
    }

    /**
     * Verifica si el modal de checkout está visible (alias para compatibilidad)
     */
    async isModalVisible(): Promise<boolean> {
        return await this.isVisible();
    }

    /**
     * Espera a que el modal de checkout aparezca
     */
    async waitForModal(): Promise<void> {
        await this.checkoutModal.waitFor({ state: 'visible' });
    }

    /**
     * Cierra el modal de checkout
     */
    async closeModal(): Promise<void> {
        await this.closeCheckoutModalButton.click();
    }

    /**
     * Hace clic en el enlace de registro/login
     */
    async clickRegisterLoginLink(): Promise<void> {
        await this.registerLoginLink.click();
    }

    /**
     * Hace clic en el botón de continuar en el carrito
     */
    async clickContinueOnCart(): Promise<void> {
        await this.continueOnCartButton.click();
    }

    /**
     * Verifica que el título del modal sea correcto
     */
    async verifyModalTitle(): Promise<boolean> {
        return await this.checkoutModalTitle.isVisible();
    }

    /**
     * Obtiene el texto del enlace de registro/login
     */
    async getRegisterLoginText(): Promise<string> {
        return await this.registerLoginLinkText.textContent() || '';
    }
}
