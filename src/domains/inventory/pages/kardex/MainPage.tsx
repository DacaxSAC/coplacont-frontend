import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./MainPage.module.scss";
import {
  PageLayout,
  Table,
  ComboBox,
  Text,
  Divider,
  Button,
  MovimientoTag
} from "@/components";
import { InventoryService } from "../../services/InventoryService";
import { ProductService } from "@/domains/maintainers/services";
import { WarehouseService } from "@/domains/maintainers/services";
import type { KardexMovement } from "../../services/types";
import type { Product, Warehouse } from "@/domains/maintainers/types";
import { downloadFile } from "@/shared/utils/downloadUtils";

export const MainPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [kardexData, setKardexData] = useState<KardexMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [kardexResponse, setKardexResponse] = useState<any>(null);

  const [reportes, setReportes] = useState({
    cantidadActual: 0,
    costoUnitarioFinal: 0,
    costoTotalFinal: 0,
    costoVentasTotal: 0,
    inventarioInicialCantidad: 0,
    inventarioInicialCostoTotal: 0,
  });

  // Cargar productos y almacenes al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Verificar si hay un inventoryId en la URL para carga directa
        const inventoryIdFromUrl = searchParams.get("inventoryId");

        if (inventoryIdFromUrl) {
          // Si hay inventoryId, cargar directamente el kardex
          await fetchKardexByInventoryId(parseInt(inventoryIdFromUrl));
        } else {
          // Flujo normal: cargar productos y almacenes
          const productsResponse = await ProductService.getAll(true);
          setProducts(productsResponse);

          const warehousesResponse = await WarehouseService.getAll(true);
          setWarehouses(warehousesResponse);

          // Si hay parámetros en la URL, seleccionarlos automáticamente
          const productIdFromUrl = searchParams.get("productId");
          const yearFromUrl = searchParams.get("year");
          if (productIdFromUrl) {
            setSelectedProductId(productIdFromUrl);
          }
          if (yearFromUrl) {
            setSelectedYear(yearFromUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error al cargar los datos");
      }
    };

    fetchData();
  }, [searchParams]);

  /**
   * Calcula el costo total de ventas sumando todos los movimientos de salida
   * Considera los detalles de salida cuando están disponibles
   */
  const getCostoVentasTotal = (kardexData: KardexMovement[]) => {
    let costoTotal = 0;
    kardexData.forEach((movement) => {
      if (movement.tipo === "Salida") {
        if (movement.detallesSalida && movement.detallesSalida.length > 0) {
          movement.detallesSalida.forEach((detalle) => {
            const calculatedDetalleCostoTotal = detalle.costoTotalDeLote && detalle.costoTotalDeLote !== 0 
              ? detalle.costoTotalDeLote 
              : detalle.cantidad * detalle.costoUnitarioDeLote;
            costoTotal += calculatedDetalleCostoTotal;
          });
        } else {
          const calculatedCostoTotal = movement.costoTotal && movement.costoTotal !== 0 
            ? movement.costoTotal 
            : movement.cantidad * movement.costoUnitario;
          costoTotal += calculatedCostoTotal;
        }
      }
    });
    return costoTotal;
  };

  /**
   * Carga el kardex directamente usando un ID de inventario
   */
  const fetchKardexByInventoryId = async (inventoryId: number) => {
    try {
      setLoading(true);
      setError("");

      const kardexResponse = await InventoryService.getKardexMovements(
        inventoryId,
        `${selectedYear}-01-01`,
        `${selectedYear}-12-31`
      );

      setKardexData(kardexResponse.movimientos);
      setKardexResponse(kardexResponse);
      setReportes({
        cantidadActual: parseFloat(kardexResponse.saldoActual),
        costoUnitarioFinal:
          parseFloat(kardexResponse.costoFinal) /
          parseFloat(kardexResponse.saldoActual),
        costoTotalFinal: parseFloat(kardexResponse.costoFinal),
        costoVentasTotal: getCostoVentasTotal(kardexResponse.movimientos),
        inventarioInicialCantidad: parseFloat(
          kardexResponse.inventarioInicialCantidad
        ),
        inventarioInicialCostoTotal: parseFloat(
          kardexResponse.inventarioInicialCostoTotal
        ),
      });
      console.log('Kardex movements:', kardexResponse.movimientos);
      // Debug: revisar valores específicos de los movimientos
      kardexResponse.movimientos.forEach((mov, index) => {
        console.log(`Movimiento ${index}:`, {
          fecha: mov.fecha,
          tipo: mov.tipo,
          cantidad: mov.cantidad,
          costoUnitario: mov.costoUnitario,
          costoTotal: mov.costoTotal,
          calculado: mov.cantidad * mov.costoUnitario
        });
      });
    } catch (error) {
      console.error("Error fetching kardex by inventory ID:", error);
      setError("Error al cargar los movimientos de kardex");
      setKardexData([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar movimientos de kardex cuando se seleccionen producto y almacén
  useEffect(() => {
    const fetchKardexMovements = async () => {
      // Solo cargar si ambos están seleccionados
      if (!selectedProductId || !selectedWarehouseId) {
        setKardexData([]);
        setReportes({
          cantidadActual: 0,
          costoUnitarioFinal: 0,
          costoTotalFinal: 0,
          costoVentasTotal: 0,
          inventarioInicialCantidad: 0,
          inventarioInicialCostoTotal: 0,
        });
        return;
      }

      try {
        setLoading(true);
        setError("");
        const inventario =
          await InventoryService.getInventoryByWarehouseAndProduct(
            parseInt(selectedWarehouseId),
            parseInt(selectedProductId)
          );
        const kardexResponse = await InventoryService.getKardexMovements(
          parseInt(inventario.id),
          `${selectedYear}-01-01`,
          `${selectedYear}-12-31`
        );
        setKardexData(kardexResponse.movimientos);
        setKardexResponse(kardexResponse);
        setReportes({
          cantidadActual: parseFloat(kardexResponse.saldoActual),
          costoUnitarioFinal:
            parseFloat(kardexResponse.costoFinal) /
            parseFloat(kardexResponse.saldoActual),
          costoTotalFinal: parseFloat(kardexResponse.costoFinal),
          costoVentasTotal: getCostoVentasTotal(kardexResponse.movimientos),
          inventarioInicialCantidad: parseFloat(
            kardexResponse.inventarioInicialCantidad
          ),
          inventarioInicialCostoTotal: parseFloat(
            kardexResponse.inventarioInicialCostoTotal
          ),
        });
        console.log(kardexResponse.movimientos);
      } catch (error) {
        console.error("Error fetching kardex movements:", error);
        setError("Error al cargar los movimientos de kardex");
        setKardexData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKardexMovements();
  }, [selectedProductId, selectedWarehouseId, selectedYear]);

  // Efecto para recargar kardex cuando cambia el año en modo directo
  useEffect(() => {
    const inventoryIdFromUrl = searchParams.get("inventoryId");
    if (inventoryIdFromUrl) {
      fetchKardexByInventoryId(parseInt(inventoryIdFromUrl));
    }
  }, [selectedYear]);

  // Generar opciones de años (últimos 10 años)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear - i;
    return {
      label: year.toString(),
      value: year.toString(),
    };
  });

  // Opciones para el ComboBox de productos
  const productOptions = [
    { label: "Seleccionar producto", value: "" },
    ...products.map((product) => ({
      label: `${product.codigo} - ${product.nombre}`,
      value: product.id.toString(),
    })),
  ];

  // Opciones para el ComboBox de almacenes
  const warehouseOptions = [
    { label: "Seleccionar almacén", value: "" },
    ...warehouses.map((warehouse) => ({
      label: `${warehouse.id} - ${warehouse.nombre}`,
      value: warehouse.id.toString(),
    })),
  ];

  const headers = [
    "Fecha",
    "Tipo",
    "Tipo de comprobante",
    "Cod de comprobante",
    "Cantidad",
    "Costo Unitario",
    "Costo Total",
    "Saldo",
  ];

  /**
   * Formatea un número para mostrar en la tabla
   */
  const formatNumber = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    const result = isNaN(num) ? '0.00' : num.toFixed(2);
    // Debug: logging del formateo
    if (value === 22.5 || num === 22.5) {
      console.log('FormatNumber debug:', { input: value, num, result });
    }
    return result;
  };

  /**
   * Genera las filas de la tabla expandiendo movimientos de salida con detalles
   */
  const generateTableRows = () => {
    const tableRows = [];
    let currentSaldo = parseFloat(reportes.inventarioInicialCantidad.toString());
    let currentCostoTotal = parseFloat(reportes.inventarioInicialCostoTotal.toString());

    // Fila inicial de saldo
    tableRows.push({
      id: "manual-header",
      cells: [
        "-",
        "Saldo inicial",
        "-",
        "-",
        formatNumber(reportes.inventarioInicialCantidad),
        formatNumber(reportes.inventarioInicialCostoTotal / reportes.inventarioInicialCantidad),
        formatNumber(reportes.inventarioInicialCostoTotal),
        "-",
      ],
    });

    kardexData.forEach((movement, index) => {
      if (movement.tipo === 'Salida' && movement.detallesSalida && movement.detallesSalida.length > 0) {
        // Para movimientos de salida con detalles, crear una fila por cada detalle
        movement.detallesSalida.forEach((detalle, detalleIndex) => {
          // Calcular costoTotal del detalle si es 0 o undefined
          const calculatedDetalleCostoTotal = detalle.costoTotalDeLote && detalle.costoTotalDeLote !== 0 
            ? detalle.costoTotalDeLote 
            : detalle.cantidad * detalle.costoUnitarioDeLote;
          
          // Calcular nuevo saldo después de este detalle
          currentSaldo -= detalle.cantidad;
          currentCostoTotal -= calculatedDetalleCostoTotal;

          tableRows.push({
            id: `${index}-detalle-${detalleIndex}`,
            cells: [
              movement.fecha,
              <MovimientoTag movimiento="Salida" />,
              movement.tComprob,
              movement.nComprobante,
              formatNumber(detalle.cantidad),
              formatNumber(detalle.costoUnitarioDeLote),
              formatNumber(calculatedDetalleCostoTotal),
              formatNumber(currentSaldo),
            ],
          });
        });
      } else {
        // Para movimientos sin detalles (entradas o salidas simples)
        // Calcular costoTotal si es 0 o undefined
        const calculatedCostoTotal = movement.costoTotal && movement.costoTotal !== 0 
          ? movement.costoTotal 
          : movement.cantidad * movement.costoUnitario;
        
        // Debug: mostrar el cálculo
        console.log(`Movimiento ${movement.fecha}:`, {
          costoTotalOriginal: movement.costoTotal,
          cantidad: movement.cantidad,
          costoUnitario: movement.costoUnitario,
          calculatedCostoTotal: calculatedCostoTotal
        });

        if (movement.tipo === 'Entrada') {
          currentSaldo += movement.cantidad;
          currentCostoTotal += calculatedCostoTotal;
        } else {
          currentSaldo -= movement.cantidad;
          currentCostoTotal -= calculatedCostoTotal;
        }

        tableRows.push({
          id: index.toString(),
          cells: [
            movement.fecha,
            <MovimientoTag movimiento={movement.tipo === 'Entrada' ? 'Entrada' : 'Salida'} />,
            movement.tComprob,
            movement.nComprobante,
            formatNumber(movement.cantidad),
            formatNumber(movement.costoUnitario),
            formatNumber(calculatedCostoTotal),
            formatNumber(currentSaldo),
          ],
        });
      }
    });

    return tableRows;
  };

  const rows = generateTableRows();

  const reporterHeaders = [
    "Existencias finales",
    "Costo unitario final",
    "Costo total final",
    "Costo de ventas total",
  ];

  const reporterRows = [
    {
      id: "reporter-row",
      cells: [
        reportes.cantidadActual,
        reportes.costoUnitarioFinal,
        reportes.costoTotalFinal,
        reportes.costoVentasTotal,
      ],
    },
  ];

  const gridTemplate = "1fr 1.5fr 1.5fr 1.5fr 1fr 1fr 1fr 1fr";
  const reporterGridTemplate = "1.5fr 1.5fr 1.5fr 1.5fr";

  /**
   * Exporta los datos del kardex a Excel
   */
  const handleExportToExcel = () => {
    if (!kardexResponse || !kardexData.length) {
      return;
    }

    // Crear contenido CSV
    const csvContent = generateKardexCSV(kardexResponse, kardexData, reportes);
    
    // Agregar BOM para UTF-8 para mejor compatibilidad con Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Generar nombre del archivo
    const filename = `kardex_${kardexResponse.producto.replace(/\s+/g, '_')}_${kardexResponse.almacen.replace(/\s+/g, '_')}_${selectedYear}.csv`;
    
    downloadFile(blob, filename);
  };

  /**
   * Genera el contenido CSV para el kardex incluyendo detalles de salida expandidos
   */
  const generateKardexCSV = (response: any, movements: KardexMovement[], reportData: any) => {
    let csv = '';
    let currentSaldo = parseFloat(reportData.inventarioInicialCantidad.toString());
    
    // Información del reporte
    csv += `Reporte de Kardex\n`;
    csv += `Producto:,${response.producto}\n`;
    csv += `Almacén:,${response.almacen}\n`;
    csv += `Año:,${selectedYear}\n`;
    csv += `Fecha de generación:,${new Date().toLocaleDateString()}\n\n`;
    
    // Resumen
    csv += `RESUMEN\n`;
    csv += `Existencias finales,Costo unitario final,Costo total final,Costo de ventas total\n`;
    csv += `${reportData.cantidadActual},${reportData.costoUnitarioFinal},${reportData.costoTotalFinal},${reportData.costoVentasTotal}\n\n`;
    
    // Movimientos
    csv += `MOVIMIENTOS\n`;
    csv += `Fecha,Tipo,Tipo de comprobante,Cod de comprobante,Cantidad,Costo Unitario,Costo Total,Saldo\n`;
    
    // Saldo inicial
    csv += `-,Saldo inicial,-,-,${reportData.inventarioInicialCantidad},${reportData.inventarioInicialCostoTotal / reportData.inventarioInicialCantidad},${reportData.inventarioInicialCostoTotal},-\n`;
    
    // Movimientos con detalles expandidos
    movements.forEach(movement => {
      if (movement.tipo === 'Salida' && movement.detallesSalida && movement.detallesSalida.length > 0) {
        // Para movimientos de salida con detalles, crear una fila por cada detalle
        movement.detallesSalida.forEach((detalle) => {
          // Calcular costoTotal del detalle si es 0 o undefined
          const calculatedDetalleCostoTotal = detalle.costoTotalDeLote && detalle.costoTotalDeLote !== 0 
            ? detalle.costoTotalDeLote 
            : detalle.cantidad * detalle.costoUnitarioDeLote;
          
          currentSaldo -= detalle.cantidad;
          csv += `${movement.fecha},${movement.tipo},${movement.tComprob},${movement.nComprobante},${detalle.cantidad},${detalle.costoUnitarioDeLote},${calculatedDetalleCostoTotal},${currentSaldo}\n`;
        });
      } else {
        // Para movimientos sin detalles (entradas o salidas simples)
        // Calcular costoTotal si es 0 o undefined
        const calculatedCostoTotal = movement.costoTotal && movement.costoTotal !== 0 
          ? movement.costoTotal 
          : movement.cantidad * movement.costoUnitario;

        if (movement.tipo === 'Entrada') {
          currentSaldo += movement.cantidad;
        } else {
          currentSaldo -= movement.cantidad;
        }
        csv += `${movement.fecha},${movement.tipo},${movement.tComprob},${movement.nComprobante},${movement.cantidad},${movement.costoUnitario},${calculatedCostoTotal},${currentSaldo}\n`;
      }
    });
    
    return csv;
  };

  // Verificar si hay inventoryId en la URL para ocultar filtros
  const inventoryIdFromUrl = searchParams.get("inventoryId");
  const isDirectLoad = !!inventoryIdFromUrl;

  return (
    <PageLayout
      title="Kardex"
      subtitle="Muestra el detalle de movimientos y saldos del producto seleccionado."
    >
      <section className={styles.MainPage}>
          <div className={styles.MainPage__FilterContainer}>
            <div className={styles.MainPage__Filter}>
              <Text size="xs" color="neutral-primary">
                Año
              </Text>
              <ComboBox
                options={yearOptions}
                size="xs"
                variant="createSale"
                value={selectedYear}
                onChange={(v) => setSelectedYear(v as string)}
                placeholder="Seleccionar año"
              />
            </div>
            {!isDirectLoad && (
              <>
                <div className={styles.MainPage__Filter}>
                  <Text size="xs" color="neutral-primary">
                    Almacen
                  </Text>
                  <ComboBox
                    options={warehouseOptions}
                    size="xs"
                    variant="createSale"
                    value={selectedWarehouseId}
                    onChange={(v) => setSelectedWarehouseId(v as string)}
                    placeholder="Seleccionar almacen"
                  />
                </div>
                <div className={styles.MainPage__Filter}>
                  <Text size="xs" color="neutral-primary">
                    Producto
                  </Text>
                  <ComboBox
                    options={productOptions}
                    size="xs"
                    variant="createSale"
                    value={selectedProductId}
                    onChange={(v) => setSelectedProductId(v as string)}
                    placeholder="Seleccionar producto"
                  />
                </div>
              </>
            )}
          </div>

        <Divider />
        {kardexData.length > 0 && kardexResponse && (
           <div className={styles.MainPage__ReportInfo}>
             <div>
                <Text size="sm" color="neutral-primary">
                  Reporte para: {kardexResponse.producto} -{" "}
                  {kardexResponse.almacen} - Año {selectedYear}
                </Text>
                <Text size="xs" color="neutral-secondary">
                  Generado el:{" "}
                  {new Date().toLocaleDateString()}
                </Text>
              </div>

             <Button
               size="small"
               variant="primary"
               onClick={handleExportToExcel}
               disabled={!kardexData || kardexData.length === 0}
             >
               Exportar como Excel
             </Button>
           </div>
         )}

        {error && (
          <div className={styles.MainPage__Error}>
            <Text size="xs" color="danger">
              {error}
            </Text>
          </div>
        )}

        <Table
          headers={reporterHeaders}
          rows={reporterRows}
          gridTemplate={reporterGridTemplate}
        />
      </section>

      <Divider />

      {loading ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <Text size="sm" color="neutral-primary">
            Cargando movimientos de kardex...
          </Text>
        </div>
      ) : (
        <Table headers={headers} rows={rows} gridTemplate={gridTemplate} />
      )}
    </PageLayout>
  );
};
