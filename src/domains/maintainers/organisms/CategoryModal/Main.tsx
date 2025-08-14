import React, { useState } from 'react';
import styles from './Main.module.scss';
import { Modal, FormField, Button } from '@/components';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { nombre: string; descripcion: string }) => void;
}

export const Main: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

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
      title="Agregar nueva categoría"
      description="Ingresa los siguientes datos para registrar una categoría."
      onClose={handleClose}
      footer={
        <Button
          variant="primary"
          size="large"
          onClick={handleSubmit}
          disabled={!nombre.trim()}
        >
          Guardar
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