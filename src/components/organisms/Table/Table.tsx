import React from 'react';
import styles from './Table.module.scss';

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