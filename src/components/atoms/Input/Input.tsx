import React from 'react';
import styles from './Input.module.scss';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  id?: string;
  name?: string;
  autoComplete?: string;
  size?: 'small' | 'medium' | 'large';
  /**
   * Elemento adicional que se renderiza dentro del contenedor del input (ej: botón)
   */
  endAdornment?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  required = false,
  error = false,
  id,
  name,
  autoComplete,
  size = 'medium',
  endAdornment,
}) => {
  const inputClassName = `${styles.input} ${styles[`input--${size}`]} ${error ? styles['input--error'] : ''} ${disabled ? styles['input--disabled'] : ''} ${endAdornment ? styles['input--with-adornment'] : ''}`.trim();

  // Si no hay endAdornment, renderizar solo el input
  if (!endAdornment) {
    return (
      <input
        type={type}
        className={inputClassName}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        required={required}
        id={id}
        name={name}
        autoComplete={autoComplete}
      />
    );
  }

  // Si hay endAdornment, renderizar con contenedor
  const containerClassName = [
    styles.inputContainer,
    error && styles['inputContainer--error'],
    disabled && styles['inputContainer--disabled']
  ].filter(Boolean).join(' ');

  const inputWithAdornmentClassName = [
    styles.input,
    styles[`input--${size}`],
    styles['input--with-adornment'],
    error && styles['input--error'],
    disabled && styles['input--disabled']
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClassName}>
      <input
        type={type}
        className={inputWithAdornmentClassName}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        required={required}
        id={id}
        name={name}
        autoComplete={autoComplete}
      />
      <div className={styles.endAdornment}>
        {endAdornment}
      </div>
    </div>
  );
};

export default Input;