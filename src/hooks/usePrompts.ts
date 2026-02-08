import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promptsApi } from '../api/prompts';
import type { PromptCreate } from '../types';

const keys = {
  all: ['prompts'] as const,
  one: (id: number) => ['prompts', id] as const,
  byDataset: (datasetId: number) => ['prompts', 'dataset', datasetId] as const,
};

export function usePrompts() {
  return useQuery({
    queryKey: keys.all,
    queryFn: async () => {
      const res = await promptsApi.list();
      return res.data;
    },
  });
}

export function usePromptsByDataset(datasetId: number | null) {
  return useQuery({
    queryKey: keys.byDataset(datasetId!),
    queryFn: async () => {
      const res = await promptsApi.byDataset(datasetId!);
      return res.data;
    },
    enabled: datasetId != null,
  });
}

export function usePrompt(id: number | null) {
  return useQuery({
    queryKey: keys.one(id!),
    queryFn: async () => {
      const res = await promptsApi.get(id!);
      return res.data;
    },
    enabled: id != null,
  });
}

export function useCreatePrompt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PromptCreate) => promptsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useDeletePrompt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => promptsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}
