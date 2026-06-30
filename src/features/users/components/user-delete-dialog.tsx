'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { User } from '../types';

interface UserDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onConfirm: (user: User) => void;
  loading?: boolean;
}

export function UserDeleteDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  loading = false,
}: UserDeleteDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete{' '}
            <strong>{user.name ?? user.email}</strong>.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter showCloseButton>
          <Button
            variant="destructive"
            onClick={() => onConfirm(user)}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
