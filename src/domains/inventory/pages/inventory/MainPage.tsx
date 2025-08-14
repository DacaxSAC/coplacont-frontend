import { useState, useEffect } from "react";
import { PageLayout, Button, Table } from "@/components";
import { InventoryService } from "../../services/InventoryService";
import type { InventoryItem } from "../../services/types";

export const MainPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const fetchInventory = async () => {
    try {
      const response = await InventoryService.getInventory();
        setInventory(response);
        console.log(response);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const headers = [
    "Código almacen",
    "Almacén",
    "Código producto",
    "Producto",
    "Stock Actual",
    "Acciones",
  ];

  const rows = inventory.map((i) => ({
    id: i.id,
    cells: [
      i.almacen.id,
      i.almacen.nombre,
      i.producto.codigo,
      i.producto.descripcion,
      i.stockActual,
        <Button
          size="tableItemSize"
          variant="tableItemStyle"
          onClick={() => {}}
        >
          Ver KARDEX
        </Button>

    ],
  }));
  const gridTemplate = "1fr 2fr 2fr 2fr 1fr 2fr";


  return (
     <PageLayout
      title="Inventario"
      subtitle="Listado de productos disponibles con sus cantidades actuales en stock."
      header={
        <Button
          onClick={() => {}}
          size="large"
        >
          + Producto a almacen
        </Button>
      }
    >
      <Table headers={headers} rows={rows} gridTemplate={gridTemplate} />
    </PageLayout>
  );
};
