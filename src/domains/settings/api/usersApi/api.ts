import { apiClient } from "@/shared";
import { USERSENDPOINTS } from './endpoints';
import type { 
  User, 
  CreateEmpresaConUsuarioDto, 
  EmpresaConUsuario,
  CreateUserForPersonaDto,
  UpdateUserDto,
  PersonaWithUsersResponse
} from '../../types';

/**
 * Servicio API para gestión de usuarios y empresas
 */
export const usersApi = {
  /**
   * Obtiene todos los usuarios
   */
  getUsers: () => 
    apiClient.get<User[]>(USERSENDPOINTS.GET_USERS),

  /**
   * Obtiene un usuario por ID
   */
  getUser: (id: number) => 
    apiClient.get<User>(USERSENDPOINTS.GET_USER.replace(':id', String(id))),

  /**
   * Actualiza un usuario
   */
  updateUser: (id: number, payload: UpdateUserDto) => 
    apiClient.patch<User>(USERSENDPOINTS.UPDATE_USER.replace(':id', String(id)), payload),

  /**
   * Desactiva un usuario
   */
  disableUser: (id: number) => 
    apiClient.patch(USERSENDPOINTS.DISABLE_USER.replace(':id', String(id))),

  /**
   * Crea una empresa con usuario principal
   */
  createEmpresaConUsuario: (payload: CreateEmpresaConUsuarioDto) => 
    apiClient.post<EmpresaConUsuario>(USERSENDPOINTS.CREATE_EMPRESA_CON_USUARIO, payload),

  /**
   * Crea un usuario para una empresa existente
   */
  createUserForPersona: (idPersona: number, payload: CreateUserForPersonaDto) => 
    apiClient.post<User>(USERSENDPOINTS.CREATE_USER_FOR_PERSONA.replace(':idPersona', String(idPersona)), payload),

  /**
   * Desactiva una empresa y todos sus usuarios
   */
  disablePersonaAndUsers: (idPersona: number) => 
    apiClient.patch(USERSENDPOINTS.DISABLE_PERSONA_AND_USERS.replace(':idPersona', String(idPersona))),

  /**
   * Obtiene todas las personas/empresas con sus usuarios asociados
   */
  getPersonasWithUsers: () => 
    apiClient.get<PersonaWithUsersResponse[]>(USERSENDPOINTS.GET_PERSONAS_WITH_USERS),

  /**
   * Obtiene una persona/empresa específica con sus usuarios asociados
   */
  getPersonaWithUsers: (id: number) => 
    apiClient.get<PersonaWithUsersResponse>(USERSENDPOINTS.GET_PERSONA_WITH_USERS.replace(':id', String(id))),
}