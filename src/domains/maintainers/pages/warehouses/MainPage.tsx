import React, { useEffect, useMemo, useState } from 'react';
import styles from './MainPage.module.scss';

import { Button, PageLayout, FormField, Table, type TableRow } from '@/components';

import type { Warehouse } from '@/domains/maintainers/types';
import { WarehouseService } from '@/domains/maintainers/services';
import { WarehouseModal } from '@/domains/maintainers/organisms';

export const MainPage: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  const [code, setCode] = useState('');
  const [status, setStatus] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState<Warehouse | null>(null);

  useEffect(() => {
    WarehouseService.getAll()
      .then((data) => setWarehouses(Array.isArray(data) ? data : []))
      .catch(() => setWarehouses([]));
  }, []);

  const filtered = useMemo(() => {
    return warehouses.filter((w) => {
      const byCode = code ? String(w.id).includes(code) : true;
      const byStatus = status === 'all' ? true : status === 'active' ? w.estado : !w.estado;
      return byCode && byStatus;
    });
  }, [warehouses, code, status]);

  const handleOpenEdit = (w: Warehouse) => {
    setEditing(w);
    setIsEditOpen(true);
  };

  const handleUpdate = async (data: Parameters<typeof WarehouseService.update>[1]) => {
    if (!editing) return;
    try {
      const updated = await WarehouseService.update(editing.id, data);
      setWarehouses((prev) => prev.map((wh) => wh.id === editing.id ? { ...wh, ...updated, ...data } : wh));
    } catch (error) {
      console.error('Error al actualizar almacén:', error);
    } finally {
      setIsEditOpen(false);
      setEditing(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await WarehouseService.delete(id);
      setWarehouses((prev) => prev.filter((wh) => wh.id !== id));
    } catch (error) {
      console.error('Error al eliminar almacén:', error);
    }
  };

  const rows: TableRow[] = useMemo(() => filtered.map((w) => ({
    id: w.id,
    cells: [
      w.id,
      w.nombre,
      w.ubicacion,
      w.responsable,
      String(w.capacidadMaxima),
      w.estado ? 'Activo' : 'Inactivo',
      (
        <div key={`actions-${w.id}`} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Button key={`edit-${w.id}`} type='edit' onClick={() => handleOpenEdit(w)} />
          <Button key={`delete-${w.id}`} type='delete' variant='danger' onClick={() => handleDelete(w.id)} />
        </div>
      )
    ],
  })), [filtered]);

  const headers = ['Código', 'Nombre', 'Ubicación', 'Responsable', 'Capacidad', 'Estado', 'Acciones'];
  const gridTemplate = '0.6fr 1.2fr 1.2fr 1fr 0.8fr 0.8fr 1fr';

  const handleCreate = async (data: Parameters<typeof WarehouseService.create>[0]) => {
    // Podríamos llamar al servicio real aquí
    // const created = await WarehouseService.create(data);
    // setWarehouses((prev) => [created, ...prev]);
    console.log('Crear almacén:', data);
  };

  return (
    <PageLayout 
      title="Almacenes" 
      subtitle="Muestra los almacenes registrados."
      header={<Button size="large" onClick={() => setIsCreateOpen(true)}>+ Agregar nuevo almacén</Button>}
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

      <WarehouseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Editar */}
      <WarehouseModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditing(null); }}
        onSubmit={handleUpdate}
        title="Editar almacén"
        description="Actualiza los datos del almacén."
        submitLabel="Actualizar"
        initialValues={editing ? {
          nombre: editing.nombre,
          ubicacion: editing.ubicacion,
          descripcion: editing.descripcion,
          capacidadMaxima: editing.capacidadMaxima,
          responsable: editing.responsable,
          telefono: editing.telefono,
        } : undefined}
      />
    </PageLayout>
  );
};

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
];
