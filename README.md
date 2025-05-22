# Proyecto de Automatización con Playwright y TypeScript (Modelo POM)

Este proyecto es un ejemplo de cómo estructurar pruebas de automatización web utilizando Playwright, TypeScript y el patrón de diseño Page Object Model (POM).

## Requisitos Previos

* Node.js (versión 18.x o superior recomendada)
* npm o yarn

## Configuración del Proyecto

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd playwright-pom-typescript-portfolio
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    # o
    # yarn install
    ```

3.  **Instalar navegadores de Playwright:**
    ```bash
    npx playwright install
    ```

4.  **Configurar variables de entorno:**
    Copia el archivo `.env.example` a un nuevo archivo llamado `.env`:
    ```bash
    cp .env.example .env
    ```
    Luego, edita el archivo `.env` con tus propias configuraciones (URLs, credenciales de prueba, etc.). Para el ejemplo de `saucedemo.com`, las credenciales ya están incluidas, pero puedes modificarlas si es necesario.

## Ejecución de Pruebas

* **Ejecutar todas las pruebas (headless):**
    ```bash
    npm test
    ```

* **Ejecutar todas las pruebas (con navegador visible - headed mode):**
    ```bash
    npm run test:headed
    ```

* **Ejecutar pruebas con la UI de Playwright Test:**
    ```bash
    npm run test:ui
    ```

* **Ejecutar pruebas en modo debug:**
    ```bash
    npm run test:debug
    ```

* **Generar código con Playwright Codegen (apuntando a tu URL base):**
    ```bash
    npm run codegen
    ```

## Estructura del Proyecto

(Aquí puedes incluir la estructura de carpetas que definimos anteriormente)

## Linting y Formateo

* **Verificar errores de linting:**
    ```bash
    npm run lint
    ```
* **Corregir errores de linting automáticamente:**
    ```bash
    npm run lint:fix
    ```
* **Formatear el código con Prettier:**
    ```bash
    npm run format
    ```

## Buenas Prácticas Implementadas

* **Page Object Model (POM):** Separación de la lógica de las páginas y las pruebas.
* **TypeScript:** Tipado estático para mayor robustez y mantenibilidad.
* **Variables de Entorno:** Manejo seguro de configuraciones y datos sensibles.
* **Selectores Robustos:** Preferencia por `data-test` atributos, IDs o selectores CSS estables.
* **Esperas Explícitas:** Uso de las capacidades de espera de Playwright en lugar de esperas fijas.
* **Scripts NPM:** Comandos definidos para tareas comunes.
* **Reportes HTML:** Generación de reportes detallados de las ejecuciones.
* **Linting y Formateo:** Mantenimiento de la calidad y consistencia del código.
