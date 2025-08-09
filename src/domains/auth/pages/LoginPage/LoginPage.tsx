import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../../../components/templates/AuthLayout/AuthLayout";
import { AuthHeader } from "../../../../components/molecules/AuthHeader";
import { LoginForm, type LoginFormData } from "../../organisms/LoginForm";
import { AuthService } from "../../services/authService";
import { useAuth } from "../../contexts";
import type { LoginRequest } from "../../types/auth.types";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>("");

  const handleLogin = async (formData: LoginFormData) => {
    setIsLoading(true);
    setLoginError("");

    const loginRequest: LoginRequest = {
      email: formData.email,
      contrasena: formData.password,
    };

    try {
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
