import React from 'react';

type Status = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'default';

const statusStyles: Record<Status, string> = {
  QUEUED: 'bg-amber-100 text-amber-800',
  RUNNING: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  FAILED: 'bg-red-100 text-red-800',
  default: 'bg-slate-100 text-slate-700',
};

interface BadgeProps {
  children: React.ReactNode;
  status?: Status;
  className?: string;
}

export default function Badge({ children, status = 'default', className = '' }: BadgeProps) {
  const style = statusStyles[status] ?? statusStyles.default;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style} ${className}`}
    >
      {children}
    </span>
  );
}
