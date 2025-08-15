import React from 'react';
import styles from './Sidebar.module.scss';

import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/atoms';
import { ThemeToggle } from '@/components/atoms/ThemeToggle/ThemeToggle';
import { TransaccionesIcon, InventarioIcon, ContabilidadIcon, CierreContableIcon, CerrarSesionIcon, EstadosFinancierosIcon, ConfiguracionIcon } from '@/components/atoms';
import { MAIN_ROUTES, TRANSACTIONS_ROUTES, INVENTORY_ROUTES, ACCOUNTING_ROUTES, FINANCIAL_CLOSING_ROUTES, FINANCIAL_STATEMENTS_ROUTES, SETTINGS_ROUTES, AUTH_ROUTES, MAINTAINERS_ROUTES } from '@/router/routes';
import { useAuth } from '@/domains/auth';

interface SidebarProps {
  userName: string;
  userRole: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ userName, userRole }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(`${AUTH_ROUTES.AUTH}${AUTH_ROUTES.LOGIN}`, { replace: true });
  };

  return (
    <aside className={styles.sidebar} >

      <div className={styles.header}>
        <Logo src='/assets/sidebar/logo.svg' width={141} height={52} />
        <Logo src='/assets/sidebar/hide.svg' size={18} />
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
            <h3 className={styles.sectionTitle__title}>Mantenedores</h3>
          </div>
          <ul className={styles.menuList}>
            <li><Link to={`${MAIN_ROUTES.MAINTAINERS}${MAINTAINERS_ROUTES.CLIENTS}`}>Clientes</Link></li>
            <li><Link to={`${MAIN_ROUTES.MAINTAINERS}${MAINTAINERS_ROUTES.SUPPLIERS}`}>Proveedores</Link></li>
            <li><Link to={`${MAIN_ROUTES.MAINTAINERS}${MAINTAINERS_ROUTES.PRODUCTS}`}>Productos y servicios</Link></li>
            <li><Link to={`${MAIN_ROUTES.MAINTAINERS}${MAINTAINERS_ROUTES.CATEGORIES}`}>Categorías</Link></li>
            <li><Link to={`${MAIN_ROUTES.MAINTAINERS}${MAINTAINERS_ROUTES.WAREHOUSES}`}>Almacenes</Link></li>
          </ul>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <TransaccionesIcon />
            <h3 className={styles.sectionTitle__title}>Transacciones</h3>
          </div>
          <ul className={styles.menuList}>
            <li><Link to={`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.PURCHASES}`}>Compras</Link></li>
            <li><Link to={`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.SALES}`}>Ventas</Link></li>
            <li><Link to={`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.CASH}`}>Caja</Link></li>
            <li><Link to={`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.MANUAL_JOURNAL_ENTRY}`}>Asientos Manuales</Link></li>
            <li><Link to={`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.PAYROLL}`}>Planillas</Link></li>
          </ul>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <InventarioIcon />
            <h3 className={styles.sectionTitle__title}>Inventario</h3>
          </div>
          <ul className={styles.menuList}>
            <li><Link to={`${MAIN_ROUTES.INVENTORY}${INVENTORY_ROUTES.INVENTORY}`}>Inventario</Link></li>
            <li><Link to={`${MAIN_ROUTES.INVENTORY}${INVENTORY_ROUTES.KARDEX}`}>Kardex</Link></li>
            <li><Link to={`${MAIN_ROUTES.INVENTORY}${INVENTORY_ROUTES.INVENTORY_ADJUSTMENT}`}>Ajustes</Link></li>
          </ul>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <ContabilidadIcon />
            <h3 className={styles.sectionTitle__title}>Contabilidad</h3>
          </div>
          <ul className={styles.menuList}>
            <li><Link to={`${MAIN_ROUTES.ACCOUNTING}${ACCOUNTING_ROUTES.CHART_OF_ACCOUNT}`}>Plan de Cuentas</Link></li>
            <li><Link to={`${MAIN_ROUTES.ACCOUNTING}${ACCOUNTING_ROUTES.GENERAL_JOURNAL}`}>Libro Diario</Link></li>
            <li><Link to={`${MAIN_ROUTES.ACCOUNTING}${ACCOUNTING_ROUTES.GENERAL_LEDGER}`}>Libro Mayor</Link></li>
            <li><Link to={`${MAIN_ROUTES.ACCOUNTING}${ACCOUNTING_ROUTES.INVENTORY_AND_BALANCE_STATEMENT}`}>Libro de Inventario y Balance</Link></li>
          </ul>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <CierreContableIcon />
            <h3 className={styles.sectionTitle__title}>Cierre Contable</h3>
          </div>
          <ul className={styles.menuList}>
            <li><Link to={`${MAIN_ROUTES.FINANCIAL_CLOSING}${FINANCIAL_CLOSING_ROUTES.ACCOUNTING_WORKSHEET}`}>Hoja de Trabajo</Link></li>
            <li><Link to={`${MAIN_ROUTES.FINANCIAL_CLOSING}${FINANCIAL_CLOSING_ROUTES.CLOSING_ADJUSTMENT}`}>Hoja de Comprobación</Link></li>
            <li><Link to={`${MAIN_ROUTES.FINANCIAL_CLOSING}${FINANCIAL_CLOSING_ROUTES.TRIAL_BALANCE}`}>Ajustes</Link></li>
          </ul>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <EstadosFinancierosIcon />
            <h3 className={styles.sectionTitle__title}>Estados Financieros</h3>
          </div>
          <ul className={styles.menuList}>
            <li><Link to={`${MAIN_ROUTES.FINANCIAL_STATEMENTS}${FINANCIAL_STATEMENTS_ROUTES.BALANCE_SHEET}`}>Balance General</Link></li>
            <li><Link to={`${MAIN_ROUTES.FINANCIAL_STATEMENTS}${FINANCIAL_STATEMENTS_ROUTES.INCOME_STATEMENT}`}>Estado de Resultados</Link></li>
            <li><Link to={`${MAIN_ROUTES.FINANCIAL_STATEMENTS}${FINANCIAL_STATEMENTS_ROUTES.CASH_FLOW_STATEMENT}`}>Flujo de efectivo</Link></li>
            <li><Link to={`${MAIN_ROUTES.FINANCIAL_STATEMENTS}${FINANCIAL_STATEMENTS_ROUTES.STATEMENT_OF_CHANGES_IN_EQUITY}`}>Estado de patrimonio</Link></li>
          </ul>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <ConfiguracionIcon />
              <h3 className={styles.sectionTitle__title}>Configuración</h3>
            </div>
            <ul className={styles.menuList}>
              <li><Link to={`${MAIN_ROUTES.SETTINGS}${SETTINGS_ROUTES.ACCOUNTING_PERIODS}`}>Periodos Contables</Link></li>
              <li><Link to={`${MAIN_ROUTES.SETTINGS}${SETTINGS_ROUTES.USERS}`}>Usuarios y Roles</Link></li>
              <li><Link to={`${MAIN_ROUTES.SETTINGS}${SETTINGS_ROUTES.PARAMS}`}>Parámetros</Link></li>
            </ul>
          </div>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <CerrarSesionIcon />
              <Link to={`${AUTH_ROUTES.AUTH}${AUTH_ROUTES.LOGIN}`} onClick={handleLogout} className={styles.sectionTitle__title}>Cerrar Sesión</Link>
            </div>

          </div>
        </div>
      </nav>
    </aside>
  );
};