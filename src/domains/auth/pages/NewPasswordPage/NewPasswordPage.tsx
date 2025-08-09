import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthLayout } from "../../../../components/templates/AuthLayout/AuthLayout";
import { AuthHeader } from "../../../../components/molecules/AuthHeader";
import {
  NewPasswordForm,
  type NewPasswordFormData,
} from "../../organisms/NewPasswordForm";
import { AuthService } from "../../services";

export const NewPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordSuccess, setPasswordSuccess] = useState<string>("");
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState<boolean>(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setPasswordError(
          "No se proporcionó un token de restablecimiento válido."
        );
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await AuthService.validateResetToken(token);
        setIsLoading(false);

        if (response.success) {
          setIsValidToken(true);
        } else {
          setPasswordError(
            response.message || "Token de restablecimiento inválido o expirado."
          );
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setPasswordError(
          "Error al validar el token. Por favor, solicita un nuevo enlace de restablecimiento."
        );
      } finally {
        setIsLoading(false);
      }
    };
    validateToken();
  }, [token]);

  const handleNewPassword = async (formData: NewPasswordFormData) => {
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
        // TODO: Redirigir al login después de un tiempo
        // setTimeout(() => {
        //   navigate('/auth/login');
        // }, 2000);
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
