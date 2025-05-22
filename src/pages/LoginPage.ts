import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage representa la página de inicio de sesión de la aplicación.
 * Contiene los selectores y métodos para interactuar con los elementos de esta página.
 */
export class LoginPage extends BasePage {
  // Selectores de los elementos de la página de login
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessageContainer: Locator;

  /**
   * Constructor de la clase LoginPage.
   * @param page - Instancia de la página de Playwright.
   */
  constructor(page: Page) {
    super(page); // Llama al constructor de BasePage

    // Inicialización de los locators utilizando selectores robustos (IDs, data-test atributos)
    this.usernameInput = this.page.locator('[data-test="username"]');
    this.passwordInput = this.page.locator('[data-test="password"]');
    this.loginButton = this.page.locator('[data-test="login-button"]');
    this.errorMessageContainer = this.page.locator('[data-test="error"]');
  }

  /**
   * Navega a la página de inicio de sesión.
   * Por defecto, la baseURL se configura en playwright.config.ts,
   * por lo que '/' o una ruta específica debería ser suficiente.
   */
  async navigate(): Promise<void> {
    await super.navigateTo('/'); // Asume que la baseURL es la página de login o se redirige a ella.
                                 // Para saucedemo.com, la baseURL es directamente la página de login.
  }

  /**
   * Rellena el campo de nombre de usuario.
   * @param username - El nombre de usuario a ingresar.
   */
  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  /**
   * Rellena el campo de contraseña.
   * @param password - La contraseña a ingresar.
   */
  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Hace clic en el botón de inicio de sesión.
   */
  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Realiza el proceso completo de inicio de sesión.
   * @param username - El nombre de usuario.
   * @param password - La contraseña.
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Obtiene el mensaje de error de inicio de sesión.
   * @returns El texto del mensaje de error, o null si no es visible.
   */
  async getErrorMessage(): Promise<string | null> {
    if (await this.errorMessageContainer.isVisible()) {
      return this.errorMessageContainer.textContent();
    }
    return null;
  }

  /**
   * Verifica si el contenedor de mensaje de error está visible.
   * @returns True si el mensaje de error es visible, false en caso contrario.
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return this.errorMessageContainer.isVisible();
  }
}
