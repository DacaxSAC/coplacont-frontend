import React from 'react';
import styles from './Sidebar.module.scss';

import { Link } from 'react-router-dom';
import { Logo } from '@/components/atoms';
import { ThemeToggle } from '@/components/atoms/ThemeToggle/ThemeToggle';
import { TransaccionesIcon, InventarioIcon, ContabilidadIcon, CierreContableIcon, CerrarSesionIcon, EstadosFinancierosIcon, ConfiguracionIcon } from '@/components/atoms';

interface SidebarProps {
  userName: string;
  userRole: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ userName, userRole }) => {
  return (
    <aside className={styles.sidebar} >

      <div className={styles.header}>
        <Logo src='../src/assets/sidebar/logo.svg' width={141} height={52} />
        <Logo src='../src/assets/sidebar/hide.svg' size={18} />
      </div>

      <div className={styles.userInfo}>
        <span className={styles.userName}>{userName}</span>
        <span className={styles.userRole}>{userRole}</span>
      </div>

      <div>
        <ThemeToggle />
      </div>

      <nav className={styles.navigation}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <TransaccionesIcon />
            <h3 className={styles.sectionTitle__title}>Transacciones</h3>  
          </div>
          
          <ul className={styles.menuList}>
            <li><Link to="/purchases">Compras</Link></li>
            <li><Link to="/sales">Ventas</Link></li>
            <li><Link to="/cash">Caja</Link></li>
            <li><Link to="/manual-journal-entry">Asientos Manuales</Link></li>
            <li><Link to="/payroll">Planillas</Link></li>
          </ul>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <InventarioIcon />
            <h3 className={styles.sectionTitle__title}>Inventario</h3>
          </div>
          <ul className={styles.menuList}>
            <li><Link to="/productos">Productos</Link></li>
            <li><Link to="/kardex">Kardex</Link></li>
            <li><Link to="/ajustes-inventario">Ajustes</Link></li>
          </ul>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <ContabilidadIcon />
            <h3 className={styles.sectionTitle__title}>Contabilidad</h3>
          </div>
          <ul className={styles.menuList}>
            <li><Link to="/plan-cuentas">Plan de Cuentas</Link></li>
            <li><Link to="/libro-diario">Libro Diario</Link></li>
            <li><Link to="/libro-mayor">Libro Mayor</Link></li>
            <li><Link to="/libro-inventario-balance">Libro de Inventario y Balance</Link></li>
          </ul>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <CierreContableIcon />
            <h3 className={styles.sectionTitle__title}>Cierre Contable</h3>
          </div>
          <ul className={styles.menuList}>
            <li><Link to="/hoja-trabajo">Hoja de Trabajo</Link></li>
            <li><Link to="/hoja-comprobacion">Hoja de Comprobación</Link></li>
            <li><Link to="/ajustes-cierre">Ajustes</Link></li>
          </ul>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <EstadosFinancierosIcon />
            <h3 className={styles.sectionTitle__title}>Estados Financieros</h3>
          </div>
          <ul className={styles.menuList}>
            <li><Link to="/balance-general">Balance General</Link></li>
            <li><Link to="/estado-resultados">Estado de Resultados</Link></li>
            <li><Link to="/flujo-efectivo">Flujo de efectivo</Link></li>
            <li><Link to="/estado-patrimonio">Estado de patrimonio</Link></li>
          </ul>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <ConfiguracionIcon />
              <h3 className={styles.sectionTitle__title}>Configuración</h3>
            </div>
            <ul className={styles.menuList}>
              <li><Link to="/periodos-contables">Periodos Contables</Link></li>
              <li><Link to="/usuarios-roles">Usuarios y Roles</Link></li>
              <li><Link to="/parametros">Parámetros</Link></li>
            </ul>
          </div>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <CerrarSesionIcon />
              <h3 className={styles.sectionTitle__title}>Cerrar Sesión</h3>
            </div>
            
          </div>
        </div>
      </nav>
    </aside>
  );
};