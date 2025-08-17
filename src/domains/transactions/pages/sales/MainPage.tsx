import React, { useMemo, useState, useEffect } from 'react';
import styles from './MainPage.module.scss';
import type { Transaction } from '../../services/types';
import { TransactionsService } from '../../services/TransactionsService';

import {
  Button,
  PageLayout,
  Text,
  Modal,
  Loader,
  ComboBox,
  Input,
  Divider,
} from '@/components';
import { Table, type TableRow } from '@/components/organisms/Table';
import {
  documentTypeOptions,
  filterTypeOptions,
  monthOptions,
  yearOptions,
} from './MainFilterData';
import { useNavigate } from 'react-router-dom';
import { MAIN_ROUTES, TRANSACTIONS_ROUTES, COMMON_ROUTES } from '@/router';

export const MainPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // State for sales data
  const [sales, setSales] = useState<Transaction[]>([]);
  const [filteredSales, setFilteredSales] = useState<Transaction[]>([]);

  // Effect to fetch sales data on component mount
  useEffect(() => {
    setLoading(true);
    TransactionsService.getSales()
      .then((response) => {
        setSales(response);
        setFilteredSales(response); // Inicializar con todas las ventas
        console.log(response);
      })
      .finally(() => setLoading(false));
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

  // Modal state for upload sales
  const [isUploadOpen, setUploadOpen] = useState(false);

  const handleRegisterSale = () => {
    navigate(`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.SALES}${COMMON_ROUTES.REGISTER}`);
  }

  //const handleBulkRegister = () => {
  //  navigate(`${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.SALES}${COMMON_ROUTES.BULK_REGISTER}`);
  //}

  /**
   * Aplica todos los filtros disponibles (fecha, entidad, tipo de documento)
   */
  const applyAllFilters = () => {
    let filtered = [...sales];

    // Aplicar filtros de fecha
    if (filterType === "mes-anio") {
      if (month && year) {
        filtered = filtered.filter((sale) => {
          const emissionDate = new Date(sale.fechaEmision);
          const saleMonth = String(emissionDate.getMonth() + 1).padStart(
            2,
            "0"
          );
          const saleYear = String(emissionDate.getFullYear());
          return saleMonth === month && saleYear === year;
        });
      }
    } else if (filterType === "rango-fechas") {
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        filtered = filtered.filter((sale) => {
          const emissionDate = new Date(sale.fechaEmision);
          return emissionDate >= start && emissionDate <= end;
        });
      }
    }

    // Aplicar filtro de entidad (búsqueda en correlativo como aproximación)
    if (entity) {
      filtered = filtered.filter((sale) =>
        sale.correlativo?.toLowerCase().includes(entity.toLowerCase()) ||
        sale.serie?.toLowerCase().includes(entity.toLowerCase())
      );
    }

    // Aplicar filtro de tipo de documento
    if (documentType) {
      filtered = filtered.filter((sale) => {
        const docTypeMap: { [key: string]: string } = {
          'factura': 'FACTURA',
          'boleta': 'BOLETA',
          'nota-credito': 'NOTA DE CREDITO',
          'nota-debito': 'NOTA DE DEBITO'
        };
        return sale.tipoComprobante?.toUpperCase() === docTypeMap[documentType];
      });
    }

    setFilteredSales(filtered);
    console.log("Filtered sales:", filtered);
  };

  /**
   * Maneja el filtrado desde la barra superior
   */
  const handleTopFilter = () => {
    applyAllFilters();
  };

  /**
   * Maneja el filtrado desde los filtros secundarios
   */
  const handleSecondaryFilter = () => {
    applyAllFilters();
  };

  // Transformar datos de ventas filtradas en filas de tabla
  const rows = useMemo(
    () =>
      filteredSales.map(
        (sale, idx) =>
          ({
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
              sale.totales?.totalGeneral.toString(),
            ],
          } as TableRow)
      ),
    [filteredSales]
  );

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
        <div className={styles.filter}>
          <Text size="xs" color="neutral-primary">
            Tipo de filtro
          </Text>
          <ComboBox
            options={filterTypeOptions}
            size="xs"
            variant="createSale"
            value={filterType}
            onChange={(v) => setFilterType(v as string)}
            placeholder="Seleccionar"
          />
        </div>

        {/* Filtros condicionales según el tipo seleccionado */}
        {filterType === "mes-anio" && (
          <>
            <div className={styles.filter}>
              <Text size="xs" color="neutral-primary">
                Año
              </Text>
              <ComboBox
                options={yearOptions}
                size="xs"
                variant="createSale"
                value={year}
                onChange={(v) => setYear(v as string)}
                placeholder="Seleccionar año"
              />
            </div>

            <div className={styles.filter}>
              <Text size="xs" color="neutral-primary">
                Mes
              </Text>
              <ComboBox
                options={monthOptions}
                size="xs"
                variant="createSale"
                value={month}
                onChange={(v) => setMonth(v as string)}
                placeholder="Seleccionar mes"
              />
            </div>
          </>
        )}

        {filterType === "rango-fechas" && (
          <>
            <div className={styles.filter}>
              <Text size="xs" color="neutral-primary">
                Desde
              </Text>
              <Input
                type="date"
                size="xs"
                variant="createSale"
                value={startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setStartDate(e.target.value)
                }
                placeholder="Seleccionar"
              />
            </div>
            <div className={styles.filter}>
              <Text size="xs" color="neutral-primary">
                Hasta
              </Text>
              <Input
                type="date"
                size="xs"
                variant="createSale"
                value={endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEndDate(e.target.value)
                }
                placeholder="Seleccionar"
              />
            </div>
          </>
        )}
        <Button size="small" onClick={handleTopFilter}>
          Filtrar
        </Button>
      </section>

      <Divider />

      {/* Botones de acciones */}
      <section className={styles.actionsRow}>
        <Button size="medium" onClick={handleRegisterSale}>
          + Nueva venta
        </Button>
        <Button disabled={true} size="medium" onClick={() => setUploadOpen(true)}>
          ⇪ Subir ventas
        </Button>
      </section>

      <Divider />

      {/* Barra de búsqueda secundaria */}
      <section className={styles.filtersSecondary}>
        <div className={styles.filter}>
          <Text size="xs" color="neutral-primary">
            Serie y número
          </Text>
          <Input
            type="text"
            size="xs"
            variant="createSale"
            value={entity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEntity(e.target.value)
            }
            placeholder="Buscar por correlativo o serie"
          />
        </div>
        <div className={styles.filter}>
          <Text size="xs" color="neutral-primary">
            Tipo de comprobante
          </Text>
          <ComboBox
            options={documentTypeOptions}
            size="xs"
            variant="createSale"
            value={documentType}
            onChange={(v) => setDocumentType(v as string)}
            placeholder="Seleccionar"
          />
        </div>

        <Button size="small" onClick={handleSecondaryFilter}>
          Filtrar búsqueda
        </Button>
      </section>

      <Divider />

      {/* Tabla de resultados */}
      <Table headers={headers} rows={rows} gridTemplate={gridTemplate} />

      {/* Modal Subir ventas */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Subir ventas"
      >
        <Text size="sm" color="neutral-primary">
          Funcionalidad de carga masiva en desarrollo.
        </Text>
      </Modal>
      {loading && <Loader text="Procesando..." />}
    </PageLayout>
  );
};