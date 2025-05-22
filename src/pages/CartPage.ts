import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage representa la página del carrito de compras.
 */
export class CartPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('.title');
    this.cartItems = this.page.locator('.cart_item');
    this.checkoutButton = this.page.locator('[data-test="checkout"]');
    this.continueShoppingButton = this.page.locator('[data-test="continue-shopping"]');
  }

  /**
   * Verifica que se está en la página del carrito.
   */
  async expectToBeOnCartPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*cart.html/);
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  /**
   * Obtiene el número de ítems diferentes en el carrito.
   * @returns El número de elementos .cart_item.
   */
  async getCartItemCount(): Promise<number> {
    await this.cartItems.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => { /* El carrito puede estar vacío */ });
    return this.cartItems.count();
  }

  /**
   * Hace clic en el botón "Checkout".
   */
  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /**
   * Hace clic en el botón "Continue Shopping".
   */
  async clickContinueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  /**
   * Remueve un ítem del carrito basado en su nombre.
   * @param itemName - El nombre exacto del producto como aparece en la UI.
   */
  async removeCartItem(itemName: string): Promise<void> {
    const removeButtonSelector = `[data-test="remove-${itemName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}"]`;
    await this.page.locator(removeButtonSelector).click();
  }

  /**
   * Obtiene el locator de un ítem en el carrito por su nombre.
   * @param itemName - El nombre exacto del producto.
   * @returns Locator del elemento .cart_item que contiene el nombre.
   */
  async getCartItemByName(itemName: string): Promise<Locator> {
    return this.page.locator('.cart_item', { has: this.page.locator('.inventory_item_name', { hasText: itemName }) });
  }
}
