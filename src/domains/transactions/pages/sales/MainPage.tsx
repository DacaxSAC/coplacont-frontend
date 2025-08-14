import React, { useMemo, useState, useEffect } from 'react';
import styles from './MainPage.module.scss';
import type { Transaction } from '../../services/types';
import { TransactionsService } from '../../services/TransactionsService';

import { Button, PageLayout, FormField, Text } from '@/components';
import { Table, type TableRow } from '@/components/organisms/Table';
import {
  documentTypeOptions,
  filterTypeOptions,
  monthOptions,
  sunatStatusOptions,
  yearOptions,
} from './MainFilterData';
import { useNavigate } from 'react-router-dom';
import { MAIN_ROUTES, TRANSACTIONS_ROUTES, COMMON_ROUTES } from '@/router';
import { useSalesTemplateDownload } from '../../hooks/useSalesTemplateDownload';
import { BulkUploadModal } from '../../organisms/BulkUpdateModal';

export const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const { downloadSalesTemplate } = useSalesTemplateDownload();

  // State for sales data
  const [sales, setSales] = useState<Transaction[]>([]);

  // Effect to fetch sales data on component mount
  useEffect(() => {
    TransactionsService.getSales().then((response) => setSales(response));
  }, []);

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

  // Modal state for upload sales
  const [isUploadOpen, setUploadOpen] = useState(false);

  const handleRegisterSale = () => {
    navigate(`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.SALES}${COMMON_ROUTES.REGISTER}`);
  }

  const handleBulkRegister = () => {
    navigate(`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.SALES}${COMMON_ROUTES.BULK_REGISTER}`);
  }

  const handleTopFilter = () => {
    // TODO: conectar con servicio de ventas
    // Por ahora, solo mostramos en consola
    console.log({ filterType, month, year, startDate, endDate });
  };

  // Nota: La lógica de búsqueda secundaria se conectará con el servicio cuando esté disponible.

  // Transformar datos de ventas reales en filas de tabla
  const rows = useMemo(() => sales.map((sale, idx) => ({
    id: idx + 1,
    cells: [
      sale.correlativo,
      sale.tipoComprobante,
      sale.serie,
      sale.numero,
      sale.fechaEmision,
      sale.fechaVencimiento,
      sale.moneda,
      sale.tipoCambio,
      sale.totales?.totalGeneral.toString()
    ],
  } as TableRow)), [sales]);

  // Cabeceras de la tabla basadas en la interfaz Transaction
  const headers = [
    'Correlativo',
    'Tipo Comprobante',
    'Serie',
    'Número',
    'Fecha Emisión',
    'Fecha Vencimiento',
    'Moneda',
    'Tipo Cambio',
    'Total General'
  ];

  const gridTemplate = '1fr 1.2fr 0.8fr 0.8fr 1fr 1fr 0.8fr 0.8fr 1fr';

  return (
    <PageLayout
      title="Ventas"
      subtitle={`Muestra la lista de ventas de AGOSTO 2025.`}
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
        <Button size="large" onClick={handleRegisterSale}>+ Nueva venta</Button>
        <Button size="large" onClick={() => setUploadOpen(true)}>⇪ Subir ventas</Button>
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

      {/* Modal Subir ventas */}
      <BulkUploadModal
        show={isUploadOpen}
        setShow={setUploadOpen}
        onDownload={downloadSalesTemplate}
        onUpload={(file) => handleBulkRegister()}
      />
    </PageLayout>
  );
};