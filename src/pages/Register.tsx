import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ErrorBanner from '../components/ui/ErrorBanner';
import { isAxiosError } from 'axios';

function getApiErrorMessage(err: unknown): string | null {
  if (!isAxiosError(err) || !err.response?.data) return null;
  const data = err.response.data as Record<string, unknown>;
  if (typeof data.message === 'string') return data.message;
  if (typeof data.error === 'string') return data.error;
  if (Array.isArray(data.errors) && data.errors[0] && typeof (data.errors[0] as Record<string, unknown>).defaultMessage === 'string') {
    return (data.errors[0] as Record<string, unknown>).defaultMessage as string;
  }
  if (err.response.status === 0 || err.code === 'ERR_NETWORK') {
    return 'Cannot reach server. Is the backend running at ' + (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1') + '?';
  }
  return null;
}

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(email, password, name || undefined);
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err);
      setError(msg ?? 'Registration failed. Check email format, use a longer password (e.g. 8+ characters), and ensure the backend is running.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white text-xl font-bold">
              G
            </span>
            <h1 className="mt-3 text-xl font-semibold text-slate-800">GenFlow AI</h1>
            <p className="mt-1 text-sm text-slate-500">Create your account</p>
          </div>
          {error && (
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" loading={isLoading}>
              Register
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
