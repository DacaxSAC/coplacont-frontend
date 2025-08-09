import React from 'react';
import { AppRouter } from './router';
import styles from './App.module.scss';
import { BrowserRouter } from 'react-router-dom';

/**
 * Componente principal de la aplicación
 * Configura el enrutamiento y la estructura base
 */
export const App: React.FC = () => {
  return (
    <div className={styles.App}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </div>
  );
}

export default App;