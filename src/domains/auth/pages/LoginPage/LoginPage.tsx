import React, { useState } from 'react';
import { AuthLayout } from '../../../../components/templates/AuthLayout/AuthLayout';
import { Logo } from '../../../../components/atoms/Logo';

import styles from './LoginPage.module.scss';

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simular una llamada a la API
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simular éxito o error
          if (email === 'admin@example.com' && password === 'password') {
            resolve('success');
          } else {
            reject(new Error('Credenciales incorrectas'));
          }
        }, 2000);
      });
      
      // Si llegamos aquí, el login fue exitoso
      console.log('Login exitoso!');
      // Aquí normalmente redirigiríamos al usuario
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>contalab</div>
      <Logo size={120}/>
    </AuthLayout>
  );
};

export default LoginPage;