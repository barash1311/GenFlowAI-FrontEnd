/**
 * Users API (ADMIN): CRUD + me.
 */

import { apiClient } from './client';
import type { User, UserCreate, UserUpdate } from '../types';

export const usersApi = {
  list: () => apiClient.get<User[]>('/users'),
  get: (id: number) => apiClient.get<User>(`/users/${id}`),
  me: () => apiClient.get<User>('/users/me'),
  create: (data: UserCreate) => apiClient.post<User>('/users', data),
  update: (id: number, data: UserUpdate) =>
    apiClient.put<User>(`/users/${id}`, data),
  delete: (id: number) => apiClient.delete<void>(`/users/${id}`),
};
