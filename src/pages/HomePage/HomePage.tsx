import React from 'react';
// import styles from './HomePage.module.scss';

import { Link } from 'react-router-dom';

import { Text, Button } from '@/components/atoms';
import { MainLayout } from '@/components/templates';

/**
 * Página de inicio de la aplicación
 * Muestra información general y enlaces de navegación principales
 */
export const HomePage: React.FC = () => {
  return (
    <MainLayout >
      <div >
        <div >
          <Text as="h1" size="4xl" weight={600} color="primary" align="center">
            Bienvenido a CoPlaCont
          </Text>
          <Text size="lg" color="secondary" align="center" className="mt-4">
            Sistema de gestión contable y administrativa
          </Text>
        </div>
        
        <div >
          {/* Temporalmente comentado hasta crear el componente Card */}
          <div>
            <h3>Iniciar Sesión</h3>
            <p>¿Ya tienes una cuenta? Inicia sesión para acceder a todas las funcionalidades del sistema.</p>
            <Link to="/auth/login">
              <Button variant="primary" size="large">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
          
          <div>
            <h3>Crear Cuenta</h3>
            <p>¿Nuevo usuario? Crea tu cuenta para comenzar a utilizar nuestro sistema de gestión.</p>
            <Link to="/auth/register">
              <Button variant="secondary" size="large">
                Crear Cuenta
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="home-page__features">
          <h2 className="home-page__features-title">Características Principales</h2>
          <div className="home-page__features-grid">
            <div className="home-page__feature">
              <h3>Gestión Contable</h3>
              <p>Administra tus cuentas, balances y reportes financieros de manera eficiente.</p>
            </div>
            <div className="home-page__feature">
              <h3>Control Administrativo</h3>
              <p>Mantén el control total de tus procesos administrativos y documentación.</p>
            </div>
            <div className="home-page__feature">
              <h3>Reportes Detallados</h3>
              <p>Genera reportes personalizados para tomar decisiones informadas.</p>
            </div>
            <div className="home-page__feature">
              <h3>Seguridad Avanzada</h3>
              <p>Protege tu información con nuestros sistemas de seguridad de última generación.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;