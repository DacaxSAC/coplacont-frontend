import { useState, useEffect } from 'react';
import { PageLayout } from '@/components';
import { Table, Button } from '@/components';
import { EntitiesService } from '../../services';
import type { Entidad } from '../../services';

export const MainPage: React.FC = () => {
  const [clients, setClients] = useState<Entidad[]>([]);

  useEffect(() => {
    EntitiesService.getClients().then((res) => {setClients(res); console.log(res)});
  }, []);

  const headers = ['Tipo', 'Número de Documento', 'Nombre Completo', 'Dirección', 'Teléfono','Acciones'];
  const rows = clients.map((c) => ({
    id: c.id,
    cells: [c.tipo,c.numeroDocumento, c.nombreCompleto, c.direccion, c.telefono],
  }));
  const gridTemplate = '1fr 1.5fr 2fr 2fr 1fr 2fr';

  return (
    <PageLayout 
      title='Clientes' 
      subtitle='Listado de clientes registrados'
      header={
        <Button size='large'>
          + Nuevo cliente
        </Button>
      }
    >
      <div>
        
      </div>
      <Table headers={headers} rows={rows} gridTemplate={gridTemplate}/>
    </PageLayout>
  );
};
