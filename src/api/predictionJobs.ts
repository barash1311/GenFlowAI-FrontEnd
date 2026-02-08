/**
 * Prediction jobs API: get job by id (for polling status).
 */

import { apiClient } from './client';
import type { PredictionJob } from '../types';

export const predictionJobsApi = {
  get: (id: number) => apiClient.get<PredictionJob>(`/prediction-jobs/${id}`),
};
