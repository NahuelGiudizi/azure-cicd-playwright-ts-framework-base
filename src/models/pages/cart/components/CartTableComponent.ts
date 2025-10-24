// src/models/pages/components/CartTableComponent.ts
import { Page, Locator } from '@playwright/test';

/**
 * Componente para la tabla del carrito de compras
 * Maneja todos los elementos relacionados con la visualización de productos en el carrito
 */
export class CartTableComponent {
    readonly page: Page;
    
    // Container principal
    readonly cartInfoContainer: Locator;
    readonly cartTable: Locator;
    readonly cartTableHead: Locator;
    readonly cartMenu: Locator;
    readonly cartTableBody: Locator;
    readonly cartItems: Locator;
    
    // Headers de la tabla
    readonly itemHeader: Locator;
    readonly descriptionHeader: Locator;
    readonly priceHeader: Locator;
    readonly quantityHeader: Locator;
    readonly totalHeader: Locator;
    
    // Filas de productos
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

    constructor(page: Page) {
        this.page = page;
        
        // Container principal
        this.cartInfoContainer = page.locator('#cart_info');
        this.cartTable = page.locator('#cart_info_table');
        this.cartTableHead = page.locator('#cart_info_table thead');
        this.cartMenu = page.locator('#cart_info_table .cart_menu');
        this.cartTableBody = page.locator('#cart_info_table tbody');
        this.cartItems = page.locator('#cart_info_table tbody tr[id^="product-"]');
        
        // Headers de la tabla
        this.itemHeader = page.locator('.cart_menu .image:has-text("Item")');
        this.descriptionHeader = page.locator('.cart_menu .description:has-text("Description")');
        this.priceHeader = page.locator('.cart_menu .price:has-text("Price")');
        this.quantityHeader = page.locator('.cart_menu .quantity:has-text("Quantity")');
        this.totalHeader = page.locator('.cart_menu .total:has-text("Total")');
        
        // Filas de productos
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
    }

    /**
     * Obtiene el número de productos en el carrito
     */
    async getProductCount(): Promise<number> {
        return await this.cartItems.count();
    }

    /**
     * Obtiene el nombre del producto en la fila especificada
     */
    async getProductName(rowIndex: number): Promise<string> {
        const productName = this.productNames.nth(rowIndex);
        return await productName.textContent() || '';
    }

    /**
     * Obtiene el precio del producto en la fila especificada
     */
    async getProductPrice(rowIndex: number): Promise<string> {
        const productPrice = this.productPrices.nth(rowIndex);
        return await productPrice.textContent() || '';
    }

    /**
     * Obtiene la cantidad del producto en la fila especificada
     */
    async getProductQuantity(rowIndex: number): Promise<string> {
        const productQuantity = this.productQuantities.nth(rowIndex);
        return await productQuantity.textContent() || '';
    }

    /**
     * Obtiene el total del producto en la fila especificada
     */
    async getProductTotal(rowIndex: number): Promise<string> {
        const productTotal = this.productTotals.nth(rowIndex);
        return await productTotal.textContent() || '';
    }

    /**
     * Elimina un producto del carrito por índice
     */
    async deleteProduct(rowIndex: number): Promise<void> {
        const deleteButton = this.deleteButtons.nth(rowIndex);
        await deleteButton.click();
    }

    /**
     * Verifica si la tabla del carrito está visible
     */
    async isTableVisible(): Promise<boolean> {
        return await this.cartTable.isVisible();
    }

    /**
     * Verifica si el carrito está vacío
     */
    async isEmpty(): Promise<boolean> {
        const count = await this.getProductCount();
        return count === 0;
    }

    /**
     * Obtiene la categoría del producto en la fila especificada
     */
    async getProductCategory(rowIndex: number): Promise<string> {
        const productCategory = this.productCategories.nth(rowIndex);
        return await productCategory.textContent() || '';
    }

    /**
     * Obtiene todos los detalles del producto en la fila especificada
     */
    async getProductDetails(rowIndex: number): Promise<{
        name: string;
        price: string;
        quantity: string;
        total: string;
        category: string;
        productId: string;
    }> {
        const name = await this.getProductName(rowIndex);
        const price = await this.getProductPrice(rowIndex);
        const quantity = await this.getProductQuantity(rowIndex);
        const total = await this.getProductTotal(rowIndex);
        const category = await this.getProductCategory(rowIndex);
        
        // Extract product ID from the product link
        const productLink = this.productLinks.nth(rowIndex);
        const href = await productLink.getAttribute('href') || '';
        const productId = href.match(/\/product_details\/(\d+)/)?.[1] || '';
        
        return {
            name,
            price,
            quantity,
            total,
            category,
            productId
        };
    }

    /**
     * Obtiene el monto total del carrito
     */
    async getTotalAmount(): Promise<string> {
        // Look for total amount in the cart - this might be in a different location
        // For now, we'll calculate it from individual totals
        const count = await this.getProductCount();
        let total = 0;
        
        for (let i = 0; i < count; i++) {
            const productTotal = await this.getProductTotal(i);
            const amount = parseFloat(productTotal.replace(/[^\d.]/g, ''));
            total += amount;
        }
        
        return `Rs. ${total.toFixed(0)}`;
    }
}
