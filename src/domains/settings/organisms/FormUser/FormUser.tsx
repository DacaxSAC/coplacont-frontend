import styles from "./FormUser.module.scss";
import { Text, Input, ComboBox } from "@/components";
import type { User, CreateUserPayload } from "../../types";
import { documentTypeOptions, userTypeOptions } from "../../types";

type FormUserProps = {
  user: User | CreateUserPayload;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  readOnly?: boolean;
  onChange: (field: keyof CreateUserPayload, value: any) => void;
  onSubmit?: () => void;
  isCreate?: boolean;
};

export const FormUser = ({
  user,
  error,
  loading,
  readOnly = false,
  onChange,
  onSubmit,
  isCreate,
}: FormUserProps) => {
  const handlePersonaChange = (field: string, value: any) => {
    onChange('createPersonaDto', {
      ...(user as CreateUserPayload).createPersonaDto,
      [field]: value,
    });
  };

  return (
    <div className={styles.FormUser}>
      {error && (
        <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', border: '1px solid #fca5a5' }}>
          <Text as="p" size="xs">
            {error}
          </Text>
        </div>
      )}

      <div className={styles.FormUser__Form}>
        {/* Tipo de documento */}
        <div className={styles.FormUser__FormField}>
          <Text size="xs" color="neutral-primary">
            Tipo de documento
          </Text>
          <ComboBox
            size="xs"
            variant="createSale"
            value="1"
            onChange={() => {}}
            options={documentTypeOptions}
            disabled={readOnly}
          />
        </div>

        {/* N° documento */}
        <div className={styles.FormUser__FormField}>
          <Text size="xs" color="neutral-primary">
            N° documento
          </Text>
          <Input
            disabled={readOnly}
            size="xs"
            variant="createSale"
            value={(user as CreateUserPayload).createPersonaDto?.dni || ""}
            onChange={(e) => handlePersonaChange('dni', e.target.value)}
          />
        </div>

        {/* Nombres completos */}
        <div className={styles.FormUser__FormField}>
          <Text size="xs" color="neutral-primary">
            Nombres completos
          </Text>
          <Input
            size="xs"
            variant="createSale"
            value={(user as CreateUserPayload).createPersonaDto?.primerNombre || ""}
            onChange={(e) => handlePersonaChange('primerNombre', e.target.value)}
            disabled={readOnly}
          />
        </div>

        {/* Apellido paterno */}
        <div className={styles.FormUser__FormField}>
          <Text size="xs" color="neutral-primary">
            Apellido paterno
          </Text>
          <Input
            size="xs"
            variant="createSale"
            value={(user as CreateUserPayload).createPersonaDto?.primerApellido || ""}
            onChange={(e) => handlePersonaChange('primerApellido', e.target.value)}
            disabled={readOnly}
          />
        </div>

        {/* Apellido materno */}
        <div className={styles.FormUser__FormField}>
          <Text size="xs" color="neutral-primary">
            Apellido materno
          </Text>
          <Input
            size="xs"
            variant="createSale"
            value={(user as CreateUserPayload).createPersonaDto?.segundoApellido || ""}
            onChange={(e) => handlePersonaChange('segundoApellido', e.target.value)}
            disabled={readOnly}
          />
        </div>

        {/* Teléfono */}
        <div className={styles.FormUser__FormField}>
          <Text size="xs" color="neutral-primary">
            Teléfono
          </Text>
          <Input
            size="xs"
            variant="createSale"
            value={(user as CreateUserPayload).createPersonaDto?.telefono || ""}
            onChange={(e) => handlePersonaChange('telefono', e.target.value)}
            disabled={readOnly}
          />
        </div>

        {/* Dirección */}
        <div className={styles.FormUser__FormField}>
          <Text size="xs" color="neutral-primary">
            Dirección
          </Text>
          <Input
            size="xs"
            variant="createSale"
            value=""
            onChange={() => {}}
            disabled={readOnly}
          />
        </div>

        {/* Correo electrónico */}
        <div className={styles.FormUser__FormField}>
          <Text size="xs" color="neutral-primary">
            Correo electrónico
          </Text>
          <Input
            size="xs"
            variant="createSale"
            value={(user as CreateUserPayload).email || ""}
            onChange={(e) => onChange('email', e.target.value)}
            disabled={readOnly}
          />
        </div>

        {/* Fecha de nacimiento */}
        <div className={styles.FormUser__FormField}>
          <Text size="xs" color="neutral-primary">
            Fecha de nacimiento
          </Text>
          <Input
            type="date"
            size="xs"
            variant="createSale"
            value={
              (() => {
                const fecha = (user as CreateUserPayload).createPersonaDto.fechaNacimiento;
                if (fecha instanceof Date) {
                  return fecha.toISOString().split('T')[0];
                } else if (typeof fecha === 'string') {
                  return new Date(fecha).toISOString().split('T')[0];
                }
                return '';
              })()
            }
            onChange={(e) => {
              const dateValue = new Date(e.target.value);
              onChange('createPersonaDto', { 
                ...(user as CreateUserPayload).createPersonaDto, 
                fechaNacimiento: dateValue 
              });
            }}
            disabled={readOnly}
            placeholder="Seleccionar fecha"
          />
        </div>

        {/* Tipo de usuario */}
        <div className={styles.FormUser__FormField}>
          <Text size="xs" color="neutral-primary">
            Tipo de usuario
          </Text>
          <ComboBox
            size="xs"
            variant="createSale"
            value={(user as CreateUserPayload).idRol?.toString()}
            onChange={(value) => {
              const numValue = Number(value);
              onChange('idRol', numValue);
            }}
            options={userTypeOptions}
            disabled={readOnly}
          />
        </div>
      </div>
    </div>
  );
};