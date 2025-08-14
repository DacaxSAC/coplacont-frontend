import { useState } from 'react';
import styles from './FormEntidad.module.scss';
import type { Entidad, EntidadParcial, EntidadToUpdate } from "../../services";
import { Text, ComboBox, Input, Button } from "@/components";
import { EntitiesService } from "../../services";

type FormEntidadProps = {
  entidad: Entidad | EntidadParcial;
  error: string;
  loading: boolean;
  readOnly?: boolean;
  onChange: (field: keyof Entidad, value: string | number | boolean) => void;
  onSubmit?: () => void;
};

export const FormEntidad = ({
  entidad,
  error,
  loading,
  readOnly = false,
  onChange,
  onSubmit
}: FormEntidadProps) => {


  const [entidadToUpdate, setEntidadToUpdate] = useState<EntidadToUpdate>({
    nombre: entidad.nombre,
    apellidoMaterno: entidad.apellidoMaterno,
    apellidoPaterno: entidad.apellidoPaterno,
    razonSocial: entidad.razonSocial,
    direccion: entidad.direccion,
    telefono: entidad.telefono,
  });

  const [isEdit, setIsEdit] = useState(false);

  const handleUpdateEntidad = async () => {
    const response = await EntitiesService.updateEntidad(entidad.id!,entidadToUpdate);
    if(response.success){
      setIsEdit(false);
    }
    console.log(entidadToUpdate)
  }

  return (
    <div className={styles.FormEntidad__Form}>
      {error && (
        <Text as="p" color="danger" size="xs">
          {error}
        </Text>
      )}

      {/* Tipo de Entidad */}
      <div className={styles.FormEntidad__FormField}>
        <Text size="xs" color="neutral-primary">Tipo de Entidad</Text>
        <ComboBox
          options={[
            { label: "JURIDICA", value: "JURIDICA" },
            { label: "NATURAL", value: "NATURAL" },
          ]}
          size="xs"
          variant="createSale"
          value={entidad.tipo}
          onChange={(value) => onChange("tipo", value)}
          disabled={readOnly}
        />
      </div>

      {/* Número de Documento */}
      <div className={styles.FormEntidad__FormField}>
        <Text size="xs" color="neutral-primary">Número de Documento</Text>
        <Input
          disabled={readOnly || !entidad.tipo}
          size="xs"
          variant="createSale"
          value={entidad.numeroDocumento}
          onChange={(e) => onChange("numeroDocumento", e.target.value)}
        />
      </div>

      {/* Razon Social o Datos Naturales */}
      {entidad.tipo === "JURIDICA" && (
        <div className={styles.FormEntidad__FormField}>
          <Text size="xs" color="neutral-primary">Razon Social</Text>
          <Input
            size="xs"
            variant="createSale"
            value={isEdit ? entidadToUpdate.razonSocial ?? "" : entidad.razonSocial ?? ""}
            onChange={(e) => {
              if(isEdit){
                setEntidadToUpdate({
                  ...entidadToUpdate,
                  razonSocial: e.target.value
                })
              }else{
                onChange("razonSocial", e.target.value)
              } 
            }}
            disabled={isEdit? false : readOnly}
          />
        </div>
      )}

      {entidad.tipo === "NATURAL" && (
        <>
          <div className={styles.FormEntidad__FormField}>
            <Text size="xs" color="neutral-primary">Nombre</Text>
            <Input
              size="xs"
              variant="createSale"
              value={isEdit ? entidadToUpdate.nombre ?? "" : entidad.nombre ?? ""}
              onChange={(e) => {
                if(isEdit){
                  setEntidadToUpdate({
                    ...entidadToUpdate,
                    nombre: e.target.value
                  })
                }else{
                  onChange("nombre", e.target.value)
                } 
              }}
              disabled={isEdit? false : readOnly}
            />
          </div>
          <div className={styles.FormEntidad__FormField}>
            <Text size="xs" color="neutral-primary">Apellido Paterno</Text>
            <Input
              size="xs"
              variant="createSale"
              value={isEdit ? entidadToUpdate.apellidoPaterno ?? "" : entidad.apellidoPaterno ?? ""}
              onChange={(e) => {
                if(isEdit){
                  setEntidadToUpdate({
                    ...entidadToUpdate,
                    apellidoPaterno: e.target.value
                  })
                }else{
                  onChange("apellidoPaterno", e.target.value)
                } 
              }}
              disabled={isEdit? false : readOnly}
            />
          </div>
          <div className={styles.FormEntidad__FormField}>
            <Text size="xs" color="neutral-primary">Apellido Materno</Text>
            <Input
              size="xs"
              variant="createSale"
              value={isEdit ? entidadToUpdate.apellidoMaterno?? "" : entidad.apellidoMaterno ?? ""}
              onChange={(e) => {
                if(isEdit){
                  setEntidadToUpdate({
                    ...entidadToUpdate,
                    apellidoMaterno: e.target.value
                  })
                }else{
                  onChange("apellidoMaterno", e.target.value)
                } 
              }}
              disabled={isEdit? false : readOnly}
            />
          </div>
        </>
      )}

      {/* Direccion */}
      <div className={styles.FormEntidad__FormField}>
        <Text size="xs" color="neutral-primary">Direccion</Text>
        <Input
          size="xs"
          variant="createSale"
          value={isEdit?entidadToUpdate.direccion:entidad.direccion}
          onChange={(e) => {
            if(isEdit){
              setEntidadToUpdate({
                ...entidadToUpdate,
                direccion: e.target.value
              })
            }else{
              onChange("direccion", e.target.value)
            } 
          }}
          disabled={isEdit? false : readOnly}
        />
      </div>

      {/* Telefono */}
      <div className={styles.FormEntidad__FormField}>
        <Text size="xs" color="neutral-primary">Telefono</Text>
        <Input
          size="xs"
          variant="createSale"
          value={isEdit ? entidadToUpdate.telefono ?? "" : entidad.telefono ?? ""}
          onChange={(e) =>{
            if(isEdit){
              setEntidadToUpdate({
                ...entidadToUpdate,
                telefono: e.target.value
              })
            }else{
              onChange("telefono", e.target.value)
            } 
          }}
          disabled={isEdit? false : readOnly}
        />
      </div>

      {!readOnly || isEdit ? (
        <Button disabled={loading} size="medium" onClick={isEdit? handleUpdateEntidad : onSubmit}>
          Guardar {isEdit? "actualización" : "nuevo registro"}
        </Button>
      ):(
        <Button disabled={loading} size="medium" onClick={() => setIsEdit(true)}>
          Activar edición
        </Button>
      )
      }
    </div>
  );
};
