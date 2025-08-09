import React, { useState } from 'react';
import { AuthLayout } from '../../../../components/templates/AuthLayout/AuthLayout';
import { AuthHeader } from '../../../../components/molecules/AuthHeader';
import { LoginForm, type LoginFormData } from '../../organisms/LoginForm';
import { AuthService } from '../../services/authService';
import type { LoginRequest } from '../../types/auth.types';

//import styles from './LoginPage.module.scss';

export const LoginPage: React.FC = () => {
  // Estado para manejar el loading y errores del login
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>('');

  /**
   * Maneja el proceso de login
   * Utiliza el servicio de autenticación para realizar el login
   */
  const handleLogin = async (formData: LoginFormData) => {

      setIsLoading(true);
      setLoginError('');
      
      // Preparar los datos para el servicio (mapear password a contrasena)
      const loginRequest: LoginRequest = {
        email: formData.email,
        contrasena: formData.password
      };
      
      // Llamada al servicio de autenticación
      const response = await AuthService.login(loginRequest);

      if(response.success){
        alert(`Login exitoso! Bienvenido`);
      } else {
        setLoginError(response.message);
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