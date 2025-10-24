// src/models/pages/README.md

# Estructura de Páginas

Esta carpeta contiene todas las páginas del framework de testing, organizadas por funcionalidad específica.

## Estructura Actual

```
pages/
├── cart/                          # Página del carrito de compras
│   ├── CartPage.ts               # Página principal del carrito
│   └── components/               # Componentes específicos del carrito
│       ├── CartTableComponent.ts
│       ├── CheckoutModalComponent.ts
│       ├── HeaderComponent.ts
│       ├── SubscriptionComponent.ts
│       └── index.ts
├── HomePage.ts                   # Página de inicio
├── LoginPage.ts                  # Página de login
├── ProductsPage.ts               # Página de productos
└── index.ts                      # Exportaciones centralizadas
```

## Patrón de Organización

Cada página compleja debe seguir este patrón:

```
pages/
├── [page-name]/
│   ├── [PageName]Page.ts         # Página principal
│   └── components/               # Componentes específicos de la página
│       ├── [ComponentName]Component.ts
│       └── index.ts
```

## Beneficios de esta Estructura

1. **Cohesión**: Los componentes están agrupados con la página que los usa
2. **Escalabilidad**: Fácil agregar nuevas páginas sin afectar las existentes
3. **Mantenibilidad**: Cambios en una página no afectan otras páginas
4. **Claridad**: La estructura refleja la organización lógica del código
5. **Reutilización**: Los componentes pueden ser reutilizados dentro de su contexto

## Ejemplo de Uso

```typescript
// Importar la página completa
import { CartPage } from "./pages/cart/CartPage";

// Importar componentes específicos
import { CartTableComponent } from "./pages/cart/components";

// Usar en tests
const cartPage = new CartPage(page);
await cartPage.navigateToCart();
```

## Próximos Pasos

Para otras páginas complejas como `ProductsPage` o `LoginPage`, seguir el mismo patrón:

```
pages/
├── products/
│   ├── ProductsPage.ts
│   └── components/
│       ├── ProductGridComponent.ts
│       ├── FilterComponent.ts
│       └── PaginationComponent.ts
├── login/
│   ├── LoginPage.ts
│   └── components/
│       ├── LoginFormComponent.ts
│       └── SocialLoginComponent.ts
```

