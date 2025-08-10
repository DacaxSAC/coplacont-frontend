import React from 'react';
import { AppRouter } from './router';
import { AuthProvider } from './domains/auth';
import { ThemeProvider } from "@/shared";
import styles from './App.module.scss';
import { BrowserRouter } from 'react-router-dom';

/**
 * Componente principal de la aplicación
 * Configura el enrutamiento y la estructura base
 */
export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className={styles.App}>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;