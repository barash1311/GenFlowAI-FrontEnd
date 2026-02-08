/**
 * Prompts API: list, get, create, delete, by dataset.
 */

import { apiClient } from './client';
import type { Prompt, PromptCreate } from '../types';

export const promptsApi = {
  list: () => apiClient.get<Prompt[]>('/prompts'),
  get: (id: number) => apiClient.get<Prompt>(`/prompts/${id}`),
  create: (data: PromptCreate) => apiClient.post<Prompt>('/prompts', data),
  delete: (id: number) => apiClient.delete<void>(`/prompts/${id}`),
  byDataset: (datasetId: number) =>
    apiClient.get<Prompt[]>(`/prompts/dataset/${datasetId}`),
};
