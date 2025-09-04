// src/tests/api/products.spec.ts
import { testWithAPIData, expect } from '../../fixtures/test-data-api-new.fixture';
import { ProductsController, ProductsResponse } from '../../api-client/controllers/ProductsController';

testWithAPIData.describe('Products API Tests', () => {
  let productsController: ProductsController;

  testWithAPIData.beforeEach(async ({ request }) => {
    productsController = new ProductsController(request);
    await productsController.init();
  });

  testWithAPIData(
    'API 1: GET All Products List - Should return 200 with products data',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that the GET All Products endpoint returns 200 status with proper products data structure.",
        },
      ],
    },
    async ({ apiTestData }) => {
    // Act
    const { status, data } = await productsController.getAllProducts();

    // Assert
    expect(status).toBe(200);
    expect(data).toHaveProperty('responseCode', 200);
    expect(data).toHaveProperty('products');
    expect(Array.isArray(data.products)).toBe(true);
    expect(data.products.length).toBeGreaterThan(0);
    
    // Use fixture data for validation
    expect(data.products.length).toBeGreaterThanOrEqual(apiTestData.productsData.expectedProductCount);

    // Validate product structure
    const firstProduct = data.products[0];
    expect(firstProduct).toHaveProperty('id');
    expect(firstProduct).toHaveProperty('name');
    expect(firstProduct).toHaveProperty('price');
    expect(firstProduct).toHaveProperty('brand');
    expect(firstProduct).toHaveProperty('category');
    expect(firstProduct.category).toHaveProperty('usertype');
    expect(firstProduct.category).toHaveProperty('category');

  });

  testWithAPIData(
    'API 2: POST To All Products List - Should return 405 Method Not Allowed',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that the POST method on products list endpoint returns 405 Method Not Allowed error.",
        },
      ],
    },
    async ({ apiTestData }) => {
    // Act
    const { status, data } = await productsController.postToProductsList();

    // Assert
    expect(status).toBe(200);
    expect(data).toHaveProperty('responseCode', 405);
    expect(data).toHaveProperty('message', 'This request method is not supported.');

 
  });

  testWithAPIData(
    'API 5: POST To Search Product - Should return 200 with filtered products',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that the search product endpoint returns filtered products based on search term.",
        },
      ],
    },
    async ({ apiTestData }) => {
    // Arrange
    const searchTerm = apiTestData.productsData.searchTerms.valid[0];

    // Act
    const { status, data } = await productsController.searchProduct(searchTerm);

    // Assert
    expect(status).toBe(200);
    expect(data).toHaveProperty('responseCode', 200);
    expect(data).toHaveProperty('products');
    expect(Array.isArray(data.products)).toBe(true);

    // Verify search results contain the search term
    if (data.products.length > 0) {
      const searchResults = data.products.some(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      expect(searchResults).toBe(true);
    }


  });

  testWithAPIData(
    'API 6: POST To Search Product without parameter - Should return 400 Bad Request',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that searching without required parameter returns 400 Bad Request error.",
        },
      ],
    },
    async ({ apiTestData }) => {
    // Act
    const { status, data } = await productsController.searchProductWithoutParameter();

    // Assert
    expect(status).toBe(200);
    expect(data).toHaveProperty('responseCode', 400);
    expect(data).toHaveProperty('message', 'Bad request, search_product parameter is missing in POST request.');


  });

  testWithAPIData(
    'Search for different product categories',
    {
      annotation: [
        {
          type: "API Test",
          description: "Tests product search functionality across multiple product categories (dress, tshirt, jean).",
        },
      ],
    },
    async ({ apiTestData }) => {
    const searchTerms = apiTestData.productsData.searchTerms.valid;

    for (const term of searchTerms) {
      const { status, data } = await productsController.searchProduct(term);
      
      expect(status).toBe(200);
      expect(data).toHaveProperty('products');
      

    }
  });

  testWithAPIData(
    'Verify product data integrity',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that all products have required fields and proper data structure integrity.",
        },
      ],
    },
    async ({ apiTestData }) => {
    // Get all products
    const { status, data } = await productsController.getAllProducts();
    
    expect(status).toBe(200);
    expect(data.products.length).toBeGreaterThan(0);

    // Check each product has required fields
    data.products.forEach((product, index) => {
      expect(product.id, `Product ${index} should have id`).toBeDefined();
      expect(product.name, `Product ${index} should have name`).toBeTruthy();
      expect(product.price, `Product ${index} should have price`).toBeTruthy();
      expect(product.brand, `Product ${index} should have brand`).toBeTruthy();
      expect(product.category, `Product ${index} should have category`).toBeDefined();
    });

    
  });

  testWithAPIData(
    'API Performance - Response time should be under 5 seconds',
    {
      annotation: [
        {
          type: "Performance Test",
          description: "Validates that the products endpoint responds within acceptable time limits (under 5 seconds).",
        },
      ],
    },
    async ({ apiTestData }) => {
    const startTime = Date.now();
    
    const { status } = await productsController.getAllProducts();
    
    const responseTime = Date.now() - startTime;
    
    expect(status).toBe(200);
    expect(responseTime).toBeLessThan(5000); // 5 seconds
    
   
  });
});
