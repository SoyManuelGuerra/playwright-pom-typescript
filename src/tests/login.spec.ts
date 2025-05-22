import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { HomePage } from '@pages/HomePage'; // Asumiendo que tienes una HomePage para verificar el login exitoso
import dotenv from 'dotenv';
import path from 'path';

// Carga las variables de entorno para acceder a credenciales seguras
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Constantes para credenciales (mejor obtenerlas de variables de entorno)
const standardUsername = process.env.SAUCEDEMO_STANDARD_USER || 'standard_user';
const lockedOutUsername = process.env.SAUCEDEMO_LOCKED_OUT_USER || 'locked_out_user';
const problemUsername = process.env.SAUCEDEMO_PROBLEM_USER || 'problem_user';
const performanceGlitchUsername = process.env.SAUCEDEMO_PERFORMANCE_GLITCH_USER || 'performance_glitch_user';
const password = process.env.SAUCEDEMO_PASSWORD || 'secret_sauce';


test.describe('Funcionalidad de Inicio de Sesión en SauceDemo', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    // Inicializa los Page Objects antes de cada prueba
    loginPage = new LoginPage(page);
    homePage = new HomePage(page); // Necesitarás crear HomePage.ts

    // Navega a la página de login
    await loginPage.navigate();
  });

  test('TC001: Inicio de sesión exitoso con credenciales válidas', async ({ page }) => {
    // Realiza el login
    await loginPage.login(standardUsername, password);

    // Verificaciones en la página de inicio (HomePage)
    await homePage.expectToBeOnInventoryPage();
    await homePage.expectInventoryPageTitleToBeVisible();
    await homePage.expectShoppingCartLinkToBeVisible();
  });

  test('TC002: Intento de inicio de sesión con usuario bloqueado', async ({ page }) => {
    // Realiza el login con un usuario bloqueado
    await loginPage.login(lockedOutUsername, password);

    // Verifica el mensaje de error
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface: Sorry, this user has been locked out.');
    await expect(loginPage.getLocator('[data-test="error"]')).toBeVisible(); // Asegura que el contenedor del error es visible
  });

  test('TC003: Intento de inicio de sesión con contraseña incorrecta', async ({ page }) => {
    // Realiza el login con contraseña incorrecta
    await loginPage.login(standardUsername, 'wrong_password');

    // Verifica el mensaje de error
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface: Username and password do not match any user in this service');
    await expect(loginPage.getLocator('[data-test="error"]')).toBeVisible();
  });

  test('TC004: Intento de inicio de sesión con nombre de usuario vacío', async ({ page }) => {
    // Intenta hacer login sin nombre de usuario
    await loginPage.enterPassword(password);
    await loginPage.clickLoginButton();

    // Verifica el mensaje de error
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface: Username is required');
    await expect(loginPage.getLocator('[data-test="error"]')).toBeVisible();
  });

  test('TC005: Intento de inicio de sesión con contraseña vacía', async ({ page }) => {
    // Intenta hacer login sin contraseña
    await loginPage.enterUsername(standardUsername);
    await loginPage.clickLoginButton();

    // Verifica el mensaje de error
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface: Password is required');
    await expect(loginPage.getLocator('[data-test="error"]')).toBeVisible();
  });

  test('TC006: Logout exitoso después de iniciar sesión', async ({ page }) => {
    // Login
    await loginPage.login(standardUsername, password);
    await homePage.expectToBeOnInventoryPage();

    // Logout
    await homePage.logout();

    // Verificar que se redirige a la página de login (los campos deben estar visibles)
    await expect(loginPage.getLocator('[data-test="username"]')).toBeVisible();
    await expect(loginPage.getLocator('[data-test="password"]')).toBeVisible();
    await expect(loginPage.getLocator('[data-test="login-button"]')).toBeVisible();
    // Adicionalmente, la URL debería ser la raíz
    await expect(page).toHaveURL(process.env.BASE_URL || 'https://www.saucedemo.com/');
  });

});
