import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users';
import type { UserCreate, UserUpdate } from '../types';

const keys = { all: ['users'] as const, one: (id: number) => ['users', id] as const };

export function useUsers() {
  return useQuery({
    queryKey: keys.all,
    queryFn: async () => {
      const res = await usersApi.list();
      return res.data;
    },
  });
}

export function useUser(id: number | null) {
  return useQuery({
    queryKey: keys.one(id!),
    queryFn: async () => {
      const res = await usersApi.get(id!);
      return res.data;
    },
    enabled: id != null,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UserCreate) => usersApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useUpdateUser(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UserUpdate) => usersApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
      qc.invalidateQueries({ queryKey: keys.one(id) });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usersApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}
