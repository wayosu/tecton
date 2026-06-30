import { type InferSelectModel } from 'drizzle-orm';
import { users } from '@/db/schema';
import type { Role } from '@/lib/rbac';

export type { Role };
export type User = Omit<InferSelectModel<typeof users>, 'hashedPassword'>;

export type UsersResponse = {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type UsersQueryParams = {
  page?: number;
  limit?: number;
  sort?: keyof User;
  order?: 'asc' | 'desc';
  search?: string;
};
