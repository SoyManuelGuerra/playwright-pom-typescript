import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { HomePage } from '@pages/HomePage';
import { CartPage } from '@pages/CartPage';
import { CheckoutStepOnePage } from '@pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '@pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '@pages/CheckoutCompletePage';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const standardUsername = process.env.SAUCEDEMO_STANDARD_USER || 'standard_user';
const password = process.env.SAUCEDEMO_PASSWORD || 'secret_sauce';

const product1Name = 'Sauce Labs Backpack'; // Asegúrate que este producto exista
const firstName = 'Juan';
const lastName = 'Perez';
const postalCode = 'C1000'; // Código postal de ejemplo

test.describe('Funcionalidad de Checkout en SauceDemo', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let cartPage: CartPage;
  let checkoutStepOnePage: CheckoutStepOnePage;
  let checkoutStepTwoPage: CheckoutStepTwoPage;
  let checkoutCompletePage: CheckoutCompletePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    cartPage = new CartPage(page);
    checkoutStepOnePage = new CheckoutStepOnePage(page);
    checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    checkoutCompletePage = new CheckoutCompletePage(page);

    await test.step('Navegar a la página de login y iniciar sesión', async () => {
      await loginPage.navigate();
      await loginPage.login(standardUsername, password);
      await homePage.expectToBeOnInventoryPage();
    });

    await test.step(`Agregar "${product1Name}" al carrito`, async () => {
      await homePage.addItemToCart(product1Name);
      expect(await homePage.getShoppingCartBadgeCount()).toBe('1');
    });

    await test.step('Navegar a la página del carrito', async () => {
      await homePage.clickShoppingCartLink();
      await cartPage.expectToBeOnCartPage();
      expect(await cartPage.getCartItemCount()).toBe(1);
    });
  });

  test('TC012: Completar flujo de checkout exitosamente', async () => {
    await test.step('Iniciar checkout desde el carrito', async () => {
      await cartPage.clickCheckout();
      await checkoutStepOnePage.expectToBeOnCheckoutStepOnePage();
    });

    await test.step('Ingresar información del comprador', async () => {
      await checkoutStepOnePage.submitInformation(firstName, lastName, postalCode);
      await checkoutStepTwoPage.expectToBeOnCheckoutStepTwoPage();
    });

    await test.step('Verificar información y finalizar compra', async () => {
      const itemInOverview = await checkoutStepTwoPage.getCartItemByName(product1Name);
      await expect(itemInOverview).toBeVisible();
      // Aquí podrías agregar aserciones sobre precios si es relevante
      // const subtotal = await checkoutStepTwoPage.getSubtotal();
      // expect(subtotal).toBeGreaterThan(0);

      await checkoutStepTwoPage.clickFinish();
      await checkoutCompletePage.expectToBeOnCheckoutCompletePage();
    });

    await test.step('Verificar página de confirmación', async () => {
      await checkoutCompletePage.expectCompleteHeaderToBeVisible('Thank you for your order!');
      await checkoutCompletePage.expectCompleteTextToBeVisible('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
      await checkoutCompletePage.expectPonyExpressImageToBeVisible();
    });

    await test.step('Regresar a la página de inicio', async () => {
      await checkoutCompletePage.clickBackHome();
      await homePage.expectToBeOnInventoryPage();
      expect(await homePage.getShoppingCartBadgeCount()).toBeNull(); // Carrito vacío
    });
  });

  test('TC013: Validaciones de campos en checkout paso uno', async () => {
    await test.step('Iniciar checkout desde el carrito', async () => {
      await cartPage.clickCheckout();
      await checkoutStepOnePage.expectToBeOnCheckoutStepOnePage();
    });

    await test.step('Intentar continuar sin rellenar campos', async () => {
      await checkoutStepOnePage.clickContinue();
      const errorMessage1 = await checkoutStepOnePage.getErrorMessage();
      expect(errorMessage1).toContain('Error: First Name is required');
    });

    await test.step('Rellenar nombre e intentar continuar', async () => {
      await checkoutStepOnePage.fillFirstName(firstName);
      await checkoutStepOnePage.clickContinue();
      const errorMessage2 = await checkoutStepOnePage.getErrorMessage();
      expect(errorMessage2).toContain('Error: Last Name is required');
    });

    await test.step('Rellenar apellido e intentar continuar', async () => {
      await checkoutStepOnePage.fillLastName(lastName); // Nombre ya estaba
      await checkoutStepOnePage.clickContinue();
      const errorMessage3 = await checkoutStepOnePage.getErrorMessage();
      expect(errorMessage3).toContain('Error: Postal Code is required');
    });
  });

  test('TC014: Cancelar checkout desde el paso uno', async () => {
    await test.step('Iniciar checkout desde el carrito', async () => {
      await cartPage.clickCheckout();
      await checkoutStepOnePage.expectToBeOnCheckoutStepOnePage();
    });

    await test.step('Cancelar el checkout', async () => {
      await checkoutStepOnePage.clickCancel();
    });

    await test.step('Verificar regreso a la página del carrito', async () => {
      await cartPage.expectToBeOnCartPage();
      expect(await cartPage.getCartItemCount()).toBe(1); // Ítem debe seguir en carrito
    });
  });

  test('TC015: Cancelar checkout desde el paso dos (resumen)', async () => {
    await test.step('Completar paso uno del checkout', async () => {
      await cartPage.clickCheckout();
      await checkoutStepOnePage.submitInformation(firstName, lastName, postalCode);
      await checkoutStepTwoPage.expectToBeOnCheckoutStepTwoPage();
    });

    await test.step('Cancelar checkout desde el paso dos', async () => {
      await checkoutStepTwoPage.clickCancel();
    });

    await test.step('Verificar regreso a la página de inventario', async () => {
      // SauceDemo redirige a inventory.html al cancelar desde checkout-step-two.html
      await homePage.expectToBeOnInventoryPage();
      expect(await homePage.getShoppingCartBadgeCount()).toBe('1'); // Ítem debe seguir en carrito
    });
  });
});
