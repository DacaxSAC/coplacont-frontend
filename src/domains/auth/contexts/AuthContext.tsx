import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../types/auth.types';

/**
 * Interfaz para el estado del contexto de autenticación
 */
interface AuthContextState {
  /** Usuario autenticado actual */
  user: AuthUser | null;
  /** Token JWT del usuario */
  token: string | null;
  /** Indica si el usuario está autenticado */
  isAuthenticated: boolean;
  /** Indica si se está verificando la autenticación */
  isLoading: boolean;
  /** Función para realizar login */
  login: (email: string, jwt: string) => void;
  /** Función para realizar logout */
  logout: () => void;
}

/**
 * Props para el proveedor del contexto de autenticación
 */
interface AuthProviderProps {
  children: ReactNode;
}

// Crear el contexto
const AuthContext = createContext<AuthContextState | undefined>(undefined);

/**
 * Proveedor del contexto de autenticación
 * Maneja el estado global de autenticación y persistencia en localStorage
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Verifica si hay datos de autenticación guardados al inicializar
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedToken = localStorage.getItem('jwt');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
          const parsedUser = JSON.parse(savedUser) as AuthUser;
          setToken(savedToken);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        // Limpiar datos corruptos
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Función para realizar login
   * Guarda los datos en el estado y en localStorage
   */
  const login = (email: string, jwt: string) => {
    const userData: AuthUser = { email };
    
    setUser(userData);
    setToken(jwt);
    
    // Persistir en localStorage
    localStorage.setItem('jwt', jwt);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * Función para realizar logout
   * Limpia el estado y el localStorage
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Limpiar localStorage
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  };

  const value: AuthContextState = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto de autenticación
 * @returns El estado y funciones del contexto de autenticación
 * @throws Error si se usa fuera del AuthProvider
 */
export const useAuth = (): AuthContextState => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};