import { useState, useEffect } from "react";
import styles from "./UserDetailForm.module.scss";
import { Text, Input, Button, ComboBox, Loader } from "@/components";
import type { User, UpdateUserPayload } from "../../types";
import { UserService } from "../../services";
import { documentTypeOptions } from "../../types";
import { AuthService } from "@/domains/auth";

type UserDetailFormProps = {
  user: User;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  readOnly?: boolean;
};

export const UserDetailForm = ({
  user,
  error,
  loading,
  setLoading,
  readOnly = false,
}: UserDetailFormProps) => {
  const [userToUpdate, setUserToUpdate] = useState<UpdateUserPayload>({
    email: user.email,
    persona: {
      primerNombre: user.persona?.primerNombre || "",
      segundoNombre: user.persona?.segundoNombre || "",
      primerApellido: user.persona?.primerApellido || "",
      segundoApellido: user.persona?.segundoApellido || "",
      fechaNacimiento: (() => {
        const fecha = user.persona?.fechaNacimiento;
        if (fecha instanceof Date) {
          return fecha;
        } else if (typeof fecha === 'string') {
          return new Date(fecha);
        }
        return new Date();
      })(),
      telefono: user.persona?.telefono || "",
      dni: user.persona?.dni || "",
      tipoDocumento: user.persona?.tipoDocumento || "DNI",
      direccion: user.persona?.direccion || "",
    },
  });

  const [isEdit, setIsEdit] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (passwordSuccess) {
      const timer = setTimeout(() => {
        setPasswordSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [passwordSuccess]);

  // Auto-hide error message after 5 seconds
  useEffect(() => {
    if (passwordError) {
      const timer = setTimeout(() => {
        setPasswordError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [passwordError]);



  const handleUpdateUser = async () => {
    setLoading(true);
    try {
      await UserService.update(user.id!, userToUpdate);
      setIsEdit(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
    setLoading(false);
  };

  const handlePersonaChange = (field: string, value: any) => {
    setUserToUpdate({
      ...userToUpdate,
      persona: {
        ...userToUpdate.persona,
        [field]: value,
      },
    });
  };

  const handlePasswordChange = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setPasswordError('');
    setPasswordSuccess('');
    
    setPasswordLoading(true);
    try {
      const response = await AuthService.recoverPassword(user.email);
      
      if (response.success) {
        setPasswordSuccess('Correo de recuperación enviado exitosamente. Revisa tu bandeja de entrada.');
      } else {
        setPasswordError(response.message || 'Error al enviar el correo de recuperación');
      }
    } catch (error) {
      console.error('Error en handlePasswordChange:', error);
      setPasswordError('Error al solicitar el cambio de contraseña');
    }
    setPasswordLoading(false);
  };

  return (
    <div className={styles.UserDetailForm__Container}>
      {error && (
        <div className={`${styles.UserDetailForm__Alert} ${styles.UserDetailForm__Alert}--error`}>
          <Text as="p" size="xs">
            {error}
          </Text>
        </div>
      )}

      {passwordSuccess && (
        <div className={`${styles.UserDetailForm__Alert} ${styles['UserDetailForm__Alert--success']}`}>
          <Text as="p" size="xs">
            {passwordSuccess}
          </Text>
        </div>
      )}

      {passwordError && (
        <div className={`${styles.UserDetailForm__Alert} ${styles['UserDetailForm__Alert--error']}`}>
          <Text as="p" size="xs">
            {passwordError}
          </Text>
        </div>
      )}

      <div className={styles.UserDetailForm__Section}>
        <div className={styles.UserDetailForm__SectionTitle}>
          <Text as="h3" size="md" weight={500}>
            Perfil
          </Text>
        </div>
        
        <div className={styles.UserDetailForm__FormGrid}>
          {/* Tipo de documento */}
          <div className={styles.UserDetailForm__FormField}>
            <Text size="xs" color="neutral-primary">
              Tipo de documento
            </Text>
            <ComboBox
              size="xs"
              variant="createSale"
              options={documentTypeOptions}
              value={user.persona?.tipoDocumento || "DNI"}
              onChange={(value) => handlePersonaChange('tipoDocumento', value)}
              disabled={!isEdit}
              placeholder="Seleccionar"
            />
          </div>

          {/* Número de documento */}
          <div className={styles.UserDetailForm__FormField}>
            <Text size="xs" color="neutral-primary">
              N° Documento
            </Text>
            <Input
              disabled={!isEdit}
              size="xs"
              variant="createSale"
              value={userToUpdate.persona?.dni || ""}
              onChange={(e) => handlePersonaChange('dni', e.target.value)}
            />
          </div>

          {/* Nombres */}
          <div className={styles.UserDetailForm__FormField}>
            <Text size="xs" color="neutral-primary">
              Nombres
            </Text>
            <Input
              size="xs"
              variant="createSale"
              value={userToUpdate.persona?.primerNombre || ""}
              onChange={(e) => handlePersonaChange('primerNombre', e.target.value)}
              disabled={!isEdit}
              placeholder="Texto"
            />
          </div>

          {/* Apellido paterno */}
          <div className={styles.UserDetailForm__FormField}>
            <Text size="xs" color="neutral-primary">
              Apellido paterno
            </Text>
            <Input
              size="xs"
              variant="createSale"
              value={userToUpdate.persona?.primerApellido || ""}
              onChange={(e) => handlePersonaChange('primerApellido', e.target.value)}
              disabled={!isEdit}
              placeholder="Texto"
            />
          </div>

          {/* Apellido materno */}
          <div className={styles.UserDetailForm__FormField}>
            <Text size="xs" color="neutral-primary">
              Apellido materno
            </Text>
            <Input
              size="xs"
              variant="createSale"
              value={userToUpdate.persona?.segundoApellido || ""}
              onChange={(e) => handlePersonaChange('segundoApellido', e.target.value)}
              disabled={!isEdit}
              placeholder="Texto"
            />
          </div>

          {/* Correo electrónico */}
          <div className={styles.UserDetailForm__FormField}>
            <Text size="xs" color="neutral-primary">
              Correo electrónico
            </Text>
            <Input
              size="xs"
              variant="createSale"
              value={userToUpdate.email}
              onChange={(e) => setUserToUpdate({ ...userToUpdate, email: e.target.value })}
              disabled={!isEdit}
              placeholder="Texto"
            />
          </div>

          {/* Fecha nacimiento */}
          <div className={styles.UserDetailForm__FormField}>
            <Text size="xs" color="neutral-primary">
              Fecha nacimiento
            </Text>
            <Input
              type="date"
              size="xs"
              variant="createSale"
              value={
                (() => {
                  const fecha = userToUpdate.persona?.fechaNacimiento;
                  if (fecha instanceof Date) {
                    return fecha.toISOString().split('T')[0];
                  } else if (typeof fecha === 'string') {
                    return new Date(fecha).toISOString().split('T')[0];
                  }
                  return '';
                })()
              }
              onChange={(e) => {
                if (e.target.value) {
                  handlePersonaChange('fechaNacimiento', new Date(e.target.value));
                }
              }}
              disabled={!isEdit}
              placeholder="Texto"
            />
          </div>

          {/* Teléfono */}
          <div className={styles.UserDetailForm__FormField}>
            <Text size="xs" color="neutral-primary">
              Teléfono
            </Text>
            <Input
              size="xs"
              variant="createSale"
              value={userToUpdate.persona?.telefono || ""}
              onChange={(e) => handlePersonaChange('telefono', e.target.value)}
              disabled={!isEdit}
              placeholder="Texto"
            />
          </div>

          {/* Dirección */}
          <div className={styles.UserDetailForm__FormField}>
            <Text size="xs" color="neutral-primary">
              Dirección
            </Text>
            <Input
              size="xs"
              variant="createSale"
              value={userToUpdate.persona?.direccion || ""}
              onChange={(e) => handlePersonaChange('direccion', e.target.value)}
              disabled={!isEdit}
              placeholder="Texto"
            />
          </div>
        </div>
      </div>

      {/* Sección de Contraseña */}
      <div className={styles.UserDetailForm__Section}>
        <div className={styles.UserDetailForm__SectionTitle}>
          <Text as="h3" size="md" weight={500}>
            Contraseña
          </Text>
        </div>
        
        <div className={styles.UserDetailForm__PasswordSection}>
          <div>
            <Button
              type="button"
              variant="secondary"
              size="medium"
              onClick={handlePasswordChange}
              disabled={passwordLoading}
              className={styles.UserDetailForm__PasswordButton}
            >
              {passwordLoading ? 'Enviando correo...' : 'Cambiar contraseña'}
            </Button>
            

            <Text as="p" size="xs" color="neutral-secondary">
              Te enviamos un enlace para cambiar contraseña.
            </Text>
          </div>
        </div>
      </div>

      {/* Botones principales */}
      <div className={styles.UserDetailForm__ButtonGroup}>
        {!isEdit ? (
          <Button
            disabled={loading}
            size="medium"
            onClick={() => setIsEdit(true)}
          >
            Activar edición
          </Button>
        ) : (
          <Button
            disabled={loading}
            size="medium"
            onClick={handleUpdateUser}
          >
            Guardar actualización
          </Button>
        )}
      </div>
      
      {passwordLoading && <Loader text="Enviando correo de recuperación..." />}
    </div>
  );
};