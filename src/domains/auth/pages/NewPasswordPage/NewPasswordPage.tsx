import React, { useState } from 'react';  
import { useNavigate, useSearchParams } from 'react-router-dom';

import { AuthLayout, AuthHeader } from '@/components';
import { AuthService, NewPasswordForm, type INewPasswordFormData } from '@/domains/auth'
import { AUTH_ROUTES } from '@/router/routes';

//import styles from './NewPasswordPage.module.scss';

export const NewPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string>('');
  const [passwordSuccess, setPasswordSuccess] = useState<string>('');
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState<boolean>(false);

  /**
   * Maneja el proceso de creación de nueva contraseña
   * Aquí se implementará la lógica de actualización de contraseña
   */
  const handleNewPassword = async (formData: INewPasswordFormData) => {
    try {
      setIsLoading(true);
      setPasswordError("");
      setPasswordSuccess("");

      if (!token) {
        setPasswordError('Token de restablecimiento no válido');
        return;
      }

      const response = await AuthService.resetPassword(token, formData.password);

      if (response.success) {
        setPasswordSuccess('Tu contraseña ha sido actualizada exitosamente');
        setIsPasswordUpdated(true);
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate(AUTH_ROUTES.LOGIN);
        }, 2000);
      } else {
        setPasswordError(response.message || 'Error al actualizar la contraseña');
      }
    } catch (error) {
      if (error instanceof Error) {
        setPasswordError(error.message);
      } else {
        setPasswordError(
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
        title="Crear nueva contraseña"
        subtitle="Crea una nueva contraseña para tu cuenta"
      />

      {/** Organismo NewPasswordForm - Contiene toda la lógica del formulario */}
      {isValidToken ? (
        <NewPasswordForm
          onSubmit={handleNewPassword}
          isLoading={isLoading}
          error={passwordError}
          success={passwordSuccess}
          disabled={isPasswordUpdated}
        />
      ) : isLoading ? (
        <div>
          <p>Validando token...</p>
        </div>
      ) : (
        <div>
          <p>{passwordError}</p>
        </div>
      )}
    </AuthLayout>
  );
};

export default NewPasswordPage;
