import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutCompletePage representa la página "Checkout: Complete!".
 */
export class CheckoutCompletePage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly completeHeader: Locator;
  private readonly completeText: Locator;
  private readonly backHomeButton: Locator;
  private readonly ponyExpressImage: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('.title');
    this.completeHeader = this.page.locator('.complete-header');
    this.completeText = this.page.locator('.complete-text');
    this.backHomeButton = this.page.locator('[data-test="back-to-products"]');
    this.ponyExpressImage = this.page.locator('.pony_express');
  }

  /**
   * Verifica que se está en la página "Checkout: Complete!".
   */
  async expectToBeOnCheckoutCompletePage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout-complete.html/);
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText('Checkout: Complete!');
  }

  /**
   * Verifica que el encabezado de completado sea visible y contenga el texto esperado.
   * @param expectedText - Texto esperado en el encabezado.
   */
  async expectCompleteHeaderToBeVisible(expectedText: string = 'Thank you for your order!'): Promise<void> {
    await expect(this.completeHeader).toBeVisible();
    await expect(this.completeHeader).toHaveText(expectedText);
  }

  /**
   * Verifica que el texto de completado sea visible y contenga el texto esperado.
   * @param expectedText - Texto esperado en el cuerpo del mensaje.
   */
  async expectCompleteTextToBeVisible(expectedText: string = 'Your order has been dispatched, and will arrive just as fast as the pony can get there!'): Promise<void> {
    await expect(this.completeText).toBeVisible();
    await expect(this.completeText).toHaveText(expectedText);
  }

  /**
   * Verifica que la imagen del Pony Express sea visible.
   */
  async expectPonyExpressImageToBeVisible(): Promise<void> {
    await expect(this.ponyExpressImage).toBeVisible();
  }

  /**
   * Hace clic en el botón "Back Home".
   */
  async clickBackHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
