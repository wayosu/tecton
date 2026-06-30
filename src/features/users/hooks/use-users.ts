'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import type { UsersResponse, UsersQueryParams } from '../types';

async function fetchUsers(params: UsersQueryParams): Promise<UsersResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.sort) searchParams.set('sort', String(params.sort));
  if (params.order) searchParams.set('order', params.order);
  if (params.search) searchParams.set('search', params.search);

  const res = await fetch(`/api/users?${searchParams.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export function useUsers(params: UsersQueryParams = {}) {
  const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search = '' } = params;

  return useQuery({
    queryKey: ['users', { page, limit, sort, order, search }],
    queryFn: () => fetchUsers({ page, limit, sort, order, search }),
    placeholderData: keepPreviousData,
  });
}
