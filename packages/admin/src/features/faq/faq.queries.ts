import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ky } from 'ky';
import type { FAQ, CreateFaqDto, UpdateFaqDto, ReorderFaqDto } from '@baker/shared-types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Query keys
export const faqKeys = {
  all: ['faqs'] as const,
  list: () => [...faqKeys.all, 'list'] as const,
  detail: (id: string) => [...faqKeys.all, 'detail', id] as const,
};

// Queries
export function useFaqs() {
  return useQuery({
    queryKey: faqKeys.list(),
    queryFn: async () => {
      const response = await ky(`${API_URL}/api/admin/faqs`).json<{ success: boolean; data: FAQ[] }>();
      return response.data;
    },
  });
}

export function useFaqById(id: string) {
  return useQuery({
    queryKey: faqKeys.detail(id),
    queryFn: async () => {
      const response = await ky(`${API_URL}/api/admin/faqs/${id}`).json<{ success: boolean; data: FAQ }>();
      return response.data;
    },
  });
}

// Mutations
export function useCreateFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFaqDto) => {
      const response = await ky.post(`${API_URL}/api/admin/faqs`, { json: data }).json<{ success: boolean; data: FAQ }>();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.list() });
    },
  });
}

export function useUpdateFaq(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFaqDto) => {
      const response = await ky.patch(`${API_URL}/api/admin/faqs/${id}`, { json: data }).json<{ success: boolean; data: FAQ }>();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.list() });
      queryClient.invalidateQueries({ queryKey: faqKeys.detail(id) });
    },
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await ky.delete(`${API_URL}/api/admin/faqs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.list() });
    },
  });
}

export function useReorderFaqs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: ReorderFaqDto) => {
      await ky.put(`${API_URL}/api/admin/faqs/reorder`, { json: items });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.list() });
    },
  });
}


