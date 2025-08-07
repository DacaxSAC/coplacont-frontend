import React from 'react';
import { Logo } from '../../atoms/Logo';
import { Text } from '../../atoms/Text';

import styles from './AuthHeader.module.scss';

/**
 * Props para el componente AuthHeader
 */
export interface AuthHeaderProps {
  /** Texto principal del header */
  title: string;
  /** Texto secundario/descripción */
  subtitle: string;
  /** Tamaño del logo (opcional, por defecto 120) */
  logoSize?: number;
}

/**
 * Componente AuthHeader - Molécula que combina Logo y textos de encabezado
 * para páginas de autenticación
 */
export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  logoSize = 120
}) => {
  return (
    <div className={styles.authHeader}>
      <Logo size={logoSize} />
      
      <Text 
        as="p" 
        size="2xl" 
        weight={600} 
        color="neutral-primary" 
        align="center"
        className={styles.title}
      >
        {title}
      </Text>

      <Text 
        as="p" 
        size="md" 
        color="neutral-secondary" 
        align="center"
        className={styles.subtitle}
      >
        {subtitle}
      </Text>
    </div>
  );
};