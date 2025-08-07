import React, { useState } from 'react';
import { AuthLayout } from '../../../../components/templates/AuthLayout/AuthLayout';
import { AuthHeader } from '../../../../components/molecules/AuthHeader';
import { LoginForm, type LoginFormData } from '../../organisms/LoginForm';

//import styles from './LoginPage.module.scss';

export const LoginPage: React.FC = () => {
  // Estado para manejar el loading y errores del login
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>('');

  /**
   * Maneja el proceso de login
   * Aquí se implementará la lógica de autenticación con el servicio
   */
  const handleLogin = async (formData: LoginFormData) => {
    try {
      setIsLoading(true);
      setLoginError('');
      
      // TODO: Implementar llamada al servicio de autenticación
      console.log('Datos de login:', formData);
      
      // Simulación de delay para mostrar el loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Aquí iría la lógica real de autenticación:
      // const response = await authService.login(formData.email, formData.password);
      // if (response.success) {
      //   // Redirigir al dashboard o página principal
      //   navigate('/dashboard');
      // } else {
      //   setLoginError(response.message || 'Error al iniciar sesión');
      // }
      
      // Por ahora, simulamos un login exitoso
      alert('Login exitoso! (simulado)');
      
    } catch (error) {
      console.error('Error en el login:', error);
      setLoginError('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
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