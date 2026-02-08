/**
 * Predictions API: list, get, create, by prompt.
 */

import { apiClient } from './client';
import type { Prediction, PredictionCreate } from '../types';

export const predictionsApi = {
  list: () => apiClient.get<Prediction[]>('/predictions'),
  get: (id: number) => apiClient.get<Prediction>(`/predictions/${id}`),
  create: (data: PredictionCreate) =>
    apiClient.post<Prediction>('/predictions', data),
  byPrompt: (promptId: number) =>
    apiClient.get<Prediction[]>(`/predictions/prompt/${promptId}`),
};
