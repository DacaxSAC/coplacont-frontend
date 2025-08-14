import React, { useState, useEffect } from 'react';
import styles from './Main.module.scss';
import { Modal, FormField, Button } from '@/components';
import { CategoryService } from '@/domains/maintainers/services';
import type { Category } from '@/domains/maintainers/types';

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
  }) => void;
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
  title = 'Creación de nuevo producto',
  description = 'Ingresa los siguientes datos para registrar un producto.',
  submitLabel = 'Guardar',
  initialValues
}) => {
  const [descripcion, setDescripcion] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');
  const [codigo, setCodigo] = useState('');
  const [precio, setPrecio] = useState('');
  const [stockMinimo, setStockMinimo] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
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
      setDescripcion('');
      setUnidadMedida('');
      setCodigo('');
      setPrecio('');
      setStockMinimo('');
      setCategoriaId('');
    }
  }, [initialValues, isOpen]);

  const categoryOptions = categories.map(cat => ({
    value: cat.id.toString(),
    label: cat.nombre
  }));

  const handleSubmit = () => {
    if (!descripcion.trim() || !codigo.trim() || !precio.trim() || !categoriaId) return;
    
    onSubmit({
      descripcion: descripcion.trim(),
      unidadMedida: unidadMedida.trim(),
      codigo: codigo.trim(),
      precio: precio.trim(),
      stockMinimo: parseInt(stockMinimo) || 0,
      categoriaId: parseInt(categoriaId)
    });
    
    // Reset form
    setDescripcion('');
    setUnidadMedida('');
    setCodigo('');
    setPrecio('');
    setStockMinimo('');
    setCategoriaId('');
    onClose();
  };

  const handleClose = () => {
    // Reset form
    setDescripcion('');
    setUnidadMedida('');
    setCodigo('');
    setPrecio('');
    setStockMinimo('');
    setCategoriaId('');
    onClose();
  };

  const isFormValid = descripcion.trim() && codigo.trim() && precio.trim() && categoriaId;

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      description={description}
      onClose={handleClose}
      footer={
        <Button
          variant="primary"
          size="large"
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          {submitLabel}
        </Button>
      }
    >
      <div className={styles.form}>
        <FormField
          type="text"
          label="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Ingresa el código del producto"
          required
        />

        <FormField
          type="text"
          label="Nombre del producto"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Ingresa el nombre del producto"
          required
        />

        <FormField
          type="text"
          label="Descripción"
          value={unidadMedida}
          onChange={(e) => setUnidadMedida(e.target.value)}
          placeholder="Ingresa la descripción"
        />

        <div className={styles.row}>
          <FormField
            type="text"
            label="Unidad de medida"
            value={unidadMedida}
            onChange={(e) => setUnidadMedida(e.target.value)}
            placeholder="Ej: unidad, kg, litro"
          />
          
          <FormField
            type="combobox"
            label="Categoría"
            options={categoryOptions}
            value={categoriaId}
            onChange={(v) => setCategoriaId(v as string)}
            placeholder="Seleccionar"
            required
          />
        </div>

        <div className={styles.row}>
          <FormField
            type="text"
            label="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="0.00"
            required
          />
          
          <FormField
            type="number"
            label="Stock mínimo"
            value={stockMinimo}
            onChange={(e) => setStockMinimo(e.target.value)}
            placeholder="0"
          />
        </div>
      </div>
    </Modal>
  );
};