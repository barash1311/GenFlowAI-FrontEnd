/**
 * Datasets API: CRUD.
 */

import { apiClient } from './client';
import type { Dataset, DatasetCreate } from '../types';

export const datasetsApi = {
  list: () => apiClient.get<Dataset[]>('/datasets'),
  get: (id: number) => apiClient.get<Dataset>(`/datasets/${id}`),
  create: (data: DatasetCreate) => apiClient.post<Dataset>('/datasets', data),
  update: (id: number, data: Partial<DatasetCreate>) =>
    apiClient.put<Dataset>(`/datasets/${id}`, data),
  delete: (id: number) => apiClient.delete<void>(`/datasets/${id}`),
};
