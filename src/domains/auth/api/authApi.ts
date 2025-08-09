import { apiClient } from "../../../shared/services/api";
import { AUTH_ENDPOINTS } from "./endpoints";

export const authApi = {
    login: (payload: {email: string, contrasena: string}) => apiClient.post(AUTH_ENDPOINTS.LOGIN, payload),
    recoverPassword: (payload: {email: string}) => apiClient.post(AUTH_ENDPOINTS.RECOVER_PASSWORD, payload),
    validateResetPassword: (payload: {token: string, contrasena: string}) => apiClient.post(AUTH_ENDPOINTS.VALIDATE_RESET_PASSWORD, payload),
    resetPassword: (payload: {token: string, password: string}) => apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, payload),
} as const;

export type AuthApi = typeof authApi;