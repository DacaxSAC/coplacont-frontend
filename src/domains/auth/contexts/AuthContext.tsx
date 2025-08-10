import React, { createContext, useState, useEffect } from 'react';
import type { IAuthUser, IAuthContextState, IAuthProviderProps } from '@/domains/auth';

export const AuthContext = createContext<IAuthContextState | undefined>(undefined);

/**
 * Proveedor del contexto de autenticación
 * Maneja el estado global de autenticación y persistencia en localStorage
 */
export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Verifica si hay datos de autenticación guardados al inicializar
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedToken = localStorage.getItem('jwt');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
          const parsedUser = JSON.parse(savedUser) as IAuthUser;
          setToken(savedToken);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
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
    const userData: IAuthUser = { email };
    
    setUser(userData);
    setToken(jwt);
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
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  };

  const value: IAuthContextState = {
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