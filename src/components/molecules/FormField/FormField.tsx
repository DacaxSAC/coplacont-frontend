import React from 'react';
import { Input, type InputProps } from '../../atoms/Input';
import { PasswordInput } from '../../atoms/PasswordInput';
import { Text } from '../../atoms/Text';

import styles from './FormField.module.scss';

/**
 * Props para el componente FormField
 */
export interface FormFieldProps extends Omit<InputProps, 'error'> {
  /** Etiqueta del campo */
  label: string;
  /** Mensaje de error a mostrar */
  errorMessage?: string;
  /** Texto de ayuda */
  helperText?: string;
  /** Si el campo es requerido */
  required?: boolean;
  /** Si hay error en el campo */
  error?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  errorMessage,
  helperText,
  required = false,
  error = false,
  id,
  type,
  ...inputProps
}) => {
  const isPasswordField = type === 'password';
  
  return (
    <div className={styles.formField}>
      <Text as="label" size="md" weight={500} color="neutral-secondary" align="left" >
        {label}
      </Text>
      <div className={styles.inputContainer}>
        {isPasswordField ? (
        <PasswordInput
          id={id}
          error={error}
          {...inputProps}
        />
      ) : (
        <Input
          id={id}
          type={type}
          error={error}
          {...inputProps}
        />
      )}
      {error && errorMessage && (
        <Text 
          as="span" 
          size="xs" 
          color="danger" 
          className={styles.errorMessage}
        >
          {errorMessage}
        </Text>
      )}
      
      {!error && helperText && (
        <Text 
          as="span" 
          size="xs" 
          color="neutral-secondary" 
          className={styles.helperText}
        >
          {helperText}
        </Text>
      )}


      </div>
      
      
      
      
    </div>
  );
};

export default FormField;