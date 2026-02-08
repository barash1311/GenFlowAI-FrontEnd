/**
 * Models API (ADMIN): CRUD.
 */

import { apiClient } from './client';
import type { Model, ModelCreate, ModelUpdate } from '../types';

export const modelsApi = {
  list: () => apiClient.get<Model[]>('/models'),
  get: (id: number) => apiClient.get<Model>(`/models/${id}`),
  create: (data: ModelCreate) => apiClient.post<Model>('/models', data),
  update: (id: number, data: ModelUpdate) =>
    apiClient.put<Model>(`/models/${id}`, data),
  delete: (id: number) => apiClient.delete<void>(`/models/${id}`),
};
