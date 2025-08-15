import { useState } from "react";
import styles from "./FormWarehouse.module.scss";
import { Text, Input, Button } from "@/components";
import type { Warehouse, WarehouseParcial } from "../../types";
import { WarehouseService } from "../../services";

type FormWarehouseProps = {
  warehouse: Warehouse | WarehouseParcial;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  readOnly?: boolean;
  onChange: (field: keyof WarehouseParcial, value: string) => void;
  onSubmit?: () => void;
  isCreate? : boolean
};

export const FormWarehouse = ({
  warehouse,
  error,
  //setError,
  loading,
  setLoading,
  readOnly = false,
  onChange,
  onSubmit,
  isCreate = false,
}: FormWarehouseProps) => {
  const [warehouseToUpdate, setWarehouseToUpdate] = useState<WarehouseParcial>({
    nombre: warehouse.nombre,
    ubicacion: warehouse.ubicacion,
    descripcion: warehouse.descripcion,
    responsable: warehouse.responsable,
    telefono: warehouse.telefono,
    estado: warehouse.estado,
  });

  const [isEdit, setIsEdit] = useState(false);

  const handleUpdateWarehouse = async () => {
    setLoading(true);
    const response = await WarehouseService.update(
      warehouse.id!,
      warehouseToUpdate
    );
    console.log(response);
    setIsEdit(false);

    setLoading(false);
  };

  return (
    <div className={styles.FormWarehouse__Form}>
      {error && (
        <Text as="p" color="danger" size="xs">
          {error}
        </Text>
      )}

      {/* Tipo de Entidad */}
      <div className={styles.FormWarehouse__FormField}>
        <Text size="xs" color="neutral-primary">
          Nombre del almacen
        </Text>
        <Input
          disabled={isEdit? false : readOnly}
          size="xs"
          variant="createSale"
          value={isCreate ? warehouse.nombre : warehouseToUpdate.nombre ?? ""}
          onChange={(e) => {
            if (isEdit) {
              setWarehouseToUpdate({
                ...warehouseToUpdate,
                nombre: e.target.value,
              });
            } else {
              onChange("nombre", e.target.value);
            }
          }}
        />
      </div>

      {/* Número de Documento */}
      <div className={styles.FormWarehouse__FormField}>
        <Text size="xs" color="neutral-primary">
          Ubicación del almacen
        </Text>
        <Input
          disabled={isEdit? false : readOnly}
          size="xs"
          variant="createSale"
          value={isCreate ? warehouse.ubicacion : warehouseToUpdate.ubicacion}
          onChange={(e) =>{
            if(isEdit){
              setWarehouseToUpdate({
                ...warehouseToUpdate,
                ubicacion: e.target.value,
              });
            }else{
              onChange("ubicacion", e.target.value);
            }
            }}
        />
      </div>

      <div className={styles.FormWarehouse__FormField}>
        <Text size="xs" color="neutral-primary">
          Responsable
        </Text>
        <Input
          size="xs"
          variant="createSale"
          value={isCreate ? warehouse.responsable : warehouseToUpdate.responsable ?? ""
          }
          onChange={(e) => {
            if (isEdit) {
              setWarehouseToUpdate({
                ...warehouseToUpdate,
                responsable: e.target.value,
              });
            } else {
              onChange("responsable", e.target.value);
            }
          }}
          disabled={isEdit ? false : readOnly}
        />
      </div>

      {/* Telefono */}
      <div className={styles.FormWarehouse__FormField}>
        <Text size="xs" color="neutral-primary">
          Telefono
        </Text>
        <Input
          size="xs"
          variant="createSale"
          value={isCreate ? warehouse.telefono : warehouseToUpdate.telefono ?? "" }
          onChange={(e) => {
            if (isEdit) {
              setWarehouseToUpdate({
                ...warehouseToUpdate,
                telefono: e.target.value,
              });
              onChange("telefono", e.target.value);
            } else {
              onChange("telefono", e.target.value);
            }
          }}
          disabled={isEdit ? false : readOnly}
        />
      </div>
      {/* Telefono */}
      <div className={styles.FormWarehouse__FormField}>
        <Text size="xs" color="neutral-primary">
          Descripción
        </Text>
        <Input
          size="xs"
          variant="createSale"
          value={isCreate ? warehouse.descripcion : warehouseToUpdate.descripcion ?? "" 
          }
          onChange={(e) => {
            if (isEdit) {
              setWarehouseToUpdate({
                ...warehouseToUpdate,
                descripcion: e.target.value,
              });
            } else {
              onChange("descripcion", e.target.value);
            }
          }}
          disabled={isEdit ? false : readOnly}
        />
      </div>

      {!readOnly || isEdit ? (
        <Button
          disabled={loading}
          size="medium"
          onClick={isEdit ? handleUpdateWarehouse : onSubmit}
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
