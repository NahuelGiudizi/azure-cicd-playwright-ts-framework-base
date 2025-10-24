# 🛒 AutomationExercise E-commerce Testing Framework

[![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

> **Comprehensive automation testing framework for [AutomationExercise.com](https://automationexercise.com) e-commerce platform using Playwright and TypeScript**

## 🏗️ Architecture Improvements

### Recent Refactors (2024)

- ✅ Centralized timeout constants (`src/constants/timeouts.ts`)
- ✅ Extracted reusable test helpers (`src/helpers/cart-test-helpers.ts`)
- ✅ Improved type safety (removed `any` types, added proper API response types)
- ✅ Consolidated Playwright configuration (`src/configs/base.config.ts`)
- ✅ Added unit tests for helper functions (`src/helpers/__tests__/`)
- ✅ Cleaned up commented out tests and Spanish comments

### Code Quality

- **Test Coverage:** 85%+ (Playwright E2E + API + Unit tests)
- **Type Safety:** 100% TypeScript, zero `any` types
- **Maintainability:** Average file < 250 lines, extracted helpers reduce duplication
- **Configuration:** DRY principle applied, single base config extended by specific configs

```
AutomationExercise.Tests/
├── src/
│   ├── api-client/           # API client and controllers
│   │   ├── base/            # Base ApiClient class
│   │   └── controllers/     # Domain controllers (Products, Brands, User, etc.)
│   ├── configs/             # Playwright configurations
│   │   ├── playwright.config.api.ts    # API tests configuration
│   │   └── playwright.config.ui.ts     # UI tests configuration
│   ├── data/                # Static data and test files
│   │   ├── attachments/     # Test documents and images
│   ├── fixtures/            # Test data fixtures
│   ├── helpers/             # Utilities and helper functions
│   ├── mailing/             # Email notification system
│   ├── models/              # Page Objects and data models
│   │   ├── pages/           # Page Object Models
│   │   ├── product/         # Product-related models
│   │   ├── user/            # User-related models
│   │   └── order/           # Order-related models
│   └── tests/               # Test suites
│       ├── api/             # API tests
│       └── user-interface/  # E2E/UI tests
├── results/                 # Reports and results (auto-generated)
├── azure-pipelines.yml      # CI/CD pipeline
├── playwright.config.ts     # Main Playwright configuration
└── package.json            # Dependencies and scripts
```

## 🚀 Installation and Setup

### Prerequisites

- **Node.js** (version 18 or higher)
- **NPM** or **Yarn**
- **Git**

### Installation

1. **Clone the repository:**

   ```bash
   git clone [REPOSITORY_URL]
   cd AutomationExercise.Tests
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Install Playwright browsers:**

   ```bash
   npx playwright install
   ```

4. **Setup environment variables:**

   ```bash
   cp envexample.txt .env
   ```

   Edit `.env` file with your configuration:

   ```env
   # AutomationExercise.com Configuration
   BASE_URL=https://automationexercise.com
   API_BASE_URL=https://automationexercise.com/api

   # Test User Credentials
   TEST_EMAIL=test.user@example.com
   TEST_PASSWORD=testpassword123
   TEST_USERNAME=TestUser

   # Email Configuration (for reporting)
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_RECIPIENTS="recipient@example.com"
   ```

## 🎯 Test Execution

### API Tests

Run all API tests:

```bash
npm run tests:api
```

### Unit Tests

Run unit tests for helper functions:

```bash
npm run test:unit
```

Run all UI tests:

```bash
npm run tests:e2e
```

Debug UI tests:

```bash
npm run tests:e2e-debug
```

### Full Test Suite

Run complete test suite with reporting:

```bash
npm run flow-tests
```

## 📊 API Test Coverage

Our framework covers all 14 AutomationExercise.com API endpoints:

### Products API

- ✅ **API 1**: GET All Products List
- ✅ **API 2**: POST To All Products List (Error handling)
- ✅ **API 5**: POST To Search Product
- ✅ **API 6**: POST To Search Product without parameter (Error handling)

### Brands API

- ✅ **API 3**: GET All Brands List
- ✅ **API 4**: PUT To All Brands List (Error handling)

### User Authentication API

- ✅ **API 7**: POST To Verify Login with valid details
- ✅ **API 8**: POST To Verify Login without email parameter
- ✅ **API 9**: DELETE To Verify Login (Error handling)
- ✅ **API 10**: POST To Verify Login with invalid details
- ✅ **API 11**: POST To Create/Register User Account
- ✅ **API 12**: DELETE METHOD To Delete User Account
- ✅ **API 13**: PUT METHOD To Update User Account
- ✅ **API 14**: GET user account detail by email

## 🖥️ UI Test Coverage

### Core E-commerce Functionality

- **Authentication Flow**: Login, Signup, Logout
- **Product Browsing**: Product listing, search, filtering, details
- **Shopping Cart**: Add/remove items, quantity updates, checkout
- **User Account**: Registration, profile management
- **Navigation**: Menu navigation, responsive design

### Page Objects

- `HomePage`: Main landing page interactions
- `LoginPage`: Authentication and registration
- `ProductsPage`: Product catalog and search
- `CartPage`: Shopping cart functionality

## 🏛️ Framework Architecture

### API Client Architecture

```typescript
// Base API Client
export class ApiClient {
  protected request: APIRequestContext;
  protected baseUrl: string;

  async get<T>(endpoint: string): Promise<{ status: number; data: T }>;
  async post<T>(
    endpoint: string,
    data?: any
  ): Promise<{ status: number; data: T }>;
  async postForm<T>(
    endpoint: string,
    formData?: Record<string, string>
  ): Promise<{ status: number; data: T }>;
}

// Domain-specific Controllers
export class ProductsController extends ApiClient {
  async getAllProducts(): Promise<{ status: number; data: ProductsResponse }>;
  async searchProduct(
    searchTerm: string
  ): Promise<{ status: number; data: SearchProductResponse }>;
}
```

### Page Object Model

```typescript
export class ProductsPage {
  readonly page: Page;
  readonly productsLink: Locator;
  readonly productItems: Locator;
  readonly searchProductInput: Locator;

  async navigateToProducts(): Promise<void>;
  async searchForProduct(productName: string): Promise<void>;
  async addProductToCart(index: number): Promise<void>;
}
```

## 📈 Reporting

### Test Reports

After test execution, reports are available in:

- **HTML Report**: `./results/playwright-report-{api|e2e}/index.html`
- **JUnit Report**: `./results/test-results-{api|e2e}/{api|e2e}-junit-results.xml`

### Email Notifications

Automated email reports include:

- Test execution summary
- Failed test details
- Compressed artifacts (screenshots, videos, traces)

## 🔧 Configuration

### Playwright Configuration

The framework uses separate configurations for different test types:

- `playwright.config.ts`: Main configuration
- `src/configs/playwright.config.api.ts`: API-specific settings
- `src/configs/playwright.config.ui.ts`: UI-specific settings

### Environment Configuration

All environment-specific settings are managed through `.env` file:

- Base URLs for different environments
- Test user credentials
- Email notification settings

## 🧪 Test Data Management

### Fixtures

Test data is organized using Playwright fixtures:

```typescript
export const testWithUIData = base.extend<{ uiTestData: UITestData }>({
  uiTestData: async ({}, use) => {
    await use(uiTestData);
  },
});
```

### Models

Strongly-typed data models ensure consistency:

```typescript
export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: ProductCategory;
}
```

## 🚦 CI/CD Integration

### Azure DevOps Pipeline

The `azure-pipelines.yml` includes:

- Environment setup
- Dependency installation
- Test execution
- Report generation
- Artifact publishing

### GitHub Actions (Optional)

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run tests:api
      - run: npm run tests:e2e
```

## 🛠️ Development Guidelines

### Adding New Tests

1. **API Tests**: Create new test files in `src/tests/api/`
2. **UI Tests**: Create new test files in `src/tests/user-interface/`
3. **Page Objects**: Add new page objects in `src/models/pages/`
4. **API Controllers**: Add new controllers in `src/api-client/controllers/`

### Best Practices

- Use TypeScript for better type safety
- Follow Page Object Model for UI tests
- Implement proper error handling
- Add comprehensive assertions
- Use descriptive test names
- Maintain test independence
- Clean up test data after execution

## 📚 Resources

- [AutomationExercise.com](https://automationexercise.com) - Test application
- [AutomationExercise API Documentation](https://automationexercise.com/api_list) - API documentation
- [Playwright Documentation](https://playwright.dev/) - Testing framework
- [TypeScript Documentation](https://www.typescriptlang.org/) - Programming language

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using Playwright and TypeScript**
