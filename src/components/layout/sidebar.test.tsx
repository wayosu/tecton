import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Sidebar } from './sidebar';

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

vi.mock('@/lib/auth-client', () => ({
  signOut: vi.fn(),
}));

describe('Sidebar responsive behavior', () => {
  const onToggleCollapse = vi.fn();
  const onCloseMobile = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('slides out on mobile while preserving collapsed desktop width', () => {
    render(
      <Sidebar
        collapsed
        mobileOpen={false}
        onToggleCollapse={onToggleCollapse}
        onCloseMobile={onCloseMobile}
        userRole="admin"
      />,
    );

    const sidebar = screen.getByRole('complementary');

    expect(sidebar).toHaveClass('lg:w-[56px]');
    expect(sidebar).toHaveClass('max-lg:w-60');
    expect(sidebar).toHaveClass('max-lg:pointer-events-none');
    expect(sidebar).toHaveClass('max-lg:-translate-x-full');
  });

  it('slides in on mobile while preserving expanded desktop width', () => {
    render(
      <Sidebar
        collapsed={false}
        mobileOpen
        onToggleCollapse={onToggleCollapse}
        onCloseMobile={onCloseMobile}
        userRole="admin"
      />,
    );

    const sidebar = screen.getByRole('complementary');

    expect(sidebar).toHaveClass('lg:w-60');
    expect(sidebar).toHaveClass('max-lg:w-60');
    expect(sidebar).toHaveClass('max-lg:translate-x-0');
  });

  it('closes the mobile drawer after selecting a nav item', () => {
    render(
      <Sidebar
        collapsed={false}
        mobileOpen
        onToggleCollapse={onToggleCollapse}
        onCloseMobile={onCloseMobile}
        userRole="admin"
      />,
    );

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    dashboardLink.addEventListener('click', (event) => event.preventDefault());

    fireEvent.click(dashboardLink);

    expect(onCloseMobile).toHaveBeenCalledTimes(1);
  });

  it('keeps labels available in mobile drawer even when desktop sidebar is collapsed', () => {
    render(
      <Sidebar
        collapsed
        mobileOpen
        onToggleCollapse={onToggleCollapse}
        onCloseMobile={onCloseMobile}
        userRole="admin"
      />,
    );

    const dashboardLabel = screen.getByText('Dashboard');

    expect(dashboardLabel).toHaveClass('lg:hidden');
  });
});
