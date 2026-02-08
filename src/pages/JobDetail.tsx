import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePredictionJob } from '../hooks/usePredictionJob';
import { Card } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import ErrorBanner from '../components/ui/ErrorBanner';
import type { PredictionStatus } from '../types';

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const jobId = id ? parseInt(id, 10) : null;
  const { data: job, isLoading, error } = usePredictionJob(jobId, { refetchInterval: 2000 });

  if (jobId == null) {
    return (
      <div className="space-y-4">
        <ErrorBanner message="Invalid job ID" />
        <Link to="/predictions" className="text-emerald-600 hover:underline">Back to Predictions</Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorBanner message={(error as Error).message} />
        <Link to="/predictions" className="text-emerald-600 hover:underline">Back to Predictions</Link>
      </div>
    );
  }

  if (isLoading && !job) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">Job not found.</p>
        <Link to="/predictions" className="text-emerald-600 hover:underline">Back to Predictions</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/predictions" className="text-slate-500 hover:text-slate-700">← Predictions</Link>
        <h1 className="text-2xl font-bold text-slate-900">Job #{job.id}</h1>
        <Badge status={job.status as PredictionStatus}>{job.status}</Badge>
        {job.status === 'RUNNING' && (
          <span className="text-sm text-slate-500">Polling for updates...</span>
        )}
      </div>

      <Card title="Status">
        <dl className="grid gap-2 sm:grid-cols-2">
          <dt className="text-slate-500">Status</dt>
          <dd><Badge status={job.status as PredictionStatus}>{job.status}</Badge></dd>
          <dt className="text-slate-500">Prediction ID</dt>
          <dd>{job.predictionId}</dd>
          {job.createdAt && (
            <>
              <dt className="text-slate-500">Created</dt>
              <dd>{new Date(job.createdAt).toLocaleString()}</dd>
            </>
          )}
          {job.completedAt && (
            <>
              <dt className="text-slate-500">Completed</dt>
              <dd>{new Date(job.completedAt).toLocaleString()}</dd>
            </>
          )}
        </dl>
      </Card>

      {job.errorMessage && (
        <Card title="Error">
          <pre className="overflow-auto rounded bg-red-50 p-4 text-sm text-red-800">
            {job.errorMessage}
          </pre>
        </Card>
      )}

      {job.result != null && job.result !== '' && (
        <Card title="Result">
          <pre className="overflow-auto rounded bg-slate-50 p-4 text-sm text-slate-800 whitespace-pre-wrap">
            {job.result}
          </pre>
        </Card>
      )}
    </div>
  );
}
