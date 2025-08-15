import { useState, useEffect, useMemo } from "react";
import styles from './MainPage.module.scss';
import { PageLayout, Button, Table, ComboBox, Text } from "@/components";
import type { InventoryItem } from "../../services/types";

export const MainPage: React.FC = () => {

  //Por ahora
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [almacenFilter, setAlmacenFilter] = useState(""); // filtro almacén
  const [productoFilter, setProductoFilter] = useState(""); // filtro producto

  useEffect(() => {
    //Logica para cargar kardex
  }, []);

  // 🔹 Opciones para los ComboBox
  const almacenOptions = [
    { label: "Todos", value: "" },
    ...Array.from(
      new Map(
        inventory.map((i) => [i.almacen.id, { label: `${i.almacen.id} - ${i.almacen.nombre}`, value: String(i.almacen.id) }])
      ).values()
    )
  ];

  const productOptions = [
    { label: "Todos", value: "" },
    ...Array.from(
      new Map(
        inventory.map((i) => [i.producto.codigo, { label: `${i.producto.codigo} - ${i.producto.descripcion}`, value: i.producto.codigo }])
      ).values()
    )
  ];

  // 🔹 Filtrar inventario por almacén y producto (código o nombre)
  const filteredInventory = useMemo(() => {
    return inventory.filter((i) => {
      const matchAlmacen =
        almacenFilter === "" ||
        String(i.almacen.id).toLowerCase().includes(almacenFilter.toLowerCase()) ||
        i.almacen.nombre.toLowerCase().includes(almacenFilter.toLowerCase());

      const matchProducto =
        productoFilter === "" ||
        i.producto.codigo.toLowerCase().includes(productoFilter.toLowerCase()) ||
        i.producto.descripcion.toLowerCase().includes(productoFilter.toLowerCase());

      return matchAlmacen && matchProducto;
    });
  }, [inventory, almacenFilter, productoFilter]);


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
      <section className={styles.MainPage}>
        <div className={styles.MainPage__Filter}>
          <Text size="xs" color="neutral-primary">
            Almacén
          </Text>
          <ComboBox
            options={almacenOptions}
            size="xs"
            variant="createSale"
            value={almacenFilter}
            onChange={(v) => setAlmacenFilter(v as string)}
            placeholder="Seleccionar"
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
            value={productoFilter}
            onChange={(v) => setProductoFilter(v as string)}
            placeholder="Seleccionar"
          />
        </div>
      </section>
      <Table headers={headers} rows={rows} gridTemplate={gridTemplate} />
    </PageLayout>
  );
};
