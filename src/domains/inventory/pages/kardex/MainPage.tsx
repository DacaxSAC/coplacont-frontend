import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./MainPage.module.scss";
import { PageLayout, Table, ComboBox, Text } from "@/components";
import { InventoryService } from "../../services/InventoryService";
import { ProductService } from "@/domains/maintainers/services";
import { WarehouseService } from "@/domains/maintainers/services";
import type { KardexMovement } from "../../services/types";
import type { Product, Warehouse } from "@/domains/maintainers/types";

export const MainPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("");
  const [kardexData, setKardexData] = useState<KardexMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [reportes,setReportes]= useState({
    cantidadActual:0,
    costoUnitarioFinal:0,
    costoTotalFinal:0,
    costoVentasTotal:0,
  })

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

          // Si hay un productId en la URL, seleccionarlo automáticamente
          const productIdFromUrl = searchParams.get("productId");
          if (productIdFromUrl) {
            setSelectedProductId(productIdFromUrl);
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
   */
  const getCostoVentasTotal = (kardexData: KardexMovement[]) =>{
    let costoTotal = 0;
    kardexData.forEach((movement) => {
      if (movement.tipo === "Salida") {
        costoTotal +=movement.costoTotal;
        console.log(costoTotal);
      }
    });
    return costoTotal;
  }

  /**
   * Carga el kardex directamente usando un ID de inventario
   */
  const fetchKardexByInventoryId = async (inventoryId: number) => {
    try {
      setLoading(true);
      setError("");
      
      const kardexResponse = await InventoryService.getKardexMovements(
        inventoryId,
        "2025-01-01",
        "2025-12-31"
      );
      
      setKardexData(kardexResponse.movimientos);
      setReportes({
        cantidadActual: parseFloat(kardexResponse.saldoActual),
        costoUnitarioFinal: (parseFloat(kardexResponse.costoFinal) / parseFloat(kardexResponse.saldoActual)),
        costoTotalFinal: parseFloat(kardexResponse.costoFinal),
        costoVentasTotal: getCostoVentasTotal(kardexResponse.movimientos),
      });
      
      console.log(kardexResponse.movimientos);
    } catch (error) {
      console.error("Error fetching kardex by inventory ID:", error);
      setError("Error al cargar los movimientos de kardex");
      setKardexData([]);
    } finally {
      setLoading(false);
    }
  }

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
          "2025-01-01",
          "2025-12-31"
        );
        setKardexData(kardexResponse.movimientos);
        setReportes(
          {
            cantidadActual:parseFloat(kardexResponse.saldoActual),
            costoUnitarioFinal:(parseFloat(kardexResponse.costoFinal)/parseFloat(kardexResponse.saldoActual)),
            costoTotalFinal:parseFloat(kardexResponse.costoFinal),
            costoVentasTotal:getCostoVentasTotal(kardexResponse.movimientos),
          }
        )
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
  }, [selectedProductId, selectedWarehouseId]);

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
    "Saldo",
    "Costo Total",
  ];

  const rows =
    kardexData.map((movement, index) => ({
      id: index.toString(),
      cells: [
        movement.fecha,
        movement.tipo,
        movement.tComprob,
        movement.nComprobante,
        movement.cantidad,

        movement.costoUnitario,
        movement.saldo,
        movement.costoTotal,
      ],
    })) || [];

  const reporterHeaders = [
    "Existencias finales",
    "Costo unitario final",
    "Costo total final",
    "Costo de ventas total",
  ]

  const reporterRows = [
    {
      id: "reporter-row",
      cells: [
        reportes.cantidadActual,
        reportes.costoUnitarioFinal,
        reportes.costoTotalFinal,
        reportes.costoVentasTotal,
      ]
    }
  ]

  const gridTemplate = "1.5fr 1.5fr 1.5fr 1.5fr 1fr 1fr 1fr 1fr";
  const reporterGridTemplate = "1.5fr 1.5fr 1.5fr 1.5fr";

  // Verificar si hay inventoryId en la URL para ocultar filtros
  const inventoryIdFromUrl = searchParams.get("inventoryId");
  const isDirectLoad = !!inventoryIdFromUrl;

  return (
    <PageLayout
      title="Kardex"
      subtitle="Muestra el detalle de movimientos y saldos del producto seleccionado."
    >
      <section className={styles.MainPage}>
        {!isDirectLoad && (
          <div className={styles.MainPage__FilterContainer}>
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
          </div>
        )}

        {error && (
          <div className={styles.MainPage__Error}>
            <Text size="xs" color="danger">
              {error}
            </Text>
          </div>
        )}
        <div>
          <Table
            headers={reporterHeaders}
            rows={reporterRows}
            gridTemplate={reporterGridTemplate}
          />
        </div>
      </section>

      {loading ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <Text size="sm" color="neutral-primary">
            Cargando movimientos de kardex...
          </Text>
        </div>
      )  : (
        <Table headers={headers} rows={rows} gridTemplate={gridTemplate} />
      )}
    </PageLayout>
  );
};
