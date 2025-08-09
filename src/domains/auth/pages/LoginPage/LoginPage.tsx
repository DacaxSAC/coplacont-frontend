import React, { useState } from 'react';

import { AuthLayout, AuthHeader } from '@/components';

import { 
  LoginForm, 
  AuthService, 
  type ILoginFormData, 
  type ILoginRequest,
} from '@/domains/auth';

//import styles from './LoginPage.module.scss';

export const LoginPage: React.FC = () => {
  // Estado para manejar el loading y errores del login
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>('');

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
      
      console.log('Login exitoso:', response);
      
      // TODO: Redirigir al dashboard o página principal
      // navigate('/dashboard');
      alert(`Login exitoso! Bienvenido ${response.email}`);
      
    } catch (error) {
      console.error('Error en el login:', error);
      
      // Mostrar el mensaje de error específico del servidor
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
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