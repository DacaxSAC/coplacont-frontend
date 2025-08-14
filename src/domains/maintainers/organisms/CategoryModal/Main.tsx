import React, { useEffect, useState } from 'react';
import styles from './Main.module.scss';
import { Modal, FormField, Button } from '@/components';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { nombre: string; descripcion: string }) => void;
  // Opcionales para reutilizar el modal en edición
  title?: string;
  description?: string;
  submitLabel?: string;
  initialValues?: Partial<{ nombre: string; descripcion: string }>;
}

export const Main: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = 'Agregar nueva categoría',
  description = 'Ingresa los siguientes datos para registrar una categoría.',
  submitLabel = 'Guardar',
  initialValues,
}) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // Cargar valores iniciales cuando se abre el modal o cambian
  useEffect(() => {
    if (isOpen) {
      setNombre(initialValues?.nombre ?? '');
      setDescripcion(initialValues?.descripcion ?? '');
    }
  }, [isOpen, initialValues?.nombre, initialValues?.descripcion]);

  const handleSubmit = () => {
    if (!nombre.trim()) return;
    
    onSubmit({ nombre: nombre.trim(), descripcion: descripcion.trim() });
    
    // Reset form
    setNombre('');
    setDescripcion('');
    onClose();
  };

  const handleClose = () => {
    // Reset form
    setNombre('');
    setDescripcion('');
    onClose();
  };

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
          disabled={!nombre.trim()}
        >
          {submitLabel}
        </Button>
      }
    >
      <div className={styles.form}>
        <FormField
          type="text"
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ingresa el nombre de la categoría"
          required
        />

        <FormField
          type="text"
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Ingresa una descripción opcional"
        />
      </div>
    </Modal>
  );
};