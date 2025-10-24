# Contributing to AutomationExercise Testing Framework

Thank you for your interest in contributing to this testing framework! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- NPM or Yarn
- Git
- Basic knowledge of Playwright and TypeScript

### Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Install Playwright browsers: `npx playwright install`
4. Copy environment file: `cp env.example .env`
5. Run tests to verify setup: `npm run tests:api && npm run tests:e2e`

## 📝 Code Style Guidelines

### TypeScript Standards

- Use TypeScript for all new code
- Avoid `any` types - use proper type definitions
- Add JSDoc comments for public methods
- Follow existing naming conventions

### Test Structure

- Use descriptive test names that explain the scenario
- Follow the Arrange-Act-Assert pattern
- Keep tests independent and isolated
- Use Page Object Model for UI tests

### File Organization

```
src/
├── api-client/          # API client and controllers
├── configs/            # Playwright configurations
├── constants/          # Named constants (timeouts, etc.)
├── helpers/            # Reusable helper functions
├── models/             # Page Objects and data models
└── tests/              # Test suites
```

## 🧪 Adding New Tests

### API Tests

1. Create new test file in `src/tests/api/`
2. Use existing API controllers or create new ones
3. Follow the test pattern:

```typescript
testWithAPIData("Should test API endpoint", async ({ apiTestData }) => {
  // Arrange
  const controller = new SomeController(request);

  // Act
  const { status, data } = await controller.someMethod();

  // Assert
  expect(status).toBe(200);
  expect(data).toHaveProperty("expectedField");
});
```

### UI Tests

1. Create new test file in `src/tests/user-interface/`
2. Use Page Object Model
3. Follow the test pattern:

```typescript
testWithUIData("Should test UI functionality", async ({ uiTestData }) => {
  // Arrange
  const page = new SomePage(page);

  // Act
  await page.performAction();

  // Assert
  await expect(page.someElement).toBeVisible();
});
```

## 🔧 Adding New Page Objects

1. Create new file in `src/models/pages/`
2. Follow the existing pattern:

```typescript
export class NewPage {
  readonly page: Page;
  readonly someElement: Locator;

  constructor(page: Page) {
    this.page = page;
    this.someElement = page.locator("#some-id");
  }

  /**
   * Performs some action on the page
   * @throws Error if action fails
   */
  async performAction(): Promise<void> {
    await this.someElement.click();
  }
}
```

## 🏗️ Adding New API Controllers

1. Create new file in `src/api-client/controllers/`
2. Extend the base ApiClient
3. Define proper response types in `src/api-client/types/`

```typescript
export class NewController extends ApiClient {
  async getSomeData(): Promise<{ status: number; data: SomeResponse }> {
    return await this.get<SomeResponse>("/some-endpoint");
  }
}
```

## 📊 Adding Helper Functions

1. Create helper files in `src/helpers/`
2. Add unit tests in `src/helpers/__tests__/`
3. Export reusable functions

```typescript
export class TestHelper {
  constructor(private page: Page) {}

  async performCommonAction(): Promise<void> {
    // Implementation
  }
}
```

## 🧪 Testing Your Changes

### Run Tests

```bash
# Unit tests
npm run test:unit

# API tests
npm run tests:api

# UI tests
npm run tests:e2e

# All tests
npm run flow-tests
```

### Code Quality Checks

- Ensure no linting errors: Check IDE or run `npx tsc --noEmit`
- Verify all tests pass
- Check that new code follows existing patterns

## 📋 Pull Request Process

### Before Submitting

1. Ensure all tests pass
2. Add tests for new functionality
3. Update documentation if needed
4. Follow the commit message format: `type: description`

### Commit Message Format

```
type: brief description

Detailed description of changes (optional)

Closes #issue-number (if applicable)
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

### Pull Request Template

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Follows code style guidelines
- [ ] All tests pass

## 🐛 Reporting Issues

When reporting issues, please include:

1. **Environment**: OS, Node.js version, browser versions
2. **Steps to reproduce**: Clear, numbered steps
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Screenshots/logs**: If applicable

## 💡 Feature Requests

For feature requests, please:

1. Check existing issues first
2. Provide clear description of the feature
3. Explain the use case and benefits
4. Consider implementation complexity

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [AutomationExercise.com](https://automationexercise.com)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow the golden rule

Thank you for contributing! 🎉
