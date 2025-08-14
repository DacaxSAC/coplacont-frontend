import React from 'react';
import styles from './Table.module.scss';
import { Text } from '@/components/atoms';

export type TableRow = {
  id: number | string;
  cells: React.ReactNode[];
};

export interface TableProps {
  headers: React.ReactNode[];
  rows: TableRow[];
  gridTemplate?: string; // CSS grid-template-columns string
  className?: string;
  ariaLabel?: string;
}

export const Table: React.FC<TableProps> = ({ headers, rows, gridTemplate, className, ariaLabel = 'Tabla' }) => {
  if (rows.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className={`${styles.tableWrapper} ${className ?? ''}`.trim()}>
      <div
        className={styles.table}
        role="table"
        aria-label={ariaLabel}
        style={gridTemplate ? ({ ['--grid-template' as any]: gridTemplate } as React.CSSProperties) : undefined}
      >
        <div className={`${styles.row} ${styles.header}`} role="row">
          {headers.map((h, i) => (
            <div key={i} className={`${styles.cell} ${styles.headerCell}`} role="columnheader">
              {h}
            </div>
          ))}
        </div>

        {rows.map((r) => (
          <div key={r.id} className={styles.row} role="row">
            {r.cells.map((c, i) => (
              <div key={i} className={styles.cell} role="cell">
                {c}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Table;

/**
 * Component to show when there are no categories
 */
export const EmptyState: React.FC = () => {
  const title = "Sin datos"
  const subtitle = "No se encontraron registros para mostrar"
  const defaultIcon = (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" 
        fill="#d1d5db" 
      />
      <path 
        d="M12 21L13 18L16 19L13 20L12 21Z" 
        fill="#d1d5db"
      />
      <path 
        d="M3 12L6 11L5 8L6 11L9 12L6 13L5 16L6 13L3 12Z" 
        fill="#d1d5db"
      />
    </svg>
  );

  return (

    <section className={styles.tableWrapper}>
    <div className={styles.emptyState}>
      <div className={styles.emptyState__icon}>
        {defaultIcon}
      </div>
      <Text
        size="lg" 
        color="neutral-primary" 
        weight={500}
        className={styles.emptyState__title}
      >
        {title}
      </Text>
      <Text
        size="md" 
        color="neutral-secondary"
        className={styles.emptyState__subtitle}
      >
        {subtitle}
      </Text>
    </div>
    </section>
  );
};