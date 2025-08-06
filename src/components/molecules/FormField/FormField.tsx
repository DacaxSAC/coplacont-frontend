import React from 'react';
import { Input } from '../../atoms/Input';
import type { InputProps } from '../../atoms/Input';
import './FormField.css';

export interface FormFieldProps extends Omit<InputProps, 'id'> {
  label: string;
  id: string;
  errorMessage?: string;
  helperText?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  errorMessage,
  helperText,
  required = false,
  error,
  ...inputProps
}) => {
  const hasError = error || !!errorMessage;

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">
        {label}
        {required && <span className="form-field__required">*</span>}
      </label>
      
      <Input
        {...inputProps}
        id={id}
        error={hasError}
        required={required}
      />
      
      {errorMessage && (
        <span className="form-field__error">{errorMessage}</span>
      )}
      
      {helperText && !errorMessage && (
        <span className="form-field__helper">{helperText}</span>
      )}
    </div>
  );
};

export default FormField;