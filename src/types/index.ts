/**
 * API and app types for GenFlow AI frontend.
 * Aligned with Spring Boot backend DTOs (camelCase JSON).
 */

export type Role = 'ADMIN' | 'USER';

export interface User {
  id: number;
  email: string;
  name?: string;
  role: Role;
  enabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  type?: string;
  expiresIn?: number;
  user?: User;
}

export interface Dataset {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
}

export interface DatasetCreate {
  name: string;
  description?: string;
}

export interface Prompt {
  id: number;
  name: string;
  content: string;
  datasetId?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
}

export interface PromptCreate {
  name: string;
  content: string;
  datasetId?: number;
}

export type PredictionStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface Prediction {
  id: number;
  promptId: number;
  modelId?: number;
  status: PredictionStatus;
  result?: string;
  errorMessage?: string;
  jobId?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
}

export interface PredictionCreate {
  promptId: number;
  modelId?: number;
}

export interface PredictionJob {
  id: number;
  predictionId: number;
  status: PredictionStatus;
  result?: string;
  errorMessage?: string;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
}

export interface Model {
  id: number;
  name: string;
  endpoint?: string;
  description?: string;
  enabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ModelCreate {
  name: string;
  endpoint?: string;
  description?: string;
  enabled?: boolean;
}

export interface ModelUpdate extends Partial<ModelCreate> {}

export interface UserCreate {
  email: string;
  password: string;
  name?: string;
  role: Role;
  enabled?: boolean;
}

export interface UserUpdate {
  email?: string;
  name?: string;
  role?: Role;
  enabled?: boolean;
}
