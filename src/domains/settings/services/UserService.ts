import { UserApi } from '../api/UserApi';
import type { User, CreateUserPayload, UpdateUserPayload } from '../types';

export class UserService {
  static async getAll(includeInactive?: boolean): Promise<User[]> {
    const response = await UserApi.getUsers(includeInactive);
    return response.data;
  }
  
  static async getById(id: number): Promise<User> {
    const response = await UserApi.getUser(id);
    return response.data;
  }

  static async create(user: CreateUserPayload): Promise<User> {
    const response = await UserApi.postUser(user);
    return response.data;
  }

  static async update(id: number, user: UpdateUserPayload): Promise<User> {
    const response = await UserApi.patchUser(id, user);
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await UserApi.deleteUser(id);
  }

  static async disable(id: number): Promise<void> {
    await UserApi.disableUser(id);
  }
}