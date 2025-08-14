import { useState, useEffect } from "react";
import styles from "./MainPage.module.scss";
import { PageLayout } from "@/components";
import { Table, Button, Modal, Text, ComboBox, Input, CloseIcon,StateTag } from "@/components";
import { EntitiesService } from "../../services";
import type { Entidad } from "../../services";

export const MainPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Entidad[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    esProveedor: true,
    esCliente: false,
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
    setNewSupplier({
      esProveedor: true,
      esCliente: false,
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

  const hanldeCreateSupplier = async () => {
    setError("");

    // Validar que el tipo esté seleccionado
    if (!newSupplier.tipo) {
      setError("Debe seleccionar el tipo de entidad.");
      return;
    }

    // Validación según tipo
    if (newSupplier.tipo === "JURIDICA") {
      if (newSupplier.numeroDocumento.length !== 11) {
        setError(
          "El número de documento para JURIDICA debe tener 11 caracteres."
        );
        return;
      }
      if (!newSupplier.razonSocial.trim()) {
        setError("Debe ingresar la razón social.");
        return;
      }
    }

    if (newSupplier.tipo === "NATURAL") {
      if (newSupplier.numeroDocumento.length !== 8) {
        setError(
          "El número de documento para NATURAL debe tener 8 caracteres."
        );
        return;
      }
      if (!newSupplier.nombre.trim()) {
        setError("Debe ingresar el nombre.");
        return;
      }
      if (!newSupplier.apellidoPaterno.trim()) {
        setError("Debe ingresar el apellido paterno.");
        return;
      }
      if (!newSupplier.apellidoMaterno.trim()) {
        setError("Debe ingresar el apellido materno.");
        return;
      }
    }

    setLoading(true);

    const response = await EntitiesService.postEntidad(newSupplier);
    if (response.success) {
      fetchSuppliers();
      resetForm();
      setIsOpen(false);
    } else {
      setError(response.message);
    }

    setLoading(false);
  };

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  const fetchSuppliers = () => {
    EntitiesService.getSuppliers().then((res) => {
      setSuppliers(res);
    });
  };

  useEffect(() => {
    fetchSuppliers();
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
  const rows = suppliers.map((s) => ({
    id: s.id,
    cells: [
      s.tipo,
      s.numeroDocumento,
      s.nombreCompleto,
      s.direccion!==''?s.direccion:'No especificado',
      s.telefono!==''?s.telefono:'No especificado',
      <StateTag state={s.activo} />,
      <div style={{display:'flex', gap:'8px'}}>
        <Button size="tableItemSize" variant="tableItemStyle" onClick={()=>{}}>Ver detalles</Button>
        <Button size="tableItemSize" variant="tableItemStyle" onClick={()=>{}}>
          <CloseIcon />
        </Button>
      </div>
     
    ],
  }));
  const gridTemplate = "1fr 1.5fr 2fr 2fr 1fr 1fr 2fr";

  return (
    <PageLayout
      title="Proveedores"
      subtitle="Listado de proveedores registrados"
      header={
        <Button onClick={handleModal} size="large">
          + Nuevo proveedor
        </Button>
      }
    >
      <Table headers={headers} rows={rows} gridTemplate={gridTemplate} />

      <Modal
        isOpen={isOpen}
        onClose={handleModal}
        title="Agregar nuevo proveedor"
        description="Ingresa los siguientes datos para registrar un proveedor."
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
              value={newSupplier.tipo}
              onChange={(value) =>
                setNewSupplier({
                  ...newSupplier,
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
              disabled={!newSupplier.tipo}
              size="xs"
              variant="createSale"
              value={newSupplier.numeroDocumento}
              onChange={(e) =>
                setNewSupplier({
                  ...newSupplier,
                  numeroDocumento: e.target.value,
                })
              }
            />
          </div>
          {newSupplier.tipo === "JURIDICA" && (
            <div className={`${styles.MainPage__FormField}`}>
              <Text size="xs" color="neutral-primary">
                Razon Social
              </Text>
              <Input
                size="xs"
                variant="createSale"
                value={newSupplier.razonSocial}
                onChange={(e) =>
                  setNewSupplier({
                    ...newSupplier,
                    razonSocial: e.target.value,
                  })
                }
              />
            </div>
          )}
          {newSupplier.tipo === "NATURAL" && (
            <>
              <div className={`${styles.MainPage__FormField}`}>
                <Text size="xs" color="neutral-primary">
                  Nombre
                </Text>
                <Input
                  size="xs"
                  variant="createSale"
                  value={newSupplier.nombre}
                  onChange={(e) =>
                    setNewSupplier({
                      ...newSupplier,
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
                  value={newSupplier.apellidoPaterno}
                  onChange={(e) =>
                    setNewSupplier({
                      ...newSupplier,
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
                  value={newSupplier.apellidoMaterno}
                  onChange={(e) =>
                    setNewSupplier({
                      ...newSupplier,
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
              value={newSupplier.direccion}
              onChange={(e) =>
                setNewSupplier({
                  ...newSupplier,
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
              value={newSupplier.telefono}
              onChange={(e) =>
                setNewSupplier({
                  ...newSupplier,
                  telefono: e.target.value,
                })
              }
            />
          </div>

          <Button
            disabled={loading}
            size="medium"
            onClick={hanldeCreateSupplier}
          >
            Guardar
          </Button>
        </div>
      </Modal>
    </PageLayout>
  );
};
