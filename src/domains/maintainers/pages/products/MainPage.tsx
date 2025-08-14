import React, { useEffect, useMemo, useState } from 'react';
import styles from './MainPage.module.scss';

import { Button, FormField, PageLayout, Table, type TableRow } from '@/components';
import { AddDropdownButton } from '@/components';

import type { Product } from '@/domains/maintainers/types';
import { ProductService } from '@/domains/maintainers/services';
import { ProductModal, ServiceModal } from '@/domains/maintainers/organisms';

export const MainPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [codigo, setCodigo] = useState('');
  const [status, setStatus] = useState('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  useEffect(() => {
    ProductService.getAll()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const byCodigo = codigo ? p.codigo.includes(codigo) : true;
      const byStatus = status === 'all' ? true : status === 'active' ? p.estado : !p.estado;
      return byCodigo && byStatus;
    });
  }, [products, codigo, status]);

  const rows: TableRow[] = useMemo(() => filtered.map((p) => ({
    id: p.id,
    cells: [
      p.codigo,
      p.descripcion,
      p.unidadMedida,
      p.categoria?.nombre || '-',
      p.precio,
      p.stockMinimo,
      p.estado ? 'Activo' : 'Inactivo',
      new Date(p.fechaCreacion).toLocaleDateString(),
    ],
  })), [filtered]);

  const headers = ['Código', 'Descripción', 'Unidad', 'Categoría', 'Precio', 'Stock Mín.', 'Estado', 'Creado'];
  const gridTemplate = '0.8fr 2fr 0.8fr 1fr 0.8fr 0.8fr 0.8fr 1fr';

  const handleCreateProduct = (data: any) => {
    console.log('Crear producto:', data);
  };

  const handleCreateService = (data: any) => {
    console.log('Crear servicio:', data);
  };

  const dropdownOptions = [
    {
      label: 'Nuevo producto',
      onClick: () => setIsProductModalOpen(true)
    },
    {
      label: 'Nuevo servicio',
      onClick: () => setIsServiceModalOpen(true)
    }
  ];

  return (
    <PageLayout 
      title="Productos y servicios" 
      subtitle="Gestiona el registro y actualización de productos y servicios."
      header={<AddDropdownButton options={dropdownOptions} />}
    >
      <div className={styles.page}>
        <section className={styles.filtersRow}>
          <FormField
            type="text"
            label="Código"
            placeholder="Seleccionar"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
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

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSubmit={handleCreateProduct}
      />

      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSubmit={handleCreateService}
      />
    </PageLayout>
  );
};

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
];
