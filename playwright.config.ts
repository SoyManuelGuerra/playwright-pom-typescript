import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Lee las variables de entorno del archivo .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Consulta https://playwright.dev/docs/test-configuration para más información.
 */
export default defineConfig({
  // Directorio donde se encuentran los tests (specs)
  testDir: './src/tests',

  /* Tiempo máximo que una prueba puede ejecutarse (en milisegundos). */
  timeout: 60 * 1000, // 60 segundos

  /* Tiempo máximo que una expectativa (expect) puede esperar (en milisegundos). */
  expect: {
    timeout: 10 * 1000, // 10 segundos
  },

  /* Ejecutar pruebas en paralelo por defecto. */
  fullyParallel: true,

  /* Número de reintentos en caso de fallo. */
  retries: process.env.CI ? 2 : 0, // 2 reintentos en CI, 0 localmente

  /* Número de workers para ejecutar pruebas en paralelo. */
  workers: process.env.CI ? 1 : undefined, // 1 worker en CI, indefinido (Playwright decide) localmente

  /* Reporter a usar. Ver https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'], // Reporter simple en la consola
    ['html', { open: 'never', outputFolder: 'playwright-report' }] // Genera un reporte HTML
  ],

  /* Opciones globales para todos los proyectos. */
  use: {
    /* URL base para acciones como `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com', // Ejemplo, cámbialo por tu URL

    /* Recolecta trazas de ejecución. Ver https://playwright.dev/docs/trace-viewer */
    trace: 'on', // Graba trazas en todas las ejecuciones

    /* Captura screenshots en caso de fallo. */
    screenshot: 'only-on-failure',

    /* Graba video de las pruebas. */
    video: 'retain-on-failure',

    /* Opciones del viewport. */
    viewport: { width: 1280, height: 720 },

    /* Ignorar errores HTTPS (usar con precaución). */
    ignoreHTTPSErrors: true,

    /* Configuración de la acción de espera (action timeout). */
    actionTimeout: 15 * 1000, // 15 segundos para acciones como click, fill

    /* Configuración del tiempo de espera para navegación (navigation timeout). */
    navigationTimeout: 30 * 1000, // 30 segundos para page.goto()
  },

  /* Configuración específica por proyecto (navegador, dispositivo, etc.). */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /* Pruebas para navegadores móviles */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* Carpeta para artefactos de prueba como screenshots, videos, trazas, etc. */
  outputDir: 'test-results/',

  /* (Opcional) Script a ejecutar antes de que comiencen todas las pruebas. */
  // globalSetup: require.resolve('./global-setup'),

  /* (Opcional) Script a ejecutar después de que terminen todas las pruebas. */
  // globalTeardown: require.resolve('./global-teardown'),
});
