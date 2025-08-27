import React, { createContext, useState, useEffect } from 'react';
import type { IAuthUser, IAuthContextState, IAuthProviderProps, IPersona, IRole } from '@/domains/auth';

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
        // Verificar si localStorage está disponible
        if (typeof Storage === 'undefined') {
          console.warn('localStorage no está disponible');
          setIsLoading(false);
          return;
        }

        const savedToken = localStorage.getItem('jwt');
        const savedUser = localStorage.getItem('user');
        const savedPersona = localStorage.getItem('persona');
        const savedRoles = localStorage.getItem('roles');

        console.log('AuthProvider: Inicializando autenticación', {
          hasToken: !!savedToken,
          hasUser: !!savedUser,
          hasPersona: !!savedPersona,
          hasRoles: !!savedRoles,
          tokenLength: savedToken?.length || 0,
          userLength: savedUser?.length || 0,
          localStorageLength: localStorage.length,
          windowLocation: window.location.href,
          userAgent: navigator.userAgent,
          isProduction: import.meta.env.PROD
        });

        if (savedToken && savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser) as IAuthUser;
            
            // Si hay persona guardada por separado, la agregamos al usuario
            if (savedPersona) {
              const parsedPersona = JSON.parse(savedPersona) as IPersona;
              parsedUser.persona = parsedPersona;
            }
            
            // Si hay roles guardados por separado, los agregamos al usuario
            if (savedRoles) {
              const parsedRoles = JSON.parse(savedRoles) as IRole[];
              parsedUser.roles = parsedRoles;
            }
            
            setToken(savedToken);
            setUser(parsedUser);
            console.log('Usuario autenticado restaurado:', parsedUser.email);
          } catch (parseError) {
            console.error('Error al parsear datos guardados:', parseError);
            // Solo limpiar si hay error de parsing
            localStorage.removeItem('jwt');
            localStorage.removeItem('user');
            localStorage.removeItem('persona');
            localStorage.removeItem('roles');
          }
        } else {
          console.log('No hay datos de autenticación guardados');
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        // Solo limpiar en caso de error crítico
        try {
          localStorage.removeItem('jwt');
          localStorage.removeItem('user');
          localStorage.removeItem('persona');
          localStorage.removeItem('roles');
        } catch (cleanupError) {
          console.error('Error al limpiar localStorage:', cleanupError);
        }
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
  const login = (nombre: string, email: string, jwt: string, persona: IPersona, roles: IRole[]) => {
    try {
      console.log('AuthProvider: Iniciando proceso de login', {
        email,
        hasJwt: !!jwt,
        hasPersona: !!persona,
        hasRoles: !!roles,
        rolesCount: roles?.length || 0,
        windowLocation: window.location.href,
        userAgent: navigator.userAgent
      });
      
      const userData: IAuthUser = { nombre, email, persona, roles };
      
      // Verificar que localStorage esté disponible
      if (typeof Storage === 'undefined') {
        console.error('AuthProvider: localStorage no está disponible durante el login');
        return;
      }
      
      // Verificar estado actual antes de actualizar
      console.log('AuthProvider: Estado antes del login', {
        currentUser: user?.email,
        currentToken: !!token,
        localStorageUser: localStorage.getItem('user'),
        localStorageToken: localStorage.getItem('jwt')
      });
      
      // Actualizar estado
      console.log('AuthProvider: Actualizando estado del contexto...');
      setUser(userData);
      setToken(jwt);
      
      // Guardar en localStorage con verificación
      try {
        console.log('AuthProvider: Guardando en localStorage...');
        localStorage.setItem('jwt', jwt);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('persona', JSON.stringify(persona));
        localStorage.setItem('roles', JSON.stringify(roles));
        
        console.log('AuthProvider: Datos guardados, verificando...');
        
        // Verificar que se guardaron correctamente
        const savedToken = localStorage.getItem('jwt');
        const savedUser = localStorage.getItem('user');
        const savedPersona = localStorage.getItem('persona');
        const savedRoles = localStorage.getItem('roles');
        
        console.log('AuthProvider: Verificación de guardado', {
          tokenSaved: !!savedToken,
          userSaved: !!savedUser,
          personaSaved: !!savedPersona,
          rolesSaved: !!savedRoles,
          tokenMatches: savedToken === jwt,
          userDataLength: savedUser?.length || 0,
          localStorageLength: localStorage.length
        });
        
        if (!savedToken || !savedUser) {
          console.error('AuthProvider: Error - Los datos no se guardaron correctamente en localStorage');
        } else {
          console.log('AuthProvider: Todos los datos se guardaron correctamente');
        }
        
        // Intentar parsear para verificar integridad
         if (savedUser) {
           try {
             const parsedUser = JSON.parse(savedUser);
             console.log('AuthProvider: Usuario parseado correctamente', {
               parsedEmail: parsedUser.email,
               originalEmail: email
             });
           } catch (parseError) {
             console.error('AuthProvider: Error al parsear usuario guardado', parseError);
           }
         }
        
      } catch (storageError) {
        console.error('AuthProvider: Error al guardar en localStorage:', storageError);
      }
      
    } catch (error) {
      console.error('AuthProvider: Error durante el login:', error);
    }
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
    localStorage.removeItem('persona');
    localStorage.removeItem('roles');
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