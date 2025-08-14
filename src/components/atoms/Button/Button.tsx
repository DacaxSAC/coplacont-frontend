import React from 'react';
import styles from './Button.module.scss';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'tableItemStyle';
  size?: 'small' | 'medium' | 'large' | 'tableItemSize';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'large',
  disabled = false,
  onClick,
  type = 'button',
}) => {
  const className = `${styles.button} ${styles[`button--${variant}`]} ${styles[`button--${size}`]} ${disabled ? styles['button--disabled'] : ''}`.trim();

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;