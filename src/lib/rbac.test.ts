import { describe, it, expect } from 'vitest';
import { hasPermission, hasMinRole, ROLES } from './rbac';

describe('rbac', () => {
  describe('hasPermission', () => {
    it('denies when role is undefined', () => {
      expect(hasPermission(undefined, 'users:read')).toBe(false);
    });

    it('grants admin all permissions', () => {
      expect(hasPermission('admin', 'users:read')).toBe(true);
      expect(hasPermission('admin', 'users:create')).toBe(true);
      expect(hasPermission('admin', 'users:update')).toBe(true);
      expect(hasPermission('admin', 'users:delete')).toBe(true);
      expect(hasPermission('admin', 'settings:read')).toBe(true);
      expect(hasPermission('admin', 'settings:write')).toBe(true);
    });

    it('grants editor read/create/update but not delete', () => {
      expect(hasPermission('editor', 'users:read')).toBe(true);
      expect(hasPermission('editor', 'users:create')).toBe(true);
      expect(hasPermission('editor', 'users:update')).toBe(true);
      expect(hasPermission('editor', 'users:delete')).toBe(false);
      expect(hasPermission('editor', 'settings:write')).toBe(false);
    });

    it('grants viewer only read permissions', () => {
      expect(hasPermission('viewer', 'users:read')).toBe(true);
      expect(hasPermission('viewer', 'settings:read')).toBe(true);
      expect(hasPermission('viewer', 'users:create')).toBe(false);
      expect(hasPermission('viewer', 'users:update')).toBe(false);
      expect(hasPermission('viewer', 'users:delete')).toBe(false);
      expect(hasPermission('viewer', 'settings:write')).toBe(false);
    });
  });

  describe('hasMinRole', () => {
    it('returns true when user role meets required role', () => {
      expect(hasMinRole('admin', 'editor')).toBe(true);
      expect(hasMinRole('editor', 'editor')).toBe(true);
      expect(hasMinRole('viewer', 'editor')).toBe(false);
    });

    it('returns false when role is undefined', () => {
      expect(hasMinRole(undefined, 'viewer')).toBe(false);
    });
  });

  describe('ROLES', () => {
    it('orders roles by level', () => {
      expect(ROLES.admin.level).toBeGreaterThan(ROLES.editor.level);
      expect(ROLES.editor.level).toBeGreaterThan(ROLES.viewer.level);
    });
  });
});
