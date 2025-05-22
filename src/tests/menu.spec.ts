import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { HomePage } from '@pages/HomePage'; // HomePage ahora tiene métodos del menú
import { CartPage } from '@pages/CartPage';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const standardUsername = process.env.SAUCEDEMO_STANDARD_USER || 'standard_user';
const password = process.env.SAUCEDEMO_PASSWORD || 'secret_sauce';
const product1Name = 'Sauce Labs Backpack';

test.describe('Funcionalidad del Menú Lateral (Hamburguesa) en SauceDemo', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let cartPage: CartPage; // Para verificar el estado del carrito después de Reset App State

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    cartPage = new CartPage(page);

    await test.step('Navegar a la página de login y iniciar sesión', async () => {
      await loginPage.navigate();
      await loginPage.login(standardUsername, password);
      await homePage.expectToBeOnInventoryPage();
    });
  });

  test('TC020: Enlace "All Items" del menú lateral', async ({ page }) => {
    await test.step('Abrir menú y hacer clic en "All Items"', async () => {
      // Primero, vamos a otra página (ej. el carrito) para asegurar que "All Items" nos regresa
      await homePage.addItemToCart(product1Name);
      await homePage.clickShoppingCartLink();
      await cartPage.expectToBeOnCartPage(); // Confirmar que estamos en el carrito

      await homePage.goToAllItems(); // Este método abre el menú y hace clic
    });

    await test.step('Verificar que se redirige a la página de inventario', async () => {
      await homePage.expectToBeOnInventoryPage();
      await homePage.expectInventoryPageTitleToBeVisible();
    });
  });

  test('TC021: Enlace "About" del menú lateral', async ({ page }) => {
    await test.step('Abrir menú y hacer clic en "About"', async () => {
      await homePage.goToAbout();
    });

    await test.step('Verificar que se redirige a la página "About" de saucelabs.com', async () => {
      // La URL de "About" es externa
      await expect(page).toHaveURL('https://saucelabs.com/');
      // Volver a la página anterior para las siguientes pruebas si es necesario
      // await page.goBack();
      // await homePage.expectToBeOnInventoryPage(); // Asegurar que volvemos bien
    });
  });

  test('TC022: Funcionalidad "Logout" del menú lateral', async ({ page }) => {
    // Esta prueba ya existe en login.spec.ts (TC006), pero la replicamos aquí para el contexto del menú.
    // Podrías decidir mantenerla solo en un lugar.
    await test.step('Abrir menú y hacer clic en "Logout"', async () => {
      await homePage.logout();
    });

    await test.step('Verificar que se redirige a la página de login', async () => {
      await expect(loginPage.getLocator('[data-test="username"]')).toBeVisible();
      await expect(loginPage.getLocator('[data-test="password"]')).toBeVisible();
      await expect(page).toHaveURL(process.env.BASE_URL || /.*saucedemo.com/);
    });
  });

  test('TC023: Funcionalidad "Reset App State" del menú lateral', async ({ page }) => {
    await test.step(`Agregar "${product1Name}" al carrito`, async () => {
      await homePage.addItemToCart(product1Name);
      expect(await homePage.getShoppingCartBadgeCount()).toBe('1');
    });

    await test.step('Navegar al carrito para confirmar el ítem', async () => {
      await homePage.clickShoppingCartLink();
      await cartPage.expectToBeOnCartPage();
      expect(await cartPage.getCartItemCount()).toBe(1);
      await cartPage.clickContinueShopping(); // Volver a la página de inventario
      await homePage.expectToBeOnInventoryPage();
    });

    await test.step('Abrir menú y hacer clic en "Reset App State"', async () => {
      await homePage.resetAppState();
    });

    await test.step('Verificar que el carrito está vacío después del reset', async () => {
      // El badge debería desaparecer o ser nulo
      expect(await homePage.getShoppingCartBadgeCount()).toBeNull();

      // Verificar también en la página del carrito
      await homePage.clickShoppingCartLink();
      await cartPage.expectToBeOnCartPage();
      await expect(cartPage.getLocator('.cart_item')).toHaveCount(0);
    });
  });
});
