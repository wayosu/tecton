'use client';

import { useActionState } from 'react';
import { updateProfile } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ProfileFormProps {
  defaultName: string | null;
  defaultEmail: string | null;
}

export function ProfileForm({ defaultName, defaultEmail }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await updateProfile(formData);
      if (result?.error) {
        toast.error(result.error);
        return result;
      }
      toast.success('Profile updated');
      return result;
    },
    null,
  );

  return (
    <div className="bg-card rounded-lg border">
      <div className="border-b px-4 py-3">
        <h3 className="text-sm font-semibold">Profile</h3>
      </div>
      <form action={formAction} className="space-y-4 p-4">
        <div className="space-y-2">
          <Label htmlFor="settings-name">Name</Label>
          <Input
            id="settings-name"
            name="name"
            defaultValue={defaultName ?? ''}
            placeholder="Your name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-email">Email</Label>
          <Input
            id="settings-email"
            name="email"
            type="email"
            defaultValue={defaultEmail ?? ''}
            placeholder="your@email.com"
            required
          />
        </div>
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </div>
  );
}
