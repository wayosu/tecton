export type Role = 'admin' | 'editor' | 'viewer';

export const ROLES: Record<Role, { label: string; level: number }> = {
  admin: { label: 'Admin', level: 3 },
  editor: { label: 'Editor', level: 2 },
  viewer: { label: 'Viewer', level: 1 },
} as const;

export const permissions = {
  'users:read': ['admin', 'editor', 'viewer'] as Role[],
  'users:create': ['admin', 'editor'] as Role[],
  'users:update': ['admin', 'editor'] as Role[],
  'users:delete': ['admin'] as Role[],
  'settings:read': ['admin', 'editor', 'viewer'] as Role[],
  'settings:write': ['admin'] as Role[],
} as const;

export type Permission = keyof typeof permissions;

export function hasPermission(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false;
  return permissions[permission].includes(role);
}

export function hasMinRole(userRole: Role | undefined, requiredRole: Role): boolean {
  if (!userRole) return false;
  return ROLES[userRole].level >= ROLES[requiredRole].level;
}
