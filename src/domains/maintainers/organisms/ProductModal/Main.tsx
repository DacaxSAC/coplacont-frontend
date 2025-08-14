import React, { useState, useEffect } from "react";
import styles from "./Main.module.scss";
import { Modal, Button, Text, Input, ComboBox } from "@/components";
import { CategoryService } from "@/domains/maintainers/services";
import type { Category } from "@/domains/maintainers/types";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    descripcion: string;
    unidadMedida: string;
    codigo: string;
    precio: string;
    stockMinimo: number;
    categoriaId: number;
  }) => void | Promise<void>;
  title?: string;
  description?: string;
  submitLabel?: string;
  initialValues?: {
    descripcion: string;
    unidadMedida: string;
    codigo: string;
    precio: string;
    stockMinimo: number;
    categoriaId: number;
  };
}

export const Main: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Creación de nuevo producto",
  description = "Ingresa los siguientes datos para registrar un producto.",
  submitLabel = "Guardar",
  initialValues,
}) => {
  const [descripcion, setDescripcion] = useState("");
  const [unidadMedida, setUnidadMedida] = useState("");
  const [codigo, setCodigo] = useState("");
  const [precio, setPrecio] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (isOpen) {
      CategoryService.getAll()
        .then((data) => setCategories(Array.isArray(data) ? data : []))
        .catch(() => setCategories([]));
    }
  }, [isOpen]);

  // Cargar valores iniciales cuando cambian
  useEffect(() => {
    if (initialValues) {
      setDescripcion(initialValues.descripcion);
      setUnidadMedida(initialValues.unidadMedida);
      setCodigo(initialValues.codigo);
      setPrecio(initialValues.precio);
      setStockMinimo(initialValues.stockMinimo.toString());
      setCategoriaId(initialValues.categoriaId.toString());
    } else {
      // Reset form
      setDescripcion("");
      setUnidadMedida("");
      setCodigo("");
      setPrecio("");
      setStockMinimo("");
      setCategoriaId("");
    }
  }, [initialValues, isOpen]);

  const categoryOptions = categories.map((cat) => ({
    value: cat.id.toString(),
    label: cat.nombre,
  }));

  const handleSubmit = async () => {
    if (!descripcion.trim() || !codigo.trim() || !precio.trim() || !categoriaId)
      return;

    await onSubmit({
      descripcion: descripcion.trim(),
      unidadMedida: unidadMedida.trim(),
      codigo: codigo.trim(),
      precio: precio.trim(),
      stockMinimo: parseInt(stockMinimo) || 0,
      categoriaId: parseInt(categoriaId),
    });

    // Reset form
    setDescripcion("");
    setUnidadMedida("");
    setCodigo("");
    setPrecio("");
    setStockMinimo("");
    setCategoriaId("");
    onClose();
  };

  const handleClose = () => {
    // Reset form
    setDescripcion("");
    setUnidadMedida("");
    setCodigo("");
    setPrecio("");
    setStockMinimo("");
    setCategoriaId("");
    onClose();
  };

  const isFormValid =
    descripcion.trim() && codigo.trim() && precio.trim() && categoriaId;

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      description={description}
      onClose={handleClose}
    >
      <div className={styles.form}>
        <div className={styles.formField}>
          <Text size="xs" color="neutral-primary">
            Código
          </Text>
          <Input
            size="xs"
            variant="createSale"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Ingresa el código del producto"
          />
        </div>

        <div className={styles.formField}>
          <Text size="xs" color="neutral-primary">
            Nombre del producto
          </Text>
          <Input
            size="xs"
            variant="createSale"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ingresa el nombre del producto"
          />
        </div>

        <div className={styles.formField}>
          <Text size="xs" color="neutral-primary">
            Unidad de medida
          </Text>
          <Input
            size="xs"
            variant="createSale"
            value={unidadMedida}
            onChange={(e) => setUnidadMedida(e.target.value)}
            placeholder="Ej: unidad, kg, litro"
          />

          <div className={styles.formField}>
            <Text size="xs" color="neutral-primary">
              Categoría
            </Text>
            <ComboBox
              options={categoryOptions}
              size="xs"
              variant="createSale"
              value={categoriaId}
              onChange={(v) => setCategoriaId(v as string)}
              placeholder="Seleccionar"
            />
          </div>
        </div>

        <div className={styles.formField}>
          <Text size="xs" color="neutral-primary">
            Precio
          </Text>
          <Input
            size="xs"
            variant="createSale"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className={styles.formField}>
          <Text size="xs" color="neutral-primary">
            Stock mínimo
          </Text>
          <Input
            size="xs"
            variant="createSale"
            value={stockMinimo}
            onChange={(e) => setStockMinimo(e.target.value)}
            placeholder="0"
          />
        </div>
        <Button
          variant="primary"
          size="large"
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          {submitLabel}
        </Button>
      </div>
    </Modal>
  );
};
