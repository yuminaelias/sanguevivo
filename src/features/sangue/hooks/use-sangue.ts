import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/utils/api';
import { queryClient } from '@/lib/query-client';
import type { Appeal, Dashboard, Workspace } from '../types/sangue';
export function useAppeals() { return useQuery({ queryKey: ['appeals'], queryFn: () => apiRequest<Appeal[]>('/v1/appeals') }); }
export function useDashboard() { const { user } = useAuth(); return useQuery({ queryKey: ['dashboard', user?.id], enabled: !!user, queryFn: () => apiRequest<Dashboard>('/v1/private/dashboard') }); }
export function useWorkspace() { const { user } = useAuth(); return useQuery({ queryKey: ['workspace', user?.id], enabled: !!user, queryFn: () => apiRequest<Workspace>('/v1/private/staff/workspace') }); }
export function useServerAction<T>() { return useMutation({ mutationFn: ({ path, method = 'POST', body }: { path: string; method?: string; body?: unknown }) => apiRequest<T>(path, method, body), onSuccess: () => { void queryClient.invalidateQueries(); } }); }
