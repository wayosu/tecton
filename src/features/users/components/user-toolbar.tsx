'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebouncedCallback } from 'use-debounce';

interface UserToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  total: number;
}

export function UserToolbar({ search, onSearchChange, total }: UserToolbarProps) {
  const debouncedSearch = useDebouncedCallback(onSearchChange, 300);

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          defaultValue={search}
          onChange={(e) => debouncedSearch(e.target.value)}
          className="h-8 pl-8 pr-8 text-xs"
        />
        {search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-8 w-8"
            onClick={() => onSearchChange('')}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      <span className="text-xs text-muted-foreground tabular-nums">
        {total} {total === 1 ? 'user' : 'users'}
      </span>
    </div>
  );
}
