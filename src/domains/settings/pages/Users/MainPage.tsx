import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from './MainPage.module.scss';
import {
  PageLayout,
  Table,
  Button,
  Modal,
  CloseIcon,
  StateTag,
  CheckIcon,
  Input,
  Text,
  ComboBox,
  Loader
} from "@/components";
import { UserService } from "../../services";
import { FormUser } from "../../organisms";
import { RoleTag } from "../../components";
import type { User, CreateUserPayload } from "../../types";
import type { TableRow } from "@/components/organisms/Table";
import { COMMON_ROUTES, SETTINGS_ROUTES } from "@/router";

const statusOptions = [
  { label: "Todos", value: "" },
  { label: "Activos", value: "true" },
  { label: "Inactivos", value: "false" },
];

export const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isView, setIsView] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  // Filtros
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [documentType, setDocumentType] = useState("DNI");

  // Form state
  const [newUser, setNewUser] = useState<CreateUserPayload>({
    email: "",
    idRol: 1,
    createPersonaDto: {
      primerNombre: "",
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
      fechaNacimiento: new Date(),
      telefono: "",
      dni: "",
      tipoDocumento: "DNI",
      direccion: "",
    },
  });

  const fetchUsers = () => {
    setIsLoading(true);
    UserService.getAll(true)
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]))
      .finally(() => setIsLoading(false));
  };

  const handleCreateUser = async () => {
    setIsLoading(true);
    try {
      await UserService.create(newUser);
      fetchUsers();
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating user:", error);
      setError("Error al crear el usuario");
    }
    setIsLoading(false);
  };

  const handleStateUser = async (id: number, currentState: boolean | undefined) => {
    try {
      setIsLoading(true);
      const isEnabled = currentState ?? true;
      if (isEnabled) {
        await UserService.disable(id);
      } else {
        await UserService.update(id, { habilitado: true });
      }
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, habilitado: !isEnabled } : user
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado de usuario:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModal = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSelectedUser(null);
      setIsView(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setNewUser({
      email: "",
      idRol: 1,
      createPersonaDto: {
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        fechaNacimiento: new Date(),
        telefono: "",
        dni: "",
        tipoDocumento: "DNI",
        direccion: "",
      },
    });
    setDocumentType("DNI");
    setError("");
  };

  const handleFormChange = (field: keyof CreateUserPayload, value: any) => {
    setNewUser({ ...newUser, [field]: value });
  };

  const handleDocumentTypeChange = (value: string) => {
    setDocumentType(value);
    // También actualizar el campo tipoDocumento en el formulario
    handleFormChange('createPersonaDto', {
      ...newUser.createPersonaDto,
      tipoDocumento: value,
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Sincronizar documentType cuando se selecciona un usuario
  useEffect(() => {
    if (selectedUser && selectedUser.persona?.tipoDocumento) {
      setDocumentType(selectedUser.persona.tipoDocumento);
    }
  }, [selectedUser]);

  // Filtrado
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = 
        (u.persona?.primerNombre?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (u.persona?.primerApellido?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.persona?.dni?.includes(search) ?? false);
      const matchesStatus = status === "" || (u.habilitado ?? true).toString() === status;
      return matchesSearch && matchesStatus;
    });
  }, [users, search, status]);

  const rows: TableRow[] = filteredUsers.map((u) => ({
    id: u.id,
    cells: [
      u.persona?.dni || "No especificado",
      `${u.persona?.primerNombre || ""} ${u.persona?.primerApellido || ""}`.trim() || "No especificado",
      u.email,
      u.persona?.telefono || "No especificado",
      u.roles && u.roles.length > 0 ? (
        <div style={{ display: "flex", gap: "2px", flexWrap: "wrap" }}>
          {u.roles.map((role, index) => (
            <RoleTag key={index} role={role} />
          ))}
        </div>
      ) : (
        <RoleTag role="Sin rol" />
      ),
      <StateTag state={u.habilitado ?? true} />,
      <div style={{ display: "flex", gap: "8px" }}>
        <Button
          size="tableItemSize"
          variant="tableItemStyle"
          onClick={() => {
            navigate(`/settings${SETTINGS_ROUTES.USERS}${COMMON_ROUTES.DETAIL.replace(':id', u.id.toString())}`);
          }}
        >
          Ver detalles
        </Button>
        <Button
          size="tableItemSize"
          variant="tableItemStyle"
          onClick={() => {
            handleStateUser(u.id, u.habilitado ?? true);
          }}
        >
            {(u.habilitado ?? true) ? <CloseIcon /> : <CheckIcon />}
          </Button>
      </div>,
    ],
  }));

  const headers = [
    "DNI",
    "Nombre completo",
    "Email",
    "Teléfono",
    "Rol",
    "Estado",
    "Acciones",
  ];
  const gridTemplate = "1fr 2fr 2fr 1.5fr 1.5fr 1fr 2fr";

  return (
    <PageLayout
      title="Usuarios y roles"
      subtitle="Gestiona la creación, edición y asignación de roles a los usuarios del sistema."
      header={
        <Button
          onClick={() => {
            resetForm();
            setIsView(false);
            setIsOpen(true);
          }}
          size="large"
        >
          + Nuevo usuario
        </Button>
      }
    >
      {/* Filtros */}
      <section className={styles.MainPage}>
        <div className={styles.MainPage__Filter}>
          <Text size="xs" color="neutral-primary">
            Buscar por nombre, email o DNI
          </Text>
          <Input
            placeholder="Buscar..."
            size="xs"
            variant="createSale"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.MainPage__Filter}>
          <Text size="xs" color="neutral-primary">
            Estado
          </Text>
          <ComboBox
            options={statusOptions}
            size="xs"
            variant="createSale"
            value={status}
            onChange={(v) => setStatus(v as string)}
            placeholder="Seleccionar"
          />
        </div>
      </section>

      <Table headers={headers} rows={rows} gridTemplate={gridTemplate} />

      <Modal
        isOpen={isOpen}
        onClose={handleModal}
        title={isView ? "Detalles del usuario" : "Agregar nuevo usuario"}
        description={
          isView
            ? "Información del usuario seleccionado."
            : "Ingresa los siguientes datos para registrar un usuario."
        }
      >
        <FormUser
          user={isView && selectedUser ? selectedUser : newUser}
          error={error}
          setError={setError}
          loading={isLoading}
          setLoading={setIsLoading}
          readOnly={isView}
          onChange={handleFormChange}
          onSubmit={handleCreateUser}
          isCreate={!isView}
          documentType={documentType}
          onDocumentTypeChange={handleDocumentTypeChange}
        />
      </Modal>

      {isLoading && <Loader text="Procesando..." />}
    </PageLayout>
  );
};
