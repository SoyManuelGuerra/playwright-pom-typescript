import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { HomePage } from '@pages/HomePage';
import { CartPage } from '@pages/CartPage';
import dotenv from 'dotenv';
import path from 'path';

// Carga las variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const standardUsername = process.env.SAUCEDEMO_STANDARD_USER || 'standard_user';
const password = process.env.SAUCEDEMO_PASSWORD || 'secret_sauce';

// Nombres de productos para usar en las pruebas (deben coincidir con los del sitio)
const product1Name = 'Sauce Labs Backpack';
const product2Name = 'Sauce Labs Bike Light';
const product3Name = 'Sauce Labs Bolt T-Shirt';


test.describe('Funcionalidad del Carrito de Compras en SauceDemo', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    // Inicializa Page Objects
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    cartPage = new CartPage(page);

    await test.step('Navegar a la página de login y iniciar sesión', async () => {
      await loginPage.navigate();
      await loginPage.login(standardUsername, password);
      await homePage.expectToBeOnInventoryPage();
    });
  });

  test('TC007: Agregar un ítem al carrito y verificar en página del carrito', async () => {
    await test.step(`Agregar "${product1Name}" al carrito`, async () => {
      await homePage.addItemToCart(product1Name);
      expect(await homePage.getShoppingCartBadgeCount()).toBe('1');
    });

    await test.step('Navegar a la página del carrito', async () => {
      await homePage.clickShoppingCartLink();
      await cartPage.expectToBeOnCartPage();
    });

    await test.step(`Verificar que "${product1Name}" está en el carrito`, async () => {
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(1);
      const itemInCart = await cartPage.getCartItemByName(product1Name);
      await expect(itemInCart).toBeVisible();
    });
  });

  test('TC008: Agregar múltiples ítems al carrito', async () => {
    await test.step(`Agregar "${product1Name}" al carrito`, async () => {
      await homePage.addItemToCart(product1Name);
      expect(await homePage.getShoppingCartBadgeCount()).toBe('1');
    });

    await test.step(`Agregar "${product2Name}" al carrito`, async () => {
      await homePage.addItemToCart(product2Name);
      expect(await homePage.getShoppingCartBadgeCount()).toBe('2');
    });

    await test.step('Navegar a la página del carrito', async () => {
      await homePage.clickShoppingCartLink();
      await cartPage.expectToBeOnCartPage();
    });

    await test.step('Verificar que ambos productos están en el carrito', async () => {
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(2);
      const item1InCart = await cartPage.getCartItemByName(product1Name);
      await expect(item1InCart).toBeVisible();
      const item2InCart = await cartPage.getCartItemByName(product2Name);
      await expect(item2InCart).toBeVisible();
    });
  });

  test('TC009: Remover un ítem desde la página del carrito', async () => {
    await test.step('Agregar productos al carrito', async () => {
      await homePage.addItemToCart(product1Name);
      await homePage.addItemToCart(product2Name);
      expect(await homePage.getShoppingCartBadgeCount()).toBe('2');
    });

    await test.step('Navegar a la página del carrito', async () => {
      await homePage.clickShoppingCartLink();
      await cartPage.expectToBeOnCartPage();
      expect(await cartPage.getCartItemCount()).toBe(2);
    });

    await test.step(`Remover "${product1Name}" del carrito`, async () => {
      await cartPage.removeCartItem(product1Name);
      expect(await cartPage.getCartItemCount()).toBe(1); // Un ítem restante
      const item1InCart = await cartPage.getCartItemByName(product1Name);
      await expect(item1InCart).not.toBeVisible();
      const item2InCart = await cartPage.getCartItemByName(product2Name);
      await expect(item2InCart).toBeVisible();
      expect(await homePage.getShoppingCartBadgeCount()).toBe('1'); // Badge global se actualiza
    });
  });

  test('TC010: Remover un ítem desde la página de inventario', async () => {
    await test.step(`Agregar "${product1Name}" al carrito`, async () => {
      await homePage.addItemToCart(product1Name);
      expect(await homePage.getShoppingCartBadgeCount()).toBe('1');
    });

    await test.step(`Remover "${product1Name}" desde la página de inventario`, async () => {
      await homePage.removeItemFromCart(product1Name);
      expect(await homePage.getShoppingCartBadgeCount()).toBeNull(); // Carrito vacío
    });

    await test.step('Navegar a la página del carrito y verificar que está vacío', async () => {
      await homePage.clickShoppingCartLink();
      await cartPage.expectToBeOnCartPage();
      // Esperar un poco para que el DOM se actualice si es necesario, o asegurar que la condición de vacío es robusta
      await expect(cartPage.getLocator('.cart_item')).toHaveCount(0); // Otra forma de verificar vacío
    });
  });

  test('TC011: Botón "Continue Shopping" redirige a la página de inventario', async () => {
    await test.step('Navegar a la página del carrito (vacío)', async () => {
      await homePage.clickShoppingCartLink();
      await cartPage.expectToBeOnCartPage();
    });

    await test.step('Hacer clic en "Continue Shopping"', async () => {
      await cartPage.clickContinueShopping();
    });

    await test.step('Verificar redirección a la página de inventario', async () => {
      await homePage.expectToBeOnInventoryPage();
      await homePage.expectInventoryPageTitleToBeVisible();
    });
  });
});
