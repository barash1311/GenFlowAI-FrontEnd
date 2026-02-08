import React from 'react';

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div
      className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
      role="alert"
    >
      <span>{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-2 rounded p-1 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}
