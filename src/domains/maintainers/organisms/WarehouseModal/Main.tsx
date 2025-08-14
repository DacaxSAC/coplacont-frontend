import React, { useState, useEffect } from 'react';
import styles from './Main.module.scss';
import { Modal, FormField, Button } from '@/components';
import type { CreateWarehousePayload, UpdateWarehousePayload } from '../../types';

// Allow bivariance on callback parameter so consumers can pass a narrower type (create or update)
type BivariantCallback<T> = { bivarianceHack(arg: T): void | Promise<void> }['bivarianceHack'];

interface CreateWarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: BivariantCallback<CreateWarehousePayload | UpdateWarehousePayload>;
  title?: string;
  description?: string;
  submitLabel?: string;
  initialValues?: {
    nombre: string;
    ubicacion: string;
    descripcion: string;
    capacidadMaxima: number;
    responsable: string;
    telefono: string;
  };
}

export const Main: React.FC<CreateWarehouseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = 'Agregar nuevo almacén',
  description = 'Ingresa los siguientes datos para registrar un almacén.',
  submitLabel = 'Guardar',
  initialValues
}) => {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [capacidadMaxima, setCapacidadMaxima] = useState('');
  const [responsable, setResponsable] = useState('');
  const [telefono, setTelefono] = useState('');

  useEffect(() => {
    if (initialValues && isOpen) {
      setNombre(initialValues.nombre ?? '');
      setUbicacion(initialValues.ubicacion ?? '');
      setDescripcion(initialValues.descripcion ?? '');
      setCapacidadMaxima(String(initialValues.capacidadMaxima ?? ''));
      setResponsable(initialValues.responsable ?? '');
      setTelefono(initialValues.telefono ?? '');
    }
    if (!initialValues && isOpen) {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues, isOpen]);

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