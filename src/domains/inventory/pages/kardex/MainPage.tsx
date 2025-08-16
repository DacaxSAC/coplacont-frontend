import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from './MainPage.module.scss';
import { PageLayout, Button, Table, ComboBox, Text } from "@/components";
import { InventoryService } from "../../services/InventoryService";
import { ProductService } from "@/domains/maintainers/services";
import type { KardexMovement } from "../../services/types";
import type { Product } from "@/domains/maintainers/types";

export const MainPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [kardexMovements, setKardexMovements] = useState<KardexMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Cargar productos al montar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductService.getAll();
        setProducts(response);
        
        // Si hay un productId en la URL, seleccionarlo automáticamente
        const productIdFromUrl = searchParams.get('productId');
        if (productIdFromUrl) {
          setSelectedProductId(productIdFromUrl);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Error al cargar los productos");
      }
    };

    fetchProducts();
  }, [searchParams]);

  // Cargar movimientos de kardex cuando se selecciona un producto
  useEffect(() => {
    const fetchKardexMovements = async () => {
      if (!selectedProductId) {
        setKardexMovements([]);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const movements = await InventoryService.getKardexMovements(parseInt(selectedProductId));
        setKardexMovements(movements);
      } catch (error) {
        console.error("Error fetching kardex movements:", error);
        setError("Error al cargar los movimientos de kardex");
        setKardexMovements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKardexMovements();
  }, [selectedProductId]);

  // Opciones para el ComboBox de productos
  const productOptions = [
    { label: "Seleccionar producto", value: "" },
    ...products.map((product) => ({
      label: `${product.codigo} - ${product.descripcion}`,
      value: product.id.toString()
    }))
  ];

  const headers = [
    "Fecha",
    "Tipo",
    "Tipo de comprobante",
    "Cod de comprobante",
    "Cantidad",
    "Saldo",
    "Costo Unitario",
    "Costo Total",
  ];

  const rows = kardexMovements.map((movement) => ({
    id: movement.id,
    cells: [
      movement.fecha,
      movement.tipo,
      movement.tipoComprobante,
      movement.codigoComprobante,
      movement.cantidad,
      movement.saldo,
      movement.costoUnitario,
      movement.costoTotal,
    ],
  }));

  const gridTemplate = "1.5fr 1.5fr 1.5fr 1.5fr 1fr 1fr 1fr 1fr";

  return (
    <PageLayout
      title="Kardex"
      subtitle="Muestra el detalle de movimientos y saldos del producto seleccionado."
    >
      <section className={styles.MainPage}>
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
        {error && (
          <div className={styles.MainPage__Error}>
            <Text size="xs" color="danger">
              {error}
            </Text>
          </div>
        )}
      </section>
      
      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Text size="sm" color="neutral-primary">
            Cargando movimientos de kardex...
          </Text>
        </div>
      ) : selectedProductId && kardexMovements.length === 0 && !error ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Text size="sm" color="neutral-secondary">
            No hay movimientos de kardex para este producto.
          </Text>
        </div>
      ) : selectedProductId ? (
        <Table headers={headers} rows={rows} gridTemplate={gridTemplate} />
      ) : (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Text size="sm" color="neutral-secondary">
            Selecciona un producto para ver sus movimientos de kardex.
          </Text>
        </div>
      )}
    </PageLayout>
  );
};
