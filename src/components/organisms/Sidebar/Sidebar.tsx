import React from "react";
import styles from "./Sidebar.module.scss";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { Logo } from "@/components/atoms";
import { ThemeToggle } from "@/components/atoms/ThemeToggle/ThemeToggle";
import {
  TransaccionesIcon,
  InventarioIcon,
  MantenedoresIcon,
  //ContabilidadIcon,
  //CierreContableIcon,
  CerrarSesionIcon,
  EstadosFinancierosIcon,
  ConfiguracionIcon,
} from "@/components/atoms";
import {
  MAIN_ROUTES,
  TRANSACTIONS_ROUTES,
  INVENTORY_ROUTES,
  //ACCOUNTING_ROUTES,
  //FINANCIAL_CLOSING_ROUTES,
  FINANCIAL_STATEMENTS_ROUTES,
  SETTINGS_ROUTES,
  AUTH_ROUTES,
  MAINTAINERS_ROUTES,
} from "@/router/routes";
import { useAuth } from "@/domains/auth";

/**
 * Tipos de roles de usuario
 */
const UserRoleType = {
  ADMIN: 'ADMIN',
  CONTADOR: 'CONTADOR'
} as const;

/**
 * Mapeo de roles a nombres descriptivos
 */
const ROLE_DISPLAY_NAMES: Record<string, string> = {
  [UserRoleType.ADMIN]: 'Administrador del sistema',
  [UserRoleType.CONTADOR]: 'Contador'
};

interface SidebarProps {}

export const Sidebar: React.FC<SidebarProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  // Construir el nombre completo del usuario
  const userName = user?.persona 
    ? `${user.persona.primerNombre} ${user.persona.primerApellido}`
    : user?.email || 'Usuario';

  // Obtener el rol principal del usuario con nombre descriptivo
  const userRole = user?.roles && user.roles.length > 0 
    ? ROLE_DISPLAY_NAMES[user.roles[0].nombre] || user.roles[0].nombre
    : 'Sin rol';

  /**
   * Determina si un enlace está activo basándose en la ruta actual
   * @param path - La ruta del enlace a verificar
   * @returns true si el enlace está activo
   */
  const isActiveLink = (path: string): boolean => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate(`${AUTH_ROUTES.AUTH}${AUTH_ROUTES.LOGIN}`, { replace: true });
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <Logo src="/assets/sidebar/logo.svg" width={141} height={52} />
        <Logo src="/assets/sidebar/hide.svg" size={18} />
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
            <li>
              <Link
                to={`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.PURCHASES}`}
                className={isActiveLink(`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.PURCHASES}`) ? styles.active : ''}
              >
                Compras
              </Link>
            </li>
            <li>
              <Link
                to={`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.SALES}`}
                className={isActiveLink(`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.SALES}`) ? styles.active : ''}
              >
                Ventas
              </Link>
            </li>
            {/** <li><Link to={`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.CASH}`}>Caja</Link></li>
            <li><Link to={`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.MANUAL_JOURNAL_ENTRY}`}>Asientos Manuales</Link></li>
            <li><Link to={`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.PAYROLL}`}>Planillas</Link></li>*/}
          </ul>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <InventarioIcon />
            <h3 className={styles.sectionTitle__title}>Inventario</h3>
          </div>
          <ul className={styles.menuList}>
            <li>
              <Link
                to={`${MAIN_ROUTES.INVENTORY}${INVENTORY_ROUTES.INVENTORY}`}
                className={isActiveLink(`${MAIN_ROUTES.INVENTORY}${INVENTORY_ROUTES.INVENTORY}`) ? styles.active : ''}
              >
                Inventario
              </Link>
            </li>
            <li>
              <Link 
                to={`${MAIN_ROUTES.INVENTORY}${INVENTORY_ROUTES.KARDEX}`}
                className={isActiveLink(`${MAIN_ROUTES.INVENTORY}${INVENTORY_ROUTES.KARDEX}`) ? styles.active : ''}
              >
                Kardex
              </Link>
            </li>
            {/**<li>
              <Link
                to={`${MAIN_ROUTES.INVENTORY}${INVENTORY_ROUTES.INVENTORY_ADJUSTMENT}`}
              >
                Ajustes
              </Link>
            </li>*/}
          </ul>
        </div>

                <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <EstadosFinancierosIcon />
            <h3 className={styles.sectionTitle__title}>Estados Financieros</h3>
          </div>
          <ul className={styles.menuList}>
            <li>
              <Link
                to={`${MAIN_ROUTES.FINANCIAL_STATEMENTS}${FINANCIAL_STATEMENTS_ROUTES.COST_OF_SALES_STATEMENT}`}
                className={isActiveLink(`${MAIN_ROUTES.FINANCIAL_STATEMENTS}${FINANCIAL_STATEMENTS_ROUTES.COST_OF_SALES_STATEMENT}`) ? styles.active : ''}
              >
                Estado de costo de venta
              </Link>
            </li>
            {/*<li>
              <Link
                to={`${MAIN_ROUTES.FINANCIAL_STATEMENTS}${FINANCIAL_STATEMENTS_ROUTES.BALANCE_SHEET}`}
              >
                Balance General
              </Link>
            </li>
            <li>
              <Link
                to={`${MAIN_ROUTES.FINANCIAL_STATEMENTS}${FINANCIAL_STATEMENTS_ROUTES.INCOME_STATEMENT}`}
              >
                Estado de Resultados
              </Link>
            </li>
            <li>
              <Link
                to={`${MAIN_ROUTES.FINANCIAL_STATEMENTS}${FINANCIAL_STATEMENTS_ROUTES.CASH_FLOW_STATEMENT}`}
              >
                Flujo de efectivo
              </Link>
            </li>
            <li>
              <Link
                to={`${MAIN_ROUTES.FINANCIAL_STATEMENTS}${FINANCIAL_STATEMENTS_ROUTES.STATEMENT_OF_CHANGES_IN_EQUITY}`}
              >
                Estado de patrimonio
              </Link>
            </li>*/}
          </ul>

          
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <MantenedoresIcon />
            <h3 className={styles.sectionTitle__title}>Mantenedores</h3>
          </div>
          <ul className={styles.menuList}>
            <li>
              <Link
                to={`${MAIN_ROUTES.MAINTAINERS}${MAINTAINERS_ROUTES.CLIENTS}`}
                className={isActiveLink(`${MAIN_ROUTES.MAINTAINERS}${MAINTAINERS_ROUTES.CLIENTS}`) ? styles.active : ''}
              >
                Clientes
              </Link>
            </li>
            <li>
              <Link
                to={`${MAIN_ROUTES.MAINTAINERS}${MAINTAINERS_ROUTES.SUPPLIERS}`}
                className={isActiveLink(`${MAIN_ROUTES.MAINTAINERS}${MAINTAINERS_ROUTES.SUPPLIERS}`) ? styles.active : ''}
              >
                Proveedores
              </Link>
            </li>
            <li>
              <Link
                to={`${MAIN_ROUTES.MAINTAINERS}${MAINTAINERS_ROUTES.PRODUCTS}`}
                className={isActiveLink(`${MAIN_ROUTES.MAINTAINERS}${MAINTAINERS_ROUTES.PRODUCTS}`) ? styles.active : ''}
              >
                Productos y servicios
              </Link>
            </li>
            <li>
              <Link
                to={`${MAIN_ROUTES.MAINTAINERS}${MAINTAINERS_ROUTES.CATEGORIES}`}
                className={isActiveLink(`${MAIN_ROUTES.MAINTAINERS}${MAINTAINERS_ROUTES.CATEGORIES}`) ? styles.active : ''}
              >
                Categorías
              </Link>
            </li>
            <li>
              <Link
                to={`${MAIN_ROUTES.MAINTAINERS}${MAINTAINERS_ROUTES.WAREHOUSES}`}
                className={isActiveLink(`${MAIN_ROUTES.MAINTAINERS}${MAINTAINERS_ROUTES.WAREHOUSES}`) ? styles.active : ''}
              >
                Almacenes
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <ConfiguracionIcon />
              <h3 className={styles.sectionTitle__title}>Configuración</h3>
            </div>
            <ul className={styles.menuList}>
              <li>
                <Link
                  to={`${MAIN_ROUTES.SETTINGS}${SETTINGS_ROUTES.ACCOUNTING_PERIODS}`}
                  className={isActiveLink(`${MAIN_ROUTES.SETTINGS}${SETTINGS_ROUTES.ACCOUNTING_PERIODS}`) ? styles.active : ''}
                >
                  Periodos Contables
                </Link>
              </li>
              <li>
                <Link 
                  to={`${MAIN_ROUTES.SETTINGS}${SETTINGS_ROUTES.USERS}`}
                  className={isActiveLink(`${MAIN_ROUTES.SETTINGS}${SETTINGS_ROUTES.USERS}`) ? styles.active : ''}
                >
                  Usuarios y Roles
                </Link>
              </li>
              <li>
                <Link 
                  to={`${MAIN_ROUTES.SETTINGS}${SETTINGS_ROUTES.PARAMS}`}
                  className={isActiveLink(`${MAIN_ROUTES.SETTINGS}${SETTINGS_ROUTES.PARAMS}`) ? styles.active : ''}
                >
                  Parámetros
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <CerrarSesionIcon />
              <Link
                to={`${AUTH_ROUTES.AUTH}${AUTH_ROUTES.LOGIN}`}
                onClick={handleLogout}
                className={styles.sectionTitle__title}
              >
                Cerrar Sesión
              </Link>
            </div>
          </div>

        {/*<div className={styles.section}>
          <div className={styles.sectionTitle}>
            <ContabilidadIcon />
            <h3 className={styles.sectionTitle__title}>Contabilidad</h3>
          </div>
          <ul className={styles.menuList}>
            <li>
              <Link
                to={`${MAIN_ROUTES.ACCOUNTING}${ACCOUNTING_ROUTES.CHART_OF_ACCOUNT}`}
              >
                Plan de Cuentas
              </Link>
            </li>
            <li>
              <Link
                to={`${MAIN_ROUTES.ACCOUNTING}${ACCOUNTING_ROUTES.GENERAL_JOURNAL}`}
              >
                Libro Diario
              </Link>
            </li>
            <li>
              <Link
                to={`${MAIN_ROUTES.ACCOUNTING}${ACCOUNTING_ROUTES.GENERAL_LEDGER}`}
              >
                Libro Mayor
              </Link>
            </li>
            <li>
              <Link
                to={`${MAIN_ROUTES.ACCOUNTING}${ACCOUNTING_ROUTES.INVENTORY_AND_BALANCE_STATEMENT}`}
              >
                Libro de Inventario y Balance
              </Link>
            </li>
          </ul>
        </div>*/}

        {/*<div className={styles.section}>
          <div className={styles.sectionTitle}>
            <CierreContableIcon />
            <h3 className={styles.sectionTitle__title}>Cierre Contable</h3>
          </div>
          <ul className={styles.menuList}>
            <li>
              <Link
                to={`${MAIN_ROUTES.FINANCIAL_CLOSING}${FINANCIAL_CLOSING_ROUTES.ACCOUNTING_WORKSHEET}`}
              >
                Hoja de Trabajo
              </Link>
            </li>
            <li>
              <Link
                to={`${MAIN_ROUTES.FINANCIAL_CLOSING}${FINANCIAL_CLOSING_ROUTES.CLOSING_ADJUSTMENT}`}
              >
                Hoja de Comprobación
              </Link>
            </li>
            <li>
              <Link
                to={`${MAIN_ROUTES.FINANCIAL_CLOSING}${FINANCIAL_CLOSING_ROUTES.TRIAL_BALANCE}`}
              >
                Ajustes
              </Link>
            </li>
          </ul>
        </div>*/}


      </nav>
    </aside>
  );
};
