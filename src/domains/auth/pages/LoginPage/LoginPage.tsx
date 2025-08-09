import React, { useState } from 'react';

import { AuthLayout, AuthHeader } from '@/components';

import { 
  LoginForm, 
  AuthService, 
  type ILoginFormData, 
  type ILoginRequest,
  useAuth,
} from '@/domains/auth';
import { useNavigate } from 'react-router-dom';

//import styles from './LoginPage.module.scss';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>("");

  /**
   * Maneja el proceso de login
   * Utiliza el servicio de autenticación para realizar el login
   */
  const handleLogin = async (formData: ILoginFormData) => {
    try {
      setIsLoading(true);
      setLoginError('');
      
      // Preparar los datos para el servicio (mapear password a contrasena)
      const loginRequest: ILoginRequest = {
        email: formData.email,
        contrasena: formData.password
      };
      
      // Llamada al servicio de autenticación
      const response = await AuthService.login(loginRequest);

      if (response.success && response.email && response.jwt) {
        // Usar el contexto para manejar el login
        login(response.email, response.jwt);
        // Redirigir a la página principal después del login exitoso
        navigate('/');
      } else {
        setLoginError(response.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError(
          "Ocurrió un error inesperado. Por favor, intenta nuevamente."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/** Header de autenticación - Molécula reutilizable */}
      <AuthHeader
        title="Bienvenido al Sistema Coplacont"
        subtitle="Ingresa a tu cuenta para continuar"
      />

      {/** Organismo LoginForm - Contiene toda la lógica del formulario */}
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={loginError}
      />
    </AuthLayout>
  );
};

export default LoginPage;
