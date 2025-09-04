// src/tests/api/brands.spec.ts
import { testWithAPIData, expect } from '../../fixtures/test-data-api-new.fixture';
import { BrandsController, BrandsResponse } from '../../api-client/controllers/BrandsController';

testWithAPIData.describe('Brands API Tests', () => {
  let brandsController: BrandsController;

  testWithAPIData.beforeEach(async ({ request }) => {
    brandsController = new BrandsController(request);
    await brandsController.init();
  });

  testWithAPIData(
    'API 3: GET All Brands List - Should return 200 with brands data',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that the GET All Brands endpoint returns 200 status with proper brands data structure and content.",
        },
      ],
    },
    async ({ apiTestData }) => {
    // Act
    const { status, data } = await brandsController.getAllBrands();

    // Assert
    expect(status).toBe(200);
    expect(data).toHaveProperty('responseCode', 200);
    expect(data).toHaveProperty('brands');
    expect(Array.isArray(data.brands)).toBe(true);
    expect(data.brands.length).toBeGreaterThan(0);
    
    // Use fixture data for validation
    expect(data.brands.length).toBeGreaterThanOrEqual(apiTestData.brandsData.expectedBrandCount);

    // Validate brand structure
    const firstBrand = data.brands[0];
    expect(firstBrand).toHaveProperty('id');
    expect(firstBrand).toHaveProperty('brand');
    expect(typeof firstBrand.id).toBe('number');
    expect(typeof firstBrand.brand).toBe('string');


  });

  testWithAPIData(
    'API 4: PUT To All Brands List - Should return 405 Method Not Allowed',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that the PUT method on the brands endpoint returns 405 Method Not Allowed error.",
        },
      ],
    },
    async ({ apiTestData }) => {
    // Act
    const { status, data } = await brandsController.putToBrandsList();

    // Assert
    expect(status).toBe(200);
    expect(data).toHaveProperty('responseCode', 405);
    expect(data).toHaveProperty('message', 'This request method is not supported.');

  });

  testWithAPIData(
    'Verify expected brands are present',
    {
      annotation: [
        {
          type: "API Test",
          description: "Verifies that all expected brand names are present in the brands list response.",
        },
      ],
    },
    async ({ apiTestData }) => {
    // Arrange
    const expectedBrands = apiTestData.brandsData.sampleBrands;

    // Act
    const { status, data } = await brandsController.getAllBrands();

    // Assert
 
    expect(status).toBe(200);
    
    const brandNames = data.brands.map(brand => brand.brand);
    
    expectedBrands.forEach(expectedBrand => {
      const brandExists = brandNames.some(name => name.includes(expectedBrand));
      expect(brandExists, `Brand "${expectedBrand}" should be present in the list`).toBe(true);
    });

  });

  testWithAPIData(
    'Verify brand IDs are unique and sequential',
    {
      annotation: [
        {
          type: "API Test",
          description: "Validates that all brand IDs are unique, positive integers and properly formatted.",
        },
      ],
    },
    async ({ apiTestData }) => {
    // Act
    const { status, data } = await brandsController.getAllBrands();

    // Assert
    expect(status).toBe(200);
    
    const brandIds = data.brands.map(brand => brand.id);
    const uniqueIds = [...new Set(brandIds)];
    
    // Check all IDs are unique
    expect(uniqueIds.length).toBe(brandIds.length);
    
    // Check IDs are positive numbers
    brandIds.forEach(id => {
      expect(id).toBeGreaterThan(0);
      expect(Number.isInteger(id)).toBe(true);
    });

  });

  testWithAPIData(
    'Verify brand names are not empty',
    {
      annotation: [
        {
          type: "API Test",
          description: "Ensures that all brand names in the response are not empty or contain only whitespace.",
        },
      ],
    },
    async ({ apiTestData }) => {
    // Act
    const { status, data } = await brandsController.getAllBrands();

    // Assert
    expect(status).toBe(200);
    
    data.brands.forEach((brand, index) => {
      expect(brand.brand, `Brand ${index + 1} name should not be empty`).toBeTruthy();
      expect(brand.brand.trim().length, `Brand ${index + 1} name should not be just whitespace`).toBeGreaterThan(0);
    });

  });

  testWithAPIData(
    'API Performance - Brands endpoint response time',
    {
      annotation: [
        {
          type: "Performance Test",
          description: "Validates that the brands endpoint responds within acceptable time limits (under 5 seconds).",
        },
      ],
    },
    async ({ apiTestData }) => {
    const startTime = Date.now();
    
    const { status } = await brandsController.getAllBrands();
    
    const responseTime = Date.now() - startTime;
    
    expect(status).toBe(200);
    expect(responseTime).toBeLessThan(5000); // 5 seconds
    
  });

  testWithAPIData(
    'Compare brand count consistency across multiple requests',
    {
      annotation: [
        {
          type: "API Test",
          description: "Verifies data consistency by ensuring multiple concurrent requests return the same number of brands.",
        },
      ],
    },
    async ({ apiTestData }) => {
    // Make multiple requests to ensure consistency
    const requests: Promise<{ status: number; data: BrandsResponse }>[] = [];
    for (let i = 0; i < 3; i++) {
      requests.push(brandsController.getAllBrands());
    }

    const responses = await Promise.all(requests);
    
    // All responses should be successful
    responses.forEach((response, index) => {
      expect(response.status, `Request ${index + 1} should be successful`).toBe(200);
    });

    // All responses should have the same number of brands
    const brandCounts = responses.map(response => response.data.brands.length);
    const firstCount = brandCounts[0];
    
    brandCounts.forEach((count, index) => {
      expect(count, `Request ${index + 1} should return same brand count as first request`).toBe(firstCount);
    });

  });
});
