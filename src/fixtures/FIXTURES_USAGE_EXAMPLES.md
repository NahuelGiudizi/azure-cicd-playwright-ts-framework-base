# Ejemplos de Uso de Fixtures en Playwright

## ¿Qué son los Fixtures?

Los fixtures en Playwright son una funcionalidad que permite:

1. **Inyectar dependencias** en tus pruebas de manera automática
2. **Compartir datos de prueba** entre múltiples tests
3. **Configurar el entorno** antes de ejecutar las pruebas
4. **Gestionar el ciclo de vida** de recursos (setup/teardown)
5. **Reutilizar código** común entre diferentes archivos de prueba

## Fixtures Implementados en este Proyecto

### 1. Fixture para Datos de API (`testWithAPIData`)

**Ubicación:** `src/fixtures/test-data-api-new.fixture.ts`

```typescript
export const testWithAPIData = base.extend({
  apiTestData: async ({}, use) => {
    const apiTestData = {
      productsData: {
        expectedProductCount: 34,
        sampleProductNames: ["Blue Top", "Men Tshirt", "Sleeveless Dress"],
        searchTerms: {
          valid: ["top", "tshirt", "dress", "jean"],
          invalid: ["nonexistent", "xyz123"],
          partial: ["blu", "men", "dres"],
        },
      },
      userData: {
        valid: {
          /* datos de usuario válido */
        },
        existing: {
          /* credenciales existentes */
        },
        invalid: {
          /* credenciales inválidas */
        },
      },
      endpoints: {
        /* endpoints de API */
      },
    };
    await use(apiTestData);
  },
});
```

### 2. Fixture para Datos de UI (`testWithUIData`)

**Ubicación:** `src/fixtures/test-data-ui-new.fixture.ts`

```typescript
export const testWithUIData = base.extend<{ uiTestData: UITestData }>({
  uiTestData: async ({}, use) => {
    await use(uiTestData);
  },
});
```

## Ejemplos de Uso Correcto

### ❌ Uso INCORRECTO (Lo que NO debes hacer)

```typescript
// ❌ Datos hardcodeados en las pruebas
import { test, expect } from "@playwright/test";

test("buscar productos", async () => {
  const searchTerm = "top"; // ❌ Dato hardcodeado
  const expectedCount = 34; // ❌ Valor hardcodeado

  // ... resto de la prueba
});
```

### ✅ Uso CORRECTO (Lo que SÍ debes hacer)

#### Para Pruebas de API:

```typescript
// ✅ Usando fixture de API
import {
  testWithAPIData,
  expect,
} from "../../fixtures/test-data-api-new.fixture";

testWithAPIData.describe("Products API Tests", () => {
  testWithAPIData.beforeEach(async ({ request }) => {
    // Setup del controlador
  });

  testWithAPIData("buscar productos", async ({ apiTestData }) => {
    // ✅ Usando datos del fixture
    const searchTerm = apiTestData.productsData.searchTerms.valid[0];
    const expectedCount = apiTestData.productsData.expectedProductCount;

    // ... resto de la prueba
  });
});
```

#### Para Pruebas de UI:

```typescript
// ✅ Usando fixture de UI
import {
  testWithUIData,
  expect,
} from "../../fixtures/test-data-ui-new.fixture";

testWithUIData.describe("Login Tests", () => {
  testWithUIData.beforeEach(async ({ page }) => {
    // Setup de páginas
  });

  testWithUIData("login con credenciales inválidas", async ({ uiTestData }) => {
    // ✅ Usando datos del fixture
    const invalidCredentials = uiTestData.invalidUser;

    await loginPage.loginWithValidation(
      invalidCredentials.email,
      invalidCredentials.password
    );

    // ... resto de la prueba
  });
});
```

## Beneficios de Usar Fixtures

### 1. **Centralización de Datos**

- Todos los datos de prueba están en un lugar
- Fácil mantenimiento y actualización
- Consistencia entre pruebas

### 2. **Reutilización**

- Los mismos datos se pueden usar en múltiples pruebas
- Evita duplicación de código
- Facilita la creación de nuevas pruebas

### 3. **Tipado Fuerte**

- TypeScript proporciona autocompletado
- Detección de errores en tiempo de compilación
- Mejor experiencia de desarrollo

### 4. **Configuración Automática**

- Setup y teardown automático
- Gestión del ciclo de vida de recursos
- Configuración consistente entre pruebas

## Estructura de Datos en los Fixtures

### Datos de API (`apiTestData`):

```typescript
{
  productsData: {
    expectedProductCount: number,
    sampleProductNames: string[],
    searchTerms: {
      valid: string[],
      invalid: string[],
      partial: string[]
    }
  },
  brandsData: {
    expectedBrandCount: number,
    sampleBrands: string[]
  },
  userData: {
    valid: UserData,
    existing: LoginCredentials,
    invalid: LoginCredentials
  },
  endpoints: {
    // URLs de endpoints
  }
}
```

### Datos de UI (`uiTestData`):

```typescript
{
  validUser: { name, email, password },
  testUser: { name, email, password },
  invalidUser: { email, password },
  newUser: { /* datos completos de usuario */ },
  contactForm: { name, email, subject, message },
  searchTerms: { validProduct, invalidProduct, categoryProduct },
  subscriptionEmail: string,
  productTestData: { expectedProductCount, sampleProductName, searchableProduct }
}
```

## Mejores Prácticas

1. **Usa siempre los fixtures** en lugar de datos hardcodeados
2. **Mantén los datos organizados** por categorías (products, users, etc.)
3. **Usa tipos TypeScript** para validación en tiempo de compilación
4. **Documenta los fixtures** para que otros desarrolladores los entiendan
5. **Actualiza los fixtures** cuando cambien los datos de prueba
6. **Separa fixtures por contexto** (API vs UI vs integración)

## Archivos Actualizados

Los siguientes archivos han sido actualizados para usar correctamente los fixtures:

### Pruebas de API:

- ✅ `src/tests/api/products.spec.ts` - Ahora usa `testWithAPIData`
- ✅ `src/tests/api/user-authentication.spec.ts` - Ahora usa `testWithAPIData`
- ✅ `src/tests/api/brands.spec.ts` - Ahora usa `testWithAPIData`

### Pruebas de UI:

- ✅ `src/tests/user-interface/e2e-login.spec.ts` - Ahora usa `testWithUIData`
- ✅ `src/tests/user-interface/e2e-products.spec.ts` - Ahora usa `testWithUIData`
- ✅ `src/tests/user-interface/e2e-cart.spec.ts` - Ahora usa `testWithUIData`

## Próximos Pasos

1. Actualizar el resto de archivos de prueba para usar los fixtures
2. Crear fixtures adicionales si es necesario (para integración, performance, etc.)
3. Documentar cualquier fixture personalizado que se cree
4. Revisar y actualizar los datos de prueba según sea necesario
