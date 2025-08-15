import { useState } from "react";
import styles from "./FormCategory.module.scss";
import { Text, Input, Button, ComboBox } from "@/components";
import type { Category, CreateCategoryPayload } from "../../types";
import { CategoryService } from "../../services";

type FormCategoryProps = {
  category: Category | CreateCategoryPayload;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  readOnly?: boolean;
  onChange: (field: keyof CreateCategoryPayload, value: string) => void;
  onSubmit?: () => void;
  isCreate?:boolean
};

export const FormCategory = ({
  category,
  error,
  //setError,
  loading,
  setLoading,
  readOnly = false,
  onChange,
  onSubmit,
  isCreate
}: FormCategoryProps) => {
  const [categoryToUpdate, setCategoryToUpdate] = useState<CreateCategoryPayload>({
    nombre: category.nombre,
    descripcion: category.descripcion,
    tipo: (category as Category).tipo || 'producto',
  });

  const [isEdit, setIsEdit] = useState(false);

  const handleUpdateCategory = async () => {
    setLoading(true);
    const response = await CategoryService.update(
      category.id!,
      categoryToUpdate
    );
    console.log(response);
    setIsEdit(false);

    setLoading(false);
  };

  return (
    <div className={styles.FormCategory__Form}>
      {error && (
        <Text as="p" color="danger" size="xs">
          {error}
        </Text>
      )}

      {/* Tipo de Entidad */}
      <div className={styles.FormCategory__FormField}>
        <Text size="xs" color="neutral-primary">
          Nombre de la categoría
        </Text>
        <Input
          disabled={isEdit? false : readOnly}
          size="xs"
          variant="createSale"
          value={isCreate? category.nombre :  categoryToUpdate.nombre ?? ""}
          onChange={(e) => {
            if (isEdit) {
              setCategoryToUpdate({
                ...categoryToUpdate,
                nombre: e.target.value,
              });
            } else {
              onChange("nombre", e.target.value);
            }
          }}
        />
      </div>

      {/* Descripcion */}
      <div className={styles.FormCategory__FormField}>
        <Text size="xs" color="neutral-primary">
          Descripción
        </Text>
        <Input
          size="xs"
          variant="createSale"
          value={isCreate? category.descripcion : categoryToUpdate.descripcion ?? "" 
          }
          onChange={(e) => {
            if (isEdit) {
              setCategoryToUpdate({
                ...categoryToUpdate,
                descripcion: e.target.value,
              });
            } else {
              onChange("descripcion", e.target.value);
            }
          }}
          disabled={isEdit ? false : readOnly}
        />
      </div>

      {/* Tipo */}
      <div className={styles.FormCategory__FormField}>
        <Text size="xs" color="neutral-primary">
          Tipo de categoría
        </Text>
        <ComboBox
          size="xs"
          variant="createSale"
          value={isCreate ? (category as CreateCategoryPayload).tipo || 'producto' : categoryToUpdate.tipo}
          onChange={(value) => {
             const stringValue = String(value);
             if (isEdit) {
               setCategoryToUpdate({
                 ...categoryToUpdate,
                 tipo: stringValue as 'producto' | 'servicio',
               });
             } else {
               onChange("tipo", stringValue);
             }
           }}
          options={[
            { value: 'producto', label: 'Producto' },
            { value: 'servicio', label: 'Servicio' }
          ]}
          disabled={isEdit ? false : readOnly}
        />
      </div>

      {!readOnly || isEdit ? (
        <Button
          disabled={loading}
          size="medium"
          onClick={isEdit ? handleUpdateCategory : onSubmit}
        >
          Guardar {isEdit ? "actualización" : "nuevo registro"}
        </Button>
      ) : (
        <Button
          disabled={loading}
          size="medium"
          onClick={() => setIsEdit(true)}
        >
          Activar edición
        </Button>
      )}
    </div>
  );
};
