import React from 'react';
import styles from './Table.module.scss';
import { Text } from '../../atoms/Text';
import { Button } from '../../atoms/Button';

/**
 * Interfaz para definir las columnas de la tabla
 */
export interface TableColumn {
  /** Clave única de la columna */
  key: string;
  /** Título que se mostrará en el header */
  title: string;
  /** Ancho de la columna (opcional) */
  width?: string;
  /** Alineación del contenido */
  align?: 'left' | 'center' | 'right';
  /** Función para renderizar el contenido de la celda */
  render?: (value: any, record: any, index: number) => React.ReactNode;
}

/**
 * Props del componente Table
 */
export interface TableProps {
  /** Columnas de la tabla */
  columns: TableColumn[];
  /** Datos a mostrar en la tabla */
  data: any[];
  /** Función que se ejecuta al eliminar un item */
  onDelete?: (record: any, index: number) => void;
  /** Texto a mostrar cuando no hay datos */
  emptyText?: string;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Componente Table - Tabla reutilizable y configurable
 * Molécula que combina múltiples átomos para crear una tabla funcional
 */
export const Table: React.FC<TableProps> = ({
  columns,
  data,
  onDelete,
  emptyText = 'No hay datos disponibles',
  className = '',
}) => {
  return (
    <div className={`${styles.tableContainer} ${className}`}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={styles.tableHeader}
                  style={{
                    width: column.width,
                    textAlign: column.align || 'left',
                  }}
                >
                  <Text size="sm" weight={500} color="neutral-primary">
                    {column.title}
                  </Text>
                </th>
              ))}
              {onDelete && (
                <th className={styles.tableHeader} style={{ width: '80px' }}>
                  <Text size="sm" weight={500} color="neutral-primary">
                    Acciones
                  </Text>
                </th>
              )}
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onDelete ? 1 : 0)}
                  className={styles.emptyCell}
                >
                  <Text size="sm" color="neutral-secondary">
                    {emptyText}
                  </Text>
                </td>
              </tr>
            ) : (
              data.map((record, index) => (
                <tr key={record.id || index} className={styles.tableRow}>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={styles.tableCell}
                      style={{ textAlign: column.align || 'left' }}
                    >
                      {column.render
                        ? column.render(record[column.key], record, index)
                        : (
                          <Text size="sm" color="neutral-primary">
                            {record[column.key] || '-'}
                          </Text>
                        )}
                    </td>
                  ))}
                  {onDelete && (
                    <td className={styles.tableCell}>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => onDelete(record, index)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;