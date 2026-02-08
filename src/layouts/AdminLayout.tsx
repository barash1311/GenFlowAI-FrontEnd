/**
 * Admin layout: sidebar with admin nav (users, models) + navbar + outlet.
 * Wrapped by RoleGuard(ADMIN) at route level.
 */

import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Breadcrumbs, { type BreadcrumbItem } from '../components/ui/Breadcrumbs';
import Button from '../components/ui/Button';

const adminNavItems = [
  { to: '/admin', label: 'Overview' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/models', label: 'Models' },
];

interface AdminLayoutProps {
  breadcrumbs?: BreadcrumbItem[];
}

export default function AdminLayout({ breadcrumbs }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white transition-all duration-200
          ${sidebarOpen ? 'w-56' : 'w-20'}
        `}
      >
        <div className="flex h-14 items-center border-b border-slate-100 px-4">
          <Link to="/admin" className="flex items-center gap-2 font-semibold text-slate-800">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white text-sm">
              A
            </span>
            {sidebarOpen && <span>Admin</span>}
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-500" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100" />
            {sidebarOpen && <span>← Back to App</span>}
          </NavLink>
        </nav>
        <button
          type="button"
          onClick={() => setSidebarOpen((o) => !o)}
          className="border-t border-slate-100 p-3 text-left text-sm text-slate-500 hover:bg-slate-50"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? '← Collapse' : '→'}
        </button>
      </aside>

      <div className={`flex flex-1 flex-col transition-all duration-200 ${sidebarOpen ? 'pl-56' : 'pl-20'}`}>
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
          <Breadcrumbs items={breadcrumbs} />
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              {user?.name ?? user?.email}
              <span className="ml-2 rounded bg-violet-100 px-1.5 py-0.5 text-xs text-violet-700">
                {user?.role}
              </span>
            </span>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
