// src/tests/unit/helpers/test-session.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { 
  TestSessionManager, 
  testSession, 
  sessionHelpers, 
  sessionCleanup 
} from '../../../helpers/test-session';
import { User } from '../../../models/user/user';
import { LoginCredentials } from '../../../models/user/user';

describe('Test Session Manager', () => {
  let sessionManager: TestSessionManager;

  beforeEach(() => {
    sessionManager = new TestSessionManager();
    vi.clearAllMocks();
  });

  afterEach(() => {
    sessionManager.clearSession();
  });

  describe('Singleton Pattern', () => {
    it('should return same instance', () => {
      const instance1 = TestSessionManager.getInstance();
      const instance2 = TestSessionManager.getInstance();
      
      expect(instance1).toBe(instance2);
    });

    it('should allow custom config on first creation', () => {
      const customConfig = { sessionTimeout: 60000 };
      const instance = TestSessionManager.getInstance(customConfig);
      
      expect(instance).toBeDefined();
    });
  });

  describe('Login/Logout', () => {
    it('should login with user object', async () => {
      const user: User = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        title: 'Mr',
        birth_date: '15',
        birth_month: 'January',
        birth_year: '1990',
        firstname: 'Test',
        lastname: 'User',
        address1: '123 Test St',
        country: 'USA',
        zipcode: '12345',
        state: 'CA',
        city: 'Test City',
        mobile_number: '+1234567890',
      };

      const loggedInUser = await sessionManager.login(user);
      
      expect(loggedInUser).toBe(user);
      expect(sessionManager.isLoggedIn()).toBe(true);
      expect(sessionManager.getCurrentUser()).toBe(user);
    });

    it('should login with credentials', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const loggedInUser = await sessionManager.login(credentials);
      
      expect(loggedInUser.email).toBe('test@example.com');
      expect(loggedInUser.password).toBe('password123');
      expect(sessionManager.isLoggedIn()).toBe(true);
    });

    it('should logout user', async () => {
      const user = await sessionManager.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(sessionManager.isLoggedIn()).toBe(true);
      
      sessionManager.logout();
      
      expect(sessionManager.isLoggedIn()).toBe(false);
      expect(sessionManager.getCurrentUser()).toBeNull();
    });

    it('should clear session completely', async () => {
      await sessionManager.login({
        email: 'test@example.com',
        password: 'password123',
      });

      sessionManager.clearSession();
      
      expect(sessionManager.isLoggedIn()).toBe(false);
      expect(sessionManager.getCurrentUser()).toBeNull();
    });
  });

  describe('User Management', () => {
    beforeEach(async () => {
      await sessionManager.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should get current user', () => {
      const user = sessionManager.getCurrentUser();
      
      expect(user).toBeDefined();
      expect(user?.email).toBe('test@example.com');
    });

    it('should update current user', () => {
      const updates = { name: 'Updated Name' };
      const updatedUser = sessionManager.updateCurrentUser(updates);
      
      expect(updatedUser?.name).toBe('Updated Name');
      expect(sessionManager.getCurrentUser()?.name).toBe('Updated Name');
    });

    it('should return null when updating without session', () => {
      sessionManager.logout();
      const result = sessionManager.updateCurrentUser({ name: 'Test' });
      
      expect(result).toBeNull();
    });

    it('should get current credentials', () => {
      const credentials = sessionManager.getCurrentCredentials();
      
      expect(credentials).toEqual({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should return null credentials without session', () => {
      sessionManager.logout();
      const credentials = sessionManager.getCurrentCredentials();
      
      expect(credentials).toBeNull();
    });
  });

  describe('Session Info', () => {
    it('should get session info', async () => {
      await sessionManager.login({
        email: 'test@example.com',
        password: 'password123',
      });

      const sessionInfo = sessionManager.getSessionInfo();
      
      expect(sessionInfo.user).toBeDefined();
      expect(sessionInfo.isLoggedIn).toBe(true);
      expect(sessionInfo.loginTime).toBeInstanceOf(Date);
      expect(sessionInfo.sessionId).toBeDefined();
    });

    it('should get session age', async () => {
      await sessionManager.login({
        email: 'test@example.com',
        password: 'password123',
      });

      const age = sessionManager.getSessionAge();
      
      expect(age).toBeGreaterThanOrEqual(0);
    });

    it('should return 0 age without session', () => {
      const age = sessionManager.getSessionAge();
      
      expect(age).toBe(0);
    });
  });

  describe('Session Timeout', () => {
    it('should handle session timeout', async () => {
      const shortTimeoutManager = new TestSessionManager({
        sessionTimeout: 100, // 100ms timeout
        autoCleanup: true,
      });

      await shortTimeoutManager.login({
        email: 'test@example.com',
        password: 'password123',
      });

      // Simular paso del tiempo
      await new Promise(resolve => setTimeout(resolve, 150));

      const user = shortTimeoutManager.getCurrentUser();
      
      expect(user).toBeNull();
      expect(shortTimeoutManager.isLoggedIn()).toBe(false);
    });
  });

  describe('sessionHelpers', () => {
    beforeEach(() => {
      // Usar el singleton para los tests
      testSession.clearSession();
    });

    it('should perform quick login', async () => {
      const user = await sessionHelpers.quickLogin();
      
      expect(user).toBeDefined();
      expect(testSession.isLoggedIn()).toBe(true);
    });

    it('should login with credentials', async () => {
      const user = await sessionHelpers.loginWithCredentials('test@example.com', 'password123');
      
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('password123');
    });

    it('should ensure clean session', async () => {
      await testSession.login({ email: 'test@example.com', password: 'password123' });
      
      sessionHelpers.ensureCleanSession();
      
      expect(testSession.isLoggedIn()).toBe(false);
    });

    it('should get or create user', async () => {
      // Primera llamada sin sesión
      const user1 = await sessionHelpers.getOrCreateUser();
      expect(user1).toBeDefined();
      
      // Segunda llamada con sesión existente
      const user2 = await sessionHelpers.getOrCreateUser();
      expect(user2).toBe(user1);
    });

    it('should login with env user', async () => {
      // Mock environment variables
      const originalEnv = process.env.TEST_EMAIL;
      const originalPassword = process.env.TEST_PASSWORD;
      
      process.env.TEST_EMAIL = 'env@test.com';
      process.env.TEST_PASSWORD = 'envpassword123';
      
      const user = await sessionHelpers.loginWithEnvUser();
      
      expect(user.email).toBe('env@test.com');
      expect(user.password).toBe('envpassword123');
      
      // Restore environment
      process.env.TEST_EMAIL = originalEnv;
      process.env.TEST_PASSWORD = originalPassword;
    });
  });

  describe('sessionCleanup', () => {
    beforeEach(async () => {
      await testSession.login({ email: 'test@example.com', password: 'password123' });
    });

    it('should cleanup after each test', () => {
      expect(testSession.isLoggedIn()).toBe(true);
      
      sessionCleanup.afterEach();
      
      expect(testSession.isLoggedIn()).toBe(false);
    });

    it('should cleanup before each test', () => {
      expect(testSession.isLoggedIn()).toBe(true);
      
      sessionCleanup.beforeEach();
      
      expect(testSession.isLoggedIn()).toBe(false);
    });

    it('should cleanup after all tests', () => {
      expect(testSession.isLoggedIn()).toBe(true);
      
      sessionCleanup.afterAll();
      
      expect(testSession.isLoggedIn()).toBe(false);
    });
  });

  describe('Role Management', () => {
    beforeEach(async () => {
      await sessionManager.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should check user role', () => {
      const hasRole = sessionManager.hasRole('user');
      
      expect(hasRole).toBe(true);
    });

    it('should return false for role without session', () => {
      sessionManager.logout();
      const hasRole = sessionManager.hasRole('user');
      
      expect(hasRole).toBe(false);
    });
  });
});

