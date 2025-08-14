import React, { useEffect, useMemo, useState } from 'react';
import styles from './MainPage.module.scss';

import { Button, PageLayout, FormField, Table, type TableRow } from '@/components';

import type { Category } from '@/domains/maintainers/types';
import { CategoryService } from '@/domains/maintainers/services';
import { CategoryModal } from '@/domains/maintainers/organisms';

export const MainPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const [code, setCode] = useState('');
  const [status, setStatus] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  useEffect(() => {
    CategoryService.getAll()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const filtered = useMemo(() => {
    return categories.filter((c) => {
      const byCode = code ? String(c.id).includes(code) : true;
      const byStatus = status === 'all' ? true : status === 'active' ? c.estado : !c.estado;
      return byCode && byStatus;
    });
  }, [categories, code, status]);

  const handleOpenEdit = (cat: Category) => {
    setEditing(cat);
    setIsEditOpen(true);
  };

  const rows: TableRow[] = useMemo(() => filtered.map((c) => ({
    id: c.id,
    cells: [
      c.id,
      c.nombre,
      c.descripcion || '-',
      c.estado ? 'Activo' : 'Inactivo',
      (
        <div key={`actions-${c.id}`} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Button key={`edit-${c.id}`} type='edit' onClick={() => handleOpenEdit(c)} />
          <Button key={`delete-${c.id}`} type='delete' variant='danger' onClick={() => handleDelete(c.id)} />
        </div>
      )
    ],
  })), [filtered]);

  const headers = ['Código', 'Nombre', 'Descripción', 'Estado', 'Acciones'];
  const gridTemplate = '0.6fr 1.2fr 2fr 0.8fr 1fr';

  const handleCreate = async (data: Parameters<typeof CategoryService.create>[0]) => {
    try {
      const created = await CategoryService.create(data);
      setCategories((prev) => [created, ...prev]);
    } catch (error) {
      console.error('Error al crear categoría:', error);
    }
  };

  const handleUpdate = async (data: Parameters<typeof CategoryService.update>[1]) => {
    if (!editing) return;
    try {
      const updated = await CategoryService.update(editing.id, data);
      // Aseguramos la actualización en la tabla haciendo merge local de los cambios
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editing.id ? { ...cat, ...updated, ...data } : cat
        )
      );
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
    } finally {
      setIsEditOpen(false);
      setEditing(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await CategoryService.delete(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

  return (
    <PageLayout 
      title="Categorías" 
      subtitle="Muestra las categorías registradas."
      header={<Button size="large" onClick={() => setIsCreateOpen(true)}>+ Agregar nueva categoría</Button>}
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

      {/* Crear */}
      <CategoryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Editar */}
      <CategoryModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditing(null); }}
        onSubmit={handleUpdate}
        title="Editar categoría"
        description="Actualiza los datos de la categoría."
        submitLabel="Actualizar"
        initialValues={{ nombre: editing?.nombre ?? '', descripcion: editing?.descripcion ?? '' }}
      />
    </PageLayout>
  );
};

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
];