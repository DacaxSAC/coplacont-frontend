import React, { useState } from 'react';
import { AuthLayout, AuthHeader } from '@/components';
import { RecoveryPasswordForm, type IRecoveryPasswordFormData } from '@/domains/auth';

//import styles from './RecoveryPasswordPage.module.scss';

export const RecoveryPasswordPage: React.FC = () => {
  // Estado para manejar el loading y errores del formulario
  const [isLoading, setIsLoading] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string>('');
  const [recoverySuccess, setRecoverySuccess] = useState<string>('');

  /**
   * Maneja el proceso de recuperación de contraseña
   * Aquí se implementará la lógica de envío del email de recuperación
   */
  const handleRecoveryPassword = async (formData: IRecoveryPasswordFormData) => {
    try {
      setIsLoading(true);
      setRecoveryError('');
      setRecoverySuccess('');
      
      // TODO: Implementar llamada al servicio de recuperación de contraseña
      console.log('Datos de recuperación:', formData);
      
      // Simulación de delay para mostrar el loading
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Aquí iría la lógica real de recuperación de contraseña:
      // const response = await authService.requestPasswordReset(formData.email);
      // if (response.success) {
      //   setRecoverySuccess('Se ha enviado un enlace de recuperación a tu correo electrónico');
      // } else {
      //   setRecoveryError(response.message || 'Error al enviar el correo de recuperación');
      // }
      
      // Por ahora, simulamos un envío exitoso
      setRecoverySuccess('Se ha enviado un enlace de recuperación a tu correo electrónico');
      
    } catch (error) {
      console.error('Error en la recuperación de contraseña:', error);
      setRecoveryError('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/** Header de autenticación - Molécula reutilizable */}
      <AuthHeader 
        title="Recuperar contraseña"
        subtitle="Ingresa tu correo electrónico para restablecer tu contraseña"
      />

      {/** Organismo RecoveryPasswordForm - Contiene toda la lógica del formulario */}
      <RecoveryPasswordForm 
        onSubmit={handleRecoveryPassword}
        isLoading={isLoading}
        error={recoveryError}
        success={recoverySuccess}
      />
    </AuthLayout>
  );
};

export default RecoveryPasswordPage;