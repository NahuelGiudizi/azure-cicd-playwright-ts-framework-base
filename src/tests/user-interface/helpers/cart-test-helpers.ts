import { CartPage, ProductsPage } from '../../../models/pages';
import { TIMEOUTS } from '../../../constants/timeouts';
import { expect } from '../../../fixtures/test-data-ui-new.fixture';

export class CartTestHelpers {
  constructor(private cartPage: CartPage, private productsPage: ProductsPage) {}

  /**
   * Adds a product to cart and navigates to cart page
   * @param productIndex - Zero-based index of product to add
   */
  async addProductAndNavigateToCart(productIndex: number) {
    await this.productsPage.navigateToProducts();
    await this.productsPage.addProductToCartAndViewCart(productIndex);
  }

  /**
   * Verifies cart has the expected number of items
   * @param expectedItemCount - Expected number of items in cart
   */
  async verifyCartState(expectedItemCount: number) {
    await this.cartPage.verifyCartHasItems();
    const actualCount = await this.cartPage.getCartItemCount();
    expect(actualCount).toBe(expectedItemCount);
  }

  /**
   * Sets up an empty cart by removing all products
   */
  async setupEmptyCart() {
    await this.cartPage.navigateToCart();
    const isEmpty = await this.cartPage.isCartEmpty();
    if (!isEmpty) {
      await this.cartPage.removeAllProducts();
    }
    await this.cartPage.verifyCartIsEmpty();
  }

  /**
   * Adds multiple products to cart with proper timing
   * @param productIndices - Array of product indices to add
   */
  async addMultipleProductsToCart(productIndices: number[]) {
    await this.productsPage.navigateToProducts();
    
    for (let i = 0; i < productIndices.length; i++) {
      await this.productsPage.addProductToCart(productIndices[i]);
      if (i < productIndices.length - 1) {
        await this.productsPage.page.waitForTimeout(TIMEOUTS.SHORT_WAIT);
      }
    }
    
    await this.productsPage.page.waitForTimeout(TIMEOUTS.SHORT_WAIT);
    await this.cartPage.navigateToCart();
  }

  /**
   * Verifies cart item details including names, prices, and quantities
   */
  async verifyCartItemDetails() {
    const productNames = await this.cartPage.getProductNames();
    const productPrices = await this.cartPage.getProductPrices();
    const productQuantities = await this.cartPage.getProductQuantities();
    
    expect(productNames.length).toBeGreaterThan(0);
    expect(productPrices.length).toEqual(productNames.length);
    expect(productQuantities.length).toEqual(productNames.length);
    
    // Verify each product has required data
    for (let i = 0; i < productNames.length; i++) {
      expect(productNames[i]).toBeTruthy();
      expect(productPrices[i]).toBeTruthy();
      expect(productQuantities[i]).toBeTruthy();
      expect(productPrices[i]).toMatch(/Rs\./);
    }
  }

  /**
   * Verifies cart total calculation accuracy
   */
  async verifyCartTotalCalculation() {
    await this.cartPage.verifyCartTotal();
    
    const totalAmount = await this.cartPage.getTotalAmount();
    expect(totalAmount).toMatch(/Rs\. \d+/);
    
    const productTotals = await this.cartPage.getProductTotals();
    const itemCount = await this.cartPage.getCartItemCount();
    expect(productTotals.length).toBe(itemCount);
    
    for (const total of productTotals) {
      expect(total).toMatch(/Rs\. \d+/);
      expect(parseFloat(total.replace(/[^\d.]/g, ''))).toBeGreaterThan(0);
    }
    
    // Verify calculated total matches sum of individual totals
    const calculatedTotal = productTotals.reduce((sum, total) => {
      return sum + parseFloat(total.replace(/[^\d.]/g, ''));
    }, 0);
    
    const displayedTotal = parseFloat(totalAmount.replace(/[^\d.]/g, ''));
    expect(Math.abs(calculatedTotal - displayedTotal)).toBeLessThan(1); // Allow for rounding differences
  }

  /**
   * Removes a product from cart and verifies the removal
   * @param productIndex - Index of product to remove
   */
  async removeProductAndVerify(productIndex: number) {
    const initialCount = await this.cartPage.getCartItemCount();
    await this.cartPage.removeProductByIndex(productIndex);
    
    const finalCount = await this.cartPage.getCartItemCount();
    expect(finalCount).toBe(initialCount - 1);
  }
}
