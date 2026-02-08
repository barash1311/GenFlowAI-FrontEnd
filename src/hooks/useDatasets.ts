import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { datasetsApi } from '../api/datasets';
import type { DatasetCreate } from '../types';

const keys = { all: ['datasets'] as const, one: (id: number) => ['datasets', id] as const };

export function useDatasets() {
  return useQuery({
    queryKey: keys.all,
    queryFn: async () => {
      const res = await datasetsApi.list();
      return res.data;
    },
  });
}

export function useDataset(id: number | null) {
  return useQuery({
    queryKey: keys.one(id!),
    queryFn: async () => {
      const res = await datasetsApi.get(id!);
      return res.data;
    },
    enabled: id != null,
  });
}

export function useCreateDataset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DatasetCreate) => datasetsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useUpdateDataset(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<DatasetCreate>) => datasetsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
      qc.invalidateQueries({ queryKey: keys.one(id) });
    },
  });
}

export function useDeleteDataset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => datasetsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}
