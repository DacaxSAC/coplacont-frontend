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
            <li><Link to="transactions/purchases">Compras</Link></li>
            <li><Link to="transactions/sales">Ventas</Link></li>
            <li><Link to="transactions/cash">Caja</Link></li>
            <li><Link to="transactions/manual-journal-entry">Asientos Manuales</Link></li>
            <li><Link to="transactions/payroll">Planillas</Link></li>
          </ul>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <InventarioIcon />
            <h3 className={styles.sectionTitle__title}>Inventario</h3>
          </div>
          <ul className={styles.menuList}>
            <li><Link to="/inventory/product">Productos</Link></li>
            <li><Link to="/inventory/kardex">Kardex</Link></li>
            <li><Link to="/inventory/inventory-adjusment">Ajustes</Link></li>
          </ul>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <ContabilidadIcon />
            <h3 className={styles.sectionTitle__title}>Contabilidad</h3>
          </div>
          <ul className={styles.menuList}>
            <li><Link to="/accounting/chart-of-account">Plan de Cuentas</Link></li>
            <li><Link to="/accounting/general-journal">Libro Diario</Link></li>
            <li><Link to="/accounting/general-ledger">Libro Mayor</Link></li>
            <li><Link to="/accounting/inventory-and-balance-statement">Libro de Inventario y Balance</Link></li>
          </ul>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <CierreContableIcon />
            <h3 className={styles.sectionTitle__title}>Cierre Contable</h3>
          </div>
          <ul className={styles.menuList}>
            <li><Link to="/financial-closing/accounting-worksheet">Hoja de Trabajo</Link></li>
            <li><Link to="/financial-closing/closing-adjustment">Hoja de Comprobación</Link></li>
            <li><Link to="/financial-closing/trial-balance">Ajustes</Link></li>
          </ul>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <EstadosFinancierosIcon />
            <h3 className={styles.sectionTitle__title}>Estados Financieros</h3>
          </div>
          <ul className={styles.menuList}>
            <li><Link to="/financial-statements/balance-sheet">Balance General</Link></li>
            <li><Link to="/financial-statements/income-statement">Estado de Resultados</Link></li>
            <li><Link to="/financial-statements/cash-flow-statement">Flujo de efectivo</Link></li>
            <li><Link to="/financial-statements/statement-of-changes-in-equity">Estado de patrimonio</Link></li>
          </ul>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <ConfiguracionIcon />
              <h3 className={styles.sectionTitle__title}>Configuración</h3>
            </div>
            <ul className={styles.menuList}>
              <li><Link to="/settings/accounting-periods">Periodos Contables</Link></li>
              <li><Link to="/settings/users">Usuarios y Roles</Link></li>
              <li><Link to="/settings/parameters">Parámetros</Link></li>
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