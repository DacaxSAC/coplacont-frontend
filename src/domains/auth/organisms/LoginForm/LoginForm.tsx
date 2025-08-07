import React, { useState } from 'react';
import styles from './LoginForm.module.scss';

import { Text, Button } from '@/components/atoms';
import { FormField } from '@/components/molecules';

/**
 * Interfaz para los datos del formulario de login
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Props para el componente LoginForm
 */
export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading?: boolean;
  error?: string;
}

/**
 * Componente LoginForm - Organismo que contiene el formulario completo de login
 * Maneja el estado del formulario y la validación básica
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  error
}) => {
  // Estado del formulario
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  // Estado de errores de validación
  const [validationErrors, setValidationErrors] = useState<Partial<LoginFormData>>({});

  /**
   * Maneja los cambios en los campos del formulario
   */
  const handleInputChange = (field: keyof LoginFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error de validación cuando el usuario empiece a escribir
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  /**
   * Valida los campos del formulario
   */
  const validateForm = (): boolean => {
    const errors: Partial<LoginFormData> = {};

    // Validación del email
    if (!formData.email.trim()) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Ingresa un correo electrónico válido';
    }

    // Validación de la contraseña
    if (!formData.password.trim()) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      {/* Campo de correo electrónico */}
      <FormField
        id="email"
        label="Correo electrónico"
        type="email"
        value={formData.email}
        onChange={handleInputChange('email')}
        error={!!validationErrors.email}
        errorMessage={validationErrors.email}
        required
        autoComplete="email"
        placeholder="ejemplo@correo.com"
        disabled={isLoading}
      />

      {/* Campo de contraseña */}
      <FormField
        label="Contraseña"
        type="password"
        id="password"
        value={formData.password}
        onChange={handleInputChange('password')}
        error={!!validationErrors.password}
        errorMessage={validationErrors.password}
        required
        autoComplete="current-password"
        placeholder="Ingresa tu contraseña"
        disabled={isLoading}
      />

      {/* Mensaje de error general */}
      {error && (
        <div className={styles.generalError}>
          {error}
        </div>
      )}

      {/* Botón de envío */}
      <div className={styles.buttonContainer}>
        <Button
          type="submit"
          variant="primary"
          size="large"
          disabled={isLoading}
        >
          {isLoading ? 'Ingresando...' : 'Ingresar'}
        </Button>
        <Text size='xs' align='center' color='neutral-primary'>
          El acceso es exclusivo para trabajadores autorizados
        </Text>
      </div>

    </form>
  );
};

export default LoginForm;