import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage representa la página principal de inventario después de un inicio de sesión exitoso.
 * Contiene los selectores y métodos para interactuar con los elementos de esta página.
 */
export class HomePage extends BasePage {
  // Selectores de los elementos de la página de inicio/inventario
  private readonly pageTitle: Locator;
  private readonly shoppingCartLink: Locator;
  private readonly shoppingCartBadge: Locator; // Para el contador de ítems
  private readonly burgerMenuButton: Locator;
  private readonly logoutLink: Locator;
  private readonly inventoryItems: Locator; // Para obtener todos los productos
  // Selectores de menú
  private readonly allItemsLink: Locator;
  private readonly aboutLink: Locator;
  private readonly resetAppStateLink: Locator;


  /**
   * Constructor de la clase HomePage.
   * @param page - Instancia de la página de Playwright.
   */
  constructor(page: Page) {
    super(page); // Llama al constructor de BasePage

    // Inicialización de los locators
    this.pageTitle = this.page.locator('.title'); // El título "Products"
    this.shoppingCartLink = this.page.locator('.shopping_cart_link');
    this.shoppingCartBadge = this.page.locator('.shopping_cart_badge');
    this.burgerMenuButton = this.page.locator('#react-burger-menu-btn');
    this.logoutLink = this.page.locator('#logout_sidebar_link');
    this.inventoryItems = this.page.locator('.inventory_item');

    // Locators del menú lateral
    this.allItemsLink = this.page.locator('#inventory_sidebar_link');
    this.aboutLink = this.page.locator('#about_sidebar_link');
    this.resetAppStateLink = this.page.locator('#reset_sidebar_link');
  }

  /**
   * Verifica que el título de la página de inventario sea visible.
   * El título esperado es "Products".
   */
  async expectInventoryPageTitleToBeVisible(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText('Products');
  }

  /**
   * Verifica que el enlace del carrito de compras sea visible.
   */
  async expectShoppingCartLinkToBeVisible(): Promise<void> {
    await expect(this.shoppingCartLink).toBeVisible();
  }

  /**
   * Abre el menú lateral (hamburguesa).
   */
  async openBurgerMenu(): Promise<void> {
    await this.burgerMenuButton.click();
    // Espera a que un elemento del menú sea visible para asegurar que se abrió
    await expect(this.allItemsLink).toBeVisible({ timeout: 5000 });
  }

  /**
   * Realiza el proceso de logout.
   */
  async logout(): Promise<void> {
    await this.openBurgerMenu();
    await this.logoutLink.click();
  }

  /**
   * Navega a "All Items" desde el menú lateral.
   */
  async goToAllItems(): Promise<void> {
    await this.openBurgerMenu();
    await this.allItemsLink.click();
  }

  /**
   * Navega a "About" desde el menú lateral.
   */
  async goToAbout(): Promise<void> {
    await this.openBurgerMenu();
    await this.aboutLink.click();
  }

  /**
   * Hace clic en "Reset App State" desde el menú lateral.
   */
  async resetAppState(): Promise<void> {
    await this.openBurgerMenu();
    await this.resetAppStateLink.click();
    // Es buena idea cerrar el menú después de una acción si no hay navegación
    // await this.burgerMenuButton.click(); // O presionar Escape
    await this.page.keyboard.press('Escape');
  }


  /**
   * Verifica que la URL actual corresponda a la página de inventario.
   * La URL esperada es '/inventory.html'.
   */
  async expectToBeOnInventoryPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory.html/);
  }

  /**
   * Agrega un ítem al carrito usando su nombre.
   * @param itemName - El nombre exacto del producto como aparece en la UI.
   */
  async addItemToCart(itemName: string): Promise<void> {
    // Construye el selector data-test dinámicamente. Ej: "Sauce Labs Backpack" -> "add-to-cart-sauce-labs-backpack"
    const dataTestValue = `add-to-cart-${itemName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}`;
    const addButtonSelector = `[data-test="${dataTestValue}"]`;
    await this.page.locator(addButtonSelector).click();
  }

  /**
   * Remueve un ítem del carrito (desde la página de inventario) usando su nombre.
   * @param itemName - El nombre exacto del producto como aparece en la UI.
   */
  async removeItemFromCart(itemName: string): Promise<void> {
    // Construye el selector data-test dinámicamente. Ej: "Sauce Labs Backpack" -> "remove-sauce-labs-backpack"
    const dataTestValue = `remove-${itemName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}`;
    const removeButtonSelector = `[data-test="${dataTestValue}"]`;
    await this.page.locator(removeButtonSelector).click();
  }

  /**
   * Obtiene el contador de ítems del ícono del carrito.
   * @returns El número como string (ej. "1") o null si el badge no es visible.
   */
  async getShoppingCartBadgeCount(): Promise<string | null> {
    if (await this.shoppingCartBadge.isVisible()) {
      return this.shoppingCartBadge.textContent();
    }
    return null;
  }

  /**
   * Hace clic en el enlace del carrito de compras.
   */
  async clickShoppingCartLink(): Promise<void> {
    await this.shoppingCartLink.click();
  }
}
