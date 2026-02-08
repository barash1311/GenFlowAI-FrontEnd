import React from 'react';
import { Link } from 'react-router-dom';
import { useDatasets } from '../../hooks/useDatasets';
import { useUsers } from '../../hooks/useUsers';
import { useModels } from '../../hooks/useModels';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';

export default function AdminOverview() {
  const { data: datasets = [], isLoading: datasetsLoading } = useDatasets();
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: models = [], isLoading: modelsLoading } = useModels();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
        <p className="mt-1 text-slate-600">System metrics and quick links</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link to="/admin/users">
          <Card className="transition-shadow hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">Users</p>
            <p className="mt-1 text-2xl font-semibold text-slate-800">
              {usersLoading ? '—' : users.length}
            </p>
          </Card>
        </Link>
        <Link to="/admin/models">
          <Card className="transition-shadow hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">Models</p>
            <p className="mt-1 text-2xl font-semibold text-slate-800">
              {modelsLoading ? '—' : models.length}
            </p>
          </Card>
        </Link>
        <Card>
          <p className="text-sm font-medium text-slate-500">Datasets</p>
          <p className="mt-1 text-2xl font-semibold text-slate-800">
            {datasetsLoading ? '—' : datasets.length}
          </p>
        </Card>
      </div>

      <Card title="Health">
        <p className="text-sm text-slate-600">
          Backend is at <code className="rounded bg-slate-100 px-1">{import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1'}</code>.
          Use Users and Models to manage access and AI endpoints.
        </p>
      </Card>
    </div>
  );
}
