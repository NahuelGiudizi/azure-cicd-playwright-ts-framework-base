// src/tests/unit/helpers/data-factories.test.ts
import { describe, it, expect } from 'vitest';
import { 
  UserFactory, 
  ProductFactory, 
  OrderFactory, 
  CartItemFactory,
  userFactory,
  productFactory,
  orderFactory,
  cartItemFactory,
  testDataBuilder
} from '../../../fixtures/data-factories';
import { User } from '../../../models/user/user';
import { Product } from '../../../models/product/product';
import { Order } from '../../../models/order/order';
import { CartItem } from '../../../models/product/product';

describe('Data Factories', () => {
  describe('UserFactory', () => {
    const factory = new UserFactory();

    it('should create a valid user', () => {
      const user = factory.create();
      
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.name).toBeDefined();
      expect(user.email).toMatch(/^user\.user\.\d+\.\d+@example\.com$/);
      expect(user.password).toBe('testpassword123');
      expect(user.title).toBe('Mr');
      expect(user.firstname).toBe('Test');
      expect(user.lastname).toMatch(/^User\d+$/);
      expect(user.country).toBe('United States');
      expect(user.mobile_number).toBe('+1234567890');
    });

    it('should create user with overrides', () => {
      const overrides = {
        name: 'Custom User',
        email: 'custom@test.com',
        title: 'Mrs' as const,
      };
      
      const user = factory.create(overrides);
      
      expect(user.name).toBe('Custom User');
      expect(user.email).toBe('custom@test.com');
      expect(user.title).toBe('Mrs');
    });

    it('should create multiple users', () => {
      const users = factory.createMany(3);
      
      expect(users).toHaveLength(3);
      expect(users[0].email).not.toBe(users[1].email);
      expect(users[1].email).not.toBe(users[2].email);
    });

    it('should create login credentials', () => {
      const credentials = factory.createLoginCredentials();
      
      expect(credentials.email).toMatch(/@example\.com$/);
      expect(credentials.password).toBe('testpassword123');
    });

    it('should create user for specific scenarios', () => {
      const validUser = factory.createForScenario('valid');
      const invalidUser = factory.createForScenario('invalid');
      const existingUser = factory.createForScenario('existing');
      
      expect(validUser.email).toMatch(/@example\.com$/);
      expect(invalidUser.email).toBe('invalid-email');
      expect(invalidUser.password).toBe('123');
      expect(existingUser.email).toBe('existing.user@example.com');
    });
  });

  describe('ProductFactory', () => {
    const factory = new ProductFactory();

    it('should create a valid product', () => {
      const product = factory.create();
      
      expect(product).toBeDefined();
      expect(product.id).toBeDefined();
      expect(product.name).toBeDefined();
      expect(product.price).toBeDefined();
      expect(product.brand).toBeDefined();
      expect(product.category).toBeDefined();
      expect(product.category.usertype.usertype).toBe('Women');
      expect(product.category.category).toBeDefined();
    });

    it('should create product with specific price', () => {
      const product = factory.createWithPrice(99.99);
      
      expect(product.price).toBe('99.99');
    });

    it('should create product with specific brand', () => {
      const product = factory.createWithBrand('Nike');
      
      expect(product.brand).toBe('Nike');
    });

    it('should create products by category', () => {
      const products = factory.createByCategory('Tops', 2);
      
      expect(products).toHaveLength(2);
      expect(products[0].category.category).toBe('Tops');
      expect(products[1].category.category).toBe('Tops');
    });
  });

  describe('OrderFactory', () => {
    const factory = new OrderFactory();

    it('should create a valid order', () => {
      const order = factory.create();
      
      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.userId).toBeDefined();
      expect(order.items).toBeDefined();
      expect(order.items.length).toBeGreaterThan(0);
      expect(order.shippingAddress).toBeDefined();
      expect(order.paymentMethod).toBeDefined();
      expect(order.totalAmount).toBeGreaterThan(0);
      expect(order.status).toBe('pending');
      expect(order.createdAt).toBeInstanceOf(Date);
    });

    it('should create order with specific status', () => {
      const order = factory.createWithStatus('confirmed');
      
      expect(order.status).toBe('confirmed');
    });

    it('should create order with multiple products', () => {
      const order = factory.createWithMultipleProducts(5);
      
      expect(order.items).toHaveLength(5);
      expect(order.totalAmount).toBeGreaterThan(0);
    });

    it('should have valid order items', () => {
      const order = factory.create();
      
      order.items.forEach(item => {
        expect(item.productId).toBeDefined();
        expect(item.productName).toBeDefined();
        expect(item.quantity).toBeGreaterThan(0);
        expect(item.unitPrice).toBeGreaterThan(0);
        expect(item.totalPrice).toBeGreaterThan(0);
        expect(item.totalPrice).toBe(item.unitPrice * item.quantity);
      });
    });
  });

  describe('CartItemFactory', () => {
    const factory = new CartItemFactory();

    it('should create a valid cart item', () => {
      const cartItem = factory.create();
      
      expect(cartItem).toBeDefined();
      expect(cartItem.product).toBeDefined();
      expect(cartItem.quantity).toBeGreaterThan(0);
      expect(cartItem.totalPrice).toBeGreaterThan(0);
      expect(cartItem.totalPrice).toBe(
        parseFloat(cartItem.product.price) * cartItem.quantity
      );
    });

    it('should create cart item with specific quantity', () => {
      const cartItem = factory.createWithQuantity(5);
      
      expect(cartItem.quantity).toBe(5);
    });

    it('should create cart item with specific product', () => {
      const product = productFactory.create();
      const cartItem = factory.createWithProduct(product);
      
      expect(cartItem.product).toBe(product);
    });
  });

  describe('Singleton Factories', () => {
    it('should provide singleton instances', () => {
      expect(userFactory).toBeInstanceOf(UserFactory);
      expect(productFactory).toBeInstanceOf(ProductFactory);
      expect(orderFactory).toBeInstanceOf(OrderFactory);
      expect(cartItemFactory).toBeInstanceOf(CartItemFactory);
    });

    it('should create data using singleton factories', () => {
      const user = userFactory.create();
      const product = productFactory.create();
      const order = orderFactory.create();
      const cartItem = cartItemFactory.create();
      
      expect(user).toBeDefined();
      expect(product).toBeDefined();
      expect(order).toBeDefined();
      expect(cartItem).toBeDefined();
    });
  });

  describe('testDataBuilder', () => {
    it('should create user with order', () => {
      const { user, order } = testDataBuilder.createUserWithOrder();
      
      expect(user).toBeDefined();
      expect(order).toBeDefined();
      expect(order.userId).toBe(user.id);
    });

    it('should create cart with items', () => {
      const cart = testDataBuilder.createCartWithItems(3);
      
      expect(cart.items).toHaveLength(3);
      expect(cart.totalItems).toBeGreaterThan(0);
      expect(cart.totalAmount).toBeGreaterThan(0);
    });

    it('should create checkout data', () => {
      const { user, cartItems, order } = testDataBuilder.createCheckoutData();
      
      expect(user).toBeDefined();
      expect(cartItems).toBeDefined();
      expect(cartItems.length).toBeGreaterThan(0);
      expect(order).toBeDefined();
      expect(order.userId).toBe(user.id);
    });

    it('should allow overrides in createUserWithOrder', () => {
      const userOverrides = { name: 'Custom User' };
      const orderOverrides = { status: 'confirmed' as const };
      
      const { user, order } = testDataBuilder.createUserWithOrder(userOverrides, orderOverrides);
      
      expect(user.name).toBe('Custom User');
      expect(order.status).toBe('confirmed');
    });
  });

  describe('Factory Integration', () => {
    it('should create consistent data across factories', () => {
      const user = userFactory.create();
      const order = orderFactory.create({ userId: user.id });
      const cartItem = cartItemFactory.create();
      
      expect(order.userId).toBe(user.id);
      expect(cartItem.product).toBeDefined();
      expect(cartItem.totalPrice).toBe(
        parseFloat(cartItem.product.price) * cartItem.quantity
      );
    });
  });
});

