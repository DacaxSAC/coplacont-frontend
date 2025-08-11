import React, { useMemo, useState } from 'react';
import styles from './HomeSalePage.module.scss';

import { Button, PageLayout, FormField } from '@/components';
import {
  documentTypeOptions,
  filterTypeOptions,
  monthOptions,
  sunatStatusOptions,
  yearOptions,
} from './HomeSaleFilterData';

export const HomeSalePage: React.FC = () => {
  // Top filters
  const [filterType, setFilterType] = useState('mes-anio');
  const [month, setMonth] = useState('08');
  const [year, setYear] = useState('2025');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Secondary filters
  const [entity, setEntity] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [sunatStatus, setSunatStatus] = useState('');

  const handleTopFilter = () => {
    // TODO: conectar con servicio de ventas
    // Por ahora, solo mostramos en consola
    console.log({ filterType, month, year, startDate, endDate });
  };

  const handleSearchFilter = () => {
    console.log({ entity, documentType, sunatStatus });
  };

  // Dummy data para la tabla (placeholder)
  const rows = useMemo(() => Array.from({ length: 10 }, (_, idx) => ({
    id: idx + 1,
    entidad: 'XXXXXXXXXXXXXX',
    correo: 'xxxxx@xxxxx.xxx',
    documento: 'XX-XXXX',
    estado: 'XXXXXX',
    columnaA: 'XXXXXXXXXX',
    columnaB: 'XXXXXX',
  })), []);

  return (
    <PageLayout
      title="Ventas"
      subtitle={`Muestra la lista de ventas de AGOSTO 2025.`}
      className={styles.homeSalePage}
    >
      {/* Barra de filtros superior */}
      <section className={styles.filtersTop}>
        <FormField
          type="combobox"
          label="Tipo de filtro"
          options={filterTypeOptions}
          value={filterType}
          onChange={(v) => setFilterType(v as string)}
          placeholder="Seleccionar"
          size="medium"
        />

        <FormField
          type="combobox"
          label="Mes"
          options={monthOptions}
          value={month}
          onChange={(v) => setMonth(v as string)}
          placeholder="Mes"
          size="medium"
        />

        <FormField
          type="combobox"
          label="Año"
          options={yearOptions}
          value={year}
          onChange={(v) => setYear(v as string)}
          placeholder="Año"
          size="medium"
        />

        <FormField
          type="date"
          label="Inicio de rango"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <FormField
          type="date"
          label="Fin de rango"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <div className={styles.alignEnd}>
          <Button size="large" onClick={handleTopFilter}>Filtrar</Button>
        </div>
      </section>

      {/* Botones de acciones */}
      <section className={styles.actionsRow}>
        <Button size="large">+ Nueva venta</Button>
        <Button size="large">⇪ Subir ventas</Button>
      </section>

      {/* Barra de búsqueda secundaria */}
      <section className={styles.filtersSecondary}>
        <FormField
          type="text"
          label="Entidad"
          placeholder="Buscar entidad"
          value={entity}
          onChange={(e) => setEntity(e.target.value)}
        />

        <FormField
          type="combobox"
          label="Tipo de documento"
          options={documentTypeOptions}
          value={documentType}
          onChange={(v) => setDocumentType(v as string)}
          placeholder="Seleccionar"
        />

        <FormField
          type="combobox"
          label="Estado de SUNAT"
          options={sunatStatusOptions}
          value={sunatStatus}
          onChange={(v) => setSunatStatus(v as string)}
          placeholder="Seleccionar"
        />

        <div className={styles.alignEnd}>
          <Button size="large">Filtrar búsqueda</Button>
        </div>
      </section>

      {/* Tabla de resultados */}
      <section className={styles.tableWrapper}>
        <div className={styles.table} role="table" aria-label="Lista de ventas">
          <div className={`${styles.row} ${styles.header}`} role="row">
            <div className={styles.cell} role="columnheader">XXXXXXXXXXXXXX</div>
            <div className={styles.cell} role="columnheader">XXXXXXXX</div>
            <div className={styles.cell} role="columnheader">XXXXXX@XXXXX.XXX</div>
            <div className={styles.cell} role="columnheader">XX-XXXX</div>
            <div className={styles.cell} role="columnheader">XXXXXXXXXX</div>
            <div className={styles.cell} role="columnheader">XXXXXX</div>
            <div className={styles.cell} role="columnheader">XXXXXXXX</div>
            <div className={styles.cell} role="columnheader"></div>
            <div className={styles.cell} role="columnheader"></div>
          </div>

          {rows.map((r) => (
            <div key={r.id} className={styles.row} role="row">
              <div className={styles.cell} role="cell">{r.entidad}</div>
              <div className={styles.cell} role="cell">{r.columnaA}</div>
              <div className={styles.cell} role="cell">{r.correo}</div>
              <div className={styles.cell} role="cell">{r.documento}</div>
              <div className={styles.cell} role="cell">{r.columnaA}</div>
              <div className={styles.cell} role="cell">{r.columnaB}</div>
              <div className={styles.cell} role="cell">{r.estado}</div>
              <div className={`${styles.cell} ${styles.actions}`} role="cell">
                <button className={styles.iconButton} aria-label="Editar">✎</button>
              </div>
              <div className={`${styles.cell} ${styles.actions}`} role="cell">
                <Button size="small" variant="secondary">Ver más</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
};