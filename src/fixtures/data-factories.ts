// src/fixtures/data-factories.ts
import { User, LoginCredentials } from '../models/user/user';
import { Product, CartItem } from '../models/product/product';
import { Order, OrderItem, ShippingAddress, PaymentMethod, OrderStatus } from '../models/order/order';

/**
 * Configuración base para factories
 */
interface FactoryConfig {
  seed?: number;
  locale?: string;
}

/**
 * Factory base con funcionalidades comunes
 */
abstract class BaseFactory<T> {
  protected config: FactoryConfig;
  protected sequence: number = 0;

  constructor(config: FactoryConfig = {}) {
    this.config = { locale: 'en-US', ...config };
  }

  /**
   * Genera un ID único basado en timestamp y secuencia
   */
  protected generateId(): number {
    return Date.now() + this.sequence++;
  }

  /**
   * Genera un email único para testing
   */
  protected generateEmail(prefix: string = 'test'): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}.user.${timestamp}.${random}@example.com`;
  }

  /**
   * Método abstracto para crear instancia
   */
  abstract create(overrides?: Partial<T>): T;

  /**
   * Crea múltiples instancias
   */
  createMany(count: number, overrides?: Partial<T>): T[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  /**
   * Construye objeto sin persistir (para validación)
   */
  build(overrides?: Partial<T>): T {
    return this.create(overrides);
  }
}

/**
 * Factory para crear usuarios de prueba
 */
export class UserFactory extends BaseFactory<User> {
  create(overrides: Partial<User> = {}): User {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);
    
    const defaultUser: User = {
      id: this.generateId(),
      name: `Test User ${randomSuffix}`,
      email: this.generateEmail('user'),
      password: 'testpassword123',
      title: 'Mr',
      birth_date: '15',
      birth_month: 'January',
      birth_year: '1990',
      firstname: 'Test',
      lastname: `User${randomSuffix}`,
      company: 'Test Company Inc.',
      address1: '123 Test Street',
      address2: 'Apt 4B',
      country: 'United States',
      zipcode: '12345',
      state: 'California',
      city: 'Test City',
      mobile_number: '+1234567890',
    };

    return { ...defaultUser, ...overrides };
  }

  /**
   * Crea credenciales de login
   */
  createLoginCredentials(overrides: Partial<LoginCredentials> = {}): LoginCredentials {
    const user = this.create();
    return {
      email: user.email,
      password: user.password,
      ...overrides,
    };
  }

  /**
   * Crea usuario con datos específicos para diferentes escenarios
   */
  createForScenario(scenario: 'valid' | 'invalid' | 'existing'): User {
    switch (scenario) {
      case 'valid':
        return this.create();
      case 'invalid':
        return this.create({
          email: 'invalid-email',
          password: '123', // Password muy corto
        });
      case 'existing':
        return this.create({
          email: 'existing.user@example.com',
        });
      default:
        return this.create();
    }
  }
}

/**
 * Factory para crear productos de prueba
 */
export class ProductFactory extends BaseFactory<Product> {
  private readonly sampleProducts = [
    'Blue Top',
    'Men Tshirt',
    'Sleeveless Dress',
    'Stylish Dress',
    'Summer White Top',
    'Winter Jacket',
    'Casual Jeans',
    'Formal Shirt',
  ];

  private readonly sampleBrands = [
    'Polo',
    'H&M',
    'Madame',
    'Mast & Harbour',
    'Babyhug',
    'Allen Solly Junior',
    'Kookie Kids',
    'Biba',
  ];

  private readonly sampleCategories = [
    'Tops',
    'Dress',
    'Jeans',
    'Jackets',
    'Shirts',
  ];

  create(overrides: Partial<Product> = {}): Product {
    const randomProduct = this.sampleProducts[Math.floor(Math.random() * this.sampleProducts.length)];
    const randomBrand = this.sampleBrands[Math.floor(Math.random() * this.sampleBrands.length)];
    const randomCategory = this.sampleCategories[Math.floor(Math.random() * this.sampleCategories.length)];
    const randomPrice = (Math.random() * 100 + 10).toFixed(2);

    const defaultProduct: Product = {
      id: this.generateId(),
      name: randomProduct,
      price: randomPrice,
      brand: randomBrand,
      category: {
        usertype: {
          usertype: 'Women',
        },
        category: randomCategory,
      },
    };

    return { ...defaultProduct, ...overrides };
  }

  /**
   * Crea producto con precio específico
   */
  createWithPrice(price: number): Product {
    return this.create({
      price: price.toFixed(2),
    });
  }

  /**
   * Crea producto de una marca específica
   */
  createWithBrand(brand: string): Product {
    return this.create({
      brand,
    });
  }

  /**
   * Crea múltiples productos de la misma categoría
   */
  createByCategory(category: string, count: number = 3): Product[] {
    return this.createMany(count, {
      category: {
        usertype: { usertype: 'Women' },
        category,
      },
    });
  }
}

/**
 * Factory para crear órdenes de prueba
 */
export class OrderFactory extends BaseFactory<Order> {
  private userFactory = new UserFactory();
  private productFactory = new ProductFactory();

  create(overrides: Partial<Order> = {}): Order {
    const userId = this.generateId();
    const products = this.productFactory.createMany(2);
    
    const orderItems: OrderItem[] = products.map(product => {
      const quantity = Math.floor(Math.random() * 3) + 1;
      const unitPrice = parseFloat(product.price);
      return {
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

    const defaultOrder: Order = {
      id: this.generateId(),
      userId,
      items: orderItems,
      shippingAddress: this.createShippingAddress(),
      paymentMethod: this.createPaymentMethod(),
      totalAmount,
      status: 'pending',
      createdAt: new Date(),
    };

    return { ...defaultOrder, ...overrides };
  }

  /**
   * Crea dirección de envío
   */
  private createShippingAddress(): ShippingAddress {
    return {
      fullName: 'Test User',
      address1: '123 Test Street',
      address2: 'Apt 4B',
      city: 'Test City',
      state: 'California',
      zipcode: '12345',
      country: 'United States',
      mobileNumber: '+1234567890',
    };
  }

  /**
   * Crea método de pago
   */
  private createPaymentMethod(): PaymentMethod {
    return {
      type: 'credit_card',
      cardNumber: '4111111111111111',
      expiryMonth: '12',
      expiryYear: '2025',
      cvv: '123',
      nameOnCard: 'Test User',
    };
  }

  /**
   * Crea orden con estado específico
   */
  createWithStatus(status: OrderStatus): Order {
    return this.create({ status });
  }

  /**
   * Crea orden con múltiples productos
   */
  createWithMultipleProducts(productCount: number): Order {
    const products = this.productFactory.createMany(productCount);
    const orderItems: OrderItem[] = products.map(product => {
      const quantity = 1;
      const unitPrice = parseFloat(product.price);
      return {
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

    return this.create({
      items: orderItems,
      totalAmount,
    });
  }
}

/**
 * Factory para crear items de carrito
 */
export class CartItemFactory extends BaseFactory<CartItem> {
  private productFactory = new ProductFactory();

  create(overrides: Partial<CartItem> = {}): CartItem {
    const product = this.productFactory.create();
    const quantity = Math.floor(Math.random() * 5) + 1;
    const unitPrice = parseFloat(product.price);

    const defaultCartItem: CartItem = {
      product,
      quantity,
      totalPrice: unitPrice * quantity,
    };

    return { ...defaultCartItem, ...overrides };
  }

  /**
   * Crea item de carrito con cantidad específica
   */
  createWithQuantity(quantity: number): CartItem {
    return this.create({ quantity });
  }

  /**
   * Crea item de carrito con producto específico
   */
  createWithProduct(product: Product): CartItem {
    return this.create({ product });
  }
}

/**
 * Instancias singleton de factories para uso global
 */
export const userFactory = new UserFactory();
export const productFactory = new ProductFactory();
export const orderFactory = new OrderFactory();
export const cartItemFactory = new CartItemFactory();

/**
 * Helper para crear datos de prueba completos
 */
export const testDataBuilder = {
  /**
   * Crea un escenario completo de usuario con orden
   */
  createUserWithOrder: (userOverrides?: Partial<User>, orderOverrides?: Partial<Order>) => {
    const user = userFactory.create(userOverrides);
    const order = orderFactory.create({
      userId: user.id!,
      ...orderOverrides,
    });
    return { user, order };
  },

  /**
   * Crea un carrito completo con múltiples items
   */
  createCartWithItems: (itemCount: number = 3) => {
    const items = cartItemFactory.createMany(itemCount);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    
    return {
      items,
      totalItems,
      totalAmount,
    };
  },

  /**
   * Crea datos para test de checkout completo
   */
  createCheckoutData: () => {
    const user = userFactory.create();
    const cartItems = cartItemFactory.createMany(2);
    const order = orderFactory.create({
      userId: user.id!,
      items: cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: parseFloat(item.product.price),
        totalPrice: item.totalPrice,
      })),
    });

    return { user, cartItems, order };
  },
};
