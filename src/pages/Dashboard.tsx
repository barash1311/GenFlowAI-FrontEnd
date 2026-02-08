import React from 'react';
import { Link } from 'react-router-dom';
import { useDatasets } from '../hooks/useDatasets';
import { usePrompts } from '../hooks/usePrompts';
import { usePredictions } from '../hooks/usePredictions';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import type { PredictionStatus } from '../types';

function StatCard({
  title,
  value,
  to,
  loading,
}: {
  title: string;
  value: number;
  to?: string;
  loading?: boolean;
}) {
  const content = (
    <>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-800">{loading ? '—' : value}</p>
    </>
  );
  if (to) {
    return (
      <Link to={to}>
        <Card className="transition-shadow hover:shadow-md">{content}</Card>
      </Link>
    );
  }
  return <Card>{content}</Card>;
}

export default function Dashboard() {
  const { data: datasets = [], isLoading: datasetsLoading } = useDatasets();
  const { data: prompts = [], isLoading: promptsLoading } = usePrompts();
  const { data: predictions = [], isLoading: predictionsLoading } = usePredictions();

  const running = predictions.filter((p) => p.status === 'RUNNING').length;
  const failed = predictions.filter((p) => p.status === 'FAILED').length;
  const completed = predictions.filter((p) => p.status === 'COMPLETED').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-600">Overview of your workflows and predictions</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Datasets" value={datasets.length} to="/datasets" loading={datasetsLoading} />
        <StatCard title="Prompts" value={prompts.length} to="/prompts" loading={promptsLoading} />
        <StatCard title="Predictions" value={predictions.length} to="/predictions" loading={predictionsLoading} />
        <StatCard title="Running jobs" value={running} />
        <StatCard title="Failed jobs" value={failed} />
      </div>

      <Card title="Workflow">
        <p className="text-sm text-slate-600 mb-4">
          Dataset → Prompt → Model → Submit Prediction. Create a dataset, add prompts, then run predictions from the Predictions page.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/datasets"
            className="inline-flex items-center rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
          >
            Datasets
          </Link>
          <Link
            to="/prompts"
            className="inline-flex items-center rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Prompts
          </Link>
          <Link
            to="/predictions"
            className="inline-flex items-center rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Predictions
          </Link>
        </div>
      </Card>
    </div>
  );
}
