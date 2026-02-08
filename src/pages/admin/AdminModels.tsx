import React, { useState } from 'react';
import { useModels, useCreateModel, useDeleteModel } from '../../hooks/useModels';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import ErrorBanner from '../../components/ui/ErrorBanner';
import { TableSkeleton } from '../../components/ui/Skeleton';

export default function AdminModels() {
  const { data: models = [], isLoading, error } = useModels();
  const create = useCreateModel();
  const remove = useDeleteModel();
  const [formError, setFormError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim()) {
      setFormError('Name is required');
      return;
    }
    try {
      await create.mutateAsync({
        name: name.trim(),
        endpoint: endpoint.trim() || undefined,
        description: description.trim() || undefined,
      });
      setShowForm(false);
      setName('');
      setEndpoint('');
      setDescription('');
    } catch {
      setFormError('Failed to create model');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this model?')) return;
    try {
      await remove.mutateAsync(id);
    } catch {
      setFormError('Failed to delete model');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Model management</h1>
        <Button onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : 'Add model'}
        </Button>
      </div>

      {error && (
        <ErrorBanner message={(error as Error).message} onDismiss={() => {}} />
      )}
      {formError && (
        <ErrorBanner message={formError} onDismiss={() => setFormError(null)} />
      )}

      {showForm && (
        <Card title="New model">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Model name"
              required
            />
            <Input
              label="Endpoint"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="Optional API endpoint"
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900"
              />
            </div>
            <Button type="submit" loading={create.isPending}>
              Create model
            </Button>
          </form>
        </Card>
      )}

      <Card title="All models">
        {isLoading ? (
          <TableSkeleton rows={3} cols={4} />
        ) : models.length === 0 ? (
          <EmptyState title="No models" description="Add a model above." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Endpoint</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m) => (
                  <tr key={m.id} className="border-b border-slate-100">
                    <td className="py-3">{m.id}</td>
                    <td className="py-3 font-medium">{m.name}</td>
                    <td className="py-3 text-slate-600">{m.endpoint ?? '—'}</td>
                    <td className="py-3">
                      <Button
                        variant="danger"
                        className="text-xs"
                        onClick={() => handleDelete(m.id)}
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
