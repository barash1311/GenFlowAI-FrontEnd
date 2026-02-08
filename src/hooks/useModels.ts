import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { modelsApi } from '../api/models';
import type { ModelCreate, ModelUpdate } from '../types';

const keys = { all: ['models'] as const, one: (id: number) => ['models', id] as const };

export function useModels(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: keys.all,
    queryFn: async () => {
      const res = await modelsApi.list();
      return res.data;
    },
    enabled: options?.enabled !== false,
  });
}

export function useModel(id: number | null) {
  return useQuery({
    queryKey: keys.one(id!),
    queryFn: async () => {
      const res = await modelsApi.get(id!);
      return res.data;
    },
    enabled: id != null,
  });
}

export function useCreateModel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ModelCreate) => modelsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useUpdateModel(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ModelUpdate) => modelsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
      qc.invalidateQueries({ queryKey: keys.one(id) });
    },
  });
}

export function useDeleteModel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => modelsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}
