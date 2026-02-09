/**
 * Auth: login, register, logout. Token in localStorage, sent as Bearer on every request.
 * 401/403 from API → clear session only (no logout API call).
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { authApi } from '../api/auth';
import { setUnauthorizedHandler } from '../api/client';
import { getTokenFromResponse, getUserFromResponse } from './utils';
import type { User } from '../types';

const TOKEN_KEY = 'token';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem(TOKEN_KEY),
    isLoading: false,
    isInitialized: false,
  });
  const clearingRef = useRef(false);
  // Prevent session clearing while login/register is in progress
  const authInProgressRef = useRef(false);

  const clearSessionOnly = useCallback(() => {
    // Don't clear session while auth operation is in progress
    if (clearingRef.current || authInProgressRef.current) return;
    clearingRef.current = true;
    localStorage.removeItem(TOKEN_KEY);
    setState((s) => ({ ...s, user: null, token: null }));
    clearingRef.current = false;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    } finally {
      clearSessionOnly();
    }
  }, [clearSessionOnly]);

  useEffect(() => {
    setUnauthorizedHandler(clearSessionOnly);
  }, [clearSessionOnly]);

  // On load: if token in storage, fetch current user
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setState((s) => ({ ...s, isInitialized: true }));
      return;
    }
    authApi
      .me()
      .then((res) => {
        setState((s) => ({
          ...s,
          user: res.data,
          token: stored,
          isInitialized: true,
        }));
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setState((s) => ({ ...s, user: null, token: null, isInitialized: true }));
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    authInProgressRef.current = true;
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const res = await authApi.login({ email, password });
      const data = res.data as unknown;
      const token = getTokenFromResponse(data);
      if (!token) throw new Error('No token in response');
      localStorage.setItem(TOKEN_KEY, token);
      const userFromRes = getUserFromResponse(data);
      if (userFromRes) {
        setState((s) => ({ ...s, user: userFromRes as User, token: token, isLoading: false }));
        return;
      }
      const meRes = await authApi.me();
      setState((s) => ({ ...s, user: meRes.data, token, isLoading: false }));
    } catch (e) {
      setState((s) => ({ ...s, isLoading: false }));
      throw e;
    } finally {
      authInProgressRef.current = false;
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    authInProgressRef.current = true;
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const res = await authApi.register({ email, password, name });
      const data = res.data as unknown;
      const token = getTokenFromResponse(data);
      if (!token) throw new Error('No token in response');
      localStorage.setItem(TOKEN_KEY, token);
      const userFromRes = getUserFromResponse(data);
      if (userFromRes) {
        setState((s) => ({ ...s, user: userFromRes as User, token, isLoading: false }));
        return;
      }
      const meRes = await authApi.me();
      setState((s) => ({ ...s, user: meRes.data, token, isLoading: false }));
    } catch (e) {
      setState((s) => ({ ...s, isLoading: false }));
      throw e;
    } finally {
      authInProgressRef.current = false;
    }
  }, []);

  const setUser = useCallback((user: User | null) => {
    setState((s) => ({ ...s, user }));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, register, logout, setUser }),
    [state, login, register, logout, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
