import React from 'react';
import { AppRouter } from './router';
import styles from './App.module.scss';

/**
 * Componente principal de la aplicación
 * Configura el enrutamiento y la estructura base
 */
export const App: React.FC = () => {
  return (
    <div className={styles.App}>
      <AppRouter />
    </div>
  );
}

export default App;