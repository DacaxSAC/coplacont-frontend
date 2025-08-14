import styles from './CreateFormEntidad.module.scss';
import type { Entidad, EntidadParcial } from "../../services";
import { Text, ComboBox, Input, Button } from "@/components";

type CreateFormEntidadProps = {
  entidad: Entidad | EntidadParcial;
  error: string;
  loading: boolean;
  onChange: (field: keyof Entidad, value: string | number | boolean) => void;
  onSubmit: () => void;
};

export const CreateFormEntidad = ({
  entidad,
  error,
  loading,
  onChange,
  onSubmit
}: CreateFormEntidadProps) => {
  return (
    <div className={styles.CreateFormEntidad__Form}>
      {error && (
        <Text as="p" color="danger" size="xs">
          {error}
        </Text>
      )}

      {/* Tipo de Entidad */}
      <div className={styles.CreateFormEntidad__FormField}>
        <Text size="xs" color="neutral-primary">
          Tipo de Entidad
        </Text>
        <ComboBox
          options={[
            { label: "JURIDICA", value: "JURIDICA" },
            { label: "NATURAL", value: "NATURAL" },
          ]}
          size="xs"
          variant="createSale"
          value={entidad.tipo}
          onChange={(value) => onChange("tipo", value)}
        />
      </div>

      {/* Número de Documento */}
      <div className={styles.CreateFormEntidad__FormField}>
        <Text size="xs" color="neutral-primary">
          Número de Documento
        </Text>
        <Input
          disabled={!entidad.tipo}
          size="xs"
          variant="createSale"
          value={entidad.numeroDocumento}
          onChange={(e) => onChange("numeroDocumento", e.target.value)}
        />
      </div>

      {/* Razon Social o Datos Naturales */}
      {entidad.tipo === "JURIDICA" && (
        <div className={styles.CreateFormEntidad__FormField}>
          <Text size="xs" color="neutral-primary">
            Razon Social
          </Text>
          <Input
            size="xs"
            variant="createSale"
            value={entidad.razonSocial || ""}
            onChange={(e) => onChange("razonSocial", e.target.value)}
          />
        </div>
      )}

      {entidad.tipo === "NATURAL" && (
        <>
          <div className={styles.CreateFormEntidad__FormField}>
            <Text size="xs" color="neutral-primary">
              Nombre
            </Text>
            <Input
              size="xs"
              variant="createSale"
              value={entidad.nombre || ""}
              onChange={(e) => onChange("nombre", e.target.value)}
            />
          </div>
          <div className={styles.CreateFormEntidad__FormField}>
            <Text size="xs" color="neutral-primary">
              Apellido Paterno
            </Text>
            <Input
              size="xs"
              variant="createSale"
              value={entidad.apellidoPaterno || ""}
              onChange={(e) => onChange("apellidoPaterno", e.target.value)}
            />
          </div>
          <div className={styles.CreateFormEntidad__FormField}>
            <Text size="xs" color="neutral-primary">
              Apellido Materno
            </Text>
            <Input
              size="xs"
              variant="createSale"
              value={entidad.apellidoMaterno || ""}
              onChange={(e) => onChange("apellidoMaterno", e.target.value)}
            />
          </div>
        </>
      )}

      {/* Direccion */}
      <div className={styles.CreateFormEntidad__FormField}>
        <Text size="xs" color="neutral-primary">
          Direccion
        </Text>
        <Input
          size="xs"
          variant="createSale"
          value={entidad.direccion}
          onChange={(e) => onChange("direccion", e.target.value)}
        />
      </div>

      {/* Telefono */}
      <div className={styles.CreateFormEntidad__FormField}>
        <Text size="xs" color="neutral-primary">
          Telefono
        </Text>
        <Input
          size="xs"
          variant="createSale"
          value={entidad.telefono}
          onChange={(e) => onChange("telefono", e.target.value)}
        />
      </div>

      {/* Botón Guardar */}
      <Button disabled={loading} size="medium" onClick={onSubmit}>
        Guardar
      </Button>
    </div>
  );
};
