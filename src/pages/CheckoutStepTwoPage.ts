import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutStepTwoPage representa la página "Checkout: Overview".
 */
export class CheckoutStepTwoPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly cartItems: Locator;
  private readonly finishButton: Locator;
  private readonly cancelButton: Locator;
  private readonly summaryInfoLabels: Locator;
  private readonly summarySubtotalLabel: Locator;
  private readonly summaryTaxLabel: Locator;
  private readonly summaryTotalLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('.title');
    this.cartItems = this.page.locator('.cart_item');
    this.finishButton = this.page.locator('[data-test="finish"]');
    this.cancelButton = this.page.locator('[data-test="cancel"]');
    this.summaryInfoLabels = this.page.locator('.summary_info_label');
    this.summarySubtotalLabel = this.page.locator('.summary_subtotal_label');
    this.summaryTaxLabel = this.page.locator('.summary_tax_label');
    this.summaryTotalLabel = this.page.locator('.summary_total_label');
  }

  /**
   * Verifica que se está en la página "Checkout: Overview".
   */
  async expectToBeOnCheckoutStepTwoPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout-step-two.html/);
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
  }

  /**
   * Obtiene el número de ítems en el resumen del carrito.
   */
  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  /**
   * Obtiene el locator de un ítem en el resumen por su nombre.
   * @param itemName - Nombre del producto.
   */
  async getCartItemByName(itemName: string): Promise<Locator> {
    return this.page.locator('.cart_item', { has: this.page.locator('.inventory_item_name', { hasText: itemName }) });
  }

  /**
   * Hace clic en el botón "Finish".
   */
  async clickFinish(): Promise<void> {
    await this.finishButton.click();
  }

  /**
   * Hace clic en el botón "Cancel".
   */
  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Obtiene el subtotal del resumen.
   * @returns El valor numérico del subtotal o null.
   */
  async getSubtotal(): Promise<number | null> {
    const text = await this.summarySubtotalLabel.textContent();
    return text ? parseFloat(text.replace(/[^0-9.]/g, '')) : null;
  }

  /**
   * Obtiene el impuesto (tax) del resumen.
   * @returns El valor numérico del impuesto o null.
   */
  async getTax(): Promise<number | null> {
    const text = await this.summaryTaxLabel.textContent();
    return text ? parseFloat(text.replace(/[^0-9.]/g, '')) : null;
  }

  /**
   * Obtiene el total del resumen.
   * @returns El valor numérico del total o null.
   */
  async getTotal(): Promise<number | null> {
    const text = await this.summaryTotalLabel.textContent();
    return text ? parseFloat(text.replace(/[^0-9.]/g, '')) : null;
  }
}
