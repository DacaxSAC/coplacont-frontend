import React, { useMemo, useState, useEffect } from 'react';
import styles from './HomePurchasePage.module.scss';
import type { Transaction } from '../../services/types';
import { TransactionsService } from '../../services/TransactionsService';

import { Button, PageLayout, FormField, Text, Modal } from '@/components';
import { Table, type TableRow } from '@/components/organisms/Table';
import {
  documentTypeOptions,
  filterTypeOptions,
  monthOptions,
  sunatStatusOptions,
  yearOptions,
} from './HomePurchaseFilterData';
import { useNavigate } from 'react-router-dom';
import { MAIN_ROUTES, TRANSACTIONS_ROUTES, COMMON_ROUTES } from '@/router';
import { usePurchasesTemplateDownload } from '../../hooks/usePurchasesTemplateDownload';

export const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const { downloadPurchasesTemplate } = usePurchasesTemplateDownload();

  // State for purchases
  const [purchases, setPurchases] = useState<Transaction[]>([]);

  // Fetch purchases on mount
  useEffect(() => {
    TransactionsService.getPurchases().then((response) => {setPurchases(response);console.log(response)});
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

  // Modal state for upload purchases
  const [isUploadOpen, setUploadOpen] = useState(false);

  const handleRegisterPurchase = () => {
    navigate(`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.PURCHASES}${COMMON_ROUTES.REGISTER}`);
  }

  const handleBulkRegister = () => {
    navigate(`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.PURCHASES}${COMMON_ROUTES.BULK_REGISTER}`);
  }

  const handleTopFilter = () => {
    // TODO: conectar con servicio de compras
    // Por ahora, solo mostramos en consola
    console.log({ filterType, month, year, startDate, endDate });
  };

  // Nota: La lógica de búsqueda secundaria se conectará con el servicio cuando esté disponible.

  // Transformar datos de compras reales en filas de tabla
  const rows = useMemo(() => purchases.map((purchase, idx) => ({
    id: idx + 1,
    cells: [
      purchase.correlativo,
      purchase.tipoComprobante,
      purchase.serie,
      purchase.numero,
      purchase.fechaEmision,
      purchase.fechaVencimiento,
      purchase.moneda,
      purchase.tipoCambio,
      purchase.totales.totalGeneral.toString()
    ],
  } as TableRow)), [purchases]);

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
      title="Compras"
      subtitle={`Muestra la lista de compras de AGOSTO 2025.`}
      className={styles.homePurchasePage}
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
        <Button size="large" onClick={handleRegisterPurchase}>+ Nueva compra</Button>
        <Button size="large" onClick={() => setUploadOpen(true)}>⇪ Subir compras</Button>
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

      {/* Modal Subir compras */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Subir compras"
        description="Sube un Excel y genera los registros de forma masiva."
      >
        <div>
          <div style={{ marginBottom: '16px' }}>
-            <Button variant="secondary">⬇️ Descargar plantilla de Excel</Button>
+            <Button variant="secondary" onClick={downloadPurchasesTemplate}>⬇️ Descargar plantilla de Excel</Button>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Text as="h3" size="md" weight={600}>Información a tener en cuenta</Text>
            <ul style={{ marginTop: '8px' }}>
              <li>Se proporciona un Excel de ejemplo para facilitar el registro.</li>
              <li>La cabecera (fila 1) no debe borrarse.</li>
              <li>Los registros deben ingresarse desde la fila 2.</li>
              <li>Las Notas de Crédito y Débito no se cargan automáticamente, se registran manualmente.</li>
              <li>Las fechas deben tener el formato DÍA/MES/AÑO.</li>
              <li>Los códigos con ceros a la izquierda (ej. 01, 02, 03) deben estar en formato TEXTO.</li>
              <li>El archivo Excel debe tener un máximo de 500 registros o filas.</li>
            </ul>
          </div>

          <div>
            <Text as="h3" size="md" weight={600}>Seleccionar archivo</Text>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '8px' }}>
              <input type="file" accept=".csv,.xlsx" />
              <Button onClick={handleBulkRegister}>Subir Excel</Button>
            </div>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
};