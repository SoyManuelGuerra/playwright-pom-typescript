import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage contiene métodos comunes que pueden ser utilizados por cualquier Page Object.
 * Esto ayuda a evitar la duplicación de código y promueve la reutilización.
 */
export class BasePage {
  readonly page: Page;

  /**
   * Constructor de la clase BasePage.
   * @param page - Instancia de la página de Playwright.
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navega a una URL específica.
   * @param path - La ruta a la que navegar (relativa a la baseURL si está configurada).
   */
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Espera a que un selector específico sea visible en la página.
   * @param selector - El selector CSS o XPath del elemento.
   * @param timeout - Tiempo máximo de espera en milisegundos (opcional).
   */
  async waitForSelectorVisible(selector: string, timeout?: number): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Hace clic en un elemento identificado por un selector.
   * @param selector - El selector CSS o XPath del elemento.
   * @param options - Opciones adicionales para el clic (opcional).
   */
  async clickElement(selector: string, options?: { force?: boolean; timeout?: number }): Promise<void> {
    await this.page.locator(selector).click(options);
  }

  /**
   * Escribe texto en un campo de entrada identificado por un selector.
   * @param selector - El selector CSS o XPath del campo de entrada.
   * @param text - El texto a escribir.
   * @param options - Opciones adicionales para rellenar el campo (opcional).
   */
  async fillText(selector: string, text: string, options?: { force?: boolean; timeout?: number }): Promise<void> {
    await this.page.locator(selector).fill(text, options);
  }

  /**
   * Obtiene el texto de un elemento identificado por un selector.
   * @param selector - El selector CSS o XPath del elemento.
   * @returns El texto del elemento, o null si no se encuentra.
   */
  async getText(selector: string): Promise<string | null> {
    return this.page.locator(selector).textContent();
  }

  /**
   * Verifica que un elemento sea visible en la página.
   * @param selector - El selector CSS o XPath del elemento.
   */
  async expectElementToBeVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  /**
   * Verifica que un elemento contenga un texto específico.
   * @param selector - El selector CSS o XPath del elemento.
   * @param expectedText - El texto que se espera que contenga el elemento.
   */
  async expectElementToContainText(selector: string, expectedText: string | RegExp): Promise<void> {
    await expect(this.page.locator(selector)).toContainText(expectedText);
  }

  /**
   * Obtiene un Locator de Playwright para un selector dado.
   * @param selector - El selector CSS o XPath.
   * @returns El Locator correspondiente.
   */
  getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Toma una captura de pantalla.
   * @param options - Opciones para la captura de pantalla (ej: path).
   */
  async takeScreenshot(options?: { path?: string; fullPage?: boolean }): Promise<Buffer> {
    return this.page.screenshot(options);
  }

  /**
   * Espera un tiempo fijo (usar con moderación, preferir esperas explícitas).
   * @param milliseconds - Tiempo a esperar en milisegundos.
   */
  async waitForTimeout(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }
}
