import React from 'react';
import styles from './MainLayout.module.scss';
import { Outlet } from 'react-router-dom';

import { Sidebar } from '@/components'

export const MainLayout: React.FC = () => {
  const userName = "Renato Lorre";
  const userRole = "Administrador de sistema";

  return (
    <div className={styles.mainLayout}>
      <Sidebar userName={userName} userRole={userRole} />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};
