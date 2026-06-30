'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { User, CreateUserInput, UserFormValues } from '../types';
import { createUserSchema, updateUserSchema } from '../types';
import type { Role } from '@/lib/rbac';

const ROLES: { value: Role; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
];

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
  currentUserRole?: Role;
  onSubmit: (data: CreateUserInput) => void;
  loading?: boolean;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  currentUserRole,
  onSubmit,
  loading = false,
}: UserFormDialogProps) {
  const isEdit = !!user;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'viewer',
    },
  });

  // Reset form when dialog opens or user changes
  useEffect(() => {
    if (open) {
      reset({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        role: user?.role ?? 'viewer',
      });
    }
  }, [open, user, reset]);

  const availableRoles: { value: Role; label: string }[] =
    currentUserRole === 'admin'
      ? ROLES
      : ROLES.filter((r) => r.value !== 'admin');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? `Update details for ${user?.name ?? user?.email}.`
              : 'Create a new user account.'}
          </DialogDescription>
        </DialogHeader>

        <form
          id="user-form"
          onSubmit={handleSubmit((data) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSubmit(data as any),
          )}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Full name"
              {...register('name')}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              {...register('email')}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {isEdit ? 'Password (leave blank to keep)' : 'Password'}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={isEdit ? '••••••••' : 'Min. 6 characters'}
              {...register('password')}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <p className="text-xs text-destructive">{errors.role.message}</p>
            )}
          </div>
        </form>

        <DialogFooter showCloseButton>
          <Button type="submit" form="user-form" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
