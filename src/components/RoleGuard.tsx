/**
 * Renders children only if current user has one of the allowed roles.
 * Use for ADMIN-only UI (e.g. admin layout, user/model management).
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import type { Role } from '../types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallbackPath?: string;
}

export default function RoleGuard({
  children,
  allowedRoles,
  fallbackPath = '/dashboard',
}: RoleGuardProps) {
  const { user, isInitialized } = useAuth();

  if (!isInitialized || !user) {
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
