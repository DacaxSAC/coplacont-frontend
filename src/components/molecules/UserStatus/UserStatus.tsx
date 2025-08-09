import React from 'react';
import { useAuth } from '../../../domains/auth';
import { Button } from '../../atoms/Button';
import { Text } from '../../atoms/Text';
import styles from './UserStatus.module.scss';

/**
 * Componente UserStatus - Muestra el estado de autenticación del usuario
 * Ejemplo de cómo usar el contexto de autenticación
 */
export const UserStatus: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className={styles.userStatus}>
        <Text size="sm">Cargando...</Text>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className={styles.userStatus}>
        <Text size="sm">No autenticado</Text>
      </div>
    );
  }

  return (
    <div className={styles.userStatus}>
      <Text size="sm">Bienvenido, {user.email}</Text>
      <Button 
        variant="secondary" 
        size="small" 
        onClick={logout}
      >
        Cerrar sesión
      </Button>
    </div>
  );
};