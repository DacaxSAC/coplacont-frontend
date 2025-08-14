import { useState, useEffect } from "react";
import styles from "./MainPage.module.scss";
import { PageLayout } from "@/components";
import { Table, Button, Modal, Text, ComboBox, Input, CloseIcon, CheckIcon,StateTag } from "@/components";
import { EntitiesService } from "../../services";
import type { Entidad } from "../../services";

export const MainPage: React.FC = () => {
  const [clients, setClients] = useState<Entidad[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [newClient, setNewClient] = useState({
    esProveedor: false,
    esCliente: true,
    tipo: "" as Entidad["tipo"],
    numeroDocumento: "",
    nombre: "",
    apellidoMaterno: "",
    apellidoPaterno: "",
    razonSocial: "",
    direccion: "",
    telefono: "",
  });

  const resetForm = () => {
    setNewClient({
      esProveedor: false,
      esCliente: true,
      tipo: "" as Entidad["tipo"],
      numeroDocumento: "",
      nombre: "",
      apellidoMaterno: "",
      apellidoPaterno: "",
      razonSocial: "",
      direccion: "",
      telefono: "",
    });
  };

  const handleCreateClient = async () => {
    setError("");

    if (!newClient.tipo) {
      setError("Debe seleccionar el tipo de entidad.");
      return;
    }

    if (newClient.tipo === "JURIDICA") {
      if (newClient.numeroDocumento.length !== 11) {
        setError(
          "El número de documento para JURIDICA debe tener 11 caracteres."
        );
        return;
      }
      if (!newClient.razonSocial.trim()) {
        setError("Debe ingresar la razón social.");
        return;
      }
    }

    if (newClient.tipo === "NATURAL") {
      if (newClient.numeroDocumento.length !== 8) {
        setError(
          "El número de documento para NATURAL debe tener 8 caracteres."
        );
        return;
      }
      if (!newClient.nombre.trim()) {
        setError("Debe ingresar el nombre.");
        return;
      }
      if (!newClient.apellidoPaterno.trim()) {
        setError("Debe ingresar el apellido paterno.");
        return;
      }
      if (!newClient.apellidoMaterno.trim()) {
        setError("Debe ingresar el apellido materno.");
        return;
      }
    }

    setLoading(true);

    const response = await EntitiesService.postEntidad(newClient);
    if (response.success) {
      fetchClients();
      resetForm();
      setIsOpen(false);
    } else {
      setError(response.message);
    }

    setLoading(false);
  };

  const handleStateClient = async (id: number, state: boolean) => {
    let response;
    if(state){
      response = await EntitiesService.deleteEntidad(id);
    }else{
      response = await EntitiesService.restoreEntidad(id);
    }

    if (response.success) {
      fetchClients();
    } else {
      setError(response.message);
    }
  };

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  const fetchClients = () => {
    EntitiesService.getClients().then((res) => {
      setClients(res);
    });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const headers = [
    "Tipo",
    "Número de Documento",
    "Nombre Completo",
    "Dirección",
    "Teléfono",
    "Estado",
    "Acciones",
  ];
  const rows = clients.map((c) => ({
    id: c.id,
    cells: [
      c.tipo,
      c.numeroDocumento,
      c.nombreCompleto,
      c.direccion!==''?c.direccion:'No especificado',
      c.telefono!==''?c.telefono:'No especificado',
      <StateTag state={c.activo} />,
      <div style={{display:'flex', gap:'8px'}}>
        <Button size="tableItemSize" variant="tableItemStyle" onClick={()=>{}}>Ver detalles</Button>
        <Button size="tableItemSize" variant="tableItemStyle" onClick={()=>{handleStateClient(c.id, c.activo)}}>
          {c.activo? <CloseIcon />:<CheckIcon />}
        </Button>
      </div>
    ],
  }));
  const gridTemplate = "1fr 1.5fr 2fr 2fr 1fr 1fr 2fr";

  return (
    <PageLayout
      title="Clientes"
      subtitle="Listado de clientes registrados"
      header={
        <Button onClick={handleModal} size="large">
          + Nuevo cliente
        </Button>
      }
    >
      <Table headers={headers} rows={rows} gridTemplate={gridTemplate} />

      <Modal
        isOpen={isOpen}
        onClose={handleModal}
        title="Agregar nuevo cliente"
        description="Ingresa los siguientes datos para registrar un cliente."
        loading={loading}
      >
        <div className={`${styles.MainPage__Form}`}>
          {error && (
            <Text as="p" color="danger" size="xs">
              {error}
            </Text>
          )}
          <div className={`${styles.MainPage__FormField}`}>
            <Text size="xs" color="neutral-primary">
              Tipo de Entidad
            </Text>
            <ComboBox
              options={[
                { label: "JURIDICA", value: "JURIDICA" },
                { label: "NATURAL", value: "NATURAL" },
              ]}
              size="xs"
              variant="createSale"
              value={newClient.tipo}
              onChange={(value) =>
                setNewClient({
                  ...newClient,
                  tipo: value as Entidad["tipo"],
                })
              }
            />
          </div>
          <div className={`${styles.MainPage__FormField}`}>
            <Text size="xs" color="neutral-primary">
              Número de Documento
            </Text>
            <Input
              disabled={!newClient.tipo}
              size="xs"
              variant="createSale"
              value={newClient.numeroDocumento}
              onChange={(e) =>
                setNewClient({
                  ...newClient,
                  numeroDocumento: e.target.value,
                })
              }
            />
          </div>
          {newClient.tipo === "JURIDICA" && (
            <div className={`${styles.MainPage__FormField}`}>
              <Text size="xs" color="neutral-primary">
                Razon Social
              </Text>
              <Input
                size="xs"
                variant="createSale"
                value={newClient.razonSocial}
                onChange={(e) =>
                  setNewClient({
                    ...newClient,
                    razonSocial: e.target.value,
                  })
                }
              />
            </div>
          )}
          {newClient.tipo === "NATURAL" && (
            <>
              <div className={`${styles.MainPage__FormField}`}>
                <Text size="xs" color="neutral-primary">
                  Nombre
                </Text>
                <Input
                  size="xs"
                  variant="createSale"
                  value={newClient.nombre}
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      nombre: e.target.value,
                    })
                  }
                />
              </div>
              <div className={`${styles.MainPage__FormField}`}>
                <Text size="xs" color="neutral-primary">
                  Apellido Paterno
                </Text>
                <Input
                  size="xs"
                  variant="createSale"
                  value={newClient.apellidoPaterno}
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      apellidoPaterno: e.target.value,
                    })
                  }
                />
              </div>
              <div className={`${styles.MainPage__FormField}`}>
                <Text size="xs" color="neutral-primary">
                  Apellido Materno
                </Text>
                <Input
                  size="xs"
                  variant="createSale"
                  value={newClient.apellidoMaterno}
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      apellidoMaterno: e.target.value,
                    })
                  }
                />
              </div>
            </>
          )}
          <div className={`${styles.MainPage__FormField}`}>
            <Text size="xs" color="neutral-primary">
              Direccion
            </Text>
            <Input
              size="xs"
              variant="createSale"
              value={newClient.direccion}
              onChange={(e) =>
                setNewClient({
                  ...newClient,
                  direccion: e.target.value,
                })
              }
            />
          </div>
          <div className={`${styles.MainPage__FormField}`}>
            <Text size="xs" color="neutral-primary">
              Telefono
            </Text>
            <Input
              size="xs"
              variant="createSale"
              value={newClient.telefono}
              onChange={(e) =>
                setNewClient({
                  ...newClient,
                  telefono: e.target.value,
                })
              }
            />
          </div>

          <Button
            disabled={loading}
            size="medium"
            onClick={handleCreateClient}
          >
            Guardar
          </Button>
        </div>
      </Modal>
    </PageLayout>
  );
};
