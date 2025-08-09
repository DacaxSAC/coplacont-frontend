/**
 * Tipos relacionados con la autenticación
 */

/**
 * Datos de entrada para el login
 */
export interface ILoginRequest {
  email: string;
  contrasena: string;
}

/**
 * Respuesta del endpoint de login
 */
export interface ILoginResponse {
  email: string;
  jwt: string;
}

/**
 * Información del usuario autenticado
 */
export interface IAuthUser {
  email: string;
  roles?: Array<{
    id: number;
    nombre: string;
  }>;
  permissions?: string[];
}

/**
 * Estado de autenticación de la aplicación
 */
export interface IAuthState {
  user: IAuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Interfaz para los datos del formulario de login
 */
export interface ILoginFormData {
  email: string;
  password: string;
}

/**
 * Props para el componente LoginForm
 */
export interface ILoginFormProps {
  /** Función que se ejecuta al enviar el formulario */
  onSubmit: (data: ILoginFormData) => void;
  /** Indica si el formulario está en proceso de envío */
  isLoading?: boolean;
  /** Mensaje de error general del formulario */
  error?: string;
}

/**
 * Interfaz para los datos del formulario de nueva contraseña
 */
export interface INewPasswordFormData {
  password: string;
  confirmPassword: string;
}

/**
 * Props para el componente NewPasswordForm
 */
export interface INewPasswordFormProps {
  /** Función que se ejecuta al enviar el formulario */
  onSubmit: (data: INewPasswordFormData) => void;
  /** Indica si el formulario está en proceso de envío */
  isLoading?: boolean;
  /** Mensaje de error general del formulario */
  error?: string;
  /** Mensaje de éxito cuando se guarda la contraseña */
  success?: string;
}

/**
 * Interfaz para los datos del formulario de recuperación de contraseña
 */
export interface IRecoveryPasswordFormData {
  email: string;
}

/**
 * Props para el componente RecoveryPasswordForm
 */
export interface IRecoveryPasswordFormProps {
  /** Función que se ejecuta al enviar el formulario */
  onSubmit: (data: IRecoveryPasswordFormData) => void;
  /** Indica si el formulario está en proceso de envío */
  isLoading?: boolean;
  /** Mensaje de error general del formulario */
  error?: string;
  /** Mensaje de éxito cuando se envía el formulario */
  success?: string;
}