import { useState, useEffect } from "react";
import { PageLayout, Button, Table } from "@/components";
import type { InventoryItem } from "../../services/types";

export const MainPage: React.FC = () => {

  //Por ahora
  const [inventory, setInventory] = useState<InventoryItem[]>([]);


  useEffect(() => {
    //Logica para cargar kardex
  }, []);

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

  //Actualizar cuando se consuma el endpoint dekardex
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
  const gridTemplate = "1.5fr 1.5fr 1.5fr 1.5fr 1fr 1fr 1fr 1fr";


  return (
     <PageLayout
      title="Kardex"
      subtitle="Muestra el detalle de movimientos y saldos del producto seleccionado."
    >
      <Table headers={headers} rows={rows} gridTemplate={gridTemplate} />
    </PageLayout>
  );
};
