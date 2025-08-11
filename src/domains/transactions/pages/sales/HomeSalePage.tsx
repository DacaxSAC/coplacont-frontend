import React, { useMemo, useState } from 'react';
import styles from './HomeSalePage.module.scss';

import { Button, PageLayout, FormField } from '@/components';
import { Table, type TableRow } from '@/components/organisms/Table';
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

  // Nota: La lógica de búsqueda secundaria se conectará con el servicio cuando esté disponible.

  // Dummy data para la tabla (placeholder)
  const rows = useMemo(() => Array.from({ length: 10 }, (_, idx) => ({
    id: idx + 1,
    cells: [
      'XXXXXXXXXXXXXX',
      'XXXXXXXX',
      'xxxxx@xxxxx.xxx',
      'XX-XXXX',
      'XXXXXXXXXX',
      'XXXXXX',
      'XXXXXXXX',
      '',
      ''
    ],
  } as TableRow)), []);

  const headers = [
    'XXXXXXXXXXXXXX',
    'XXXXXXXX',
    'XXXXXX@XXXXX.XXX',
    'XX-XXXX',
    'XXXXXXXXXX',
    'XXXXXX',
    'XXXXXXXX',
    '',
    ''
  ];

  const gridTemplate = '1.2fr 1fr 1.2fr 0.8fr 1fr 0.8fr 0.8fr 0.4fr 0.6fr';

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
      <Table headers={headers} rows={rows} gridTemplate={gridTemplate} />
    </PageLayout>
  );
};