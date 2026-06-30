import { type InferSelectModel } from 'drizzle-orm';
import { users } from '@/db/schema';
import type { Role } from '@/lib/rbac';
import { z } from 'zod';

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

// ── Validation Schemas ──────────────────────

const passwordField = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(100);

export const userFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Invalid email').max(255),
    password: z.union([z.literal(''), passwordField]).optional(),
    role: z.enum(['admin', 'editor', 'viewer']),
  })
  .transform((data) => ({
    ...data,
    password: data.password === '' || data.password === undefined ? undefined : data.password,
  }));

export const createUserSchema = userFormSchema.refine(
  (data) => !!data.password && data.password.length >= 6,
  {
    message: 'Password must be at least 6 characters',
    path: ['password'],
  },
);

export const updateUserSchema = userFormSchema;

// ── Form Types ──────────────────────────────

export type UserFormValues = z.input<typeof userFormSchema>;
export type CreateUserInput = z.output<typeof createUserSchema>;
export type UpdateUserInput = z.output<typeof updateUserSchema>;
