'use client';

import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { User } from '../types';
import { hasPermission } from '@/lib/rbac';
import type { Role } from '@/lib/rbac';

interface UserRowActionsProps {
  user: User;
  currentUserRole?: Role;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export function UserRowActions({
  user,
  currentUserRole,
  onEdit,
  onDelete,
}: UserRowActionsProps) {
  const canUpdate = hasPermission(currentUserRole, 'users:update');
  const canDelete = hasPermission(currentUserRole, 'users:delete');

  if (!canUpdate && !canDelete) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="h-8 w-8" />
        }
      >
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {canUpdate && (
          <DropdownMenuItem
            onClick={() => onEdit?.(user)}
            className="cursor-pointer text-xs"
          >
            <Pencil className="mr-2 h-3.5 w-3.5" />
            Edit
          </DropdownMenuItem>
        )}
        {canDelete && (
          <DropdownMenuItem
            onClick={() => onDelete?.(user)}
            className="cursor-pointer text-xs text-destructive"
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
