import React, { useState } from 'react';
import { AuthLayout } from '../../../../components/templates/AuthLayout/AuthLayout';
import { Logo } from '../../../../components/atoms/Logo';
import { Text } from '../../../../components/atoms/Text';
import { Input } from '../../../../components/atoms/Input';

import styles from './LoginPage.module.scss';

export const LoginPage: React.FC = () => {

  return (
    <AuthLayout>
      {/** Zona que se usa casi en toda la autenticacion, solo cambia el text 1 y text 2 */}
      <Logo size={120}/>
      <Text as="h1" size="2xl" weight={600} color="neutral-primary" align="center">
        Bienvenido al Sistema Coplacont
      </Text>

      <Text as="p" size="md" color="neutral-secondary" align="center" >
        Ingresa a tu cuenta para continuar
      </Text>

      {/** Espacio para el formulario */}
      <Text as="p" size="md" weight={500} color="neutral-secondary" align="center" >
        Correo electronico
      </Text>

      <Input />

      <Text as="p" size="md" weight={500} color="neutral-secondary" align="center" >
        Contraseña
      </Text>

      <Input />


    </AuthLayout>
  );
};

export default LoginPage;