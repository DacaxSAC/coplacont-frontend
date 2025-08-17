import React, { useMemo, useState, useEffect } from "react";
import styles from "./HomePurchasePage.module.scss";
import type { Transaction } from "../../services/types";
import { TransactionsService } from "../../services/TransactionsService";

import {
  Button,
  PageLayout,
  Text,
  Modal,
  Loader,
  ComboBox,
  Input,
  Divider,
} from "@/components";
import { Table, type TableRow } from "@/components/organisms/Table";
import {
  documentTypeOptions,
  filterTypeOptions,
  monthOptions,
  yearOptions,
} from "./HomePurchaseFilterData";
import { useNavigate } from "react-router-dom";
import { MAIN_ROUTES, TRANSACTIONS_ROUTES, COMMON_ROUTES } from "@/router";
import { usePurchasesTemplateDownload } from "../../hooks/usePurchasesTemplateDownload";

export const MainPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { downloadPurchasesTemplate } = usePurchasesTemplateDownload();

  // State for purchases
  const [purchases, setPurchases] = useState<Transaction[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Transaction[]>([]);

  // Fetch purchases on component mount
  useEffect(() => {
    setLoading(true);
    TransactionsService.getPurchases()
      .then((response) => {
        setPurchases(response);
        setFilteredPurchases(response); // Inicializar con todas las compras
        console.log(response);
      })
      .finally(() => setLoading(false));
  }, []);

  // Top filters
  const [filterType, setFilterType] = useState("mes-anio");
  const [month, setMonth] = useState("08");
  const [year, setYear] = useState("2025");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Secondary filters
  const [entity, setEntity] = useState("");
  const [documentType, setDocumentType] = useState("");

  // Modal state for upload purchases
  const [isUploadOpen, setUploadOpen] = useState(false);

  const handleRegisterPurchase = () => {
    navigate(
      `${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.PURCHASES}${COMMON_ROUTES.REGISTER}`
    );
  };

  const handleBulkRegister = () => {
    navigate(
      `${MAIN_ROUTES.TRANSACTIONS}${TRANSACTIONS_ROUTES.PURCHASES}${COMMON_ROUTES.BULK_REGISTER}`
    );
  };

  /**
   * Aplica todos los filtros disponibles (fecha, entidad, tipo de documento, estado SUNAT)
   */
  const applyAllFilters = () => {
    let filtered = [...purchases];

    // Aplicar filtros de fecha
    if (filterType === "mes-anio") {
      if (month && year) {
        filtered = filtered.filter((purchase) => {
          const emissionDate = new Date(purchase.fechaEmision);
          const purchaseMonth = String(emissionDate.getMonth() + 1).padStart(
            2,
            "0"
          );
          const purchaseYear = String(emissionDate.getFullYear());
          return purchaseMonth === month && purchaseYear === year;
        });
      }
    } else if (filterType === "rango-fechas") {
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        filtered = filtered.filter((purchase) => {
          const emissionDate = new Date(purchase.fechaEmision);
          return emissionDate >= start && emissionDate <= end;
        });
      }
    }

    // Aplicar filtro de entidad (búsqueda en correlativo como aproximación)
    if (entity) {
      filtered = filtered.filter((purchase) =>
        purchase.correlativo?.toLowerCase().includes(entity.toLowerCase()) ||
        purchase.serie?.toLowerCase().includes(entity.toLowerCase())
      );
    }

    // Aplicar filtro de tipo de documento
    if (documentType) {
      filtered = filtered.filter((purchase) => {
        const docTypeMap: { [key: string]: string } = {
          'factura': 'FACTURA',
          'boleta': 'BOLETA',
          'nota-credito': 'NOTA DE CREDITO',
          'nota-debito': 'NOTA DE DEBITO'
        };
        return purchase.tipoComprobante?.toUpperCase() === docTypeMap[documentType];
      });
    }

    setFilteredPurchases(filtered);
    console.log("Filtered purchases:", filtered);
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

  // Nota: La lógica de búsqueda secundaria se conectará con el servicio cuando esté disponible.

  // Transformar datos de compras filtradas en filas de tabla
  const rows = useMemo(
    () =>
      filteredPurchases.map(
        (purchase, idx) =>
          ({
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
              purchase.totales.totalGeneral.toString(),
            ],
          } as TableRow)
      ),
    [filteredPurchases]
  );

  // Cabeceras de la tabla basadas en la interfaz Transaction
  const headers = [
    "Correlativo",
    "Tipo Comprobante",
    "Serie",
    "Número",
    "Fecha Emisión",
    "Fecha Vencimiento",
    "Moneda",
    "Tipo Cambio",
    "Total General",
  ];

  const gridTemplate = "1fr 1.2fr 0.8fr 0.8fr 1fr 1fr 0.8fr 0.8fr 1fr";

  return (
    <PageLayout
      title="Compras"
      subtitle={`Muestra la lista de compras de ${month}/${year}.`}
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
        <Button size="medium" onClick={handleRegisterPurchase}>
          + Nueva compra
        </Button>
        <Button disabled={true} size="medium" onClick={() => setUploadOpen(true)}>
          ⇪ Subir compras
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

      {/* Modal Subir compras */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Subir compras"
        description="Sube un Excel y genera los registros de forma masiva."
      >
        <div>
          <div style={{ marginBottom: "16px" }}>
            -{" "}
            <Button variant="secondary">⬇️ Descargar plantilla de Excel</Button>
            +{" "}
            <Button variant="secondary" onClick={downloadPurchasesTemplate}>
              ⬇️ Descargar plantilla de Excel
            </Button>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <Text as="h3" size="md" weight={600}>
              Información a tener en cuenta
            </Text>
            <ul style={{ marginTop: "8px" }}>
              <li>
                Se proporciona un Excel de ejemplo para facilitar el registro.
              </li>
              <li>La cabecera (fila 1) no debe borrarse.</li>
              <li>Los registros deben ingresarse desde la fila 2.</li>
              <li>
                Las Notas de Crédito y Débito no se cargan automáticamente, se
                registran manualmente.
              </li>
              <li>Las fechas deben tener el formato DÍA/MES/AÑO.</li>
              <li>
                Los códigos con ceros a la izquierda (ej. 01, 02, 03) deben
                estar en formato TEXTO.
              </li>
              <li>
                El archivo Excel debe tener un máximo de 500 registros o filas.
              </li>
            </ul>
          </div>

          <div>
            <Text as="h3" size="md" weight={600}>
              Seleccionar archivo
            </Text>
            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "center",
                marginTop: "8px",
              }}
            >
              <input type="file" accept=".csv,.xlsx" />
              <Button onClick={handleBulkRegister}>Subir Excel</Button>
            </div>
          </div>
        </div>
      </Modal>
      {loading && <Loader text="Procesando..." />}
    </PageLayout>
  );
};
