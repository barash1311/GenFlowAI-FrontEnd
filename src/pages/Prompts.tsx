import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDatasets } from '../hooks/useDatasets';
import { usePrompts, usePromptsByDataset, useCreatePrompt, useDeletePrompt } from '../hooks/usePrompts';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import ErrorBanner from '../components/ui/ErrorBanner';
import { TableSkeleton } from '../components/ui/Skeleton';

export default function Prompts() {
  const [searchParams] = useSearchParams();
  const datasetIdParam = searchParams.get('dataset');
  const datasetId = datasetIdParam ? parseInt(datasetIdParam, 10) : null;

  const { data: datasets = [] } = useDatasets();
  const { data: allPrompts = [], isLoading: allLoading } = usePrompts();
  const { data: promptsByDs = [], isLoading: byDsLoading } = usePromptsByDataset(datasetId);
  const prompts = datasetId != null ? promptsByDs : allPrompts;
  const isLoading = datasetId != null ? byDsLoading : allLoading;

  const create = useCreatePrompt();
  const remove = useDeletePrompt();
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [selectedDatasetId, setSelectedDatasetId] = useState<number | ''>(datasetId ?? '');
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim() || !content.trim()) {
      setFormError('Name and content are required');
      return;
    }
    try {
      await create.mutateAsync({
        name: name.trim(),
        content: content.trim(),
        datasetId: selectedDatasetId ? Number(selectedDatasetId) : undefined,
      });
      setName('');
      setContent('');
    } catch {
      setFormError('Failed to create prompt');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this prompt?')) return;
    try {
      await remove.mutateAsync(id);
    } catch {
      setFormError('Failed to delete prompt');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Prompts</h1>
      </div>

      {formError && (
        <ErrorBanner message={formError} onDismiss={() => setFormError(null)} />
      )}

      <Card title="Add prompt">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Prompt name"
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Dataset (optional)</label>
              <select
                value={selectedDatasetId}
                onChange={(e) => setSelectedDatasetId(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">None</option>
                {datasets.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Prompt text..."
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <Button type="submit" loading={create.isPending}>
            Create prompt
          </Button>
        </form>
      </Card>

      <Card title={datasetId ? `Prompts for dataset` : 'All prompts'}>
        {isLoading ? (
          <TableSkeleton rows={3} cols={4} />
        ) : prompts.length === 0 ? (
          <EmptyState
            title="No prompts yet"
            description="Create a prompt above or link one to a dataset."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Content</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prompts.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100">
                    <td className="py-3 font-medium text-slate-800">{p.name}</td>
                    <td className="max-w-md truncate py-3 text-slate-600">{p.content}</td>
                    <td className="py-3 space-x-2">
                      <Link
                        to={`/predictions?prompt=${p.id}`}
                        className="text-emerald-600 hover:underline"
                      >
                        Predict
                      </Link>
                      <Button
                        variant="danger"
                        className="text-xs"
                        onClick={() => handleDelete(p.id)}
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
