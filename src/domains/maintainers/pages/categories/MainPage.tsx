import { useEffect, useState } from "react";
import { PageLayout } from "@/components";
import { Table, Button, StateTag, CloseIcon, CheckIcon } from "@/components";
import { CategoryService } from "@/domains/maintainers/services";
import type { Category } from "@/domains/maintainers/types";
import { CategoryModal } from "@/domains/maintainers/organisms";

export const MainPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  useEffect(() => {
    CategoryService.getAll()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const handleOpenEdit = (cat: Category) => {
    setEditing(cat);
    setIsEditOpen(true);
  };

  const handleStateCategory = async (id: number, currentState: boolean) => {
    try {
      // Toggle estado usando update con el estado opuesto
      const updatedData = { estado: !currentState };
      await CategoryService.update(id, updatedData as any);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? { ...cat, estado: !currentState } : cat))
      );
    } catch (error) {
      console.error("Error al cambiar estado de categoría:", error);
    }
  };

  const rows = categories.map((c) => ({
    id: c.id,
    cells: [
      c.id,
      c.nombre,
      c.descripcion || "-",
      <StateTag state={c.estado} />,
      (
        <div key={`actions-${c.id}`} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Button key={`edit-${c.id}`} type="edit" onClick={() => handleOpenEdit(c)} />
          <Button
            key={`toggle-${c.id}`}
            size="tableItemSize"
            variant="tableItemStyle"
            onClick={() => handleStateCategory(c.id, c.estado)}
          >
            {c.estado ? <CloseIcon /> : <CheckIcon />}
          </Button>
        </div>
      ),
    ],
  }));

  const headers = ["Código", "Nombre", "Descripción", "Estado", "Acciones"];
  const gridTemplate = "0.6fr 1.2fr 2fr 0.8fr 1fr";

  const handleCreate = async (data: Parameters<typeof CategoryService.create>[0]) => {
    try {
      const created = await CategoryService.create(data);
      setCategories((prev) => [created, ...prev]);
    } catch (error) {
      console.error("Error al crear categoría:", error);
    }
  };

  const handleUpdate = async (data: Parameters<typeof CategoryService.update>[1]) => {
    if (!editing) return;
    try {
      const updated = await CategoryService.update(editing.id, data);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === editing.id ? { ...cat, ...updated, ...data } : cat))
      );
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
    } finally {
      setIsEditOpen(false);
      setEditing(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await CategoryService.delete(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
    }
  };

  return (
    <PageLayout
      title="Categorías"
      subtitle="Listado de categorías registradas"
      header={<Button size="large" onClick={() => setIsCreateOpen(true)}>+ Agregar nueva categoría</Button>}
    >
      <Table headers={headers} rows={rows} gridTemplate={gridTemplate} />

      {/* Crear */}
      <CategoryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Editar */}
      <CategoryModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditing(null);
        }}
        onSubmit={handleUpdate}
        title="Editar categoría"
        description="Actualiza los datos de la categoría."
        submitLabel="Actualizar"
        initialValues={{ nombre: editing?.nombre ?? "", descripcion: editing?.descripcion ?? "" }}
      />
    </PageLayout>
  );
};