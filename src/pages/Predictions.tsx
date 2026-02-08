import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { usePrompts } from '../hooks/usePrompts';
import { useModels } from '../hooks/useModels';
import { usePredictions, usePredictionsByPrompt, useCreatePrediction } from '../hooks/usePredictions';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import ErrorBanner from '../components/ui/ErrorBanner';
import { TableSkeleton } from '../components/ui/Skeleton';
import type { PredictionStatus } from '../types';

export default function Predictions() {
  const [searchParams] = useSearchParams();
  const promptIdParam = searchParams.get('prompt');
  const promptId = promptIdParam ? parseInt(promptIdParam, 10) : null;

  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: prompts = [] } = usePrompts();
  const { data: models = [] } = useModels({ enabled: user?.role === 'ADMIN' });
  const { data: allPredictions = [], isLoading: allLoading } = usePredictions();
  const { data: byPrompt = [], isLoading: byPromptLoading } = usePredictionsByPrompt(promptId);
  const predictions = promptId != null ? byPrompt : allPredictions;
  const isLoading = promptId != null ? byPromptLoading : allLoading;

  const create = useCreatePrediction();
  const [selectedPromptId, setSelectedPromptId] = useState<number | ''>(promptId ?? '');
  const [selectedModelId, setSelectedModelId] = useState<number | ''>('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!selectedPromptId) {
      setFormError('Select a prompt');
      return;
    }
    try {
      const res = await create.mutateAsync({
        promptId: Number(selectedPromptId),
        modelId: selectedModelId ? Number(selectedModelId) : undefined,
      });
      const jobId = res.data.jobId ?? res.data.id;
      if (jobId) {
        navigate(`/predictions/jobs/${jobId}`);
      }
    } catch {
      setFormError('Failed to submit prediction');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Predictions</h1>
      </div>

      {formError && (
        <ErrorBanner message={formError} onDismiss={() => setFormError(null)} />
      )}

      <Card title="Submit prediction">
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
          <div className="min-w-[200px]">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Prompt</label>
            <select
              value={selectedPromptId}
              onChange={(e) => setSelectedPromptId(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Select prompt</option>
              {prompts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[200px]">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Model (optional)</label>
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Default</option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" loading={create.isPending}>
            Run prediction
          </Button>
        </form>
      </Card>

      <Card title="Prediction history">
        {isLoading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : predictions.length === 0 ? (
          <EmptyState
            title="No predictions yet"
            description="Submit a prediction above to see jobs here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Prompt ID</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100">
                    <td className="py-3 font-medium">{p.id}</td>
                    <td className="py-3">{p.promptId}</td>
                    <td className="py-3">
                      <Badge status={p.status as PredictionStatus}>{p.status}</Badge>
                    </td>
                    <td className="py-3">
                      <Link
                        to={`/predictions/jobs/${p.id}`}
                        className="text-emerald-600 hover:underline"
                      >
                        View job
                      </Link>
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
