/**
 * Axios client: base URL, JWT in header, 401/403 clear session (no API call).
 */

import axios, { type AxiosError } from 'axios';

const raw = import.meta.env.VITE_API_BASE_URL;
const baseURL =
  import.meta.env.DEV
    ? '/api/v1'
    : (typeof raw === 'string' && raw.trim()
        ? raw.trim().replace(/\/$/, '')
        : 'http://localhost:8080/api/v1');

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

apiClient.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('token');
    if (!stored) return config;
    // Store only raw token; send as "Bearer <token>"
    const token = stored.startsWith('Bearer ') ? stored.slice(7) : stored;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const isLogout = error.config?.url?.includes('/auth/logout');
    // Clear session on 401/403, except for logout (else logout 401 would loop).
    if ((status === 401 || status === 403) && !isLogout) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);
