import React from 'react';
import styles from './Button.module.scss';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'large',
  disabled = false,
  onClick,
  type = 'button',
  className,
}) => {
  const classNameMain = `${styles.button} ${styles[`button--${variant}`]} ${styles[`button--${size}`]} ${disabled ? styles['button--disabled'] : ''} ${className}`.trim();

  return (
    <button
      type={type}
        className={`${classNameMain} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;