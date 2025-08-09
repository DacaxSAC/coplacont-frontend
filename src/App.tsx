import React from 'react';
import { AppRouter } from './router';
import { AuthProvider } from './domains/auth';
import styles from './App.module.scss';

/**
 * Componente principal de la aplicación
 * Configura el enrutamiento y la estructura base
 */
export const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className={styles.App}>
        <AppRouter />
      </div>
    </AuthProvider>
  );
}

export default App;