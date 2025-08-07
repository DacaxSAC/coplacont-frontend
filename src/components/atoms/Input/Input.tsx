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
}) => {
  const className = `${styles.input} ${styles[`input--${size}`]} ${error ? styles['input--error'] : ''} ${disabled ? styles['input--disabled'] : ''}`.trim();

  return (
    <input
      type={type}
      className={className}
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
};

export default Input;