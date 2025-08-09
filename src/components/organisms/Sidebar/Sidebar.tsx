import React from 'react';
import styles from './Sidebar.module.scss';

import { Link } from 'react-router-dom';

interface SidebarProps {
  userName: string;
  userRole: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ userName, userRole }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.userInfo}>
        <span className={styles.userName}>{userName}</span>
        <span className={styles.userRole}>{userRole}</span>
      </div>

      <nav className={styles.navigation}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Transacciones</h3>
          <ul className={styles.menuList}>
            <li><Link to="/compras">Compras</Link></li>
            <li><Link to="/ventas">Ventas</Link></li>
            <li><Link to="/caja">Caja</Link></li>
            <li><Link to="/asientos-manuales">Asientos Manuales</Link></li>
            <li><Link to="/planillas">Planillas</Link></li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Inventario</h3>
          <ul className={styles.menuList}>
            <li><Link to="/productos">Productos</Link></li>
            <li><Link to="/kardex">Kardex</Link></li>
            <li><Link to="/ajustes-inventario">Ajustes</Link></li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Contabilidad</h3>
          <ul className={styles.menuList}>
            <li><Link to="/plan-cuentas">Plan de Cuentas</Link></li>
            <li><Link to="/libro-diario">Libro Diario</Link></li>
            <li><Link to="/libro-mayor">Libro Mayor</Link></li>
            <li><Link to="/libro-inventario-balance">Libro de Inventario y Balance</Link></li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Cierre Contable</h3>
          <ul className={styles.menuList}>
            <li><Link to="/hoja-trabajo">Hoja de Trabajo</Link></li>
            <li><Link to="/hoja-comprobacion">Hoja de Comprobación</Link></li>
            <li><Link to="/ajustes-cierre">Ajustes</Link></li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Estados Financieros</h3>
          <ul className={styles.menuList}>
            <li><Link to="/balance-general">Balance General</Link></li>
            <li><Link to="/estado-resultados">Estado de Resultados</Link></li>
            <li><Link to="/flujo-efectivo">Flujo de efectivo</Link></li>
            <li><Link to="/estado-patrimonio">Estado de patrimonio</Link></li>
          </ul>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Configuración</h3>
            <ul className={styles.menuList}>
              <li><Link to="/periodos-contables">Periodos Contables</Link></li>
              <li><Link to="/usuarios-roles">Usuarios y Roles</Link></li>
              <li><Link to="/parametros">Parámetros</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    </aside>
  );
};