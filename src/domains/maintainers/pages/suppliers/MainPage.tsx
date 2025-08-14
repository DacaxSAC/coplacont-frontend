import { useState, useEffect } from 'react';
import { PageLayout } from '@/components';
import { Table, Button } from '@/components';
import { EntitiesService } from '../../services';
import type { Entidad } from '../../services';

export const MainPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Entidad[]>([]);

  useEffect(() => {
    EntitiesService.getSuppliers().then((res) => {setSuppliers(res); console.log(res)});
  }, []);

  const headers = ['Tipo', 'Número de Documento', 'Nombre Completo', 'Dirección', 'Teléfono','Acciones'];
  const rows = suppliers.map((s) => ({
    id: s.id,
    cells: [s.tipo,s.numeroDocumento, s.nombreCompleto, s.direccion, s.telefono],
  }));
  const gridTemplate = '1fr 1.5fr 2fr 2fr 1fr 2fr';

  return (
    <PageLayout 
      title='Proveedores' 
      subtitle='Listado de proveedores registrados'
       header={
        <Button size='large'>
          + Nuevo proveedor
        </Button>
      } 
    >
      <div>
        
      </div>
      <Table headers={headers} rows={rows} gridTemplate={gridTemplate}/>
    </PageLayout>
  );
};
