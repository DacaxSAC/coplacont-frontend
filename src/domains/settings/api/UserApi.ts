import { apiClient } from '@/shared/services/apiService';
import type { User, CreateUserPayload, UpdateUserPayload } from '../types';

const BASE_URL = '/user';

export class UserApi {
  static async getUsers(includeInactive?: boolean) {
    const params = includeInactive ? { includeInactive } : {};
    return apiClient.get<User[]>(BASE_URL, { params });
  }

  static async getUser(id: number) {
    return apiClient.get<User>(`${BASE_URL}/${id}`);
  }

  static async postUser(user: CreateUserPayload) {
    return apiClient.post<User>(BASE_URL, user);
  }

  static async patchUser(id: number, user: UpdateUserPayload) {
    return apiClient.patch<User>(`${BASE_URL}/${id}`, user);
  }

  static async deleteUser(id: number) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  }

  static async disableUser(id: number) {
    return apiClient.patch(`${BASE_URL}/${id}/disabled`);
  }
}