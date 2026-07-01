'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { User } from '../types';
import { StatusBadge } from '@/components/shared/status-badge';
import { format } from 'date-fns';
import type { Role } from '@/lib/rbac';

export function getUserColumns(_userRole?: Role): ColumnDef<User>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium">
            {row.original.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-sm font-medium">{row.original.name || '—'}</p>
            <p className="text-muted-foreground text-xs">{row.original.email}</p>
          </div>
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ getValue }) => <span className="text-sm">{getValue<string>()}</span>,
      enableSorting: true,
      size: 200,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ getValue }) => {
        const role = getValue<Role>();
        const variant = role === 'admin' ? 'default' : role === 'editor' ? 'warning' : 'secondary';
        return (
          <StatusBadge variant={variant as 'default' | 'warning' | 'secondary'} dot>
            {role}
          </StatusBadge>
        );
      },
      enableSorting: true,
      size: 100,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ getValue }) => {
        const date = getValue<Date | string | null>();
        if (!date) return <span className="text-muted-foreground text-xs">—</span>;
        return (
          <span className="text-muted-foreground text-xs">
            {format(new Date(date), 'MMM d, yyyy')}
          </span>
        );
      },
      enableSorting: true,
      size: 130,
    },
  ];
}
