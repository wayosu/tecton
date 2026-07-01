'use client';

import { useActionState } from 'react';
import { updatePassword } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function PasswordForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await updatePassword(formData);
      if (result?.error) {
        toast.error(result.error);
        return result;
      }
      toast.success('Password changed');
      // Reset the form
      const form = document.getElementById('password-form') as HTMLFormElement;
      form?.reset();
      return result;
    },
    null,
  );

  return (
    <div className="bg-card rounded-lg border">
      <div className="border-b px-4 py-3">
        <h3 className="text-sm font-semibold">Change Password</h3>
      </div>
      <form id="password-form" action={formAction} className="space-y-4 p-4">
        <div className="space-y-2">
          <Label htmlFor="settings-current-password">Current Password</Label>
          <Input
            id="settings-current-password"
            name="currentPassword"
            type="password"
            placeholder="Enter current password"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-new-password">New Password</Label>
          <Input
            id="settings-new-password"
            name="newPassword"
            type="password"
            placeholder="At least 8 characters"
            minLength={8}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-confirm-password">Confirm New Password</Label>
          <Input
            id="settings-confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter new password"
            required
          />
        </div>
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? 'Changing...' : 'Change Password'}
        </Button>
      </form>
    </div>
  );
}
