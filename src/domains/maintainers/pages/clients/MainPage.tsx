import { useState, useEffect } from "react";
import { PageLayout } from "@/components";
import {
  Table,
  Button,
  Modal,
  CloseIcon,
  CheckIcon,
  StateTag,
} from "@/components";
import { EntitiesService } from "../../services";
import type { Entidad } from "../../services";
import { FormEntidad } from "../../organisms/FormEntidad";

export const MainPage: React.FC = () => {
  const [clients, setClients] = useState<Entidad[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isView, setIsView] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Entidad | null>(
    null
  );
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

  const handleClientChange = (
    field: keyof Entidad,
    value: string | number | boolean
  ) => {
    setNewClient((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
    if (state) {
      response = await EntitiesService.deleteEntidad(id);
    } else {
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
      console.log(res);
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
      c.direccion !== "" ? c.direccion : "No especificado",
      c.telefono !== "" ? c.telefono : "No especificado",
      <StateTag state={c.activo} />,
      <div style={{ display: "flex", gap: "8px" }}>
        <Button
          size="tableItemSize"
          variant="tableItemStyle"
          onClick={() => {
            setSelectedClient(c);
            setIsView(true);
            setIsOpen(true);
          }}
        >
          Ver detalles
        </Button>
        <Button
          size="tableItemSize"
          variant="tableItemStyle"
          onClick={() => {
            handleStateClient(c.id, c.activo);
          }}
        >
          {c.activo ? <CloseIcon /> : <CheckIcon />}
        </Button>
      </div>,
    ],
  }));
  const gridTemplate = "1fr 1.5fr 2fr 2fr 1fr 1fr 2fr";

  return (
    <PageLayout
      title="Clientes"
      subtitle="Listado de clientes registrados"
      header={
        <Button
          onClick={() => {
            resetForm();
            setIsView(false);
            setIsOpen(true);
          }}
          size="large"
        >
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
        buttonText={isView ? "Cerrar" : "Guardar"}
      >
        <FormEntidad
          setError={setError}
          setLoading={setLoading}
          entidad={isView && selectedClient ? selectedClient : newClient}
          error={error}
          loading={loading}
          onChange={handleClientChange}
          onSubmit={isView ? undefined : handleCreateClient}
          readOnly={isView}
        />
      </Modal>
    </PageLayout>
  );
};
