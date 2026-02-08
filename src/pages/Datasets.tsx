import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDatasets, useCreateDataset, useDeleteDataset } from '../hooks/useDatasets';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import ErrorBanner from '../components/ui/ErrorBanner';
import { TableSkeleton } from '../components/ui/Skeleton';

export default function Datasets() {
  const { data: datasets = [], isLoading, error } = useDatasets();
  const create = useCreateDataset();
  const remove = useDeleteDataset();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim()) {
      setFormError('Name is required');
      return;
    }
    try {
      await create.mutateAsync({ name: name.trim(), description: description.trim() || undefined });
      setName('');
      setDescription('');
    } catch {
      setFormError('Failed to create dataset');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this dataset?')) return;
    try {
      await remove.mutateAsync(id);
    } catch {
      setFormError('Failed to delete dataset');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Datasets</h1>
      </div>

      {error && (
        <ErrorBanner
          message={(error as Error).message}
          onDismiss={() => {}}
        />
      )}

      <Card title="Add dataset">
        {formError && (
          <ErrorBanner message={formError} onDismiss={() => setFormError(null)} />
        )}
        <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My dataset"
            className="min-w-[200px]"
          />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional"
            className="min-w-[200px]"
          />
          <Button type="submit" loading={create.isPending}>
            Create
          </Button>
        </form>
      </Card>

      <Card title="All datasets">
        {isLoading ? (
          <TableSkeleton rows={3} cols={4} />
        ) : datasets.length === 0 ? (
          <EmptyState
            title="No datasets yet"
            description="Create a dataset above to get started."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {datasets.map((d) => (
                  <tr key={d.id} className="border-b border-slate-100">
                    <td className="py-3">
                      <Link to={`/prompts?dataset=${d.id}`} className="font-medium text-emerald-600 hover:underline">
                        {d.name}
                      </Link>
                    </td>
                    <td className="py-3 text-slate-600">{d.description ?? '—'}</td>
                    <td className="py-3">
                      <Button
                        variant="danger"
                        className="text-xs"
                        onClick={() => handleDelete(d.id)}
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
