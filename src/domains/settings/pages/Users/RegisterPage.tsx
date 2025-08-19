import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout, Button, Loader } from "@/components";
import { FormUser } from "../../organisms";
import { UserService } from "../../services";
import type { CreateUserPayload } from "../../types";
import { SETTINGS_ROUTES } from "@/router";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    },
  });

  const handleCreateUser = async () => {
    setLoading(true);
    setError("");
    try {
      await UserService.create(newUser);
      navigate(`/settings${SETTINGS_ROUTES.USERS}`);
    } catch (error) {
      console.error("Error creating user:", error);
      setError("Error al crear el usuario. Verifique los datos e intente nuevamente.");
    }
    setLoading(false);
  };

  const handleFormChange = (field: keyof CreateUserPayload, value: any) => {
    setNewUser({ ...newUser, [field]: value });
  };

  const handleCancel = () => {
    navigate(`/settings${SETTINGS_ROUTES.USERS}`);
  };

  return (
    <PageLayout
      title="Agregar nuevo usuario"
      subtitle="Permite al administrador crear un nuevo usuario y asignarle un rol."
      header={
        <Button
          variant="secondary"
          size="large"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
      }
    >
      <FormUser
        user={newUser}
        error={error}
        setError={setError}
        loading={loading}
        setLoading={setLoading}
        onChange={handleFormChange}
        onSubmit={handleCreateUser}
        isCreate={true}
      />

      {loading && <Loader text="Creando usuario..." />}
    </PageLayout>
  );
};
