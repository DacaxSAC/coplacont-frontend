import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageLayout, Button, Loader } from "@/components";
import { UserDetailForm } from "../../organisms";
import { UserService } from "../../services";
import type { User } from "../../types";
import { SETTINGS_ROUTES } from "@/router";

export const DetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (id) {
      fetchUser(id);
    }
  }, [id]);

  const fetchUser = async (userId: string) => {
    setLoading(true);
    setError("");
    try {
      const userData = await UserService.getById(parseInt(userId));
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Error al cargar los datos del usuario.");
    }
    setLoading(false);
  };

  const handleBack = () => {
    navigate(`/settings${SETTINGS_ROUTES.USERS}`);
  };

  if (loading) {
    return (
      <PageLayout 
        title="Detalles del usuario" 
        subtitle="Visualización de la información del usuario."
      >
        <Loader text="Cargando datos del usuario..." />
      </PageLayout>
    );
  }

  if (error || !user) {
    return (
      <PageLayout 
        title="Detalles del usuario" 
        subtitle="Visualización de la información del usuario."
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>{error || "Usuario no encontrado"}</p>
          <div style={{ marginTop: "1rem" }}>
            <Button
              variant="secondary"
              size="large"
              onClick={handleBack}
            >
              Volver
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Detalles del usuario" 
      subtitle="Visualización de la información del usuario."
      header={
        <Button
          variant="secondary"
          size="large"
          onClick={handleBack}
        >
          Volver
        </Button>
      }
    >
      <UserDetailForm
        user={user}
        error={error}
        setError={setError}
        loading={loading}
        setLoading={setLoading}
        readOnly={true}
      />
    </PageLayout>
  );
};