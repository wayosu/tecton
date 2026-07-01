'use client';

import { Search, X, Download } from 'lucide-react';
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

  const exportUrl = search
    ? `/api/users/export?search=${encodeURIComponent(search)}`
    : '/api/users/export';

  return (
    <div className="flex items-center gap-3">
      <div className="relative max-w-xs flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search users..."
          defaultValue={search}
          onChange={(e) => debouncedSearch(e.target.value)}
          className="h-8 pr-8 pl-8 text-xs"
        />
        {search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 h-8 w-8"
            onClick={() => onSearchChange('')}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      <span className="text-muted-foreground text-xs tabular-nums">
        {total} {total === 1 ? 'user' : 'users'}
      </span>
      <a
        href={exportUrl}
        className="bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors"
      >
        <Download className="h-3.5 w-3.5" />
        Export CSV
      </a>
    </div>
  );
}
