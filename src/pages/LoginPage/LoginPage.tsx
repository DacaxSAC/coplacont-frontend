import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../../components/templates/PageLayout';
import { LoginForm } from '../../components/organisms/LoginForm';
import './LoginPage.scss';

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
    <PageLayout className="login-page">
      <div className="login-page__container">
        <div className="login-page__content">
          <h1 className="login-page__title">Bienvenido</h1>
          <p className="login-page__subtitle">
            Accede a tu cuenta para continuar
          </p>
          
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
          />
          
          <div className="login-page__demo">
            <p><strong>Demo:</strong></p>
            <p>Email: admin@example.com</p>
            <p>Contraseña: password</p>
          </div>
          
          <div className="login-page__navigation">
            <p>¿No tienes una cuenta? <Link to="/auth/register" className="login-page__link">Regístrate aquí</Link></p>
            <p><Link to="/" className="login-page__link">Volver al inicio</Link></p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default LoginPage;