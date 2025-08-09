import React from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../../components/templates/PageLayout';
import { Card } from '../../components/molecules/Card';
import { UserStatus } from '../../components/molecules/UserStatus';
import { Button } from '../../components/atoms/Button';
import { Text } from '../../components/atoms/Text';

/**
 * Página de inicio de la aplicación
 * Muestra información general y enlaces de navegación principales
 */
export const HomePage: React.FC = () => {
  return (
    <PageLayout >
      <div >
        {/* Estado de autenticación del usuario */}
        <UserStatus />
        
        <div >
          <Text as="h1" size="4xl" weight={600} color="primary" align="center">
            Bienvenido a CoPlaCont
          </Text>
          <Text size="lg" color="secondary" align="center" className="mt-4">
            Sistema de gestión contable y administrativa
          </Text>
        </div>
        
        <div >
          <Card 
            title="Iniciar Sesión" 
            subtitle="Accede a tu cuenta existente"
            variant="elevated"
          >
            <div >
              <p>¿Ya tienes una cuenta? Inicia sesión para acceder a todas las funcionalidades del sistema.</p>
              <Link to="/auth/login">
                <Button variant="primary" size="large">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </Card>
          
          <Card 
            title="Crear Cuenta" 
            subtitle="Regístrate para comenzar"
            variant="elevated"
            className="home-page__card"
          >
            <div className="home-page__card-content">
              <p>¿Nuevo usuario? Crea tu cuenta para comenzar a utilizar nuestro sistema de gestión.</p>
              <Link to="/auth/register">
                <Button variant="secondary" size="large">
                  Crear Cuenta
                </Button>
              </Link>
            </div>
          </Card>
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
    </PageLayout>
  );
};

export default HomePage;