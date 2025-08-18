import React from 'react';
import styles from './RoleTag.module.scss';
import { Text } from '@/components';

type RoleTagProps = {
  role: string;
};

const getRoleConfig = (role: string) => {
  const normalizedRole = role.toLowerCase();
  
  if (normalizedRole.includes('contribuyente')) {
    return {
      icon: '📊',
      className: styles.RoleTag__Contribuyente,
      label: 'Contribuyente'
    };
  }
  
  if (normalizedRole.includes('administrador') || normalizedRole.includes('admin')) {
    return {
      icon: '👤',
      className: styles.RoleTag__Administrador,
      label: 'Administrador'
    };
  }
  
  if (normalizedRole.includes('contador')) {
    return {
      icon: '💬',
      className: styles.RoleTag__Contador,
      label: 'Contador'
    };
  }
  
  // Default role
  return {
    icon: '👤',
    className: styles.RoleTag__Default,
    label: role
  };
};

export const RoleTag: React.FC<RoleTagProps> = ({ role }) => {
  const config = getRoleConfig(role);
  
  return (
    <div className={`${styles.RoleTag} ${config.className}`}>
      <span className={styles.RoleTag__Icon}>{config.icon}</span>
      <Text size="xs" weight={500}>
        {config.label}
      </Text>
    </div>
  );
};