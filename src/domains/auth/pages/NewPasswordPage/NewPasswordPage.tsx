import React, { useState } from 'react';
import { AuthLayout } from '../../../../components/templates/AuthLayout/AuthLayout';
import { AuthHeader } from '../../../../components/molecules/AuthHeader';
import { NewPasswordForm, type NewPasswordFormData } from '../../organisms/NewPasswordForm';

//import styles from './NewPasswordPage.module.scss';

export const NewPasswordPage: React.FC = () => {
  // Estado para manejar el loading y errores del formulario
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string>('');
  const [passwordSuccess, setPasswordSuccess] = useState<string>('');

  /**
   * Maneja el proceso de creación de nueva contraseña
   * Aquí se implementará la lógica de actualización de contraseña
   */
  const handleNewPassword = async (formData: NewPasswordFormData) => {
    try {
      setIsLoading(true);
      setPasswordError('');
      setPasswordSuccess('');
      
      // TODO: Implementar llamada al servicio de actualización de contraseña
      console.log('Datos de nueva contraseña:', { password: formData.password });
      
      // Simulación de delay para mostrar el loading
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Aquí iría la lógica real de actualización de contraseña:
      // const response = await authService.updatePassword(formData.password, token);
      // if (response.success) {
      //   setPasswordSuccess('Tu contraseña ha sido actualizada exitosamente');
      //   // Redirigir al login después de un tiempo
      //   setTimeout(() => {
      //     navigate('/auth/login');
      //   }, 2000);
      // } else {
      //   setPasswordError(response.message || 'Error al actualizar la contraseña');
      // }
      
      // Por ahora, simulamos una actualización exitosa
      setPasswordSuccess('Tu contraseña ha sido actualizada exitosamente');
      
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      setPasswordError('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/** Header de autenticación - Molécula reutilizable */}
      <AuthHeader 
        title="Crear nueva contraseña"
        subtitle="Crea una nueva contraseña para tu cuenta"
      />

      {/** Organismo NewPasswordForm - Contiene toda la lógica del formulario */}
      <NewPasswordForm 
        onSubmit={handleNewPassword}
        isLoading={isLoading}
        error={passwordError}
        success={passwordSuccess}
      />
    </AuthLayout>
  );
};

export default NewPasswordPage;