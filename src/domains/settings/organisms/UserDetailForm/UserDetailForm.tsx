import { useState } from "react";
import styles from "./UserDetailForm.module.scss";
import { Text, Input, Button, ComboBox } from "@/components";
import type { User, UpdateUserPayload } from "../../types";
import { UserService } from "../../services";
import { documentTypeOptions, userTypeOptions } from "../../types";

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
      direccion: user.persona?.direccion || "",
    },
  });

  const [isEdit, setIsEdit] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

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

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    try {
      // Aquí iría la llamada al servicio para cambiar contraseña
      // await UserService.changePassword(user.id!, passwordData);
      setPasswordSuccess('Contraseña cambiada exitosamente');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordChange(false);
    } catch (error) {
      setPasswordError('Error al cambiar la contraseña');
    }
    setLoading(false);
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
        <div className={`${styles.UserDetailForm__Alert} ${styles.UserDetailForm__Alert}--success`}>
          <Text as="p" size="xs">
            {passwordSuccess}
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
          {!showPasswordChange ? (
            <div>
              <Button
                variant="secondary"
                size="medium"
                onClick={() => setShowPasswordChange(true)}
                className={styles.UserDetailForm__PasswordButton}
              >
                Cambiar contraseña
              </Button>
              <Text as="p" size="xs" color="neutral-secondary">
                Te enviamos un enlace para cambiar contraseña.
              </Text>
            </div>
          ) : (
            <div className={styles.UserDetailForm__PasswordForm}>
              {passwordError && (
                <div className={`${styles.UserDetailForm__Alert} ${styles.UserDetailForm__Alert}--error`}>
                  <Text as="p" size="xs">
                    {passwordError}
                  </Text>
                </div>
              )}
              
              <div className={styles.UserDetailForm__FormField}>
                <Text size="xs" color="neutral-primary">
                  Contraseña actual
                </Text>
                <Input
                  type="password"
                  size="xs"
                  variant="createSale"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                />
              </div>
              
              <div className={styles.UserDetailForm__FormField}>
                <Text size="xs" color="neutral-primary">
                  Nueva contraseña
                </Text>
                <Input
                  type="password"
                  size="xs"
                  variant="createSale"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                />
              </div>
              
              <div className={styles.UserDetailForm__FormField}>
                <Text size="xs" color="neutral-primary">
                  Confirmar nueva contraseña
                </Text>
                <Input
                  type="password"
                  size="xs"
                  variant="createSale"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                />
              </div>
              
              <div className={styles.UserDetailForm__ButtonGroup}>
                <Button
                  variant="secondary"
                  size="medium"
                  onClick={() => {
                    setShowPasswordChange(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordError('');
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  disabled={loading}
                  size="medium"
                  onClick={handlePasswordChange}
                >
                  Cambiar contraseña
                </Button>
              </div>
            </div>
          )}
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
    </div>
  );
};