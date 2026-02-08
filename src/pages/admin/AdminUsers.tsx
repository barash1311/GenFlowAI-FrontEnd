import React, { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../hooks/useUsers';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { TableSkeleton } from '../../components/ui/Skeleton';
import type { Role } from '../../types';

export default function AdminUsers() {
  const { data: users = [], isLoading, error } = useUsers();
  const create = useCreateUser();
  const remove = useDeleteUser();
  const [formError, setFormError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('USER');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!email.trim() || !password.trim()) {
      setFormError('Email and password are required');
      return;
    }
    try {
      await create.mutateAsync({
        email: email.trim(),
        password,
        name: name.trim() || undefined,
        role,
      });
      setShowForm(false);
      setEmail('');
      setPassword('');
      setName('');
      setRole('USER');
    } catch {
      setFormError('Failed to create user');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await remove.mutateAsync(id);
    } catch {
      setFormError('Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">User management</h1>
        <Button onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : 'Add user'}
        </Button>
      </div>

      {error && (
        <ErrorBanner message={(error as Error).message} onDismiss={() => {}} />
      )}
      {formError && (
        <ErrorBanner message={formError} onDismiss={() => setFormError(null)} />
      )}

      {showForm && (
        <Card title="New user">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
            <Button type="submit" loading={create.isPending}>
              Create user
            </Button>
          </form>
        </Card>
      )}

      <Card title="All users">
        {isLoading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : users.length === 0 ? (
          <EmptyState title="No users" description="Add a user above." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100">
                    <td className="py-3">{u.id}</td>
                    <td className="py-3 font-medium">{u.email}</td>
                    <td className="py-3">{u.name ?? '—'}</td>
                    <td className="py-3">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{u.role}</span>
                    </td>
                    <td className="py-3">
                      <Button
                        variant="danger"
                        className="text-xs"
                        onClick={() => handleDelete(u.id)}
                        disabled={remove.isPending}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
