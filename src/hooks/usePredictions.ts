import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { predictionsApi } from '../api/predictions';
import type { PredictionCreate } from '../types';

const keys = {
  all: ['predictions'] as const,
  one: (id: number) => ['predictions', id] as const,
  byPrompt: (promptId: number) => ['predictions', 'prompt', promptId] as const,
};

export function usePredictions() {
  return useQuery({
    queryKey: keys.all,
    queryFn: async () => {
      const res = await predictionsApi.list();
      return res.data;
    },
  });
}

export function usePredictionsByPrompt(promptId: number | null) {
  return useQuery({
    queryKey: keys.byPrompt(promptId!),
    queryFn: async () => {
      const res = await predictionsApi.byPrompt(promptId!);
      return res.data;
    },
    enabled: promptId != null,
  });
}

export function usePrediction(id: number | null) {
  return useQuery({
    queryKey: keys.one(id!),
    queryFn: async () => {
      const res = await predictionsApi.get(id!);
      return res.data;
    },
    enabled: id != null,
  });
}

export function useCreatePrediction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PredictionCreate) => predictionsApi.create(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: keys.all });
      qc.invalidateQueries({ queryKey: keys.byPrompt(variables.promptId) });
    },
  });
}
