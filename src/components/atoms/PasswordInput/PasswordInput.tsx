import React, { useState } from 'react';
import { Input } from '../Input';
import type { InputProps } from '../Input';
import { EyeIcon, EyeOffIcon } from '../icons';
import styles from './PasswordInput.module.scss';

/**
 * Props para el componente PasswordInput
 * Extiende las props del Input básico
 */
export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  /** Placeholder por defecto para campos de contraseña */
  placeholder?: string;
}



/**
 * Componente PasswordInput - Átomo especializado para campos de contraseña
 * Incluye funcionalidad para mostrar/ocultar la contraseña
 */
export const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder = "Ingresa tu contraseña",
  ...inputProps
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  /**
   * Alterna la visibilidad de la contraseña
   */
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleButton = (
    <button
      type="button"
      className={styles.toggleButton}
      onClick={togglePasswordVisibility}
      aria-label={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
    >
      {isPasswordVisible ? (
        <EyeOffIcon />
      ) : (
        <EyeIcon />
      )}
    </button>
  );

  return (
    <Input
      {...inputProps}
      type={isPasswordVisible ? 'text' : 'password'}
      placeholder={placeholder}
      endAdornment={toggleButton}
    />
  );
};

export default PasswordInput;