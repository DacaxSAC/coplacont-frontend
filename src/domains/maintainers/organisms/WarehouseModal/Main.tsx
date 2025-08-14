import React, { useState } from 'react';
import styles from './Main.module.scss';
import { Modal, FormField, Button } from '@/components';
import type { CreateWarehousePayload } from '../../types';

interface CreateWarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateWarehousePayload) => void;
}

export const Main: React.FC<CreateWarehouseModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [capacidadMaxima, setCapacidadMaxima] = useState('');
  const [responsable, setResponsable] = useState('');
  const [telefono, setTelefono] = useState('');

  const handleSubmit = () => {
    if (!nombre.trim() || !ubicacion.trim() || !responsable.trim()) return;
    
    onSubmit({
      nombre: nombre.trim(),
      ubicacion: ubicacion.trim(),
      descripcion: descripcion.trim(),
      capacidadMaxima: parseInt(capacidadMaxima) || 0,
      responsable: responsable.trim(),
      telefono: telefono.trim()
    });
    
    // Reset form
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setNombre('');
    setUbicacion('');
    setDescripcion('');
    setCapacidadMaxima('');
    setResponsable('');
    setTelefono('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isFormValid = nombre.trim() && ubicacion.trim() && responsable.trim();

  return (
    <Modal
      isOpen={isOpen}
      title="Agregar nuevo almacén"
      description="Ingresa los siguientes datos para registrar un almacén."
      onClose={handleClose}
      footer={
        <Button
          variant="primary"
          size="large"
          onClick={handleSubmit}
          disabled={!isFormValid}
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
          placeholder="Ingresa el nombre del almacén"
          required
        />

        <FormField
          type="text"
          label="Ubicación"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          placeholder="Ingresa la ubicación del almacén"
          required
        />

        <FormField
          type="text"
          label="Responsable"
          value={responsable}
          onChange={(e) => setResponsable(e.target.value)}
          placeholder="Ingresa el nombre del responsable"
          required
        />

        <FormField
          type="text"
          label="Capacidad"
          value={capacidadMaxima}
          onChange={(e) => setCapacidadMaxima(e.target.value)}
          placeholder="Capacidad máxima del almacén"
        />

        <FormField
          type="text"
          label="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Teléfono de contacto"
        />

        <FormField
          type="text"
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción opcional del almacén"
        />
      </div>
    </Modal>
  );
};