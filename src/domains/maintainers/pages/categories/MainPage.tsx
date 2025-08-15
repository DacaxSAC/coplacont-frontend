import { useEffect, useState, useMemo } from "react";
import styles from './MainPage.module.scss';
import { PageLayout } from "@/components";
import { Table, Button, StateTag, CloseIcon, CheckIcon, Modal, Text, Input, ComboBox } from "@/components";
import { CategoryService } from "@/domains/maintainers/services";
import type { Category, CreateCategoryPayload } from "@/domains/maintainers/types";
import { FormCategory } from "../../organisms/FormCategory";

export const MainPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [newCategory, setNewCategory] = useState<CreateCategoryPayload>({
    nombre: "",
    descripcion: ""
  });

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // 🔹 Estados para filtros
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // Opciones para el ComboBox
  const statusOptions = [
    { label: "Activo", value: "true" },
    { label: "Inactivo", value: "false" },
  ];

  const hanldeCategoryChange = (
    field: keyof CreateCategoryPayload,
    value: string
  ) => {
    setNewCategory((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setNewCategory({
      nombre: "",
      descripcion: ""
    });
  };

  const fetchCategories = () => {
    setIsLoading(true);
    CategoryService.getAll()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleStateCategory = async (id: number, currentState: boolean) => {
    try {
      const updatedData = { estado: !currentState };
      await CategoryService.update(id, updatedData as any);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? { ...cat, estado: !currentState } : cat))
      );
    } catch (error) {
      console.error("Error al cambiar estado de categoría:", error);
    }
  };

  const handleCreate = async () => {
    if (!newCategory.nombre.trim()) {
      setError("El nombre de la categoría es obligatorio.");
      return;
    }
    try {
      setIsLoading(true);
      setError("");
      await CategoryService.create(newCategory);
      setIsCreate(false);
      setIsOpen(false);
      fetchCategories();
      resetForm();
    } catch (error) {
      console.error("Error al crear categoría:", error);
    }
  };

  // 🔹 Filtrado con useMemo para evitar recalcular en cada render
  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const matchesSearch = c.nombre.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        status === "" || c.estado.toString() === status;
      return matchesSearch && matchesStatus;
    });
  }, [categories, search, status]);

  const rows = filteredCategories.map((c) => ({
    id: c.id,
    cells: [
      c.id,
      c.nombre,
      c.descripcion || "No especificado",
      <StateTag state={c.estado} />,
      (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            size="tableItemSize"
            variant="tableItemStyle"
            onClick={() => {
              setSelectedCategory(c);
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
              handleStateCategory(c.id, c.estado);
            }}
          >
            {c.estado ? <CloseIcon /> : <CheckIcon />}
          </Button>
        </div>
      ),
    ],
  }));

  const headers = ["Código", "Nombre", "Descripción", "Estado", "Acciones"];
  const gridTemplate = "0.6fr 1.2fr 2fr 0.8fr 1fr";

  return (
    <PageLayout
      title="Categorías"
      subtitle="Listado de categorías registradas"
      header={
        <Button
          size="large"
          onClick={() => {
            setIsOpen(true);
            setIsView(false);
            setIsCreate(true);
          }}
        >
          + Agregar nueva categoría
        </Button>
      }
    >
      {/* 🔹 Sección de filtros */}
      <section className={styles.MainPage}>
        <div className={styles.MainPage__Filter}>
          <Text size="xs" color="neutral-primary">
            Buscar nombre
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
        onClose={() => {
          fetchCategories();
          setIsOpen(!isOpen);
          setIsCreate(false);
          resetForm();
        }}
        title="Agregar nueva categoría"
        description="Ingresa los siguientes datos para registrar una categoría."
        loading={isLoading}
        buttonText={"Cerrar"}
      >
        <FormCategory
          category={isView && selectedCategory ? selectedCategory : newCategory}
          onChange={hanldeCategoryChange}
          onSubmit={handleCreate}
          readOnly={isView}
          error={error}
          setError={setError}
          loading={isLoading}
          setLoading={setIsLoading}
          isCreate={isCreate}
        />
      </Modal>
    </PageLayout>
  );
};
