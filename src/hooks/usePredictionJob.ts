import { useQuery } from '@tanstack/react-query';
import { predictionJobsApi } from '../api/predictionJobs';
import type { PredictionStatus } from '../types';

const TERMINAL_STATUSES: PredictionStatus[] = ['COMPLETED', 'FAILED'];

/**
 * Polls prediction job until status is COMPLETED or FAILED.
 */
export function usePredictionJob(id: number | null, options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: ['prediction-job', id],
    queryFn: async () => {
      const res = await predictionJobsApi.get(id!);
      return res.data;
    },
    enabled: id != null,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data || TERMINAL_STATUSES.includes(data.status)) return false;
      return options?.refetchInterval ?? 2000;
    },
  });
}
