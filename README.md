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
    El comando principal para instalar las dependencias es:
    ```bash
    npm install
    ```
    Si prefieres usar `yarn` y ya lo tienes configurado en tu entorno, puedes ejecutar:
    ```bash
    # Si prefieres usar yarn y lo tienes instalado:
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

El proyecto está organizado de la siguiente manera:

```
playwright-pom-typescript-portfolio/
├── .env                # Variables de entorno locales (creado a partir de .env.example)
├── .env.example        # Ejemplo de archivo de variables de entorno
├── .gitignore          # Archivos ignorados por Git
├── README.md           # Este archivo
├── package.json        # Dependencias y scripts del proyecto
├── package-lock.json   # Versiones exactas de las dependencias
├── playwright.config.ts # Configuración de Playwright Test
├── tsconfig.json       # Configuración de TypeScript
├── src/                # Código fuente de las pruebas
│   ├── pages/          # Clases Page Object Model (POM)
│   │   ├── BasePage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutCompletePage.ts
│   │   ├── CheckoutStepOnePage.ts
│   │   ├── CheckoutStepTwoPage.ts
│   │   ├── HomePage.ts
│   │   └── LoginPage.ts
│   └── tests/          # Archivos de prueba (specs)
│       ├── cart.spec.ts
│       ├── checkout.spec.ts
│       ├── login.spec.ts
│       └── menu.spec.ts
├── playwright-report/  # Reportes HTML generados después de la ejecución de pruebas (opcional, se genera)
└── test-results/       # Resultados de las pruebas (opcional, se genera)
```

**Descripción de Directorios y Archivos Clave:**

*   **`src/`**: Contiene todo el código fuente de las pruebas.
    *   **`pages/`**: Define las clases del Page Object Model (POM). Cada archivo `.ts` representa una página o un componente importante de la aplicación web, encapsulando sus elementos y las interacciones con ellos.
    *   **`tests/`**: Contiene los archivos de prueba (`*.spec.ts`). Cada archivo agrupa pruebas relacionadas con una funcionalidad o página específica.
*   **`.env` / `.env.example`**: Utilizados para gestionar variables de entorno como URLs base, credenciales de prueba, etc., separando la configuración sensible del código.
*   **`playwright.config.ts`**: Archivo central de configuración para Playwright Test, donde se definen navegadores, opciones de ejecución, reporteros, etc.
*   **`package.json`**: Define las dependencias del proyecto y los scripts NPM para tareas comunes (ejecutar pruebas, linting, etc.).
*   **`tsconfig.json`**: Especifica las opciones del compilador de TypeScript.
*   **`playwright-report/`**: Directorio donde se guardan los reportes HTML de Playwright después de ejecutar las pruebas.
*   **`test-results/`**: Contiene los resultados crudos de las ejecuciones de prueba, incluyendo trazas si están habilitadas.

Esta estructura ayuda a mantener el código organizado, facilitando la navegación, el mantenimiento y la escalabilidad del proyecto de automatización.

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
