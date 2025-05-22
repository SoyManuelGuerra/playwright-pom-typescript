import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutStepOnePage representa la página "Checkout: Your Information".
 */
export class CheckoutStepOnePage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;
  private readonly errorMessageContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('.title');
    this.firstNameInput = this.page.locator('[data-test="firstName"]');
    this.lastNameInput = this.page.locator('[data-test="lastName"]');
    this.postalCodeInput = this.page.locator('[data-test="postalCode"]');
    this.continueButton = this.page.locator('[data-test="continue"]');
    this.cancelButton = this.page.locator('[data-test="cancel"]');
    this.errorMessageContainer = this.page.locator('[data-test="error"]');
  }

  /**
   * Verifica que se está en la página "Checkout: Your Information".
   */
  async expectToBeOnCheckoutStepOnePage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout-step-one.html/);
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText('Checkout: Your Information');
  }

  /**
   * Rellena el campo de nombre.
   * @param firstName - Nombre a ingresar.
   */
  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  /**
   * Rellena el campo de apellido.
   * @param lastName - Apellido a ingresar.
   */
  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  /**
   * Rellena el campo de código postal.
   * @param postalCode - Código postal a ingresar.
   */
  async fillPostalCode(postalCode: string): Promise<void> {
    await this.postalCodeInput.fill(postalCode);
  }

  /**
   * Hace clic en el botón "Continue".
   */
  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  /**
   * Hace clic en el botón "Cancel".
   */
  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Rellena el formulario de información y hace clic en "Continue".
   * @param firstName - Nombre.
   * @param lastName - Apellido.
   * @param postalCode - Código Postal.
   */
  async submitInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillPostalCode(postalCode);
    await this.clickContinue();
  }

  /**
   * Obtiene el mensaje de error visible.
   * @returns El texto del mensaje de error o null si no es visible.
   */
  async getErrorMessage(): Promise<string | null> {
    if (await this.errorMessageContainer.isVisible()) {
      return this.errorMessageContainer.textContent();
    }
    return null;
  }
}
