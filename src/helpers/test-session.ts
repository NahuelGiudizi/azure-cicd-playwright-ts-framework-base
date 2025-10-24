// src/helpers/test-session.ts
import { User, LoginCredentials } from '../models/user/user';
import { userFactory } from '../fixtures/data-factories';

/**
 * Estado de la sesión de usuario durante los tests
 */
export interface UserSession {
  user: User | null;
  isLoggedIn: boolean;
  loginTime: Date | null;
  sessionId: string | null;
}

/**
 * Configuración para el manejo de sesiones
 */
export interface SessionConfig {
  autoCleanup: boolean;
  sessionTimeout: number; // en milisegundos
  generateSessionId: boolean;
}

/**
 * Configuración por defecto para sesiones
 */
const DEFAULT_SESSION_CONFIG: SessionConfig = {
  autoCleanup: true,
  sessionTimeout: 30 * 60 * 1000, // 30 minutos
  generateSessionId: true,
};

/**
 * Gestor de sesiones de usuario para tests
 * Permite mantener estado de usuario entre diferentes tests
 */
export class TestSessionManager {
  private session: UserSession;
  private config: SessionConfig;
  private static instance: TestSessionManager | null = null;

  constructor(config: Partial<SessionConfig> = {}) {
    this.config = { ...DEFAULT_SESSION_CONFIG, ...config };
    this.session = {
      user: null,
      isLoggedIn: false,
      loginTime: null,
      sessionId: null,
    };
  }

  /**
   * Obtiene la instancia singleton del gestor de sesiones
   */
  static getInstance(config?: Partial<SessionConfig>): TestSessionManager {
    if (!TestSessionManager.instance) {
      TestSessionManager.instance = new TestSessionManager(config);
    }
    return TestSessionManager.instance;
  }

  /**
   * Inicia sesión con un usuario
   * @param credentials Credenciales de login o usuario completo
   * @param userData Datos adicionales del usuario (opcional)
   * @returns Usuario logueado
   */
  async login(credentials: LoginCredentials | User, userData?: Partial<User>): Promise<User> {
    let user: User;

    if ('email' in credentials && 'password' in credentials && !('name' in credentials)) {
      // Es LoginCredentials, crear usuario completo
      user = userFactory.create({
        email: credentials.email,
        password: credentials.password,
        ...userData,
      });
    } else {
      // Es User completo
      user = credentials as User;
    }

    this.session = {
      user,
      isLoggedIn: true,
      loginTime: new Date(),
      sessionId: this.config.generateSessionId ? this.generateSessionId() : null,
    };

    // Log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`User logged in: ${user.email} (Session: ${this.session.sessionId})`);
    }

    return user;
  }

  /**
   * Cierra la sesión del usuario actual
   */
  logout(): void {
    const userEmail = this.session.user?.email || 'Unknown';
    
    this.session = {
      user: null,
      isLoggedIn: false,
      loginTime: null,
      sessionId: null,
    };

    // Log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`User logged out: ${userEmail}`);
    }
  }

  /**
   * Obtiene el usuario actual de la sesión
   * @returns Usuario actual o null si no hay sesión
   */
  getCurrentUser(): User | null {
    if (!this.session.isLoggedIn || !this.session.user) {
      return null;
    }

    // Verificar timeout si está habilitado
    if (this.config.autoCleanup && this.isSessionExpired()) {
      this.logout();
      return null;
    }

    return this.session.user;
  }

  /**
   * Verifica si hay un usuario logueado
   * @returns true si hay sesión activa
   */
  isLoggedIn(): boolean {
    return this.session.isLoggedIn && this.session.user !== null;
  }

  /**
   * Obtiene información completa de la sesión
   * @returns Estado actual de la sesión
   */
  getSessionInfo(): UserSession {
    return { ...this.session };
  }

  /**
   * Actualiza datos del usuario actual
   * @param updates Datos a actualizar
   * @returns Usuario actualizado
   */
  updateCurrentUser(updates: Partial<User>): User | null {
    if (!this.session.user) {
      return null;
    }

    this.session.user = { ...this.session.user, ...updates };
    return this.session.user;
  }

  /**
   * Verifica si la sesión ha expirado
   * @returns true si la sesión ha expirado
   */
  private isSessionExpired(): boolean {
    if (!this.session.loginTime) {
      return false;
    }

    const now = new Date();
    const sessionAge = now.getTime() - this.session.loginTime.getTime();
    return sessionAge > this.config.sessionTimeout;
  }

  /**
   * Genera un ID único para la sesión
   * @returns ID de sesión único
   */
  private generateSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `session_${timestamp}_${random}`;
  }

  /**
   * Limpia completamente la sesión
   */
  clearSession(): void {
    this.session = {
      user: null,
      isLoggedIn: false,
      loginTime: null,
      sessionId: null,
    };
  }

  /**
   * Obtiene credenciales del usuario actual
   * @returns Credenciales de login o null
   */
  getCurrentCredentials(): LoginCredentials | null {
    const user = this.getCurrentUser();
    if (!user) {
      return null;
    }

    return {
      email: user.email,
      password: user.password,
    };
  }

  /**
   * Verifica si el usuario actual tiene un rol específico
   * @param role Rol a verificar
   * @returns true si el usuario tiene el rol
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    // Implementación básica - puede extenderse según necesidades
    // En el futuro se puede agregar lógica de roles específicos
    return user !== null && role.length > 0;
  }

  /**
   * Obtiene el tiempo transcurrido desde el login
   * @returns Tiempo en milisegundos
   */
  getSessionAge(): number {
    if (!this.session.loginTime) {
      return 0;
    }

    return Date.now() - this.session.loginTime.getTime();
  }
}

/**
 * Instancia singleton del gestor de sesiones
 */
export const testSession = TestSessionManager.getInstance();

/**
 * Helpers para integración con fixtures de Playwright
 */
export const sessionHelpers = {
  /**
   * Login rápido con usuario por defecto
   */
  quickLogin: async (userOverrides?: Partial<User>): Promise<User> => {
    const user = userFactory.create(userOverrides);
    return await testSession.login(user);
  },

  /**
   * Login con credenciales específicas
   */
  loginWithCredentials: async (email: string, password: string): Promise<User> => {
    return await testSession.login({ email, password });
  },

  /**
   * Verifica si hay sesión activa y la limpia si es necesario
   */
  ensureCleanSession: (): void => {
    if (testSession.isLoggedIn()) {
      testSession.logout();
    }
  },

  /**
   * Obtiene usuario actual o crea uno nuevo si no hay sesión
   */
  getOrCreateUser: async (userOverrides?: Partial<User>): Promise<User> => {
    const currentUser = testSession.getCurrentUser();
    if (currentUser) {
      return currentUser;
    }

    return await sessionHelpers.quickLogin(userOverrides);
  },

  /**
   * Login con usuario existente de variables de entorno
   */
  loginWithEnvUser: async (): Promise<User> => {
    const email = process.env.TEST_EMAIL || 'test.user@example.com';
    const password = process.env.TEST_PASSWORD || 'testpassword123';
    
    return await sessionHelpers.loginWithCredentials(email, password);
  },
};

/**
 * Hook para limpieza automática de sesiones
 */
export const sessionCleanup = {
  /**
   * Limpia la sesión al finalizar tests
   */
  afterEach: (): void => {
    if (process.env.CLEANUP_SESSIONS !== 'false') {
      testSession.clearSession();
    }
  },

  /**
   * Limpia la sesión antes de iniciar tests
   */
  beforeEach: (): void => {
    testSession.clearSession();
  },

  /**
   * Limpia la sesión al finalizar todos los tests
   */
  afterAll: (): void => {
    testSession.clearSession();
  },
};
