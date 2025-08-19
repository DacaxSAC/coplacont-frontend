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
import * as XLSX from 'xlsx';

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
          const productsResponse = await ProductService.getAll();
          setProducts(productsResponse);

          const warehousesResponse = await WarehouseService.getAll();
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
   * Exporta los datos del kardex a CSV
   */
  const handleExportToCSV = () => {
    if (!kardexResponse || !kardexData.length) {
      return;
    }

    // Crear contenido CSV
    const csvContent = generateKardexCSV(kardexResponse, kardexData, reportes);
    
    // Agregar BOM para UTF-8 para mejor compatibilidad con Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Generar nombre del archivo
    const producto = kardexResponse.producto || 'producto';
    const almacen = kardexResponse.almacen || 'almacen';
    const filename = `kardex_${producto.replace(/\s+/g, '_')}_${almacen.replace(/\s+/g, '_')}_${selectedYear}.csv`;
    
    downloadFile(blob, filename);
  };

  /**
   * Exporta los datos del kardex a Excel (.xlsx)
   */
  const handleExportToExcel = () => {
    if (!kardexResponse || !kardexData.length) {
      return;
    }

    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();

    // Crear hoja de resumen
    const summaryData = [
      ['REPORTE DE KARDEX'],
      [],
      ['Producto:', kardexResponse.producto],
      ['Almacén:', kardexResponse.almacen],
      ['Año:', selectedYear],
      ['Fecha de Generación:', new Date().toLocaleDateString()],
      [],
      ['RESUMEN'],
      ['Existencias finales', 'Costo unitario final', 'Costo total final', 'Costo de ventas total'],
       [
         reportes.cantidadActual.toString(),
         reportes.costoUnitarioFinal.toString(),
         reportes.costoTotalFinal.toString(),
         reportes.costoVentasTotal.toString()
       ]
    ];

    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Resumen');

    // Crear hoja de movimientos
    const movementsData = [
      ['MOVIMIENTOS'],
      [],
      ['Fecha', 'Tipo', 'Tipo de comprobante', 'Cod de comprobante', 'Cantidad', 'Costo Unitario', 'Costo Total', 'Saldo']
    ];

    // Agregar saldo inicial
     movementsData.push([
       '-',
       'Saldo inicial',
       '-',
       '-',
       reportes.inventarioInicialCantidad.toString(),
       (reportes.inventarioInicialCostoTotal / reportes.inventarioInicialCantidad).toString(),
       reportes.inventarioInicialCostoTotal.toString(),
       '-'
     ]);

    // Agregar movimientos con detalles expandidos
    let currentSaldo = parseFloat(reportes.inventarioInicialCantidad.toString());
    let currentCostoTotal = parseFloat(reportes.inventarioInicialCostoTotal.toString());

    kardexData.forEach(movement => {
      if (movement.tipo === 'Salida' && movement.detallesSalida && movement.detallesSalida.length > 0) {
        movement.detallesSalida.forEach(detalle => {
          const calculatedDetalleCostoTotal = detalle.costoTotalDeLote && detalle.costoTotalDeLote !== 0 
            ? detalle.costoTotalDeLote 
            : detalle.cantidad * detalle.costoUnitarioDeLote;
          
          currentSaldo -= detalle.cantidad;
          currentCostoTotal -= calculatedDetalleCostoTotal;
          
          movementsData.push([
             movement.fecha,
             movement.tipo,
             movement.tComprob,
             movement.nComprobante,
             detalle.cantidad.toString(),
             detalle.costoUnitarioDeLote.toString(),
             calculatedDetalleCostoTotal.toString(),
             currentSaldo.toString()
           ]);
        });
      } else {
        const calculatedCostoTotal = movement.costoTotal && movement.costoTotal !== 0 
          ? movement.costoTotal 
          : movement.cantidad * movement.costoUnitario;
        
        if (movement.tipo === 'Entrada') {
          currentSaldo += movement.cantidad;
          currentCostoTotal += calculatedCostoTotal;
        } else {
          currentSaldo -= movement.cantidad;
          currentCostoTotal -= calculatedCostoTotal;
        }
        
        movementsData.push([
           movement.fecha,
           movement.tipo,
           movement.tComprob,
           movement.nComprobante,
           movement.cantidad.toString(),
           movement.costoUnitario.toString(),
           calculatedCostoTotal.toString(),
           currentSaldo.toString()
         ]);
      }
    });

    const movementsWorksheet = XLSX.utils.aoa_to_sheet(movementsData);
    XLSX.utils.book_append_sheet(workbook, movementsWorksheet, 'Movimientos');

    // Generar nombre del archivo
    const producto = kardexResponse.producto || 'producto';
    const almacen = kardexResponse.almacen || 'almacen';
    const filename = `kardex_${producto.replace(/\s+/g, '_')}_${almacen.replace(/\s+/g, '_')}_${selectedYear}.xlsx`;

    // Escribir el archivo
    XLSX.writeFile(workbook, filename);
  };

  /**
   * Exporta los datos del kardex a PDF (usando ventana de impresión)
   */
  const handleExportToPDF = () => {
    if (!kardexResponse || !kardexData.length) {
      return;
    }

    // Crear contenido HTML para imprimir
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reporte de Kardex - ${kardexResponse.producto} - ${kardexResponse.almacen} - ${selectedYear}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; margin-bottom: 30px; }
          h2 { margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .info { margin-bottom: 20px; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>REPORTE DE KARDEX</h1>
        
        <div class="info">
          <p><strong>Producto:</strong> ${kardexResponse.producto}</p>
          <p><strong>Almacén:</strong> ${kardexResponse.almacen}</p>
          <p><strong>Año:</strong> ${selectedYear}</p>
          <p><strong>Fecha de Generación:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <h2>RESUMEN</h2>
        <table>
          <thead>
            <tr>
              <th>Existencias finales</th>
              <th>Costo unitario final</th>
              <th>Costo total final</th>
              <th>Costo de ventas total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${reportes.cantidadActual}</td>
              <td>${reportes.costoUnitarioFinal}</td>
              <td>${reportes.costoTotalFinal}</td>
              <td>${reportes.costoVentasTotal}</td>
            </tr>
          </tbody>
        </table>
        
        <h2>MOVIMIENTOS</h2>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Tipo de comprobante</th>
              <th>Cod de comprobante</th>
              <th>Cantidad</th>
              <th>Costo Unitario</th>
              <th>Costo Total</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>-</td>
              <td>Saldo inicial</td>
              <td>-</td>
              <td>-</td>
              <td>${reportes.inventarioInicialCantidad}</td>
              <td>${(reportes.inventarioInicialCostoTotal / reportes.inventarioInicialCantidad).toFixed(2)}</td>
              <td>${reportes.inventarioInicialCostoTotal}</td>
              <td>-</td>
            </tr>
            ${generateTableRows().slice(1).map(row => `
            <tr>
              ${row.cells.map(cell => `<td>${cell}</td>`).join('')}
            </tr>`).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Abrir nueva ventana e imprimir
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
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
      title="Kardex (Método de valuación FIFO)"
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

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.25rem'}}>
              <Button
                size="small"
                variant="primary"
                onClick={handleExportToCSV}
                disabled={!kardexData || kardexData.length === 0}
              >
                Exportar como CSV
              </Button>
              <Button
                size="small"
                variant="primary"
                onClick={handleExportToExcel}
                disabled={!kardexData || kardexData.length === 0}
              >
                Exportar como Excel
              </Button>

              <Button
                size="small"
                variant="primary"
                onClick={handleExportToPDF}
                disabled={!kardexData || kardexData.length === 0}
              >
                Exportar como PDF
              </Button>
            </div>
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
