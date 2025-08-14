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

  const rows: TableRow[] = useMemo(() => filtered.map((c) => ({
    id: c.id,
    cells: [
      c.id,
      c.nombre,
      c.descripcion || '-',
      c.estado ? 'Activo' : 'Inactivo',
      new Date(c.fechaCreacion).toLocaleDateString(),
    ],
  })), [filtered]);

  const headers = ['Código', 'Nombre', 'Descripción', 'Estado', 'Creado'];
  const gridTemplate = '0.6fr 1.2fr 2fr 0.8fr 1fr';

  const handleCreate = (data: { nombre: string; descripcion: string }) => {
    console.log('Crear categoría:', data);
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

      <CategoryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />
    </PageLayout>
  );
};

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
];