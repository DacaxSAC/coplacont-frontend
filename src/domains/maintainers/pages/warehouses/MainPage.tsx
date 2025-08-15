import React, { useEffect, useMemo, useState } from "react";
import styles from "./MainPage.module.scss";

import {
  Button,
  PageLayout,
  FormField,
  Table,
  type TableRow,
  StateTag,
  CloseIcon,
  CheckIcon,
  Modal,
} from "@/components";

import type { Warehouse, WarehouseParcial } from "@/domains/maintainers/types";
import { WarehouseService } from "@/domains/maintainers/services";
import { FormWarehouse } from "../../organisms/FormWarehouse/FormWarehouse";

export const MainPage: React.FC = () => {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("all");

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isView, setIsView] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [newWarehouse, setNewWarehouse] = useState<WarehouseParcial>({
    nombre: "",
    ubicacion: "",
    descripcion: "",
    responsable: "",
    telefono: "",
  });

  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null
  );

  const hanldeWarehouseChange = (
    field: keyof Warehouse,
    value: string | number | boolean
  ) => {
    setNewWarehouse((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setNewWarehouse({
      nombre: "",
      ubicacion: "",
      descripcion: "",
      capacidadMaxima: 0,
      responsable: "",
      telefono: "",
    });
  };

  const handleCreate = async () => {
    // Validación simple: revisa si algún campo está vacío
    if (!newWarehouse.nombre.trim()) {
      setError("El nombre del almacén es obligatorio.");
      return;
    }
    if (!newWarehouse.ubicacion.trim()) {
      setError("La ubicación del almacén es obligatoria.");
      return;
    }
    if (!newWarehouse.responsable.trim()) {
      setError("El responsable es obligatorio.");
      return;
    }
    if (!newWarehouse.telefono.trim()) {
      setError("El teléfono es obligatorio.");
      return;
    }

    try {
      setLoading(true);
      setError(""); // limpia errores previos
      const created = await WarehouseService.create(newWarehouse);
      fetchWarehouses();
      resetForm();
      setIsOpen(false);
      setWarehouses((prev) => [created, ...prev]);
    } catch (error) {
      console.error("Error al crear almacén:", error);
      setError("No se pudo crear el almacén. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const data = await WarehouseService.getAll();
      setWarehouses(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener almacenes:", error);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const filtered = useMemo(() => {
    return warehouses.filter((w) => {
      const byCode = code ? String(w.id).includes(code) : true;
      const byStatus =
        status === "all" ? true : status === "active" ? w.estado : !w.estado;
      return byCode && byStatus;
    });
  }, [warehouses, code, status]);

  const handleChangeState = async (id: number, estado: boolean) => {
    try {
      if (estado) {
        await WarehouseService.delete(id);
      } else {
        await WarehouseService.restore(id, { estado:true });
      }
      fetchWarehouses();
    } catch (error) {
      console.error("Error al eliminar almacén:", error);
    }
  };

  const rows: TableRow[] = useMemo(
    () =>
      filtered.map((w) => ({
        id: w.id,
        cells: [
          w.id,
          w.nombre,
          w.ubicacion,
          w.responsable,
          <StateTag state={w.estado} />,
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              size="tableItemSize"
              variant="tableItemStyle"
              onClick={() => {
                setSelectedWarehouse(w);
                setIsView(true);
                setIsOpen(true);
              }}
            >
              Ver detalles
            </Button>

            <Button
              size="tableItemSize"
              variant="tableItemStyle"
              onClick={() => {handleChangeState(w.id, w.estado)}}
            >
              {w.estado ? <CloseIcon /> : <CheckIcon />}
            </Button>
          </div>,
        ],
      })),
    [filtered]
  );

  const headers = [
    "Código",
    "Nombre",
    "Ubicación",
    "Responsable",
    "Estado",
    "Acciones",
  ];
  const gridTemplate = "0.6fr 1.2fr 1.2fr 1fr 0.8fr 1fr";

  return (
    <PageLayout
      title="Almacenes"
      subtitle="Muestra los almacenes registrados."
      header={
        <Button
          size="large"
          onClick={() => {
            setIsOpen(true);
            setIsView(false);
          }}
        >
          + Agregar nuevo almacén
        </Button>
      }
    >
      <div className={styles.page}>
        <section className={styles.filtersRow}>
          <FormField
            type="text"
            label="Código"
            placeholder="Seleccionar"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <FormField
            type="combobox"
            label="Estado"
            options={statusOptions}
            value={status}
            onChange={(v) => setStatus(v as string)}
            placeholder="Seleccionar"
          />
          <div className={styles.alignEnd}>
            <Button size="large">Filtrar búsqueda</Button>
          </div>
        </section>

        <Table headers={headers} rows={rows} gridTemplate={gridTemplate} />
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(!isOpen)}
        title="Agregar nuevo almacén"
        description="Ingresa los siguientes datos para registrar un almacén."
        loading={loading}
        buttonText={"Cerrar"}
      >
        <FormWarehouse
          setError={setError}
          setLoading={setLoading}
          warehouse={isView && selectedWarehouse ? selectedWarehouse :  newWarehouse}
          error={error}
          loading={loading}
          onChange={hanldeWarehouseChange}
          onSubmit={handleCreate}
          readOnly={isView}
        />
      </Modal>

      {/*<WarehouseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Editar */}
      {/*<WarehouseModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditing(null);
        }}
        onSubmit={handleUpdate}
        title="Editar almacén"
        description="Actualiza los datos del almacén."
        submitLabel="Actualizar"
        initialValues={
          editing
            ? {
                nombre: editing.nombre,
                ubicacion: editing.ubicacion,
                descripcion: editing.descripcion,
                capacidadMaxima: editing.capacidadMaxima,
                responsable: editing.responsable,
                telefono: editing.telefono,
              }
            : undefined
        }}
      />*/}
    </PageLayout>
  );
};

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activos" },
  { value: "inactive", label: "Inactivos" },
];
