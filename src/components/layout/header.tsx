'use client';

import { Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { signOut } from '@/lib/auth-client';

interface HeaderProps {
  onMenuClick: () => void;
  userName?: string;
  userImage?: string;
}

export function Header({ onMenuClick, userName, userImage }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const initials = userName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="h-7 w-7 lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-7 w-7 cursor-pointer transition-opacity hover:opacity-80">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback className="text-[11px]">
                {initials || 'U'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{userName || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">
                Signed in
              </p>
            </div>
            <DropdownMenuItem
              className="text-xs mt-1 cursor-pointer"
              onClick={() => signOut()}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
