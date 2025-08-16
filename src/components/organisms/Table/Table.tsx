import React, { useRef, useEffect } from 'react';
import styles from './Table.module.scss';
import { Text } from '@/components/atoms';
import { NoDataIcon } from '@/components/atoms';

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
  const scrollableRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  if (rows.length === 0) {
    return <EmptyState />;
  }

  const hasActions = headers.length > 0 && headers[headers.length - 1] === 'Acciones';
  const contentHeaders = hasActions ? headers.slice(0, -1) : headers;
  const contentGridTemplate = hasActions && gridTemplate ? 
    gridTemplate.split(' ').slice(0, -1).join(' ') : gridTemplate;

  // Sincronizar scroll vertical
  const handleScroll = (source: 'content' | 'actions') => {
    return (e: React.UIEvent<HTMLDivElement>) => {
      const scrollTop = e.currentTarget.scrollTop;
      if (source === 'content' && actionsRef.current) {
        actionsRef.current.scrollTop = scrollTop;
      } else if (source === 'actions' && scrollableRef.current) {
        scrollableRef.current.scrollTop = scrollTop;
      }
    };
  };

  return (
    <section className={`${styles.tableWrapper} ${className ?? ''}`.trim()}>
      {/* Contenido scrollable */}
      <div 
        ref={scrollableRef}
        className={styles.scrollableContent}
        onScroll={hasActions ? handleScroll('content') : undefined}
      >
        <div
          className={styles.table}
          role="table"
          aria-label={ariaLabel}
          style={contentGridTemplate ? ({ ['--grid-template' as any]: contentGridTemplate } as React.CSSProperties) : undefined}
        >
          <div className={`${styles.row} ${styles.header}`} role="row">
            {contentHeaders.map((h, i) => (
              <div key={i} className={`${styles.cell} ${styles.headerCell}`} role="columnheader">
                {h}
              </div>
            ))}
          </div>

          {rows.map((r) => (
            <div key={r.id} className={styles.row} role="row">
              {r.cells.slice(0, hasActions ? -1 : r.cells.length).map((c, i) => (
                <div key={i} className={styles.cell} role="cell">
                  {c}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Columna de acciones fija */}
      {hasActions && (
        <div 
          ref={actionsRef}
          className={styles.actionsColumn}
          onScroll={handleScroll('actions')}
        >
          <div className={styles.table}>
            <div className={`${styles.row} ${styles.header}`} role="row">
              <div className={`${styles.cell} ${styles.headerCell}`} role="columnheader">
                {headers[headers.length - 1]}
              </div>
            </div>

            {rows.map((r) => (
              <div key={r.id} className={styles.row} role="row">
                <div className={styles.cell} role="cell">
                  {r.cells[r.cells.length - 1]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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

  return (

    <section className={styles.tableWrapper}>
    <div className={styles.emptyState}>
      <div className={styles.emptyState__icon}>
        <NoDataIcon />
      </div>
      <Text
        size="xl" 
        color="info" 
        weight={500}
        className={styles.emptyState__title}
      >
        {title}
      </Text>
      <Text
        size="md" 
        color="info"
        className={styles.emptyState__subtitle}
      >
        {subtitle}
      </Text>
    </div>
    </section>
  );
};